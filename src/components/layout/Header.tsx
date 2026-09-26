import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Menu, X, Briefcase, GraduationCap, ArrowUpRight } from 'lucide-react'
import { navLinks, joinTeamDropdown, contactLink, site } from '../../lib/site'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <Link to="/" className="focus-ring flex min-w-0 items-center gap-2.5 rounded-lg" aria-label="Global Tech Byte home">
          <img src="/brand/logo.webp" alt="" className="h-9 w-auto shrink-0 sm:h-10" width={1492} height={992} />
          <span className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="truncate text-base font-extrabold tracking-tight text-[var(--color-ink)]">
              Global Tech Byte
            </span>
            <span className="truncate text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-gray)]">
              Private Limited
            </span>
          </span>
        </Link>

        <nav
          className={`hidden items-center gap-1 rounded-full bg-[var(--color-ink)] px-2 py-2 lg:flex ${
            scrolled ? 'shadow-lg shadow-black/10' : ''
          }`}
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-white text-[var(--color-ink)]' : 'text-white/80 hover:text-white'
                }`
              }
              end={link.href === '/'}
            >
              {link.label}
            </NavLink>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              className="focus-ring flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((v) => !v)}
            >
              Join Our Team
              <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-1/2 top-full mt-3 w-72 -translate-x-1/2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/20 ring-1 ring-black/5"
                  role="menu"
                >
                  {joinTeamDropdown.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      role="menuitem"
                      className="focus-ring flex items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-[var(--color-peach)]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-peach)] text-[var(--color-orange)]">
                        {item.label === 'Careers' ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-[var(--color-ink)]">{item.label}</span>
                        <span className="block text-xs text-[var(--color-text-gray)]">{item.description}</span>
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink
            to={contactLink.href}
            className={({ isActive }) =>
              `focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-white text-[var(--color-ink)]' : 'text-white/80 hover:text-white'
              }`
            }
          >
            {contactLink.label}
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="group hidden items-center gap-2 rounded-full bg-[var(--color-ink)] py-2 pl-5 pr-2 text-sm font-semibold text-white transition-colors hover:bg-black sm:inline-flex"
          >
            Let's Talk
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-orange)] transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={15} />
            </span>
          </Link>

          <button
            type="button"
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-ink)] text-white lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-white lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 pb-6 pt-2 sm:px-6" aria-label="Mobile">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === '/'}
                  className={({ isActive }) =>
                    `focus-ring rounded-xl px-4 py-3 text-base font-medium ${
                      isActive ? 'bg-[var(--color-peach)] text-[var(--color-orange)]' : 'text-[var(--color-ink)]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="mt-1 rounded-xl bg-[var(--color-warm-white)] p-2">
                <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-gray)]">
                  Join Our Team
                </p>
                {joinTeamDropdown.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-white"
                  >
                    {item.label === 'Careers' ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                    {item.label}
                  </Link>
                ))}
              </div>

              <NavLink
                to={contactLink.href}
                className={({ isActive }) =>
                  `focus-ring rounded-xl px-4 py-3 text-base font-medium ${
                    isActive ? 'bg-[var(--color-peach)] text-[var(--color-orange)]' : 'text-[var(--color-ink)]'
                  }`
                }
              >
                {contactLink.label}
              </NavLink>

              <Link
                to="/contact"
                className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[var(--color-orange)] py-3 text-sm font-semibold text-white"
              >
                Let's Talk
              </Link>
              <a
                href={site.phoneHref}
                className="mt-2 text-center text-sm font-medium text-[var(--color-text-gray)]"
              >
                {site.phone}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
