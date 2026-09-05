import React, { useEffect, useState } from 'react';
import { ChevronDown, HelpCircle, Search, MessageSquare } from 'lucide-react';
import { FaqItem } from '../types';
import { fetchFaqs } from '../firebase/firestoreService';
import { useSettings } from '../firebase/settingsContext';

export const FaqSection: React.FC = () => {
  const { homepageConfig, discordSettings } = useSettings();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await fetchFaqs();
        setFaqs(items.filter((f) => f.active));
        if (items.length > 0) {
          setOpenId(items[0].id);
        }
      } catch (err) {
        console.warn('Error loading FAQs:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="faq" className="py-20 bg-slate-950/60 border-t border-slate-800/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {homepageConfig.faqTitle || 'Frequently Asked Questions'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-400">
            {homepageConfig.faqSubtitle ||
              'Everything you need to know about our plans, Discord ordering process, and hardware.'}
          </p>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions (e.g., Discord ordering, mods, DDoS)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* FAQs Accordion */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-sm">
            No questions matching "{searchTerm}". Check our Discord server for instant answers!
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  id={`faq-item-${faq.id}`}
                  className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-sm sm:text-base font-semibold text-white">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still have questions banner */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 via-slate-900 to-[#5865F2]/10 border border-slate-800 rounded-2xl p-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white">Still have custom setup questions?</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Chat directly with our hosting engineers in Discord #pre-sales or open a ticket.
            </p>
          </div>
          <a
            id="faq-discord-support-btn"
            href={discordSettings.supportInviteUrl || discordSettings.mainInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#5865F2] hover:bg-[#4752c4] text-white shadow-md transition-all shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Us on Discord</span>
          </a>
        </div>
      </div>
    </section>
  );
};
