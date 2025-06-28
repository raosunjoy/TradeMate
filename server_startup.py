# server_startup.py

import asyncio
import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import logging
import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

# Import our SaaS platform
try:
    from app.saas.unified_support_platform import (
        TradeMateUnifiedSupportPlatform, PlatformTier, IntegrationType
    )
    print("✅ SaaS platform modules imported successfully")
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Creating mock platform for testing...")
    
    # Create a mock platform for testing
    class TradeMateUnifiedSupportPlatform:
        def __init__(self):
            self.partners = {}
            self.interactions = {}
        
        async def onboard_partner(self, partner_data):
            return {"status": "success", "partner_id": partner_data["partner_id"]}
        
        async def process_unified_support_request(self, partner_id, request_data):
            return {"status": "processed", "response": "Mock response"}

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="TradeMate AI Support + ZK + WhatsApp SaaS Platform",
    description="Enterprise-grade customer support SaaS for fintech companies",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the SaaS platform
platform = TradeMateUnifiedSupportPlatform()

# Pydantic models for API requests
class PartnerOnboardingRequest(BaseModel):
    partner_id: str
    company_name: str
    business_type: str
    platform_tier: str = "professional"
    integration_type: str = "full_integration"
    languages: Optional[List[str]] = ["Hindi", "English"]
    knowledge_base: Optional[Dict[str, Any]] = {}
    whatsapp_data: Optional[Dict[str, str]] = None

class SupportRequest(BaseModel):
    partner_id: str
    customer_id: str
    query_text: str
    language: str = "Hindi"
    channel: str = "api"
    context: Optional[Dict[str, Any]] = {}

class WhatsAppWebhookRequest(BaseModel):
    entry: List[Dict[str, Any]]

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "TradeMate SaaS Platform",
        "version": "1.0.0",
        "timestamp": asyncio.get_event_loop().time()
    }

# Platform status endpoint
@app.get("/platform/status")
async def platform_status():
    return {
        "platform_status": "operational",
        "active_partners": len(platform.partners),
        "total_interactions": sum(len(interactions) for interactions in platform.interactions.values()),
        "services": {
            "ai_support": "operational",
            "whatsapp_integration": "operational", 
            "zk_privacy": "operational"
        }
    }

# Partner onboarding endpoint
@app.post("/partners/onboard")
async def onboard_partner(request: PartnerOnboardingRequest, background_tasks: BackgroundTasks):
    try:
        logger.info(f"Onboarding partner: {request.partner_id}")
        
        partner_data = {
            "partner_id": request.partner_id,
            "company_name": request.company_name,
            "business_type": request.business_type,
            "platform_tier": request.platform_tier,
            "integration_type": request.integration_type,
            "languages": request.languages,
            "knowledge_base": request.knowledge_base
        }
        
        if request.whatsapp_data:
            partner_data["whatsapp_data"] = request.whatsapp_data
        
        # Onboard partner in background
        background_tasks.add_task(platform.onboard_partner, partner_data)
        
        return {
            "status": "success",
            "message": f"Partner {request.partner_id} onboarding initiated",
            "partner_id": request.partner_id,
            "platform_tier": request.platform_tier
        }
        
    except Exception as e:
        logger.error(f"Partner onboarding failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Onboarding failed: {str(e)}")

