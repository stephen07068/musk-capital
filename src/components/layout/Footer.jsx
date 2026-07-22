import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

const footerLinks = {
  Explore: [
    { label: 'Companies', to: '/companies' },
    { label: 'Markets', to: '/markets' },
    { label: 'News', to: '/news' },
    { label: 'Portfolio', to: '/dashboard' },
    { label: 'Watchlist', to: '/dashboard' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Customer Support', to: '/support' },
    { label: 'Careers', to: '/about' },
    { label: 'Press', to: '/about' },
  ],
  Learn: [
    { label: 'Investment 101', to: '/about' },
    { label: 'Market Insights', to: '/news' },
    { label: 'Support Center', to: '/support' },
    { label: 'Guides', to: '/about' },
  ],
  Legal: [
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Disclaimer', to: '/about' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0D0F14] border-t border-[#1F2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-black tracking-[0.1em]">
                <span className="text-white">MUSK</span>
                <span className="text-[#D4AF37] mx-1.5">|</span>
                <span className="text-[#D4AF37]">CAPITAL</span>
              </span>
            </Link>
            <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-xs">
              Musk Capital is an educational platform for exploring markets, companies, and innovation inspired by Elon Musk's vision.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { Icon: Twitter, href: '#', label: 'X (Twitter)' },
                { Icon: Linkedin, href: '#', label: 'LinkedIn' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-[#1F2937] hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/40 border border-[#1F2937] flex items-center justify-center text-[#9CA3AF] hover:text-[#D4AF37] transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#9CA3AF] hover:text-[#D4AF37] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1F2937] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B7280]">© 2026 Musk Capital. All rights reserved.</p>
          <p className="text-xs text-[#9CA3AF] mt-6 md:mt-0 text-center md:text-left max-w-sm">
            Musk Capital is a premier investment platform. Not affiliated with Elon Musk or any of his companies.
          </p>
        </div>
      </div>
    </footer>
  );
}
