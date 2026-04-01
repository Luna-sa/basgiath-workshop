// Ambient floating particles — CSS-only, no Canvas overhead
// Uses character accent color via CSS variable

export default function TealParticles() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-0"
          style={{
            width: `${3 + (i % 3)}px`,
            height: `${3 + (i % 3)}px`,
            background: 'var(--char-accent)',
            left: `${5 + (i * 8) % 90}%`,
            animation: `particleFloat ${12 + (i * 3) % 10}s linear infinite`,
            animationDelay: `${(i * 1.7) % 12}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes particleFloat {
          0% { opacity: 0; transform: translateY(100vh) scale(0); }
          10% { opacity: 0.4; }
          90% { opacity: 0.15; }
          100% { opacity: 0; transform: translateY(-10vh) scale(1); }
        }
      `}</style>
    </div>
  )
}