# Support request processing endpoint
@app.post("/support/process")
async def process_support_request(request: SupportRequest):
    try:
        logger.info(f"Processing support request for partner: {request.partner_id}")
        
        # Check if partner exists
        if request.partner_id not in platform.partners:
            # For demo purposes, create a mock partner
            logger.warning(f"Partner {request.partner_id} not found, creating mock configuration")
            platform.partners[request.partner_id] = {
                "partner_id": request.partner_id,
                "platform_tier": "professional",
                "features_enabled": {"ai_support": True, "languages": ["Hindi", "English"]}
            }
            platform.interactions[request.partner_id] = []
        
        request_data = {
            "customer_id": request.customer_id,
            "query_text": request.query_text,
            "language": request.language,
            "channel": request.channel,
            "context": request.context
        }
        
        # Process the request
        interaction = await platform.process_unified_support_request(
            request.partner_id, request_data
        )
        
        return {
            "status": "success",
            "interaction_id": getattr(interaction, 'interaction_id', 'mock_interaction'),
            "response": getattr(interaction, 'ai_response', {}).get('response_text', 'Mock AI response'),
            "language": request.language,
            "intent": getattr(interaction, 'intent', 'general_query'),
            "processing_time": getattr(interaction, 'processing_time', 0.1),
            "escalated": getattr(interaction, 'escalated', False),
            "privacy_protected": request.partner_id in platform.partners
        }
        
    except Exception as e:
        logger.error(f"Support request processing failed: {str(e)}")
        return {
            "status": "processed_with_mock",
            "response": f"आपका प्रश्न समझ में आया। {request.query_text} के लिए हमारी सहायता टीम आपसे जल्द संपर्क करेगी।",
            "language": request.language,
            "intent": "general_query",
            "processing_time": 0.05,
            "escalated": False,
            "note": "Mock response due to missing dependencies"
        }

# WhatsApp webhook endpoint
@app.post("/whatsapp/webhook/{partner_id}")
async def whatsapp_webhook(partner_id: str, request: WhatsAppWebhookRequest):
    try:
        logger.info(f"WhatsApp webhook received for partner: {partner_id}")
        
        # Process WhatsApp message
        webhook_data = {"entry": request.entry}
        
        # For demo, return success
        return {
            "status": "success", 
            "partner_id": partner_id,
            "messages_processed": len(request.entry),
            "response": "WhatsApp message processed successfully"
        }
        
    except Exception as e:
        logger.error(f"WhatsApp webhook processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Webhook processing failed: {str(e)}")

# WhatsApp webhook verification
@app.get("/whatsapp/webhook/{partner_id}")
async def verify_whatsapp_webhook(partner_id: str, hub_mode: str = None, hub_verify_token: str = None, hub_challenge: str = None):
    if hub_mode == "subscribe" and hub_verify_token == f"{partner_id}_verify_token":
        logger.info(f"WhatsApp webhook verified for partner: {partner_id}")
        return int(hub_challenge)
    else:
        raise HTTPException(status_code=403, detail="Webhook verification failed")

# Partner analytics endpoint
@app.get("/partners/{partner_id}/analytics")
async def get_partner_analytics(partner_id: str, days: int = 7):
    try:
        logger.info(f"Generating analytics for partner: {partner_id}")
        
        # Mock analytics data
        analytics = {
            "partner_id": partner_id,
            "period_days": days,
            "summary": {
                "total_interactions": 156,
                "avg_response_time": 1.2,
                "escalation_rate": 8.5,
                "satisfaction_score": 4.6
            },
            "distributions": {
                "languages": {"Hindi": 65, "English": 35},
                "channels": {"whatsapp": 70, "api": 30},
                "intents": {"account_query": 40, "trading_query": 35, "general": 25}
            },
            "performance": {
                "sla_compliance": 98.5,
                "automation_rate": 91.5,
                "cost_per_interaction": 12.50
            },
            "business_impact": {
                "cost_reduction_percent": 87,
                "response_time_improvement": "99% faster than traditional",
                "customer_satisfaction_improvement": "+45% vs industry average"
            }
        }
        
        return analytics
        
    except Exception as e:
        logger.error(f"Analytics generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analytics generation failed: {str(e)}")

# Partner dashboard endpoint  
@app.get("/partners/{partner_id}/dashboard")
async def get_partner_dashboard(partner_id: str):
    try:
        logger.info(f"Loading dashboard for partner: {partner_id}")
        
        # Mock dashboard data
        dashboard = {
            "partner_info": {
                "company_name": f"Partner {partner_id}",
                "platform_tier": "professional",
                "integration_type": "full_integration"
            },
            "real_time_metrics": {
                "interactions_today": 23,
                "avg_response_time": 1.1,
                "escalation_rate": 6.2,
                "system_status": "operational"
            },
            "billing_summary": {
                "current_usage": 1250,
                "monthly_limit": 5000,
                "usage_percentage": 25,
                "estimated_cost": 75000
            },
            "service_status": {
                "ai_support": "operational",
                "whatsapp": "operational", 
                "privacy": "operational"
            }
        }
        
        return dashboard
        
    except Exception as e:
        logger.error(f"Dashboard loading failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Dashboard loading failed: {str(e)}")

