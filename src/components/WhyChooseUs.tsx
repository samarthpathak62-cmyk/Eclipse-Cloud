import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Zap,
  Globe2,
  Clock,
  Flame,
} from 'lucide-react';
import { useSettings } from '../firebase/settingsContext';

export const WhyChooseUs: React.FC = () => {
  const { homepageConfig, websiteSettings, discordSettings } = useSettings();

  const comparison = [
    {
      feature: 'Processor Standard',
      us: 'Ryzen 9 7950X / 9950X (5.7 GHz single-core)',
      others: 'Outdated Xeon / Epyc shared threads (sub 3.5 GHz)',
    },
    {
      feature: 'Memory Technology',
      us: 'DDR5 5600MHz ECC Low-Latency RAM',
      others: 'Overcommitted DDR4 or cheap desktop RAM',
    },
    {
      feature: 'DDoS Defense',
      us: 'Path.net 2.5+ Tbps inline Game Filtering',
      others: 'Basic OVH/generic filters that cause false packet drops',
    },
    {
      feature: 'Ordering & Support Flow',
      us: 'Direct Discord consultation with node specialists',
      others: 'Automated email bot replies & slow 48-hour tickets',
    },
    {
      feature: 'Uptime Commitment',
      us: '99.99% Hardware & Network SLA Guarantee',
      others: '99% theoretical (frequent node reboots & lag)',
    },
  ];

  return (
    <section id="why-us" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            Architectural Superiority
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {homepageConfig.whyChooseUsTitle || 'Engineered for Performance & Zero Bottlenecks'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-400">
            {homepageConfig.whyChooseUsDescription ||
              'We invest exclusively in top-tier dedicated hardware so your players enjoy silky smooth 20 TPS with heavy modpacks and high view distances.'}
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 bg-slate-950/90 border-b border-slate-800 text-sm font-bold p-4 text-center">
            <div className="text-left text-slate-400">Specification / Standard</div>
            <div className="text-emerald-400 flex items-center justify-center gap-1.5 py-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{websiteSettings.websiteName || 'Eclipse Cloud'}</span>
            </div>
            <div className="text-slate-500 flex items-center justify-center gap-1.5 py-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Standard Budget Hosts</span>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80">
            {comparison.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-3 p-4 sm:p-5 gap-3 items-center text-xs sm:text-sm hover:bg-slate-800/30 transition-colors"
              >
                <div className="font-semibold text-white">{item.feature}</div>
                <div className="flex items-center gap-2 text-emerald-300 font-medium bg-emerald-950/20 md:bg-transparent p-2 md:p-0 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item.us}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 bg-rose-950/10 md:bg-transparent p-2 md:p-0 rounded-lg">
                  <XCircle className="w-4 h-4 text-rose-400/70 shrink-0" />
                  <span>{item.others}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Network Nodes & Stats */}
        <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
              <Globe2 className="w-5 h-5" />
            </div>
            <h4 className="text-2xl font-black text-white">{websiteSettings.serverNodeCount || '14+ Global Locations'}</h4>
            <p className="text-xs text-slate-400 mt-1">Ashburn, Frankfurt, Singapore, London, Dallas</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-2xl font-black text-white">{websiteSettings.uptimeGuarantee || '99.99% SLA Uptime'}</h4>
            <p className="text-xs text-slate-400 mt-1">Enterprise BGP multihomed connectivity</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-2xl font-black text-white">Under 5 Min Setup</h4>
            <p className="text-xs text-slate-400 mt-1">Via Discord staff-guided onboarding ticket</p>
          </div>
        </div>
      </div>
    </section>
  );
};
