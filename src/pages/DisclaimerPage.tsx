import React from "react";
import { SEOHead } from "../components/SEOHead";
export function DisclaimerPage() {
  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
           <SEOHead
        title="Disclaimer - Online Tools Portal"
        description="Important disclaimer information for Online Tools Portal services. Tool limitations, security notes, and usage guidelines."
        keywords="disclaimer, service limitations, tool disclaimer, usage guidelines"
        canonicalUrl="/disclaimer"
        noIndex={true}
      />
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Disclaimer</h1>
        <p className="text-slate-400">
          Important information about the use of our services
        </p>
      </div>

      <div className="prose tool-card prose-invert max-w-none">
        <h2>General Disclaimer</h2>
        <p>
          The information and tools provided by Online Tools Portal are for general informational 
          and utility purposes only. While we strive to provide accurate and reliable services, 
          we make no representations or warranties of any kind, express or implied, about the 
          completeness, accuracy, reliability, suitability, or availability of the information, 
          products, services, or related graphics contained on the website.
        </p>

        <h2>Use at Your Own Risk</h2>
        <p>
          Any reliance you place on the information and tools provided is strictly at your own risk. 
          We will not be liable for any loss or damage, including without limitation, indirect or 
          consequential loss or damage, or any loss or damage whatsoever arising from loss of data 
          or profits arising out of, or in connection with, the use of this website.
        </p>

        <h2>Tool-Specific Disclaimers</h2>

        <h3>Encryption and Security Tools</h3>
        <ul>
          <li>Encryption tools are provided for convenience and basic security needs</li>
          <li>For highly sensitive data, use enterprise-grade security solutions</li>
          <li>We cannot guarantee absolute security of encrypted data</li>
          <li>Users are responsible for key management and security practices</li>
        </ul>

        <h3>File Sharing and Storage</h3>
        <ul>
          <li>Files are stored temporarily and automatically deleted after expiration</li>
          <li>We are not responsible for data loss due to expiration or technical issues</li>
          <li>Users should maintain backups of important files</li>
          <li>Shared files may be accessible to anyone with the access code</li>
        </ul>

        <h3>Password Generator</h3>
        <ul>
          <li>Generated passwords are created using cryptographically secure methods</li>
          <li>Password strength indicators are estimates and may not reflect actual security</li>
          <li>Users are responsible for password storage and management</li>
          <li>We recommend using dedicated password managers for sensitive accounts</li>
        </ul>

        <h3>QR Code Generator</h3>
        <ul>
          <li>QR codes are generated based on user input without validation</li>
          <li>We are not responsible for the content or destination of QR codes</li>
          <li>Users should verify QR code content before sharing or using</li>
          <li>QR codes may not work with all scanning applications</li>
        </ul>

        <h3>Code Minifiers and Formatters</h3>
        <ul>
          <li>Minification may alter code behavior in rare cases</li>
          <li>Always test minified code thoroughly before deployment</li>
          <li>We recommend keeping original source files for development</li>
          <li>Formatting tools may not preserve all code semantics</li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>
          Our website may contain links to third-party websites or integrate with external services. 
          These third-party sites have separate and independent privacy policies and terms of service. 
          We have no responsibility or liability for the content and activities of these linked sites.
        </p>

        <h3>Payment Processing</h3>
        <ul>
          <li>Payments are processed by Razorpay, a third-party payment processor</li>
          <li>We do not store credit card or payment information</li>
          <li>Payment disputes should be directed to the payment processor</li>
          <li>Subscription billing is handled automatically by the payment system</li>
        </ul>

        <h3>Google Services</h3>
        <ul>
          <li>Authentication is provided through Google OAuth</li>
          <li>Google's privacy policy and terms apply to authentication data</li>
          <li>We only access basic profile information with your consent</li>
        </ul>

        <h2>Data and Privacy</h2>
        <ul>
          <li>While we implement security measures, no system is 100% secure</li>
          <li>Users should not share sensitive personal information through our tools</li>
          <li>Temporary data (clipboard, file sharing) is automatically deleted</li>
          <li>We may retain usage analytics for service improvement</li>
        </ul>

        <h2>Service Availability</h2>
        <ul>
          <li>Services may be temporarily unavailable due to maintenance or technical issues</li>
          <li>We do not guarantee continuous, uninterrupted access to our services</li>
          <li>Features may be modified or discontinued without prior notice</li>
          <li>Free tier limitations may change based on resource availability</li>
        </ul>

        <h2>Legal Compliance</h2>
        <ul>
          <li>Users are responsible for complying with applicable laws and regulations</li>
          <li>Some tools may be restricted in certain jurisdictions</li>
          <li>Export controls may apply to encryption and security tools</li>
          <li>Users should consult legal counsel for compliance questions</li>
        </ul>

        <h2>Accuracy of Information</h2>
        <p>
          While we make every effort to ensure the accuracy of information and proper functioning 
          of our tools, errors may occur. We reserve the right to make changes to the website 
          and these disclaimers at any time without notice.
        </p>

        <h2>Professional Advice</h2>
        <p>
          The tools and information provided should not be considered as professional advice. 
          For specific technical, legal, or security requirements, please consult with qualified 
          professionals in the relevant field.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          In no event will Online Tools Portal, its owners, employees, or affiliates be liable 
          for any direct, indirect, incidental, special, or consequential damages arising out of 
          the use or inability to use our services, even if we have been advised of the possibility 
          of such damages.
        </p>

        <h2>Updates to Disclaimer</h2>
        <p>
          This disclaimer may be updated from time to time to reflect changes in our services 
          or legal requirements. Users are encouraged to review this page periodically for any changes.
        </p>

        <h2>Contact Information</h2>
        <p>
          If you have any questions about this disclaimer or our services, please contact us at:
        </p>
        <ul>
          <li>Email: support@onlinetools.com</li>
          <li>Website: Contact form on our website</li>
        </ul>
      </div>
    </div>
  );
}