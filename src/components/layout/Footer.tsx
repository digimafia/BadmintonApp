import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { site, navLinks, contactLink, footerServiceLinks } from '../../lib/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[var(--color-ink)] px-4 pt-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="inline-flex rounded-xl bg-white px-3 py-2">
              <img src="/brand/logo.webp" alt="Global Tech Byte" className="h-9 w-auto" width={1492} height={992} />
            </div>
            <p className="mt-3 text-xs uppercase tracking-widest text-white/40">Global Tech Byte Private Limited</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Turning ideas into powerful digital experiences through custom software engineering.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white/90">Quick Links</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="focus-ring text-sm text-white/60 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/careers" className="focus-ring text-sm text-white/60 transition-colors hover:text-white">
                  Join Our Team
                </Link>
              </li>
              <li>
                <Link to={contactLink.href} className="focus-ring text-sm text-white/60 transition-colors hover:text-white">
                  {contactLink.label}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white/90">Services</h3>
            <ul className="space-y-3">
              {footerServiceLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="focus-ring text-sm text-white/60 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white/90">Contact</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-[var(--color-orange)]" />
                <a href={site.phoneHref} className="focus-ring transition-colors hover:text-white">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-[var(--color-orange)]" />
                <a href={`mailto:${site.email}`} className="focus-ring transition-colors hover:text-white">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-[var(--color-orange)]" />
                {site.location}
              </li>
            </ul>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="focus-ring mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold transition-colors hover:bg-white/20"
            >
              <MessageCircle size={14} className="text-[var(--color-orange)]" />
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row">
          <p>© {year} Global Tech Byte Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="focus-ring hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="focus-ring hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
