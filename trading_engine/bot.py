import ccxt
import pandas as pd
# import pandas_ta as ta (Removed)
from ta.trend import EMAIndicator
from ta.momentum import RSIIndicator
from ta.volatility import AverageTrueRange
import time
import sys
import os
from decimal import Decimal
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- PATH SETUP ---
# This ensures the bot can find the backend files
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from trading_engine.risk_manager import RiskManager
from backend.app.services.pool_service import get_total_trading_pool

class QuantitativeBot:
    def __init__(self):
        # 1. Configuration
        # 1. Configuration
        # Load keys from environment variables
        self.api_key = os.getenv("BINANCE_API_KEY")
        self.secret = os.getenv("BINANCE_SECRET_KEY")
        
        if not self.api_key or not self.secret:
            print("❌ Error: Binance API Creditentials not found in environment variables.")
            return
        
        self.exchange = ccxt.binance({
            'apiKey': self.api_key,
            'secret': self.secret,
            'enableRateLimit': True,
            'options': {'defaultType': 'spot'} 
        })
        
        # self.exchange.set_sandbox_mode(True) # Disabled: Keys appear to be Mainnet (Signature Invalid on Mainnet vs Invalid Key on Testnet)
        
        self.symbol = 'BTC/USDT'
        self.timeframe = '4h' 
        
        # 2. Initialize Risk Manager
        self.risk_manager = RiskManager(self.exchange)
        
        print("🤖 Gapeva Quantitative Agent: ONLINE")

    def fetch_data(self):
        """Get market data for analysis"""
        bars = self.exchange.fetch_ohlcv(self.symbol, timeframe=self.timeframe, limit=200)
        df = pd.DataFrame(bars, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        return df

    def calculate_indicators(self, df):
        """Apply the Phase 2 Strategy Logic"""
        # Trend Indicators 
        df['EMA_50'] = EMAIndicator(close=df['close'], window=50).ema_indicator()
        df['EMA_200'] = EMAIndicator(close=df['close'], window=200).ema_indicator()
        
        # Momentum
        df['RSI'] = RSIIndicator(close=df['close'], window=14).rsi()
        
        # Volatility (for Stop Loss) [cite: 60]
        df['ATR'] = AverageTrueRange(high=df['high'], low=df['low'], close=df['close'], window=14).average_true_range()
        return df

    def execute_logic(self):
        """The Main Decision Brain"""
        
        # A. SYNC GLOBAL POOL
        # Get the total amount of money users have allocated
        total_pool_usd = get_total_trading_pool()
        
        # Get current value of assets on Binance
        try:
            balance = self.exchange.fetch_balance()
            total_equity = Decimal(str(balance['total']['USDT'])) + \
                           (Decimal(str(balance['total']['BTC'])) * Decimal(str(self.exchange.fetch_ticker(self.symbol)['last'])))
        except Exception as e:
            print(f"⚠️ Exchange Connection Error: {e}")
            return

        print(f"\n--- CYCLE REPORT ---")
        print(f"💰 Global User Pool: ${total_pool_usd} | 🏦 Binance Equity: ${total_equity:.2f}")

        # B. RISK CHECK (Panic Switch) [cite: 61]
        # We pass the real-time equity to the risk manager
        if self.risk_manager.check_panic_condition(total_equity):
            self.risk_manager.trigger_emergency_sell()
            return # Stop here if panic triggered

        if self.risk_manager.is_frozen:
            print("❄️ Trading Frozen due to previous panic trigger.")
            return

        # C. MARKET ANALYSIS
        df = self.fetch_data()
        df = self.calculate_indicators(df)
        current = df.iloc[-1]
        
        price = current['close']
        rsi = current['RSI']
        ema_50 = current['EMA_50']
        ema_200 = current['EMA_200']
        
        # D. TRADING STRATEGY (EMA Cross + RSI Filter)
        is_bullish = ema_50 > ema_200
        is_momentum_safe = 40 < rsi < 70  # Avoid overbought/oversold extremes
        
        # Log "Agent Thoughts"
        print(f"🧠 Analysis: Price=${price} | Trend={'BULLISH' if is_bullish else 'BEARISH'} | RSI={rsi:.1f}")

        # (Here we would place orders. For safety in this phase, we just print the decision)
        if is_bullish and is_momentum_safe:
             print("✅ SIGNAL: BUY CONDITION MET. (Waiting for Phase 3 execution logic)")
        elif not is_bullish:
             print("🔻 SIGNAL: SELL/CASH CONDITION. Preservation mode.")

    def run(self):
        while True:
            try:
                self.execute_logic()
                # Run every 60 seconds
                time.sleep(60)
            except KeyboardInterrupt:
                print("🛑 Bot stopped manually.")
                break
            except Exception as e:
                print(f"⚠️ Critical Loop Error: {e}")
                time.sleep(10)

if __name__ == "__main__":
    bot = QuantitativeBot()
    bot.run()
