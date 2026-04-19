import React from 'react';
import { ChevronLeft, Shield, Lock, Eye, Share2, UserCheck, RefreshCw } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Eye size={20} className="text-blue-600" />,
      bg: "bg-blue-50",
      content: [
        "Name and contact details (phone number, email)",
        "Location data (for better search results)",
        "Device and usage information",
        "Booking and transaction details"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <RefreshCw size={20} className="text-violet-600" />,
      bg: "bg-violet-50",
      content: [
        "Provide and improve our services",
        "Help you find relevant rental listings",
        "Process bookings and communicate with you",
        "Enhance user experience and app performance"
      ]
    },
    {
      title: "Data Protection",
      icon: <Lock size={20} className="text-emerald-600" />,
      bg: "bg-emerald-50",
      content: [
        "We implement appropriate security measures to protect your data from unauthorized access, misuse, or disclosure."
      ]
    },
    {
      title: "Third-Party Sharing",
      icon: <Share2 size={20} className="text-amber-600" />,
      bg: "bg-amber-50",
      content: [
        "We may share limited information with property owners for booking purposes",
        "We do not sell your personal data to third parties",
        "Trusted service providers may assist in app operations (under confidentiality)"
      ]
    },
    {
      title: "Your Rights",
      icon: <UserCheck size={20} className="text-rose-600" />,
      bg: "bg-rose-50",
      content: [
        "Access or update your information",
        "Request deletion of your data",
        "Opt out of certain communications"
      ]
    }
  ];

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-4">
        <button onClick={onBack} className="rounded-full p-1 hover:bg-slate-100">
          <ChevronLeft size={24} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-black text-slate-900">Privacy Policy</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100">
            <Shield size={24} />
          </div>
          <h2 className="mb-1 text-2xl font-black text-slate-900">Privacy Policy</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Effective Date: April 14, 2026</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Roomzy values your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <section key={i}>
              <div className="mb-3 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${section.bg}`}>
                  {section.icon}
                </div>
                <h3 className="text-lg font-black text-slate-900">{section.title}</h3>
              </div>
              <ul className="space-y-2 pl-13">
                {section.content.map((item, j) => (
                  <li key={j} className="relative text-sm text-slate-600 before:absolute before:-left-4 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-slate-300">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="rounded-2xl border border-slate-100 p-5">
            <h3 className="mb-2 text-sm font-black text-slate-900">Updates to Policy</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              We may update this Privacy Policy from time to time. Continued use of Roomzy means you accept those changes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
