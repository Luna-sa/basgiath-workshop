import { useState, useEffect } from 'react'

const links = [
  { href: '#about', label: 'О воркшопе' },
  { href: '#timeline', label: 'Программа' },
  { href: '#characters', label: 'Персонажи' },
  { href: '#resources', label: 'Ресурсы' },
  { href: '#prep', label: 'Подготовка' },
  { href: '#register', label: 'Записаться' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`fixed top-1 left-0 right-0 z-[100] transition-all duration-300 ${
      scrolled ? 'bg-black/90 backdrop-blur-2xl border-b border-border-subtle' : 'bg-transparent'
    }`}>
      <div className="max-w-[900px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* QA Clan logo */}
        <a href="#" className="font-display text-lg text-white tracking-wide">
          QA <em className="text-qa-teal italic font-normal">Clan</em>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="font-mono text-[12px] font-medium text-text-secondary tracking-[1.5px] uppercase hover:text-qa-teal transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-qa-teal p-2"
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <path d="M6 6l12 12M6 18L18 6" />
              : <path d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-2xl border-t border-border px-6 py-4">
          {links.map(l => (
            <a key={l.href} href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 font-mono text-[12px] text-text-secondary tracking-[1.5px] uppercase hover:text-qa-teal transition-colors border-b border-border last:border-0">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
