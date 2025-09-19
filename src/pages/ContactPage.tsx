import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { GoogleAdSlot } from "../components/GoogleAdSlot";
import { SEOHead } from "../components/SEOHead";
import React from "react";
interface ContactForm {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  priority: string;
}

export function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
    priority: "normal",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing & Subscriptions" },
    { value: "feature", label: "Feature Request" },
    { value: "bug", label: "Bug Report" },
    { value: "partnership", label: "Partnership" },
    { value: "press", label: "Press & Media" },
  ];

  const priorities = [
    { value: "low", label: "Low", color: "text-green-500" },
    { value: "normal", label: "Normal", color: "text-blue-500" },
    { value: "high", label: "High", color: "text-yellow-500" },
    { value: "urgent", label: "Urgent", color: "text-red-500" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, you would send this to your backend
      console.log("Contact form submission:", form);

      setSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset form
      setForm({
        name: "",
        email: "",
        subject: "",
        category: "general",
        message: "",
        priority: "normal",
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
      <SEOHead
        title="Contact Us - Online Tools Portal Support"
        description="Get in touch with Online Tools Portal support team. Technical support, billing inquiries, feature requests, and general questions. Fast response times."
        keywords="contact support, online tools help, technical support, customer service, billing support, feature request"
        canonicalUrl="/contact"
      />
      {/* SEO Meta Tags */}
      <div style={{ display: "none" }}>
        <h1>Contact Us - Online Tools Portal Support</h1>
        <meta
          name="description"
          content="Get in touch with Online Tools Portal support team. Technical support, billing inquiries, feature requests, and general questions. Fast response times."
        />
        <meta
          name="keywords"
          content="contact support, online tools help, technical support, customer service, billing support, feature request"
        />
      </div>

      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Contact Us
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-400">
          Have questions, feedback, or need support? We're here to help! Reach
          out to us and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Contact Information */}
        <div className="space-y-6 lg:col-span-1">
          <div className="tool-card">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 mt-1 text-blue-500" />
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p className="text-sm text-slate-400">
                    shrawan2401@gmail.com
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 mt-1 text-green-500" />
                <div>
                  <p className="font-medium text-white">Phone</p>
                  <p className="text-sm text-slate-400">9905737772</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Mon-Fri, 9 AM - 6 PM EST
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 text-purple-500" />
                <div>
                  <p className="font-medium text-white">Address</p>
                  <p className="text-sm text-slate-400">
                      chandigarh university 
                    <br />
                    chandigarh university ,140413
                    <br />
                  INDIA
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 mt-1 text-yellow-500" />
                <div>
                  <p className="font-medium text-white">Business Hours</p>
                  <p className="text-sm text-slate-400">
                    Monday - Friday: 9:00 AM - 6:00 PM EST
                    <br />
                    Saturday: 10:00 AM - 4:00 PM EST
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Times */}
          <div className="tool-card">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Response Times
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">General Inquiries</span>
                <span className="text-sm text-blue-400">24-48 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Technical Support</span>
                <span className="text-sm text-green-400">12-24 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Billing Issues</span>
                <span className="text-sm text-yellow-400">4-8 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Urgent Issues</span>
                <span className="text-sm text-red-400">1-4 hours</span>
              </div>
            </div>
          </div>

          {/* FAQ Link */}
          <div className="tool-card">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Before You Contact
            </h3>
            <p className="mb-4 text-sm text-slate-400">
              Check our FAQ section for quick answers to common questions about
              our tools, subscriptions, and technical issues.
            </p>
            <button className="w-full btn-secondary">View FAQ</button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="tool-card">
            {submitted ? (
              <div className="py-12 text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="mb-2 text-xl font-semibold text-white">
                  Message Sent Successfully!
                </h3>
                <p className="mb-6 text-slate-400">
                  Thank you for contacting us. We've received your message and
                  will get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-primary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="flex items-center text-lg font-semibold text-white">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                    Send us a Message
                  </h3>
                  <div className="text-sm text-slate-400">
                    * Required fields
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-slate-300"
                      >
                        Full Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Your full name"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-slate-300"
                      >
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="your.email@example.com"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  {/* Category and Priority */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="category"
                        className="block mb-2 text-sm font-medium text-slate-300"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        value={form.category}
                        onChange={(e) =>
                          handleInputChange("category", e.target.value)
                        }
                        className="input-field"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="priority"
                        className="block mb-2 text-sm font-medium text-slate-300"
                      >
                        Priority
                      </label>
                      <select
                        id="priority"
                        value={form.priority}
                        onChange={(e) =>
                          handleInputChange("priority", e.target.value)
                        }
                        className="input-field"
                      >
                        {priorities.map((priority) => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block mb-2 text-sm font-medium text-slate-300"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={form.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      placeholder="Brief description of your inquiry"
                      className="input-field"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block mb-2 text-sm font-medium text-slate-300"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      placeholder="Please provide as much detail as possible about your inquiry..."
                      className="h-32 textarea-field"
                      required
                    />
                    <div className="mt-1 text-xs text-right text-slate-500">
                      {form.message.length}/2000 characters
                    </div>
                  </div>

                  {/* Priority Notice */}
                  {form.priority === "urgent" && (
                    <div className="flex items-start p-4 space-x-3 border rounded-lg bg-red-900/20 border-red-700/30">
                      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-200">
                          Urgent Priority Selected
                        </p>
                        <p className="mt-1 text-xs text-red-300">
                          Please only use urgent priority for critical issues
                          that prevent you from using our services. For general
                          questions, please use normal priority.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      By submitting this form, you agree to our Privacy Policy
                      and Terms of Service.
                    </div>
                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !form.name.trim() ||
                        !form.email.trim() ||
                        !form.message.trim()
                      }
                      className="inline-flex items-center space-x-2 btn-primary"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <GoogleAdSlot adSlotId="9012345678" />

      {/* Additional Support Options */}
      <div className="mt-8 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Other Ways to Get Help
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-blue-500/10">
              <MessageSquare className="w-6 h-6 text-blue-500" />
            </div>
            <h4 className="mb-2 font-medium text-white">Live Chat</h4>
            <p className="mb-3 text-sm text-slate-400">
              Get instant help with our live chat support during business hours.
            </p>
            <button className="text-sm btn-secondary">Start Chat</button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/10">
              <Phone className="w-6 h-6 text-green-500" />
            </div>
            <h4 className="mb-2 font-medium text-white">Phone Support</h4>
            <p className="mb-3 text-sm text-slate-400">
              Call us directly for urgent issues or complex technical problems.
            </p>
            <button className="text-sm btn-secondary">Call Now</button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500/10">
              <Mail className="w-6 h-6 text-purple-500" />
            </div>
            <h4 className="mb-2 font-medium text-white">Email Support</h4>
            <p className="mb-3 text-sm text-slate-400">
              Send us an email for detailed inquiries and non-urgent matters.
            </p>
            <button className="text-sm btn-secondary">Send Email</button>
          </div>
        </div>
      </div>
    </div>
  );
}
