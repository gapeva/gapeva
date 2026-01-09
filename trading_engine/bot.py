import ccxt
import pandas as pd
import pandas_ta as ta
import time
from decimal import Decimal

class QuantitativeBot:
    def __init__(self):
        # 1. Initialize Connection to Binance (Public data for now)
        self.exchange = ccxt.binance({
            'enableRateLimit': True,
            'options': {'defaultType': 'spot'} 
        })
        self.symbol = 'BTC/USDT'
        self.timeframe = '4h' # 4-hour candles for Trend Following
        
        # 2. Risk Management Settings (Zero-Loss Logic)
        self.panic_threshold = 0.05  # 5% Drop
        self.trailing_stop_atr = 2.5 # Safety Multiplier

    def fetch_market_data(self):
        """Fetches the latest candles to analyze trends."""
        bars = self.exchange.fetch_ohlcv(self.symbol, timeframe=self.timeframe, limit=300)
        df = pd.DataFrame(bars, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        return df

    def analyze_signals(self, df):
        """
        The Agent's Thoughts:
        Calculates EMA 200, EMA 50, and RSI to decide "Buy" or "Sell".
        """
        # Calculate Indicators
        df['EMA_50'] = ta.ema(df['close'], length=50)
        df['EMA_200'] = ta.ema(df['close'], length=200)
        df['RSI'] = ta.rsi(df['close'], length=14)
        df['ATR'] = ta.atr(df['high'], df['low'], df['close'], length=14)

        # Get latest value
        current = df.iloc[-1]
        
        print(f"🧠 Agent Analysis [{current['timestamp']}]:")
        print(f"   Price: ${current['close']} | RSI: {current['RSI']:.2f}")
        print(f"   Trend: {'BULLISH' if current['EMA_50'] > current['EMA_200'] else 'BEARISH'}")
        
        return df

    def run_engine(self):
        """The Main Loop: Runs 24/7"""
        print("--- Gapeva Quantitative Agent Initialized ---")
        while True:
            try:
                data = self.fetch_market_data()
                self.analyze_signals(data)
                
                # Logic to be added: Execute Trade & Check Panic Switch
                
                time.sleep(60) # Rest for 1 minute
            except Exception as e:
                print(f"⚠️ Agent Error: {e}")
                time.sleep(10)

if __name__ == "__main__":
    bot = QuantitativeBot()
    bot.run_engine()
