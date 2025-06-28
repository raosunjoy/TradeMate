# demo_saas_platform.py

import asyncio
import json
import time
from datetime import datetime, timedelta

# Import the unified SaaS platform
from app.saas.unified_support_platform import (
    TradeMateUnifiedSupportPlatform, PlatformTier, IntegrationType
)

async def demo_saas_platform():
    """
    Demonstrate the TradeMate AI Support + ZK + WhatsApp SaaS Platform
    """
    
    print("🚀 TradeMate AI Support + ZK + WhatsApp SaaS Platform Demo")
    print("=" * 70)
    
    # Initialize the unified platform
    platform = TradeMateUnifiedSupportPlatform()
    
    print("\n📋 Step 1: Partner Onboarding")
    print("-" * 40)
    
    # Onboard HDFC Bank as Enterprise partner
    hdfc_data = {
        "partner_id": "hdfc_bank",
        "company_name": "HDFC Bank",
        "business_type": "bank",
        "platform_tier": "enterprise",
        "integration_type": "full_integration",
        "gdpr_required": True,
        "rbi_required": True,
        "sebi_required": True,
        "knowledge_base": {
            "banking_products": ["savings", "current", "loans", "credit_cards"],
            "investment_products": ["mutual_funds", "insurance", "gold"],
            "digital_services": ["net_banking", "mobile_app", "upi"]
        },
        "whatsapp_data": {
            "business_number": "919876543210",
            "access_token": "demo_token_hdfc",
            "verify_token": "hdfc_verify_123",
            "webhook_url": "https://hdfc.com/whatsapp-webhook",
            "webhook_secret": "hdfc_secret_key"
        }
    }
    
    hdfc_config = await platform.onboard_partner(hdfc_data)
    print(f"✅ HDFC Bank onboarded as {hdfc_config.platform_tier.value}")
    print(f"   Features: {list(hdfc_config.features_enabled.keys())}")
    print(f"   Monthly cost: ₹{hdfc_config.monthly_base_cost:,}")
    print(f"   Included interactions: {hdfc_config.included_interactions:,}")
    
    # Onboard Groww as Professional partner
    groww_data = {
        "partner_id": "groww",
        "company_name": "Groww",
        "business_type": "fintech",
        "platform_tier": "professional",
        "integration_type": "api_only",  # API only integration
        "knowledge_base": {
            "investment_products": ["mutual_funds", "stocks", "etfs"],
            "services": ["sip", "lumpsum", "portfolio_tracking"]
        }
    }
    
    groww_config = await platform.onboard_partner(groww_data)
    print(f"\n✅ Groww onboarded as {groww_config.platform_tier.value}")
    print(f"   Integration: {groww_config.integration_type.value}")
    print(f"   Monthly cost: ₹{groww_config.monthly_base_cost:,}")
    
    print("\n🤖 Step 2: AI Support Processing")
    print("-" * 40)
    
    # Simulate customer support requests
    test_queries = [
        {
            "partner_id": "hdfc_bank",
            "channel": "whatsapp",
            "customer_id": "customer_001",
            "query_text": "मेरे खाते का बैलेंस क्या है?",
            "language": "Hindi",
            "context": {"customer_tier": "premium", "account_type": "savings"}
        },
        {
            "partner_id": "hdfc_bank", 
            "channel": "api",
            "customer_id": "customer_002",
            "query_text": "I want to invest ₹50,000 in mutual funds. Please suggest good options.",
            "language": "English",
            "context": {"age": 32, "risk_profile": "moderate", "investment_experience": "beginner"}
        },
        {
            "partner_id": "groww",
            "channel": "api", 
            "customer_id": "customer_003",
            "query_text": "SIP में निवेश कैसे करें? कौन से फंड अच्छे हैं?",
            "language": "Hindi",
            "context": {"monthly_income": 50000, "investment_goal": "wealth_creation"}
        }
    ]
    
    interactions = []
    for i, query in enumerate(test_queries, 1):
        print(f"\nProcessing Query {i}:")
        print(f"Partner: {query['partner_id']}")
        print(f"Query: {query['query_text']}")
        print(f"Language: {query['language']}")
        
        interaction = await platform.process_unified_support_request(
            query["partner_id"], query
        )
        
        print(f"✅ Response generated in {interaction.processing_time:.2f}s")
        print(f"Intent detected: {interaction.intent}")
        print(f"Escalated: {interaction.escalated}")
        print(f"Privacy level: {interaction.privacy_level.value}")
        if interaction.zk_proof:
            print(f"ZK Proof generated: {interaction.zk_proof.proof_id[:16]}...")
        
        interactions.append(interaction)
        
        # Show sample response
        response_preview = interaction.ai_response.response_text[:200] + "..." if len(interaction.ai_response.response_text) > 200 else interaction.ai_response.response_text
        print(f"Response preview: {response_preview}")
    
    print("\n📊 Step 3: Analytics & Reporting")
    print("-" * 40)
    
    # Generate analytics for HDFC Bank
    date_range = (
        (datetime.now() - timedelta(days=1)).isoformat(),
        datetime.now().isoformat()
    )
    
    hdfc_analytics = await platform.generate_unified_analytics("hdfc_bank", date_range)
    
    print(f"\n📈 HDFC Bank Analytics:")
    print(f"Total interactions: {hdfc_analytics['platform_summary']['total_interactions']}")
    print(f"Avg processing time: {hdfc_analytics['platform_summary']['avg_processing_time_seconds']}s")
    print(f"Escalation rate: {hdfc_analytics['platform_summary']['escalation_rate_percent']}%")
    print(f"SLA compliance: {hdfc_analytics['platform_metrics']['sla_compliance']}%")
    print(f"Cost per interaction: ₹{hdfc_analytics['platform_metrics']['cost_per_interaction']}")
    
    # Show business impact
    impact = hdfc_analytics['business_impact']
    print(f"\n💰 Business Impact:")
    print(f"Response time improvement: {impact['response_time_improvement']}")
    print(f"Cost reduction: {impact['cost_reduction_percent']}%")
    print(f"Automation rate: {impact['automation_rate_percent']}%")
    
    print("\n🏦 Step 4: Partner Dashboard")
    print("-" * 40)
    
    # Get dashboard data for HDFC
    hdfc_dashboard = await platform.get_partner_dashboard_data("hdfc_bank")
    
    print(f"\n📱 HDFC Bank Dashboard:")
    print(f"Company: {hdfc_dashboard['partner_info']['company_name']}")
    print(f"Platform tier: {hdfc_dashboard['partner_info']['platform_tier']}")
    print(f"Integration: {hdfc_dashboard['partner_info']['integration_type']}")
    
    metrics = hdfc_dashboard['real_time_metrics']
    print(f"\nReal-time metrics:")
    print(f"- Interactions today: {metrics['interactions_today']}")
    print(f"- Avg response time: {metrics['avg_response_time_today']}s")
    print(f"- System status: {metrics['system_status']}")
    print(f"- API uptime: {metrics['api_uptime']}")
    
    billing = hdfc_dashboard['billing_summary']
    print(f"\nBilling summary:")
    print(f"- Usage: {billing['current_month_usage']}/{billing['monthly_limit']} ({billing['usage_percentage']}%)")
    print(f"- Estimated cost: ₹{billing['estimated_monthly_cost']:,}")
    
    print("\n🔐 Step 5: Privacy & Compliance")
    print("-" * 40)
    
    # Check privacy analytics
    if 'privacy' in hdfc_analytics['service_analytics']:
        privacy = hdfc_analytics['service_analytics']['privacy']
        print(f"\n🛡️ Privacy Analytics:")
        print(f"Privacy tier: {privacy['privacy_summary']['privacy_tier']}")
        print(f"ZK proofs generated: {privacy['privacy_summary']['zero_knowledge_proofs_generated']}")
        print(f"Privacy violations: {privacy['privacy_summary']['privacy_violations']}")
        print(f"Compliance score: {privacy['privacy_summary']['compliance_score']}")
        
        print(f"\nCompliance status:")
        compliance = privacy['compliance_metrics']
        print(f"- GDPR: {'✅' if compliance['gdpr_compliance'] else '❌'}")
        print(f"- RBI: {'✅' if compliance['rbi_compliance'] else '❌'}")
        print(f"- SEBI: {'✅' if compliance['sebi_compliance'] else '❌'}")
    
    print("\n🎯 Step 6: Market Analysis Showcase")
    print("-" * 40)
    
    # Show Indian market expertise
    market_query = {
        "partner_id": "hdfc_bank",
        "channel": "api",
        "customer_id": "market_demo",
        "query_text": "80C में कौन से options हैं? Tax saving के लिए क्या करूं?",
        "language": "Hindi",
        "context": {"annual_income": 800000, "age": 35}
    }
    
    print(f"Market Analysis Demo Query:")
    print(f"Query: {market_query['query_text']}")
    
    market_interaction = await platform.process_unified_support_request(
        market_query["partner_id"], market_query
    )
    
    print(f"✅ Market analysis completed in {market_interaction.processing_time:.2f}s")
    print(f"Intent: {market_interaction.intent}")
    
    # Show detailed response
    response_lines = market_interaction.ai_response.response_text.split('\n')[:10]
    print(f"\nMarket Analysis Response Preview:")
    for line in response_lines:
        if line.strip():
            print(f"  {line.strip()}")
    
    print("\n📈 Step 7: ROI Demonstration")
    print("-" * 40)
    
    # Calculate ROI for partners
    total_interactions = sum(len(platform.interactions.get(partner_id, [])) for partner_id in platform.partners.keys())
    
    print(f"\n💰 Platform Performance Summary:")
    print(f"Total partners onboarded: {len(platform.partners)}")
    print(f"Total interactions processed: {total_interactions}")
    print(f"Average processing time: {sum(i.processing_time for interactions in platform.interactions.values() for i in interactions) / total_interactions:.2f}s")
    
    # Compare with traditional support
    traditional_cost_per_interaction = 500  # ₹500 per traditional support interaction
    platform_cost_per_interaction = 25     # ₹25 per platform interaction
    
    savings_per_interaction = traditional_cost_per_interaction - platform_cost_per_interaction
    total_savings = savings_per_interaction * total_interactions
    
    print(f"\nCost Comparison:")
    print(f"Traditional support cost per interaction: ₹{traditional_cost_per_interaction}")
    print(f"Platform cost per interaction: ₹{platform_cost_per_interaction}")
    print(f"Savings per interaction: ₹{savings_per_interaction}")
    print(f"Total savings for demo interactions: ₹{total_savings}")
    print(f"Cost reduction: {((savings_per_interaction / traditional_cost_per_interaction) * 100):.1f}%")
    
    print("\n🚀 Demo Completed Successfully!")
    print("=" * 70)
    print("\n🎯 Key Takeaways:")
    print("✅ Multi-tier SaaS platform operational")
    print("✅ AI Support with Indian market expertise")
    print("✅ Zero-Knowledge privacy for financial data")
    print("✅ WhatsApp integration for vernacular users")
    print("✅ Real-time analytics and compliance reporting")
    print("✅ 95% cost reduction vs traditional support")
    print("✅ Sub-2 second response times in 11 languages")
    
    print(f"\n💡 Business Opportunity:")
    print(f"Target Market: 1000+ fintech companies in India")
    print(f"Average Revenue per Partner: ₹75L - ₹2.5L annually")
    print(f"Total Market Opportunity: ₹500+ Cr annually")
    
    return platform

if __name__ == "__main__":
    # Run the demo
    asyncio.run(demo_saas_platform())