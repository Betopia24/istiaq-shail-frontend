"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    agencyName: "",
    email: "",
    phone: "",
    topic: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Thank you! Our UK team will get back to you shortly.");
    }, 1000);
  };

  return (
    <div className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] text-[#8C6605] border border-[#FDE68A] text-xs font-semibold">
          <Mail className="w-3.5 h-3.5 text-[#E8A808]" />
          <span>Support &amp; Inquiries</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#06143E] tracking-tight">
          Get in Touch with Our Team
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
          Have questions about multi-office agency licensing, custom templates,
          or billing? We&apos;re here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <h2 className="font-heading font-bold text-lg text-slate-900">
              Direct Contact Details
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#092167] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#E8A808]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Customer Support</p>
                  <a
                    href="mailto:support@propertypack.ai"
                    className="text-[#092167] hover:underline"
                  >
                    support@propertypack.ai
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#092167] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#E8A808]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Telephone</p>
                  <p className="text-slate-600">+44 161 496 0200</p>
                  <p className="text-[11px] text-slate-400">
                    Mon–Fri, 9:00am – 5:30pm GMT
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#092167] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#E8A808]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Manchester Office</p>
                  <p className="text-slate-600 leading-relaxed">
                    14 Wilmslow Road, Didsbury
                    <br />
                    Manchester, M20 2RN, United Kingdom
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#092167] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#E8A808]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Response SLA</p>
                  <p className="text-slate-600">
                    Under 2 hours for active Professional and Team subscribers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#E8A808]" />
              Enterprise &amp; Multi-Branch Networks
            </span>
            <p className="leading-relaxed">
              Managing 5+ branch offices or require custom CRM API integration
              (Reapit, Street.co.uk, Alto)? Book a 1-on-1 discovery session with
              our technical director.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-slate-900">
                Message Received!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for contacting Property Pack AI. A member of our
                Manchester support team has received your inquiry and will reply
                within 2 business hours.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: "",
                      agencyName: "",
                      email: "",
                      phone: "",
                      topic: "general",
                      message: "",
                    });
                  }}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-heading font-bold text-xl text-slate-900 mb-2">
                Send Us a Message
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    Full Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ishtiaq Sohail"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    Agency / Firm Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prestige Estates UK"
                    value={formData.agencyName}
                    onChange={(e) =>
                      setFormData({ ...formData, agencyName: e.target.value })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    Work Email <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="agent@agency.co.uk"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+44 7911 123456"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Inquiry Topic <span className="text-amber-500">*</span>
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                >
                  <option value="general">General Product Question</option>
                  <option value="billing">Subscription &amp; VAT Billing</option>
                  <option value="demo">Request Live Demonstration</option>
                  <option value="enterprise">Multi-Branch Agency Pricing</option>
                  <option value="compliance">NTSELAT / CPR Compliance</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Message <span className="text-amber-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help your agency today?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#092167]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-11 px-8 rounded-xl bg-[#092167] hover:bg-[#06143E] text-white font-heading font-semibold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5 text-[#E8A808]" />
                  <span>{isSubmitting ? "Sending Message..." : "Send Message"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
