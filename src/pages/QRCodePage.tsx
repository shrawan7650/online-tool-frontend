import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Copy,
  Download,
  QrCode,
  Upload,
  Link as LinkIcon,
  User,
  Mail,
  Phone,
  Wifi,
  CreditCard,
  Share2,
  Palette,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import QRCodeReact from "react-qr-code";
import { GoogleAdSlot } from "../components/GoogleAdSlot";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { SEOHead } from "../components/SEOHead";
type QRType =
  | "url"
  | "text"
  | "vcard"
  | "email"
  | "phone"
  | "sms"
  | "wifi"
  | "upi"
  | "social";

interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  organization: string;
  address: string;
  website: string;
}

interface EmailData {
  to: string;
  subject: string;
  body: string;
}

interface WiFiData {
  ssid: string;
  password: string;
  security: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

interface UPIData {
  upiId: string;
  name: string;
  amount: string;
  note: string;
}

interface SocialData {
  platform:
    | "instagram"
    | "twitter"
    | "linkedin"
    | "facebook"
    | "youtube"
    | "tiktok";
  username: string;
}

export function QRCodePage() {
  const [qrType, setQRType] = useState<QRType>("url");
  const [qrValue, setQRValue] = useState("");
  const [size, setSize] = useState(256);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#000000");
  const [logo, setLogo] = useState<string>("");
  const qrRef = useRef<HTMLDivElement>(null);

  // Form data for different QR types
  const [urlData, setUrlData] = useState("");
  const [textData, setTextData] = useState("");
  const [vCardData, setVCardData] = useState<VCardData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    organization: "",
    address: "",
    website: "",
  });
  const [emailData, setEmailData] = useState<EmailData>({
    to: "",
    subject: "",
    body: "",
  });
  const [phoneData, setPhoneData] = useState("");
  const [smsData, setSmsData] = useState({ phone: "", message: "" });
  const [wifiData, setWifiData] = useState<WiFiData>({
    ssid: "",
    password: "",
    security: "WPA",
    hidden: false,
  });
  const [upiData, setUpiData] = useState<UPIData>({
    upiId: "",
    name: "",
    amount: "",
    note: "",
  });
  const [socialData, setSocialData] = useState<SocialData>({
    platform: "instagram",
    username: "",
  });

  // Listen for clipboard paste events
  useEffect(() => {
    const handleClipboardPaste = (event: CustomEvent) => {
      if (qrType === "url") {
        setUrlData(event.detail.text);
      } else if (qrType === "text") {
        setTextData(event.detail.text);
      }
      toast.success("Clipboard content pasted!");
    };

    window.addEventListener(
      "clipboard-paste",
      handleClipboardPaste as EventListener
    );
    return () => {
      window.removeEventListener(
        "clipboard-paste",
        handleClipboardPaste as EventListener
      );
    };
  }, [qrType]);

  const generateQRValue = useCallback(() => {
    switch (qrType) {
      case "url":
        if (!urlData.trim()) return "";
        let url = urlData.trim();
        if (!url.match(/^https?:\/\//)) {
          url = `https://${url}`;
        }
        return url;

      case "text":
        return textData.trim();

      case "vcard":
        if (!vCardData.firstName && !vCardData.lastName) return "";
        return `BEGIN:VCARD
VERSION:3.0
FN:${vCardData.firstName} ${vCardData.lastName}
N:${vCardData.lastName};${vCardData.firstName};;;
ORG:${vCardData.organization}
TEL:${vCardData.phone}
EMAIL:${vCardData.email}
URL:${vCardData.website}
ADR:;;${vCardData.address};;;;
END:VCARD`;

      case "email":
        if (!emailData.to.trim()) return "";
        return `mailto:${emailData.to}?subject=${encodeURIComponent(
          emailData.subject
        )}&body=${encodeURIComponent(emailData.body)}`;

      case "phone":
        if (!phoneData.trim()) return "";
        return `tel:${phoneData.replace(/\D/g, "")}`;

      case "sms":
        if (!smsData.phone.trim()) return "";
        return `sms:${smsData.phone.replace(
          /\D/g,
          ""
        )}?body=${encodeURIComponent(smsData.message)}`;

      case "wifi":
        if (!wifiData.ssid.trim()) return "";
        return `WIFI:T:${wifiData.security};S:${wifiData.ssid};P:${
          wifiData.password
        };H:${wifiData.hidden ? "true" : "false"};;`;

      case "upi":
        if (!upiData.upiId.trim()) return "";
        let upiString = `upi://pay?pa=${upiData.upiId}`;
        if (upiData.name)
          upiString += `&pn=${encodeURIComponent(upiData.name)}`;
        if (upiData.amount) upiString += `&am=${upiData.amount}`;
        if (upiData.note)
          upiString += `&tn=${encodeURIComponent(upiData.note)}`;
        return upiString;

      case "social":
        if (!socialData.username.trim()) return "";
        const baseUrls = {
          instagram: "https://instagram.com/",
          twitter: "https://twitter.com/",
          linkedin: "https://linkedin.com/in/",
          facebook: "https://facebook.com/",
          youtube: "https://youtube.com/@",
          tiktok: "https://tiktok.com/@",
        };
        return `${baseUrls[socialData.platform]}${socialData.username}`;

      default:
        return "";
    }
  }, [
    qrType,
    urlData,
    textData,
    vCardData,
    emailData,
    phoneData,
    smsData,
    wifiData,
    upiData,
    socialData,
  ]);

  const generateQR = useCallback(() => {
    const value = generateQRValue();
    if (!value) {
      toast.error("Please fill in the required fields");
      return;
    }
    setQRValue(value);
    toast.success("QR Code generated successfully!");
  }, [generateQRValue]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const downloadQR = useCallback(() => {
    if (!qrValue) {
      toast.error("Generate a QR code first");
      return;
    }

    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = `qrcode-${qrType}-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
          toast.success("QR Code downloaded!");
        }
      }, "image/png");

      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [qrValue, size, qrType]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        // 1MB limit
        toast.error("Logo file size must be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const qrTypes = [
    {
      value: "url" as QRType,
      label: "URL",
      icon: LinkIcon,
      description: "Website links",
    },
    {
      value: "text" as QRType,
      label: "Text",
      icon: MessageSquare,
      description: "Plain text",
    },
    {
      value: "vcard" as QRType,
      label: "Contact",
      icon: User,
      description: "vCard contact info",
    },
    {
      value: "email" as QRType,
      label: "Email",
      icon: Mail,
      description: "Pre-filled email",
    },
    {
      value: "phone" as QRType,
      label: "Phone",
      icon: Phone,
      description: "Phone number",
    },
    {
      value: "sms" as QRType,
      label: "SMS",
      icon: MessageSquare,
      description: "Text message",
    },
    {
      value: "wifi" as QRType,
      label: "Wi-Fi",
      icon: Wifi,
      description: "Network credentials",
    },
    {
      value: "upi" as QRType,
      label: "UPI Payment",
      icon: CreditCard,
      description: "UPI payment",
    },
    {
      value: "social" as QRType,
      label: "Social Media",
      icon: Share2,
      description: "Social profiles",
    },
  ];

  const renderFormFields = () => {
    switch (qrType) {
      case "url":
        return (
          <div>
            <label
              htmlFor="url"
              className="block mb-2 text-sm font-medium text-slate-300"
            >
              Website URL
            </label>
            <input
              id="url"
              type="url"
              value={urlData}
              onChange={(e) => setUrlData(e.target.value)}
              placeholder="https://example.com"
              className="input-field"
            />
          </div>
        );

      case "text":
        return (
          <div>
            <label
              htmlFor="text"
              className="block mb-2 text-sm font-medium text-slate-300"
            >
              Text Content
            </label>
            <textarea
              id="text"
              value={textData}
              onChange={(e) => setTextData(e.target.value)}
              placeholder="Enter your text here..."
              className="h-24 textarea-field"
            />
          </div>
        );

      case "vcard":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-300">
                  First Name
                </label>
                <input
                  type="text"
                  value={vCardData.firstName}
                  onChange={(e) =>
                    setVCardData({ ...vCardData, firstName: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-300">
                  Last Name
                </label>
                <input
                  type="text"
                  value={vCardData.lastName}
                  onChange={(e) =>
                    setVCardData({ ...vCardData, lastName: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Phone
              </label>
              <input
                type="tel"
                value={vCardData.phone}
                onChange={(e) =>
                  setVCardData({ ...vCardData, phone: e.target.value })
                }
                placeholder="+1234567890"
                className="input-field"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                type="email"
                value={vCardData.email}
                onChange={(e) =>
                  setVCardData({ ...vCardData, email: e.target.value })
                }
                placeholder="john@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Organization
              </label>
              <input
                type="text"
                value={vCardData.organization}
                onChange={(e) =>
                  setVCardData({ ...vCardData, organization: e.target.value })
                }
                placeholder="Company Name"
                className="input-field"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Address
              </label>
              <input
                type="text"
                value={vCardData.address}
                onChange={(e) =>
                  setVCardData({ ...vCardData, address: e.target.value })
                }
                placeholder="123 Main St, City, Country"
                className="input-field"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Website
              </label>
              <input
                type="url"
                value={vCardData.website}
                onChange={(e) =>
                  setVCardData({ ...vCardData, website: e.target.value })
                }
                placeholder="https://example.com"
                className="input-field"
              />
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                To Email
              </label>
              <input
                type="email"
                value={emailData.to}
                onChange={(e) =>
                  setEmailData({ ...emailData, to: e.target.value })
                }
                placeholder="recipient@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Subject
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
                placeholder="Email subject"
                className="input-field"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Message
              </label>
              <textarea
                value={emailData.body}
                onChange={(e) =>
                  setEmailData({ ...emailData, body: e.target.value })
                }
                placeholder="Email message..."
                className="h-24 textarea-field"
              />
            </div>
          </div>
        );

      case "phone":
        return (
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneData}
              onChange={(e) => setPhoneData(e.target.value)}
              placeholder="+1234567890"
              className="input-field"
            />
          </div>
        );

      case "sms":
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Phone Number
              </label>
              <input
                type="tel"
                value={smsData.phone}
                onChange={(e) =>
                  setSmsData({ ...smsData, phone: e.target.value })
                }
                placeholder="+1234567890"
                className="input-field"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Message
              </label>
              <textarea
                value={smsData.message}
                onChange={(e) =>
                  setSmsData({ ...smsData, message: e.target.value })
                }
                placeholder="SMS message..."
                className="h-24 textarea-field"
              />
            </div>
          </div>
        );

      case "wifi":
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Network Name (SSID)
              </label>
              <input
                type="text"
                value={wifiData.ssid}
                onChange={(e) =>
                  setWifiData({ ...wifiData, ssid: e.target.value })
                }
                placeholder="MyWiFiNetwork"
                className="input-field"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                value={wifiData.password}
                onChange={(e) =>
                  setWifiData({ ...wifiData, password: e.target.value })
                }
                placeholder="WiFi password"
                className="input-field"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Security Type
              </label>
              <select
                value={wifiData.security}
                onChange={(e) =>
                  setWifiData({
                    ...wifiData,
                    security: e.target.value as "WPA" | "WEP" | "nopass",
                  })
                }
                className="input-field"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <ToggleSwitch
                label="Hidden Network"
                checked={wifiData.hidden}
                onChange={(val) => setWifiData({ ...wifiData, hidden: val })}
                id="hidden"
              />

              <label htmlFor="hidden" className="text-sm text-slate-300">
                Hidden Network
              </label>
            </div>
          </div>
        );

      case "upi":
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                UPI ID
              </label>
              <input
                type="text"
                value={upiData.upiId}
                onChange={(e) =>
                  setUpiData({ ...upiData, upiId: e.target.value })
                }
                placeholder="user@paytm"
                className="input-field"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Recipient Name
              </label>
              <input
                type="text"
                value={upiData.name}
                onChange={(e) =>
                  setUpiData({ ...upiData, name: e.target.value })
                }
                placeholder="John Doe"
                className="input-field"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Amount (₹)
              </label>
              <input
                type="number"
                value={upiData.amount}
                onChange={(e) =>
                  setUpiData({ ...upiData, amount: e.target.value })
                }
                placeholder="100"
                className="input-field"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Note
              </label>
              <input
                type="text"
                value={upiData.note}
                onChange={(e) =>
                  setUpiData({ ...upiData, note: e.target.value })
                }
                placeholder="Payment for..."
                className="input-field"
              />
            </div>
          </div>
        );

      case "social":
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Platform
              </label>
              <select
                value={socialData.platform}
                onChange={(e) =>
                  setSocialData({
                    ...socialData,
                    platform: e.target.value as any,
                  })
                }
                className="input-field"
              >
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-300">
                Username
              </label>
              <input
                type="text"
                value={socialData.username}
                onChange={(e) =>
                  setSocialData({ ...socialData, username: e.target.value })
                }
                placeholder="@username"
                className="input-field"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
         <SEOHead
        title="Advanced QR Code Generator - 9 Types with Custom Styling"
        description="Generate QR codes for URLs, contacts, Wi-Fi, payments, and more. 9 different types with custom colors, logos, and high-quality export options."
        keywords="QR code generator, vCard QR, WiFi QR, UPI QR, contact QR, custom QR codes, QR code with logo"
        canonicalUrl="/qr-code"
      />
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Advanced QR Code Generator
        </h1>
        <p className="text-lg text-slate-400">
          Generate QR codes for URLs, contacts, payments, Wi-Fi, and more with
          custom styling
        </p>
      </div>

      {/* QR Type Selection */}
      <div className="mb-6 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">QR Code Type</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {qrTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setQRType(type.value)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  qrType === type.value
                    ? "border-indigo-500 bg-indigo-500/10 text-white"
                    : "border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 mb-2" />
                <div className="text-sm font-medium">{type.label}</div>
                <div className="text-xs text-slate-400">{type.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        {/* Input Section */}
        <div className="tool-card">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Content & Settings
          </h3>
          <div className="space-y-4">
            {renderFormFields()}

            {/* Styling Options */}
            <div className="pt-4 border-t border-slate-700">
              <h4 className="mb-3 font-medium text-white">Styling Options</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    Size (px)
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="input-field"
                  >
                    <option value={128}>128x128</option>
                    <option value={256}>256x256</option>
                    <option value={512}>512x512</option>
                    <option value={1024}>1024x1024</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-center text-slate-300">
                    Colors
                  </label>
                  <div className="flex space-x-4">
                    {/* Foreground */}
                    <div className="flex flex-col items-center flex-1">
                      <label className="relative cursor-pointer group">
                        <input
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {/* Preview Circle */}
                        <div
                          className="w-12 h-12 transition border-2 rounded-full shadow-md border-slate-500 group-hover:scale-110"
                          style={{ backgroundColor: fgColor }}
                        />
                      </label>
                      <span className="mt-2 text-xs text-slate-400">
                        Foreground
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {fgColor}
                      </span>
                    </div>

                    {/* Background */}
                    <div className="flex flex-col items-center flex-1">
                      <label className="relative cursor-pointer group">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {/* Preview Circle */}
                        <div
                          className="w-12 h-12 transition border-2 rounded-full shadow-md border-slate-500 group-hover:scale-110"
                          style={{ backgroundColor: bgColor }}
                        />
                      </label>
                      <span className="mt-2 text-xs text-slate-400">
                        Background
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {bgColor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              {/* <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-slate-300">
                  Custom Logo (Optional)
                </label>
                <label className="flex flex-col items-center justify-center w-full h-40 transition border-2 border-dashed cursor-pointer border-slate-500 rounded-xl bg-slate-800/40 hover:bg-slate-700/40">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-slate-400" />
                    <p className="text-sm text-slate-300">Click to upload</p>
                    <p className="text-xs text-slate-400">PNG, JPG, JPEG</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {logo && (
                  <div className="flex items-center mt-2 space-x-2">
                    <img
                      src={logo}
                      alt="Logo preview"
                      className="w-8 h-8 rounded"
                    />
                    <button
                      onClick={() => setLogo("")}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div> */}
            </div>

            <button
              onClick={generateQR}
              disabled={!generateQRValue()}
              className="w-full btn-primary"
            >
              Generate QR Code
            </button>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="tool-card">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
            <QrCode className="w-5 h-5 mr-2 text-indigo-500" />
            Generated QR Code
          </h3>
          {qrValue ? (
            <div className="space-y-4">
              <div
                ref={qrRef}
                className="relative flex justify-center p-4 rounded-lg"
                style={{ backgroundColor: bgColor }}
              >
                <div className="relative">
                  <QRCodeReact
                    value={qrValue}
                    size={Math.min(size, 300)}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    level="M"
                  />
                  {logo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={logo}
                        alt="Logo"
                        className="w-12 h-12 p-1 bg-white rounded"
                        style={{ maxWidth: "20%", maxHeight: "20%" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-slate-400">
                  <strong>Type:</strong>{" "}
                  {qrTypes.find((t) => t.value === qrType)?.label}
                </div>
                <div className="text-sm text-slate-400">
                  <strong>Size:</strong> {size}x{size}px
                </div>
                <div className="text-sm break-all text-slate-400">
                  <strong>Content:</strong>{" "}
                  {qrValue.length > 50
                    ? `${qrValue.substring(0, 50)}...`
                    : qrValue}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleCopy(qrValue)}
                  className="inline-flex items-center space-x-2 btn-copy"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Content</span>
                </button>
                <button
                  onClick={downloadQR}
                  className="inline-flex items-center space-x-2 btn-secondary"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg bg-slate-900 border-slate-700">
              <div className="text-center">
                <QrCode className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                <p className="text-slate-500">QR Code will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <GoogleAdSlot adSlotId="2345678901" />

      {/* Info Section */}
      <div className="mt-8 tool-card">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
          <Palette className="w-5 h-5 mr-2 text-indigo-500" />
          QR Code Types & Features
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="mb-4 text-slate-400">
            Generate professional QR codes for various purposes with custom
            styling and logo integration.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-white">Supported Types:</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>• URL - Website links with auto-protocol</li>
                <li>• Text - Plain text content</li>
                <li>• vCard - Complete contact information</li>
                <li>• Email - Pre-filled email composition</li>
                <li>• Phone/SMS - Direct calling and messaging</li>
                <li>• Wi-Fi - Network auto-connection</li>
                <li>• UPI - Indian payment system integration</li>
                <li>• Social Media - Profile links</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-white">Customization:</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>• Custom foreground and background colors</li>
                <li>• Logo overlay with automatic sizing</li>
                <li>• Multiple size options (128px to 1024px)</li>
                <li>• High-quality PNG download</li>
                <li>• Error correction level M for reliability</li>
                <li>• Mobile-optimized scanning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
