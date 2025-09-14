import React from "react";
import { SEOHead } from "../components/SEOHead";
export function TermsPage() {
  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
            <SEOHead
        title="Terms & Conditions - Online Tools Portal"
        description="Terms and conditions for using Online Tools Portal. User agreements, subscription terms, and service policies."
        keywords="terms and conditions, user agreement, service terms, subscription terms"
        canonicalUrl="/terms"
        noIndex={true}
      />
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Terms & Conditions</h1>
        <p className="text-slate-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose tool-card prose-invert max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Online Tools Portal ("the Service"), you accept and agree to be 
          bound by the terms and provision of this agreement.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Online Tools Portal provides a collection of web-based utilities including but not limited to:
        </p>
        <ul>
          <li>Text encoding and decoding tools</li>
          <li>File sharing and hashing services</li>
          <li>QR code generation</li>
          <li>Secure clipboard functionality</li>
          <li>Password generation and management tools</li>
          <li>Code minification and formatting</li>
        </ul>

        <h2>3. User Accounts</h2>
        <h3>3.1 Account Creation</h3>
        <ul>
          <li>Accounts are created through Google OAuth authentication</li>
          <li>You must provide accurate and complete information</li>
          <li>You are responsible for maintaining account security</li>
          <li>One account per person is permitted</li>
        </ul>

        <h3>3.2 Account Termination</h3>
        <ul>
          <li>You may delete your account at any time</li>
          <li>We may suspend or terminate accounts for violations</li>
          <li>Termination does not relieve payment obligations</li>
        </ul>

        <h2>4. Subscription Services</h2>
        <h3>4.1 Pro and Max Pro Plans</h3>
        <ul>
          <li>Subscription fees are billed monthly in advance</li>
          <li>Prices are subject to change with 30 days notice</li>
          <li>Subscriptions auto-renew unless cancelled</li>
          <li>Refunds are provided according to our refund policy</li>
        </ul>

        <h3>4.2 Payment Terms</h3>
        <ul>
          <li>Payments are processed through Razorpay</li>
          <li>All fees are non-refundable except as required by law</li>
          <li>Failed payments may result in service suspension</li>
          <li>Taxes are your responsibility where applicable</li>
        </ul>

        <h2>5. Acceptable Use</h2>
        <h3>5.1 Permitted Uses</h3>
        <p>You may use the Service for lawful purposes only, including:</p>
        <ul>
          <li>Personal and commercial projects</li>
          <li>Educational and research purposes</li>
          <li>Development and testing activities</li>
        </ul>

        <h3>5.2 Prohibited Uses</h3>
        <p>You may not use the Service to:</p>
        <ul>
          <li>Violate any laws or regulations</li>
          <li>Infringe on intellectual property rights</li>
          <li>Distribute malware or harmful content</li>
          <li>Attempt to breach security measures</li>
          <li>Abuse or overload our systems</li>
          <li>Share inappropriate or offensive content</li>
        </ul>

        <h2>6. Content and Data</h2>
        <h3>6.1 Your Content</h3>
        <ul>
          <li>You retain ownership of content you upload</li>
          <li>You grant us license to process and store your content</li>
          <li>You are responsible for the legality of your content</li>
          <li>We may remove content that violates these terms</li>
        </ul>

        <h3>6.2 Data Security</h3>
        <ul>
          <li>We implement industry-standard security measures</li>
          <li>Clipboard data is encrypted and automatically deleted</li>
          <li>File sharing includes automatic expiration</li>
          <li>We cannot guarantee absolute security</li>
        </ul>

        <h2>7. Service Availability</h2>
        <ul>
          <li>We strive for 99.9% uptime but cannot guarantee it</li>
          <li>Maintenance may cause temporary interruptions</li>
          <li>We reserve the right to modify or discontinue features</li>
          <li>No compensation for service interruptions</li>
        </ul>

        <h2>8. Intellectual Property</h2>
        <h3>8.1 Our Rights</h3>
        <ul>
          <li>The Service and its content are our property</li>
          <li>Trademarks and logos are protected</li>
          <li>You may not copy or redistribute our content</li>
        </ul>

        <h3>8.2 User Rights</h3>
        <ul>
          <li>You retain rights to your original content</li>
          <li>Generated outputs (hashes, codes) are yours to use</li>
          <li>No rights granted to our proprietary algorithms</li>
        </ul>

        <h2>9. Privacy and Data Protection</h2>
        <ul>
          <li>Our Privacy Policy governs data collection and use</li>
          <li>We comply with applicable privacy laws</li>
          <li>You consent to data processing as described</li>
          <li>You may request data deletion at any time</li>
        </ul>

        <h2>10. Disclaimers</h2>
        <h3>10.1 Service Disclaimer</h3>
        <p>
          The Service is provided "as is" without warranties of any kind. We disclaim all 
          warranties, express or implied, including merchantability and fitness for a particular purpose.
        </p>

        <h3>10.2 Content Disclaimer</h3>
        <p>
          We do not endorse or verify user-generated content. Users are solely responsible 
          for their content and its consequences.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, we shall not be liable for any indirect, 
          incidental, special, consequential, or punitive damages, including loss of profits, 
          data, or use.
        </p>

        <h2>12. Indemnification</h2>
        <p>
          You agree to indemnify and hold us harmless from any claims, damages, or expenses 
          arising from your use of the Service or violation of these terms.
        </p>

        <h2>13. Governing Law</h2>
        <p>
          These terms are governed by the laws of [Your Jurisdiction]. Any disputes will be 
          resolved in the courts of [Your Jurisdiction].
        </p>

        <h2>14. Changes to Terms</h2>
        <p>
          We may modify these terms at any time. Material changes will be communicated via 
          email or service notifications. Continued use constitutes acceptance of new terms.
        </p>

        <h2>15. Severability</h2>
        <p>
          If any provision of these terms is found unenforceable, the remaining provisions 
          will continue in full force and effect.
        </p>

        <h2>16. Contact Information</h2>
        <p>
          For questions about these terms, please contact us at:
        </p>
        <ul>
          <li>Email: legal@onlinetools.com</li>
          <li>Address: [Your Business Address]</li>
        </ul>
      </div>
    </div>
  );
}