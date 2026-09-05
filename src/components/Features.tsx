import React, { useEffect, useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  HardDrive,
  Server,
  MessageSquare,
  Activity,
  Zap,
  Globe,
  Radio,
  Lock,
} from 'lucide-react';
import { FeatureItem } from '../types';
import { fetchFeatures } from '../firebase/firestoreService';
import { useSettings } from '../firebase/settingsContext';

export const Features: React.FC = () => {
  const { homepageConfig } = useSettings();
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const feats = await fetchFeatures();
        setFeatures(feats.filter((f) => f.active));
      } catch (e) {
        console.warn('Error fetching features:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'cpu':
        return <Cpu className="w-6 h-6 text-emerald-400" />;
      case 'shieldcheck':
      case 'shield':
        return <ShieldCheck className="w-6 h-6 text-indigo-400" />;
      case 'harddrive':
        return <HardDrive className="w-6 h-6 text-cyan-400" />;
      case 'server':
        return <Server className="w-6 h-6 text-amber-400" />;
      case 'messagesquare':
        return <MessageSquare className="w-6 h-6 text-[#7983f5]" />;
      case 'activity':
        return <Activity className="w-6 h-6 text-emerald-400" />;
      case 'globe':
        return <Globe className="w-6 h-6 text-blue-400" />;
      case 'lock':
        return <Lock className="w-6 h-6 text-emerald-400" />;
      default:
        return <Zap className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <section id="features" className="py-20 bg-slate-950/60 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            Pure Bare-Metal Power
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {homepageConfig.featuresTitle || 'Next-Generation Infrastructure'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-400">
            {homepageConfig.featuresSubtitle ||
              'Everything you need to run a flawless Minecraft community without server lag or downtime.'}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-44 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => (
              <div
                key={feat.id}
                id={`feature-card-${feat.id}`}
                className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(feat.icon)}
                  </div>
                  {feat.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {feat.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {feat.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
