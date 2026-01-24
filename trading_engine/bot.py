import ccxt
import pandas as pd
import pandas_ta as ta
import time
import sys
import os
import requests
import numpy as np
from decimal import Decimal

# --- PATH SETUP ---
# CRITICAL: Allows the bot to see the 'backend' folder
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from trading_engine.risk_manager import RiskManager
# CONNECT TO DATABASE: Fetches the total capital allocated by users
from backend.app.services.pool_service import get_total_trading_pool

class QuantitativeBot:
    def __init__(self):
        # 1. API CONFIGURATION
        self.api_key = os.getenv("BINANCE_API_KEY", "YOUR_KEY")
        self.secret = os.getenv("BINANCE_SECRET", "YOUR_SECRET")
        
        self.exchange = ccxt.binance({
            'apiKey': self.api_key,
            'secret': self.secret,
            'enableRateLimit': True,
            'options': {'defaultType': 'spot'} 
        })
        
        # 2. STRATEGY SETTINGS (The "Apex" Config)
        self.symbol = 'BTC/USDT'
        self.timeframe = '1h'       # 1H gives cleaner signals than 15m
        self.risk_manager = RiskManager(self.exchange)
        
        # 3. STATE TRACKING
        self.entry_price = 0.0
        self.trailing_stop_price = 0.0
        self.in_position = False
        
        print("🚀 Gapeva Tier-3 'Apex': INITIALIZED")
        print("🔗 Database Link: CONNECTED")
        print("🎯 Strategy: Trend Following + Dynamic ATR Trailing Stop")

    def get_fundamentals(self):
        """Fetches Fear & Greed but allows trading in High Greed (Momentum)"""
        try:
            url = "https://api.alternative.me/fng/?limit=1"
            response = requests.get(url, timeout=5)
            data = response.json()
            value = int(data['data'][0]['value'])
            return value
        except:
            return 50

    def fetch_data(self):
        """Fetches OHLCV and calculates Advanced Indicators"""
        try:
            bars = self.exchange.fetch_ohlcv(self.symbol, timeframe=self.timeframe, limit=200)
            df = pd.DataFrame(bars, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            
            # --- INDICATORS ---
            # 1. Trend: EMA 50 & 200
            df['EMA_50'] = ta.ema(df['close'], length=50)
            df['EMA_200'] = ta.ema(df['close'], length=200)
            
            # 2. Momentum: RSI & MACD
            df['RSI'] = ta.rsi(df['close'], length=14)
            macd = ta.macd(df['close'])
            df['MACD'] = macd['MACD_12_26_9']
            df['MACD_SIGNAL'] = macd['MACDs_12_26_9']
            
            # 3. Volatility: ATR (Average True Range) for Dynamic Stops
            df['ATR'] = ta.atr(df['high'], df['low'], df['close'], length=14)
            
            # 4. Bollinger Bands (for Volatility Breakouts)
            bb = ta.bbands(df['close'], length=20, std=2)
            df['BB_UPPER'] = bb['BBU_20_2.0']
            
            return df
        except Exception as e:
            print(f"⚠️ Data Error: {e}")
            return pd.DataFrame()

    def update_trailing_stop(self, current_price, atr):
        """
        Updates the Trailing Stop.
        Moves UP only, never down. Locks in profit as price rises.
        """
        # Tight Stop: 2x ATR (Approx 2-3% wiggle room)
        new_stop = current_price - (atr * 2.0)
        
        if new_stop > self.trailing_stop_price:
            self.trailing_stop_price = new_stop
            print(f"🛡️ Trailing Stop Moved Up: ${self.trailing_stop_price:.2f}")

    def execute_strategy(self):
        # A. SYNC MONEY (DATABASE + BINANCE)
        try:
            # 1. Get Reality (Binance)
            balance = self.exchange.fetch_balance()
            usdt = float(balance['total']['USDT'])
            btc = float(balance['total']['BTC'])
            ticker = self.exchange.fetch_ticker(self.symbol)
            price = float(ticker['last'])
            
            # 2. Get Truth (Database)
            # This connects to Gapeva DB to see how much users have deposited
            db_pool_val = get_total_trading_pool() 
            
            # Calculate Total Equity
            total_equity_val = Decimal(str(usdt)) + (Decimal(str(btc)) * Decimal(str(price)))
            
            # 3. Audit Log
            print(f"\n--- 🏦 SOLVENCY CHECK ---")
            print(f"👥 User Deposits (DB): ${db_pool_val:,.2f}")
            print(f"📉 Binance Equity:     ${total_equity_val:,.2f}")
            
            # B. RISK CHECK (Panic Switch)
            if self.risk_manager.check_panic_condition(total_equity_val):
                self.risk_manager.trigger_emergency_sell()
                self.in_position = False
                return

            if self.risk_manager.is_frozen:
                print("❄️ FROZEN. Waiting for market to stabilize.")
                return

        except Exception as e:
            print(f"Sync Error: {e}")
            return

        # C. ANALYZE MARKET
        df = self.fetch_data()
        if df.empty: return
        
        curr = df.iloc[-1]
        fng = self.get_fundamentals()
        
        # D. TRADING LOGIC (APEX STRATEGY)
        
        # --- BUY CONDITIONS ---
        bullish_trend = curr['EMA_50'] > curr['EMA_200']
        momentum_up = curr['MACD'] > curr['MACD_SIGNAL']
        safe_entry = curr['RSI'] < 75
        volatility_breakout = curr['close'] > curr['BB_UPPER'] 
        
        buy_signal = (bullish_trend and momentum_up and safe_entry) or (volatility_breakout and momentum_up)

        # --- SELL CONDITIONS ---
        stop_hit = price < self.trailing_stop_price
        trend_reversal = curr['EMA_50'] < curr['EMA_200']
        momentum_crash = (curr['MACD'] < curr['MACD_SIGNAL']) and (curr['RSI'] > 75)
        
        sell_signal = stop_hit or trend_reversal or momentum_crash

        # E. EXECUTION
        print(f"📊 Price: ${price} | RSI: {curr['RSI']:.1f} | F&G: {fng} | Stop: ${self.trailing_stop_price:.2f}")

        # ENTRY
        if buy_signal and usdt > 5 and not self.in_position:
            print("🟢 APEX BUY SIGNAL DETECTED")
            qty = (usdt * 0.99) / price # Invest 99% of available USDT
            try:
                self.exchange.create_market_buy_order(self.symbol, qty)
                self.in_position = True
                self.entry_price = price
                # Initialize Trailing Stop
                self.trailing_stop_price = price - (curr['ATR'] * 2.0)
                print(f"✅ BOUGHT at ${price}. Initial Stop: ${self.trailing_stop_price}")
            except Exception as e:
                print(f"❌ Buy Failed: {e}")

        # MANAGEMENT / EXIT
        elif self.in_position:
            # Update Trailing Stop
            if price > self.entry_price:
                self.update_trailing_stop(price, curr['ATR'])
            
            # Check Exit
            if sell_signal and btc > 0.0001:
                print(f"🔴 EXIT SIGNAL (Stop Hit: {stop_hit}, Reversal: {trend_reversal})")
                try:
                    self.exchange.create_market_sell_order(self.symbol, btc)
                    self.in_position = False
                    self.trailing_stop_price = 0.0
                    print(f"✅ SOLD at ${price}")
                except Exception as e:
                    print(f"❌ Sell Failed: {e}")
        
        else:
            print("⏳ Scanning for High-Probability Setup...")

    def run(self):
        while True:
            try:
                self.execute_strategy()
                time.sleep(15) # 15s Pulse
            except KeyboardInterrupt:
                print("🛑 Bot Stopped by User")
                break
            except Exception as e:
                print(f"⚠️ Critical Loop Error: {e}")
                time.sleep(30)

if __name__ == "__main__":
    bot = QuantitativeBot()
    bot.run()
