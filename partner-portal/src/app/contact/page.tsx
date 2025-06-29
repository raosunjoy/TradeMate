'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const contactMethods = [
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Live Chat',
    description: 'Chat with our support team',
    contact: 'Available 24/7 for Enterprise customers',
    action: 'Start Chat',
    href: '#chat',
    available: true
  },
  {
    icon: EnvelopeIcon,
    title: 'Email Support',
    description: 'Send us an email anytime',
    contact: 'support@trademate.ai',
    action: 'Send Email',
    href: 'mailto:support@trademate.ai',
    available: true
  },
  {
    icon: PhoneIcon,
    title: 'Phone Support',
    description: 'Call our support team',
    contact: '+91 80 4567 8900',
    action: 'Call Now',
    href: 'tel:+918045678900',
    available: true
  },
  {
    icon: MapPinIcon,
    title: 'Office Visit',
    description: 'Visit our Bangalore office',
    contact: 'Koramangala, Bangalore',
    action: 'Get Directions',
    href: '#office',
    available: true
  }
];

const officeLocations = [
  {
    city: 'Bangalore',
    address: '123 Innovation Drive, Koramangala 4th Block, Bangalore, Karnataka 560034',
    phone: '+91 80 4567 8900',
    email: 'bangalore@trademate.ai',
    hours: 'Mon-Fri: 9:00 AM - 6:00 PM IST'
  },
  {
    city: 'Mumbai',
    address: '456 Fintech Tower, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
    phone: '+91 22 4567 8900',
    email: 'mumbai@trademate.ai',
    hours: 'Mon-Fri: 9:00 AM - 6:00 PM IST'
  },
  {
    city: 'Delhi',
    address: '789 Tech Hub, Cyber City, Gurugram, Haryana 122002',
    phone: '+91 124 456 7890',
    email: 'delhi@trademate.ai',
    hours: 'Mon-Fri: 9:00 AM - 6:00 PM IST'
  }
];

const supportTiers = [
  {
    tier: 'Community',
    description: 'For Starter plan users',
    responseTime: '24-48 hours',
    channels: ['Email', 'Documentation', 'Community Forum'],
    features: ['Basic troubleshooting', 'General guidance', 'Bug reports']
  },
  {
    tier: 'Professional',
    description: 'For Professional plan users',
    responseTime: '4-8 hours',
    channels: ['Priority Email', 'Live Chat', 'Video Calls'],
    features: ['Priority support', 'Technical guidance', 'Integration help', 'Custom solutions']
  },
  {
    tier: 'Enterprise',
    description: 'For Enterprise plan users',
    responseTime: '1-2 hours',
    channels: ['24/7 Phone', 'Dedicated Support', 'Slack Integration'],
    features: ['Dedicated account manager', 'Emergency support', 'Custom development', 'SLA guarantees']
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    plan: '',
    subject: '',
    message: '',
    urgency: 'medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TM</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">TradeMate</span>
            </Link>
            <Link 
              href="/auth/signin"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're here to help you succeed. Whether you need technical support, 
            have questions about our services, or want to explore enterprise solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        company: '',
                        plan: '',
                        subject: '',
                        message: '',
                        urgency: 'medium'
                      });
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your company"
                      />
                    </div>
                    <div>
                      <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Plan
                      </label>
                      <select
                        id="plan"
                        name="plan"
                        value={formData.plan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a plan</option>
                        <option value="starter">Starter (Free)</option>
                        <option value="professional">Professional</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="interested">Interested in TradeMate</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="What can we help you with?"
                      />
                    </div>
                    <div>
                      <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency
                      </label>
                      <select
                        id="urgency"
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Low - General inquiry</option>
                        <option value="medium">Medium - Need assistance</option>
                        <option value="high">High - Urgent issue</option>
                        <option value="critical">Critical - Service down</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Methods</h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <method.icon className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{method.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                      <p className="text-sm text-gray-900">{method.contact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Tiers */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Levels</h3>
              <div className="space-y-4">
                {supportTiers.map((tier, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{tier.tier}</h4>
                      <span className="text-sm text-blue-600">{tier.responseTime}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{tier.description}</p>
                    <div className="text-xs text-gray-500">
                      {tier.channels.join(' • ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Office Hours</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-900">Monday - Friday: 9:00 AM - 6:00 PM IST</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GlobeAltIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-900">24/7 for Enterprise customers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Office Locations */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Offices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{office.city}</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPinIcon className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{office.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-900">{office.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-900">{office.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">{office.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-16 bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-red-900 mb-4">Emergency Support</h2>
          <p className="text-red-700 mb-4">
            For critical issues affecting your production systems (Enterprise customers only)
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+918045678999"
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Emergency Hotline: +91 80 4567 8999
            </a>
            <a
              href="mailto:emergency@trademate.ai"
              className="bg-white text-red-600 border border-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors"
            >
              emergency@trademate.ai
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}