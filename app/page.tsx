"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { 
  FlaskConical, 
  Sparkles, 
  Cpu, 
  Rocket, 
  ArrowRight, 
  Code, 
  CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();
  const jsonExample = `{
  "form": {
    "title": "Patient Registration",
    "fields": [
      {
        "type": "text",
        "name": "fullName",
        "label": "Full Name",
        "required": true
      },
      {
        "type": "email",
        "name": "email",
        "label": "Email Address",
        "required": true
      },
      {
        "type": "select",
        "name": "patientType",
        "label": "Patient Type",
        "options": ["New", "Existing", "Referral"]
      }
    ]
  }
}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="flex items-center">
                <FlaskConical className="h-8 w-8 text-[#e4002b]" />
                <span className="ml-2 text-xl font-bold text-gray-900">FormGen<span className="text-[#e4002b]">AI</span></span>
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Features</Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Documentation</Button>
              <Button 
                className="bg-[#e4002b] hover:bg-[#cc0027] text-white"
                onClick={() => router.push('/GetStarted')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e4002b]/10 to-white/50 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Transform Your Forms with
                <span className="text-[#e4002b] block">AI-Powered Innovation</span>
              </h1>
              <p className="text-lg text-gray-700">
                Convert complex JSON schemas into beautiful, interactive forms with 
                enterprise-grade validation and processing—powered by advanced AI technology.
              </p>
              <div className="flex gap-4 pt-4">
                <Button 
                  className="bg-[#e4002b] hover:bg-[#cc0027] text-white px-6 py-6 text-lg"
                  onClick={() => router.push('/GetStarted')}
                >
                  Start Converting
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-[#e4002b] text-[#e4002b] hover:bg-red-50 px-6 py-6 text-lg">
                  View Demo
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-xl bg-white border-0">
                <CardHeader className="bg-gray-900 text-white rounded-t-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#e4002b]"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-sm">patient-form.json</div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="bg-gray-900 text-green-400 p-6 rounded-b-lg text-sm overflow-x-auto">
                    {jsonExample}
                  </pre>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900">Enterprise Features</h2>
            <div className="w-24 h-1 bg-[#e4002b] mx-auto my-4"></div>
            <p className="text-lg text-gray-700">Advanced capabilities for complex form requirements</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Conversion",
                description: "Intelligent form generation with smart field mapping and layout optimization",
                code: `{
  "ai": {
    "smartMapping": true,
    "layoutOptimization": true,
    "accessibilityChecks": true
  }
}`
              },
              {
                icon: CheckCircle2,
                title: "Enterprise Validation",
                description: "Comprehensive validation rules with custom logic and dependencies",
                code: `{
  "validation": {
    "rules": ["required", "pattern"],
    "custom": "async (value) => {
      return validateWithAPI(value)
    }"
  }
}`
              },
              {
                icon: Cpu,
                title: "High Performance",
                description: "Optimized for large-scale enterprise applications with complex workflows",
                code: `{
  "performance": {
    "caching": true,
    "lazyLoading": true,
    "batchSize": 1000
  }
}`
              },
              {
                icon: Rocket,
                title: "Easy Integration",
                description: "Seamless integration with existing enterprise systems and workflows",
                code: `{
  "integration": {
    "api": "/api/v1/forms",
    "webhooks": true,
    "formats": ["json", "xml"]
  }
}`
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-[#e4002b]/10 flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-[#e4002b]" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                        <p className="text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="bg-gray-900 p-4 mt-4 rounded-lg">
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      {feature.code}
                    </pre>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#e4002b]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white">Ready to Transform Your Forms?</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Join leading enterprises in creating intelligent, dynamic forms with our AI-powered platform.
            </p>
            <div className="pt-4">
              <Button
                className="w-full bg-white text-[#e4002b] hover:bg-gray-100 border border-[#e4002b] font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center space-x-2"
                onClick={() => router.push('/GetStarted')}
              >
                <span className="text-lg">Get Started Free</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center">
                <FlaskConical className="h-6 w-6 text-[#e4002b]" />
                <span className="ml-2 text-lg font-bold text-white">FormGen<span className="text-[#e4002b]">AI</span></span>
              </div>
              <p className="mt-4 text-sm">
                Enterprise-grade form generation powered by artificial intelligence.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Security", "Enterprise", "Pricing"]
              },
              {
                title: "Resources",
                links: ["Documentation", "API Reference", "Guides", "Examples"]
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"]
              }
            ].map((column, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>&copy; 2025 FormGenAI. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}