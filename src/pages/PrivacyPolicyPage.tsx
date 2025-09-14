import React from "react";
import { SEOHead } from "../components/SEOHead";
export function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
            <SEOHead
        title="Privacy Policy - Online Tools Portal"
        description="Privacy policy for Online Tools Portal. Learn how we collect, use, and protect your personal information and data."
        keywords="privacy policy, data protection, user privacy, GDPR compliance"
        canonicalUrl="/privacy"
        noIndex={true}
      />
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Privacy Policy</h1>
        <p className="text-slate-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose tool-card prose-invert max-w-none">
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, 
          use our services, or contact us for support.
        </p>

        <h3>1.1 Account Information</h3>
        <ul>
          <li>Google account information (name, email, profile picture)</li>
          <li>Subscription status and payment information</li>
          <li>Usage preferences and settings</li>
        </ul>

        <h3>1.2 Usage Data</h3>
        <ul>
          <li>Tool usage statistics and analytics</li>
          <li>Device information and browser type</li>
          <li>IP address and location data</li>
          <li>Performance and error logs</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and manage subscriptions</li>
          <li>Send important updates and notifications</li>
          <li>Analyze usage patterns to enhance user experience</li>
          <li>Prevent fraud and ensure security</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties, 
          except in the following circumstances:
        </p>
        <ul>
          <li>With your explicit consent</li>
          <li>To comply with legal obligations</li>
          <li>To protect our rights and safety</li>
          <li>With service providers who assist in our operations</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information:
        </p>
        <ul>
          <li>Encryption of sensitive data in transit and at rest</li>
          <li>Regular security audits and updates</li>
          <li>Access controls and authentication</li>
          <li>Secure payment processing through trusted providers</li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>
          We retain your information for as long as necessary to provide our services and comply 
          with legal obligations. Specific retention periods:
        </p>
        <ul>
          <li>Account data: Until account deletion</li>
          <li>Clipboard notes: As specified by expiration settings</li>
          <li>Usage logs: 12 months maximum</li>
          <li>Payment records: As required by law</li>
        </ul>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Delete your account and data</li>
          <li>Export your data</li>
          <li>Opt-out of marketing communications</li>
        </ul>

        <h2>7. Cookies and Tracking</h2>
        <p>
          We use cookies and similar technologies to enhance your experience:
        </p>
        <ul>
          <li>Essential cookies for site functionality</li>
          <li>Analytics cookies to understand usage patterns</li>
          <li>Preference cookies to remember your settings</li>
          <li>Advertising cookies (with your consent)</li>
        </ul>

        <h2>8. Third-Party Services</h2>
        <p>Our service integrates with third-party providers:</p>
        <ul>
          <li><strong>Google OAuth:</strong> For authentication</li>
          <li><strong>Razorpay:</strong> For payment processing</li>
          <li><strong>Cloudinary:</strong> For file storage</li>
          <li><strong>Google AdSense:</strong> For advertising</li>
        </ul>

        <h2>9. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your own. 
          We ensure appropriate safeguards are in place to protect your data.
        </p>

        <h2>10. Children's Privacy</h2>
        <p>
          Our service is not intended for children under 13. We do not knowingly collect 
          personal information from children under 13.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of any 
          material changes by posting the new policy on this page and updating the "Last updated" date.
        </p>

        <h2>12. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our data practices, please contact us at:
        </p>
        <ul>
          <li>Email: privacy@onlinetools.com</li>
          <li>Address: [Your Business Address]</li>
        </ul>
      </div>
    </div>
  );
}