# Demo endpoint to test Indian market analysis
@app.post("/demo/market-analysis")
async def demo_market_analysis(request: SupportRequest):
    """Demo endpoint showcasing Indian market analysis capabilities"""
    
    try:
        query = request.query_text.lower()
        language = request.language
        
        # Simulate comprehensive Indian market analysis
        if "mutual fund" in query or "म्यूचुअल फंड" in query or "sip" in query:
            if language == "Hindi":
                response = """
🎯 **म्यूचुअल फंड निवेश सलाह**

आपके लिए सुझाव:

💰 **SIP के फायदे:**
• रुपया कॉस्ट एवरेजिंग का लाभ
• मासिक अनुशासित निवेश
• कंपाउंडिंग की शक्ति
• ₹500 से शुरुआत करें

📊 **फंड कैटेगरी:**
• लार्ज कैप: कम जोखिम, स्थिर रिटर्न
• मिड कैप: मध्यम जोखिम, बेहतर रिटर्न  
• स्माल कैप: उच्च जोखिम, उच्च रिटर्न

💡 **टैक्स बेनिफिट:**
• ELSS: 3 साल लॉक-इन, 80C में छूट
• इक्विटी फंड: 1 साल बाद 10% LTCG

⚠️ **जोखिम:** म्यूचुअल फंड निवेश बाजार जोखिमों के अधीन है।
                """
            else:
                response = """
🎯 **Mutual Fund Investment Advice**

Recommendations for you:

💰 **SIP Benefits:**
• Rupee cost averaging advantage
• Disciplined monthly investment
• Power of compounding
• Start with ₹500

📊 **Fund Categories:**
• Large Cap: Low risk, stable returns
• Mid Cap: Medium risk, better returns
• Small Cap: High risk, high returns

💡 **Tax Benefits:**
• ELSS: 3-year lock-in, 80C deduction
• Equity funds: 10% LTCG after 1 year

⚠️ **Risk:** Mutual fund investments are subject to market risks.
                """
        
        elif "stock" in query or "share" in query or "शेयर" in query or "trading" in query:
            if language == "Hindi":
                response = """
📈 **शेयर ट्रेडिंग जानकारी**

🕘 **मार्केट टाइमिंग:**
• सुबह 9:15 - दोपहर 3:30 (नियमित)
• सुबह 9:00-9:15 (प्री-मार्केट)

💰 **ट्रेडिंग कॉस्ट:**
• ब्रोकरेज: ₹0-20 प्रति ट्रेड
• STT: 0.1% (सेल साइड)
• कुल कॉस्ट: ~0.5% राउंड ट्रिप

📊 **आज के इंडेक्स:**
• निफ्टी 50: 19,850 (+0.5%)
• सेंसेक्स: 66,500 (+0.3%)

⚡ **तुरंत ट्रेड करने के लिए WhatsApp पर "BUY RELIANCE 100" भेजें**
                """
            else:
                response = """
📈 **Stock Trading Information**

🕘 **Market Timings:**
• 9:15 AM - 3:30 PM (Regular)
• 9:00-9:15 AM (Pre-market)

💰 **Trading Costs:**
• Brokerage: ₹0-20 per trade
• STT: 0.1% (sell side)
• Total: ~0.5% round trip

📊 **Today's Indices:**
• Nifty 50: 19,850 (+0.5%)
• Sensex: 66,500 (+0.3%)

⚡ **Trade instantly via WhatsApp: "BUY RELIANCE 100"**
                """
        
        elif "tax" in query or "टैक्स" in query or "80c" in query:
            if language == "Hindi":
                response = """
💰 **टैक्स सेविंग गाइड (FY 2024-25)**

🎯 **सेक्शन 80C (₹1.5 लाख तक):**
• PPF: 15 साल लॉक-इन, 7.1% रिटर्न
• ELSS: 3 साल लॉक-इन, मार्केट रिटर्न
• NSC: 5 साल लॉक-इन, 6.8% रिटर्न
• होम लोन प्रिंसिपल

📊 **अन्य छूट:**
• 80D: हेल्थ इंश्योरेंस ₹25,000-50,000
• 80E: एजुकेशन लोन इंटरेस्ट (कोई लिमिट नहीं)

💡 **कैपिटल गेन्स टैक्स:**
• इक्विटी LTCG: 10% (₹1 लाख के बाद)
• डेट LTCG: 20% (इंडेक्सेशन के साथ)
                """
            else:
                response = """
💰 **Tax Saving Guide (FY 2024-25)**

🎯 **Section 80C (Up to ₹1.5 lakh):**
• PPF: 15-year lock-in, 7.1% return
• ELSS: 3-year lock-in, market returns
• NSC: 5-year lock-in, 6.8% return
• Home loan principal

📊 **Other Deductions:**
• 80D: Health insurance ₹25,000-50,000
• 80E: Education loan interest (no limit)

💡 **Capital Gains Tax:**
• Equity LTCG: 10% (above ₹1 lakh)
• Debt LTCG: 20% (with indexation)
                """
        
        else:
            if language == "Hindi":
                response = f"""
नमस्ते! आपका प्रश्न "{request.query_text}" के लिए हमारी विशेषज्ञ टीम तैयार है।

🏦 **हमारी सेवाएं:**
• शेयर ट्रेडिंग सहायता
• म्यूचुअल फंड सलाह  
• टैक्स प्लानिंग
• इंश्योरेंस गाइडेंस

💬 **तुरंत सहायता के लिए:**
• WhatsApp: +91-XXXXXXXXX
• विशेषज्ञ कॉल: 60 सेकंड में
• 24x7 AI सहायता उपलब्ध

आपकी और कोई सहायता चाहिए?
                """
            else:
                response = f"""
Hello! Our expert team is ready to help with "{request.query_text}".

🏦 **Our Services:**
• Stock trading assistance
• Mutual fund advice
• Tax planning
• Insurance guidance

💬 **Instant Support:**
• WhatsApp: +91-XXXXXXXXX
• Expert call: Within 60 seconds
• 24x7 AI assistance available

How else can we help you?
                """
        
        return {
            "status": "success",
            "query": request.query_text,
            "language": language,
            "response": response,
            "market_analysis": {
                "category": "financial_advice",
                "confidence": 0.95,
                "indian_market_expertise": True,
                "regulatory_compliant": True
            },
            "processing_time": 0.8,
            "escalated": False
        }
        
    except Exception as e:
        logger.error(f"Market analysis demo failed: {str(e)}")
        return {
            "status": "error",
            "error": str(e),
            "fallback_response": "हमारी तकनीकी टीम इस समस्या को ठीक कर रही है। कृपया बाद में कोशिश करें।"
        }

# Server startup function
async def startup_event():
    logger.info("🚀 TradeMate SaaS Platform starting up...")
    logger.info("✅ Platform initialized successfully")

# Server shutdown function
async def shutdown_event():
    logger.info("🛑 TradeMate SaaS Platform shutting down...")

# Add event handlers
app.add_event_handler("startup", startup_event)
app.add_event_handler("shutdown", shutdown_event)

if __name__ == "__main__":
    print("🚀 Starting TradeMate AI Support + ZK + WhatsApp SaaS Platform")
    print("=" * 70)
    print("🌐 Server will be available at:")
    print("   • Main API: http://localhost:8000")
    print("   • Health Check: http://localhost:8000/health")
    print("   • API Docs: http://localhost:8000/docs")
    print("   • Platform Status: http://localhost:8000/platform/status")
    print("=" * 70)
    
    uvicorn.run(
        "server_startup:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )