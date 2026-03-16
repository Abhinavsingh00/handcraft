import Link from 'next/link'
import { FileText, Gavel, AlertCircle, Users, Package, CreditCard, ArrowRight } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/10"></div>
        <div className="container mx-auto px-4 py-20 md:py-24 relative">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full mb-6">
              <Gavel className="w-4 h-4" />
              <span className="text-sm font-medium">Legal Terms</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Terms of <span className="text-primary">Service</span>
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
            {/* Agreement Notice */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 border-2 border-primary/20 mb-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-display text-xl font-bold mb-3">Important: Please Read Carefully</h2>
                  <p className="text-foreground/70 leading-relaxed">
                    By accessing or using <strong>Pawfectly Handmade</strong> ("we," "our," or "us"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access our website or use our services.
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Sections */}
            {[
              {
                title: '1. Account Registration & Security',
                icon: Users,
                content: (
                  <div className="space-y-4">
                    <p className="text-foreground/70">When creating an account, you agree to:</p>
                    <ul className="list-disc list-inside space-y-2 text-foreground/70">
                      <li>Provide accurate, current, and complete information</li>
                      <li>Maintain and update your account information</li>
                      <li>Keep your password confidential and secure</li>
                      <li>Accept responsibility for all activities under your account</li>
                      <li>Notify us immediately of any unauthorized use</li>
                    </ul>
                    <p className="text-foreground/70 mt-4">You must be at least 18 years old to create an account, or have parental/guardian consent.</p>
                  </div>
                ),
              },
              {
                title: '2. Products & Services',
                icon: Package,
                content: (
                  <div className="space-y-4">
                    <p className="text-foreground/70">We reserve the right to:</p>
                    <ul className="list-disc list-inside space-y-2 text-foreground/70">
                      <li>Modify or discontinue products at any time</li>
                      <li>Substitute products with similar items if necessary</li>
                      <li>Limit quantities available for purchase</li>
                    </ul>
                    <p className="text-foreground/70 mt-4"><strong>Product Descriptions:</strong> We strive for accuracy but cannot guarantee that every description is error-free. Colors may vary slightly due to monitor settings.</p>
                    <p className="text-foreground/70 mt-4"><strong>Handmade Nature:</strong> As our products are handmade, slight variations in size, color, and craftsmanship may occur. These variations make each item unique.</p>
                  </div>
                ),
              },
              {
                title: '3. Pricing & Payment',
                icon: CreditCard,
                content: (
                  <div className="space-y-4">
                    <p className="text-foreground/70"><strong>Pricing:</strong> All prices are in USD unless otherwise specified. We reserve the right to modify prices without notice. We are not liable for any pricing errors.</p>
                    <p className="text-foreground/70"><strong>Payment:</strong> We accept major credit cards and PayPal. By providing payment information, you represent that you are authorized to use the payment method.</p>
                    <p className="text-foreground/70 mt-4"><strong>Security:</strong> All payments are processed securely through third-party payment processors. We do not store your complete credit card information.</p>
                  </div>
                ),
              },
              {
                title: '4. Shipping & Delivery',
                icon: '🚚',
                content: (
                  <div className="space-y-4">
                    <p className="text-foreground/70">Shipping times are estimates and not guaranteed. We are not liable for delays caused by:</p>
                    <ul className="list-disc list-inside space-y-2 text-foreground/70">
                      <li>Weather conditions or natural disasters</li>
                      <li>Carrier issues or delays</li>
                      <li>Incorrect or incomplete shipping information</li>
                      <li>Customs processing (for international orders)</li>
                    </ul>
                    <p className="text-foreground/70 mt-4"><strong>Risk of Loss:</strong> All items purchased from Pawfectly Handmade are made pursuant to a shipment contract. This means that the risk of loss and title for such items pass to you upon our delivery to the shipping carrier.</p>
                  </div>
                ),
              },
              {
                title: '5. Returns & Refunds',
                icon: '↩️',
                content: (
                  <div className="space-y-4">
                    <p className="text-foreground/70">Our return policy is outlined separately and incorporated by reference. Key points:</p>
                    <ul className="list-disc list-inside space-y-2 text-foreground/70">
                      <li>30-day happiness guarantee on all products</li>
                      <li>Items must be unused and in original packaging</li>
                      <li>Custom orders may have different return terms</li>
                      <li>Refunds processed within 5-7 business days of approval</li>
                    </ul>
                    <p className="text-foreground/70 mt-4">See our full <Link href="/returns" className="text-primary hover:underline">Return Policy</Link> for details.</p>
                  </div>
                ),
              },
              {
                title: '6. Intellectual Property',
                icon: '©️',
                content: (
                  <div className="space-y-4">
                    <p className="text-foreground/70">All content on this website, including:</p>
                    <ul className="list-disc list-inside space-y-2 text-foreground/70">
                      <li>Text, graphics, logos, and images</li>
                      <li>Product designs and photos</li>
                      <li>Software and code</li>
                      <li>Brand names and trademarks</li>
                    </ul>
                    <p className="text-foreground/70 mt-4">Are the property of Pawfectly Handmade or our licensors and are protected by copyright and other intellectual property laws.</p>
                    <p className="text-foreground/70 mt-4">You may not use, reproduce, or distribute any content without our written permission.</p>
                  </div>
                ),
              },
              {
                title: '7. User Conduct',
                icon: '⚠️',
                content: (
                  <div className="space-y-4">
                    <p className="text-foreground/70">You agree NOT to:</p>
                    <ul className="list-disc list-inside space-y-2 text-foreground/70">
                      <li>Use the website for any illegal purpose</li>
                      <li>Attempt to gain unauthorized access to our systems</li>
                      <li>Interfere with other users' use of the website</li>
                      <li>Post or transmit harmful, offensive, or inappropriate content</li>
                      <li>Harvest or collect user information without permission</li>
                      <li>Impersonate Pawfectly Handmade or any other person</li>
                    </ul>
                    <p className="text-foreground/70 mt-4">We reserve the right to terminate accounts violating these terms.</p>
                  </div>
                ),
              },
              {
                title: '8. Limitation of Liability',
                icon: '🛡️',
                content: (
                  <div className="space-y-4">
                    <p className="text-foreground/70"><strong>To the Maximum Extent Permitted by Law:</strong></p>
                    <ul className="list-disc list-inside space-y-2 text-foreground/70">
                      <li>We are not liable for any indirect, incidental, special, or consequential damages</li>
                      <li>Our liability is limited to the amount you paid for the product</li>
                      <li>We are not liable for product misuse or improper handling</li>
                      <li>We are not liable for actions of third parties (shipping carriers, payment processors, etc.)</li>
                    </ul>
                    <p className="text-foreground/70 mt-4">Some jurisdictions do not allow exclusion of warranties, so these limitations may not apply to you.</p>
                  </div>
                ),
              },
              {
                title: '9. Indemnification',
                icon: '🤝',
                content: (
                  <p className="text-foreground/70">You agree to indemnify and hold harmless Pawfectly Handmade, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from:</p>
                ),
              },
              {
                title: '10. Governing Law & Dispute Resolution',
                icon: '⚖️',
                content: (
                  <div className="space-y-4">
                    <p className="text-foreground/70">These terms are governed by the laws of the State of Oregon, USA.</p>
                    <p className="text-foreground/70 mt-4"><strong>Dispute Resolution:</strong> Any disputes shall be resolved through binding arbitration in Portland, Oregon, except where prohibited by law.</p>
                  </div>
                ),
              },
              {
                title: '11. Modifications to These Terms',
                icon: '📝',
                content: (
                  <p className="text-foreground/70">We may modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the modified terms.</p>
                ),
              },
              {
                title: '12. Severability',
                icon: '✂️',
                content: (
                  <p className="text-foreground/70">If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect.</p>
                ),
              },
              {
                title: '13. Waiver',
                icon: '📋',
                content: (
                  <p className="text-foreground/70">Our failure to enforce any right or provision of these terms will not be considered a waiver of those rights.</p>
                ),
              },
              {
                title: '14. Entire Agreement',
                icon: '📄',
                content: (
                  <p className="text-foreground/70">These Terms of Service, together with our Privacy Policy and Return Policy, constitute the entire agreement between you and Pawfectly Handmaid regarding the use of our website.</p>
                ),
              },
            ].map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-border mb-8 last:mb-0"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    {typeof section.icon === 'string' ? (
                      <span className="text-2xl">{section.icon}</span>
                    ) : (
                      <section.icon className="w-6 h-6 text-secondary" strokeWidth={2} />
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
            <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl p-8 md:p-12 border-2 border-secondary/20 mt-12">
              <div className="max-w-2xl">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                  Questions About These Terms?
                </h2>
                <p className="font-body text-foreground/70 mb-6">
                  If you have any questions about these Terms of Service, please contact us.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-secondary" />
                    <a
                      href="mailto:hello@pawfectlyhandmade.com"
                      className="text-foreground hover:text-secondary transition-colors"
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
              Related <span className="text-secondary">Documents</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full font-medium shadow-sm hover:shadow-md transition-shadow border border-border"
              >
                Privacy Policy
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
