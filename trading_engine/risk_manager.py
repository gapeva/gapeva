from decimal import Decimal
import time
from datetime import datetime, timedelta

class RiskManager:
    def __init__(self, exchange_client):
        self.exchange = exchange_client
        self.panic_threshold = Decimal("0.05")  # 5% Drop
        self.cooldown_period = 24 * 60 * 60     # 24 Hours in seconds
        
        # State tracking
        self.high_water_mark = Decimal("0.00")  # Peak value in last 24h
        self.is_frozen = False
        self.freeze_start_time = None

    def update_high_water_mark(self, current_portfolio_value: Decimal):
        """
        Tracks the highest value the portfolio has reached recently.
        In a real production app, we would reset this every 24h or use a rolling window.
        """
        if current_portfolio_value > self.high_water_mark:
            self.high_water_mark = current_portfolio_value

    def check_panic_condition(self, current_portfolio_value: Decimal):
        """
        The Guardian Logic:
        Checks if we have dropped 5% from the peak.
        """
        if self.is_frozen:
            return self._check_thaw()

        if self.high_water_mark == 0:
            self.update_high_water_mark(current_portfolio_value)
            return False

        # Calculate drawdown
        # Formula: (Peak - Current) / Peak
        drawdown = (self.high_water_mark - current_portfolio_value) / self.high_water_mark

        if drawdown >= self.panic_threshold:
            print(f"🚨 PANIC TRIGGERED! Drawdown: {drawdown*100:.2f}%")
            return True
        
        return False

    def trigger_emergency_sell(self):
        """
        EXECUTE ORDER 66: Sell everything to USDC immediately.
        """
        print("🛑 EMERGENCY: Liquidating all assets to USDC...")
        
        try:
            # 1. Cancel all open orders to free up locked funds
            self.exchange.cancel_all_orders('BTC/USDT')
            
            # 2. Get current BTC balance
            balance = self.exchange.fetch_balance()
            btc_amount = balance.get('BTC', {}).get('free', 0)
            
            if btc_amount > 0.0001: # Minimum trade size check
                # 3. Market Sell (Fastest exit)
                order = self.exchange.create_market_sell_order('BTC/USDT', btc_amount)
                print(f"✅ LIQUIDATION COMPLETE. Sold {btc_amount} BTC. ID: {order['id']}")
            
            # 4. Freeze the system
            self.is_frozen = True
            self.freeze_start_time = time.time()
            self.high_water_mark = Decimal("0.00") # Reset for next cycle
            
        except Exception as e:
            print(f"❌ CRITICAL FAILURE during Panic Sell: {e}")
            # In production, this would send an SMS/Email to the admin immediately

    def _check_thaw(self):
        """
        Checks if the 24h freeze period is over.
        """
        elapsed = time.time() - self.freeze_start_time
        if elapsed > self.cooldown_period:
            print("🧊 Thawing Protocol: Trading resumed after 24h cooldown.")
            self.is_frozen = False
            self.freeze_start_time = None
        else:
            hours_left = (self.cooldown_period - elapsed) / 3600
            print(f"❄️ System Frozen. Resuming in {hours_left:.1f} hours.")
        
        return False # Still frozen, do not trade
