import React from 'react';
import {
  Server,
  MessageSquare,
  Shield,
  Zap,
  Activity,
  ChevronRight,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';
import { useSettings } from '../firebase/settingsContext';

interface HeroProps {
  onExplorePlans: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplorePlans }) => {
  const { homepageConfig, websiteSettings, discordSettings } = useSettings();

  if (!homepageConfig.heroVisible) return null;

  return (
    <div id="hero-section" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Futuristic Background Glows & Grid */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Server Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner mb-6 text-xs text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-white">All 14 Nodes Operational</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-mono font-medium">Locked 20.0 TPS</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Path.net 2.5+ Tbps Active</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {homepageConfig.heroHeading || 'Ultra-Fast Minecraft Server Hosting'}
          </h1>

          {/* Hero Subheading */}
          <p className="mt-4 text-lg sm:text-xl font-semibold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            {homepageConfig.heroSubheading || 'Powered by AMD Ryzen 9 7950X & Enterprise DDR5 Memory'}
          </p>

          {/* Hero Description */}
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            {homepageConfig.heroDescription ||
              'Experience zero lag, instant Discord-coordinated order fulfillment, and military-grade 2.5+ Tbps DDoS defense. Scale your community from vanilla SMP to massive networks.'}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-primary-cta-btn"
              onClick={onExplorePlans}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Server className="w-5 h-5" />
              <span>{homepageConfig.heroCtaText || 'View Server Plans'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <a
              id="hero-discord-cta-btn"
              href={discordSettings.mainInviteUrl || 'https://discord.gg'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-bold bg-slate-900/90 hover:bg-[#5865F2] text-white border border-slate-700/80 hover:border-[#5865F2] shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquare className="w-5 h-5 text-[#7983f5] group-hover:text-white" />
              <span>{homepageConfig.heroDiscordText || discordSettings.buttonText || 'Order on Discord'}</span>
            </a>
          </div>

          {/* Quick Hardware Highlights */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Processor</p>
                <p className="text-sm font-bold text-white">Ryzen 9 7950X</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Storage Array</p>
                <p className="text-sm font-bold text-white">Gen4 NVMe SSDs</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400">DDoS Mitigation</p>
                <p className="text-sm font-bold text-white">2.5+ Tbps Inline</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Guaranteed</p>
                <p className="text-sm font-bold text-white">{websiteSettings.uptimeGuarantee || '99.99% Uptime'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
