import Link from 'next/link'
import { Shield, Eye, Cookie, Mail, ArrowRight } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
        <div className="container mx-auto px-4 py-20 md:py-24 relative">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Your Privacy Matters</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <p className="font-body text-lg text-foreground/70">
              Last updated: March 16, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-border mb-8">
              <p className="font-body text-foreground/70 leading-relaxed mb-4">
                At <strong>Pawfectly Handmade</strong>, we value your privacy as much as we value our furry customers. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
              </p>
              <p className="font-body text-foreground/70 leading-relaxed">
                By using our website, you agree to the terms of this policy. If you don't agree with these terms, please refrain from using our website.
              </p>
            </div>

            {/* Policy Sections */}
            {[
              {
                title: '1. Information We Collect',
                icon: Eye,
                content: (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold mb-2">Personal Information:</h4>
                      <ul className="list-disc list-inside space-y-2 text-foreground/70">
                        <li>Name, email address, phone number (when you create an account or place an order)</li>
                        <li>Shipping and billing address</li>
                        <li>Payment information (processed securely through third-party payment processors)</li>
                        <li>Account credentials (username/password)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Automatically Collected Information:</h4>
                      <ul className="list-disc list-inside space-y-2 text-foreground/70">
                        <li>IP address, browser type, device information</li>
                        <li>Pages visited, time spent, click patterns</li>
                        <li>Referring website and search terms</li>
                      </ul>
                    </div>
                  </div>
                ),
              },
              {
                title: '2. How We Use Your Information',
                icon: '🎯',
                content: (
                  <div className="space-y-4">
                    <p className="text-foreground/70">We use your information to:</p>
                    <ul className="list-disc list-inside space-y-2 text-foreground/70">
                      <li>Process and fulfill your orders</li>
                      <li>Send you order confirmations and shipping updates</li>
                      <li>Respond to your inquiries and provide customer support</li>
                      <li>Send promotional emails (only with your consent)</li>
                      <li>Improve our website, products, and services</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </div>
                ),
              },
              {
                title: '3. Information Sharing',
                icon: '🤝',
                content: (
                  <div className="space-y-4">
                    <p className="text-foreground/70">We do not sell your personal information. We may share your information with:</p>
                      <ul className="list-disc list-inside space-y-2 text-foreground/70">
                        <li><strong>Payment Processors:</strong> To process transactions securely</li>
                        <li><strong>Shipping Partners:</strong> To deliver your orders</li>
                        <li><strong>Email Service:</strong> To send you communications</li>
                        <li><strong>Analytics Providers:</strong> To understand website usage</li>
                        <li><strong>Legal Authorities:</strong> When required by law</li>
                      </ul>
                    </div>
                ),
              },
              {
                title: '4. Cookies and Tracking',
                icon: Cookie,
                content: (
                  <div className="space-y-4">
                    <p className="text-foreground/70">We use cookies and similar technologies to:</p>
                    <ul className="list-disc list-inside space-y-2 text-foreground/70">
                      <li>Remember your preferences and keep you logged in</li>
                      <li>Analyze website traffic and user behavior</li>
                      <li>Personalize your experience</li>
                      <li>Track marketing campaigns</li>
                    </ul>
                    <p className="text-foreground/70 mt-4">You can manage cookies through your browser settings.</p>
                  </div>
                ),
              },
              {
                title: '5. Data Security',
                icon: '🔒',
                content: (
                  <div className="space-y-4">
                    <p className="text-foreground/70">We implement appropriate security measures to protect your information:</p>
                    <ul className="list-disc list-inside space-y-2 text-foreground/70">
                      <li>SSL encryption for all data transmission</li>
                      <li>Secure payment processing through PCI-compliant processors</li>
                      <li>Regular security audits and updates</li>
                      <li>Restricted access to personal data</li>
                    </ul>
                    <p className="text-foreground/70 mt-4">However, no method of transmission over the Internet is 100% secure.</p>
                  </div>
                ),
              },
              {
                title: '6. Your Rights',
                icon: '✋',
                content: (
                  <div className="space-y-4">
                    <p className="text-foreground/70">You have the right to:</p>
                    <ul className="list-disc list-inside space-y-2 text-foreground/70">
                      <li>Access and review your personal information</li>
                      <li>Correct inaccurate data</li>
                      <li>Request deletion of your personal information</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Object to processing of your data</li>
                    </ul>
                    <p className="text-foreground/70 mt-4">Contact us to exercise these rights.</p>
                  </div>
                ),
              },
              {
                title: '7. Third-Party Links',
                icon: '🔗',
                content: (
                  <p className="text-foreground/70">Our website may contain links to third-party websites. We are not responsible for their privacy practices. Please review their policies before providing personal information.</p>
                ),
              },
              {
                title: '8. Children\'s Privacy',
                icon: '👶',
                content: (
                  <p className="text-foreground/70">Our services are not intended for children under 13. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us.</p>
                ),
              },
              {
                title: '9. Policy Updates',
                icon: '📅',
                content: (
                  <p className="text-foreground/70">We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
                ),
              },
            ].map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-border mb-8 last:mb-0"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    {typeof section.icon === 'string' ? (
                      <span className="text-2xl">{section.icon}</span>
                    ) : (
                      <section.icon className="w-6 h-6 text-primary" strokeWidth={2} />
                    )}
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold">{section.title}</h2>
                </div>
                <div className="text-foreground/70 leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 border-2 border-primary/20 mt-12">
              <div className="max-w-2xl">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                  Questions About Your Privacy?
                </h2>
                <p className="font-body text-foreground/70 mb-6">
                  We're happy to answer any questions you may have about this privacy policy or our data practices.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <a
                      href="mailto:hello@pawfectlyhandmade.com"
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      hello@pawfectlyhandmade.com
                    </a>
                  </div>
                  <div className="text-sm text-foreground/60">
                    <strong>Pawfectly Handmade</strong><br />
                    Portland, Oregon<br />
                    United States
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-display text-2xl font-bold mb-8">
              Related <span className="text-primary">Documents</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/terms"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full font-medium shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                Terms of Service
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shipping"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full font-medium shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                Shipping Policy
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/returns"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full font-medium shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                Return Policy
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
