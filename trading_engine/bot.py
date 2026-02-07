import ccxt
import pandas as pd
import numpy as np
import time
import schedule
import logging
from textblob import TextBlob
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL")
BINANCE_API_KEY = os.getenv("BINANCE_API_KEY")
BINANCE_SECRET_KEY = os.getenv("BINANCE_SECRET_KEY")

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
logger = logging.getLogger()

# Database Setup (Synchronous for Bot)
if not DATABASE_URL:
    # Fallback to local file path if env var is missing
    # Assuming bot.py is in /trading_engine and db is in /backend
    DATABASE_URL = "sqlite:///../backend/gapeva.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

class TradingBot:
    def __init__(self):
        self.exchange = ccxt.binance({
            'apiKey': BINANCE_API_KEY,
            'secret': BINANCE_SECRET_KEY,
            'enableRateLimit': True,
            'options': {
                'defaultType': 'future',
                'adjustForTimeDifference': True, # <--- Auto-sync time
                'recvWindow': 60000              # <--- Allow 60s time drift
            }
        })
        self.symbols = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT']
        self.timeframe = '1h'

    def fetch_data(self, symbol):
        try:
            bars = self.exchange.fetch_ohlcv(symbol, timeframe=self.timeframe, limit=100)
            df = pd.DataFrame(bars, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            return df
        except Exception as e:
            logger.error(f"Error fetching data for {symbol}: {e}")
            return None

    def analyze_market(self, df):
        if df is None or df.empty:
            return None
            
        # Simple SMA Strategy
        df['sma_20'] = df['close'].rolling(window=20).mean()
        df['sma_50'] = df['close'].rolling(window=50).mean()
        
        last_row = df.iloc[-1]
        
        # Signal Logic
        if last_row['sma_20'] > last_row['sma_50']:
            return "BUY"
        elif last_row['sma_20'] < last_row['sma_50']:
            return "SELL"
        return "HOLD"

    def execute_trade(self, symbol, signal):
        if signal == "HOLD":
            return
            
        logger.info(f"🚀 Signal for {symbol}: {signal}")
        
        # In a real bot, we would place orders here using self.exchange.create_order(...)
        # For now, we just log to DB
        self.log_trade_to_db(symbol, signal)

    def log_trade_to_db(self, symbol, signal):
        session = SessionLocal()
        try:
            # We use raw SQL for simplicity here, or you could import the Trade model
            query = text("INSERT INTO trades (symbol, type, amount, price, timestamp) VALUES (:symbol, :type, :amount, :price, :timestamp)")
            # Mock data for price/amount
            session.execute(query, {
                "symbol": symbol,
                "type": signal,
                "amount": 0.0,
                "price": 0.0,
                "timestamp":  pd.Timestamp.now().isoformat()
            })
            session.commit()
            # logger.info(f"Saved {signal} trade to DB")
        except Exception as e:
            # Tables might not exist yet if backend didn't run, ignore for now
            pass
            # logger.error(f"DB Log Error: {e}")
        finally:
            session.close()

    def run_cycle(self):
        logger.info("🔄 Running Market Analysis Cycle...")
        for symbol in self.symbols:
            df = self.fetch_data(symbol)
            signal = self.analyze_market(df)
            if signal:
                self.execute_trade(symbol, signal)

if __name__ == "__main__":
    bot = TradingBot()
    print("🤖 Gapeva Quantitative Agent: ONLINE")
    
    # Run immediately once
    bot.run_cycle()
    
    # Then schedule every 1 minute
    schedule.every(1).minutes.do(bot.run_cycle)
    
    while True:
        schedule.run_pending()
        time.sleep(1)