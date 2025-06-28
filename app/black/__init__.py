"""
TradeMate Black - Premium Exclusive Trading Platform
The "Amex Black Card of Trading" for ultra-HNI users
"""

from .app_core import TradeMateBlackApp
from .market_butler import MarketButler
from .authentication import BlackAuthentication
from .luxury_ux import LuxuryUIComponents
from .concierge_services import ConciergeServices

__all__ = [
    'TradeMateBlackApp',
    'MarketButler', 
    'BlackAuthentication',
    'LuxuryUIComponents',
    'ConciergeServices'
]

__version__ = '1.0.0'
__tier__ = 'BLACK'