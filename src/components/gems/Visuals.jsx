// Per-gem visual hero components. Each renders a distinct illustrative
// block that conveys the spirit of the gem without needing external
// screenshots (URLs rot, image rights are unclear). Real screenshots
// can be dropped in later by replacing a single component.

// ─────────────────────────────────────────────────────────────────
// Pixel Agents — tiny pixel-art office. CSS-grid of "desks" with
// little workers (emoji as pixel sprites for now).
// ─────────────────────────────────────────────────────────────────
export function PixelAgentsVisual() {
  const desks = [
    { agent: '🧑‍💻', label: 'reading file', state: 'busy' },
    { agent: '👨‍💻', label: 'typing', state: 'busy' },
    { agent: '🧑‍💼', label: 'waiting perm', state: 'idle' },
    { agent: '👩‍💻', label: 'reviewing', state: 'busy' },
    { agent: null, label: 'empty', state: 'empty' },
    { agent: '🧑‍🔧', label: 'running tests', state: 'busy' },
  ]
  return (
    <div className="border border-border bg-[#0a1410] p-5 rounded-[2px]">
      <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal/80 mb-3">
        ◆ pixel office · live status
      </div>
      <div className="grid grid-cols-3 gap-3">
        {desks.map((d, i) => (
          <div
            key={i}
            className={`border p-3 text-center font-mono text-[10px] tracking-[1px] uppercase ${
              d.state === 'busy'
                ? 'border-qa-teal/40 bg-qa-teal/[0.08] text-qa-teal'
                : d.state === 'idle'
                ? 'border-yellow-300/40 bg-yellow-300/[0.05] text-yellow-300/80'
                : 'border-border/40 bg-bg/30 text-text-dim'
            }`}
            style={{ imageRendering: 'pixelated' }}
          >
            <div className="text-[28px] leading-none mb-2">{d.agent || '·'}</div>
            <div className="leading-tight">{d.label}</div>
          </div>
        ))}
      </div>
      <div className="font-mono text-[10px] text-text-dim mt-3 text-center italic">
        each pixel character = one running subagent
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// MemPalace — tree of halls/rooms/drawers
// ─────────────────────────────────────────────────────────────────
export function MemPalaceVisual() {
  return (
    <div className="border border-border bg-[#0c0e1a] p-5 rounded-[2px]">
      <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal/80 mb-3">
        ◆ palace structure
      </div>
      <pre className="font-mono text-[12px] text-text-body leading-relaxed">
{`palace/
├─ projects · hall
│  ├─ workshop · room
│  │  ├─ 2026-05-08-flow-rebuild · drawer
│  │  ├─ dragon-arena-rules · drawer
│  │  └─ checkpoint-schema · drawer
│  └─ ig-white · room
│     └─ voice-system · drawer
├─ people · hall
│  └─ self · room
│     ├─ programs-ledger · drawer
│     └─ writing-process · drawer
└─ lore · hall
   └─ kai · room
      └─ desktop-voice-patterns · drawer`}
      </pre>
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div className="border border-border/40 bg-surface/40 p-2">
          <div className="font-mono text-[10px] text-text-dim uppercase">benchmark</div>
          <div className="font-display italic text-[18px] text-qa-teal">96.6%</div>
          <div className="font-mono text-[9px] text-text-dim uppercase tracking-[1px]">LongMemEval</div>
        </div>
        <div className="border border-border/40 bg-surface/40 p-2">
          <div className="font-mono text-[10px] text-text-dim uppercase">backend</div>
          <div className="font-display italic text-[14px] text-text-body">Chroma</div>
          <div className="font-mono text-[9px] text-text-dim uppercase tracking-[1px]">+ SQLite</div>
        </div>
        <div className="border border-border/40 bg-surface/40 p-2">
          <div className="font-mono text-[10px] text-text-dim uppercase">runs</div>
          <div className="font-display italic text-[14px] text-text-body">100% local</div>
          <div className="font-mono text-[9px] text-text-dim uppercase tracking-[1px]">no cloud</div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// suzu-mcp — Spotify-card mockup with bell glyph
// ─────────────────────────────────────────────────────────────────
export function SuzuVisual() {
  return (
    <div className="border border-border bg-[#0a0f0c] p-5 rounded-[2px]">
      <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal/80 mb-3 flex items-center gap-2">
        <span>◆ when claude finishes...</span>
      </div>

      <div className="flex gap-4 items-center">
        <div className="text-[64px] leading-none">🔔</div>
        <div className="text-2xl text-text-dim">→</div>
        {/* Spotify card mock */}
        <div className="flex-1 border border-[#1DB954]/40 bg-[#0e1a13] p-3 rounded-[2px]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1DB954] to-[#0d6e35] rounded-[2px] flex items-center justify-center text-white font-bold text-[20px]">
              ♪
            </div>
            <div className="flex-1">
              <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#1DB954] mb-0.5">
                now playing · spotify
              </div>
              <div className="font-display italic text-[14px] text-white">
                Item Get
              </div>
              <div className="font-mono text-[10px] text-text-dim">
                The Legend of Zelda · 0:02
              </div>
            </div>
          </div>
          <div className="mt-2 h-[3px] bg-[#1DB954]/20 rounded-full overflow-hidden">
            <div className="h-full bg-[#1DB954] w-1/3" />
          </div>
        </div>
      </div>

      <div className="font-mono text-[10px] text-text-dim mt-4 text-center italic">
        suzu = 鈴 · the bell that marks the moment of attention
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// ENABLE_TOOL_SEARCH — before/after token-overhead bars
// ─────────────────────────────────────────────────────────────────
export function ToolSearchVisual() {
  return (
    <div className="border border-border bg-[#0c0e0f] p-5 rounded-[2px]">
      <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal/80 mb-4">
        ◆ token overhead per turn
      </div>

      {/* OFF state */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-text-dim">
            OFF · default
          </span>
          <span className="font-mono text-[14px] text-yellow-300 font-bold">77,000</span>
        </div>
        <div className="h-3 bg-bg/60 border border-border overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-300 to-red-500" style={{ width: '100%' }} />
        </div>
      </div>

      {/* ON state */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-qa-teal">
            ON · with flag
          </span>
          <span className="font-mono text-[14px] text-qa-teal font-bold">8,700</span>
        </div>
        <div className="h-3 bg-bg/60 border border-border overflow-hidden">
          <div className="h-full bg-qa-teal" style={{ width: '11%' }} />
        </div>
      </div>

      {/* The flag itself */}
      <pre className="mt-5 bg-black border border-qa-teal/30 p-3 font-mono text-[12px] text-qa-teal text-center">
{`{ "env": { "ENABLE_TOOL_SEARCH": "true" } }`}
      </pre>

      <div className="font-mono text-[10px] text-text-dim mt-3 text-center italic">
        85% context back · one line in settings.json
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Quinn + Jinx — two-persona split panel
// ─────────────────────────────────────────────────────────────────
export function QuinnJinxVisual() {
  return (
    <div className="border border-border bg-[#0d0f12] p-5 rounded-[2px]">
      <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal/80 mb-3">
        ◆ adversarial pair
      </div>

      <div className="grid grid-cols-2 gap-0 border border-border/60">
        {/* Quinn — methodical */}
        <div className="border-r border-border/60 p-4 bg-[#0e1518]">
          <div className="text-[28px] mb-2">📋</div>
          <div className="font-display italic text-[18px] text-qa-teal mb-1">Quinn</div>
          <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-dim mb-3">
            methodical
          </div>
          <ul className="space-y-1 font-mono text-[11px] text-text-body leading-relaxed list-none">
            <li>✓ AC-1: login form valid</li>
            <li>✓ AC-2: error states clear</li>
            <li>✓ AC-3: submit disabled empty</li>
            <li>· AC-4: pending review</li>
          </ul>
        </div>
        {/* Jinx — chaos */}
        <div className="p-4 bg-[#160d12]">
          <div className="text-[28px] mb-2">💥</div>
          <div className="font-display italic text-[18px] text-pink-400 mb-1">Jinx</div>
          <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-text-dim mb-3">
            chaos
          </div>
          <ul className="space-y-1 font-mono text-[11px] text-text-body leading-relaxed list-none">
            <li>! emoji in number field</li>
            <li>! 50,000-char string</li>
            <li>! double-click submit</li>
            <li>! kill network mid-upload</li>
          </ul>
        </div>
      </div>

      <div className="font-mono text-[10px] text-text-dim mt-4 text-center italic">
        run both · the gap between their reports is the interesting part
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Claude Code Channels — phone mockup with chat
// ─────────────────────────────────────────────────────────────────
export function ChannelsVisual() {
  return (
    <div className="border border-border bg-[#0c0d10] p-5 rounded-[2px]">
      <div className="font-mono text-[10px] tracking-[2px] uppercase text-qa-teal/80 mb-3">
        ◆ telegram → laptop
      </div>

      <div className="flex justify-center">
        <div className="w-[280px] border-2 border-text-dim/60 rounded-[18px] bg-bg overflow-hidden">
          {/* Phone notch */}
          <div className="h-5 bg-black flex justify-center items-end pb-1">
            <div className="w-12 h-1 bg-text-dim/40 rounded-full" />
          </div>
          {/* Chat header */}
          <div className="bg-[#1a1f24] px-3 py-2 border-b border-border/40 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-qa-teal/20 flex items-center justify-center">
              🐉
            </div>
            <div className="flex-1">
              <div className="font-mono text-[10px] text-white">claude_code_bot</div>
              <div className="font-mono text-[8px] text-qa-teal">● online · on laptop</div>
            </div>
          </div>
          {/* Messages */}
          <div className="px-3 py-3 space-y-2 bg-[#0e1216] min-h-[180px]">
            <div className="flex justify-end">
              <div className="bg-qa-teal/20 text-text-body text-[11px] px-2.5 py-1.5 rounded-[10px] rounded-tr-[2px] max-w-[80%]">
                what did you change overnight?
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-surface/80 text-text-body text-[11px] px-2.5 py-1.5 rounded-[10px] rounded-tl-[2px] max-w-[85%]">
                <div className="font-mono text-[9px] text-qa-teal mb-1">claude</div>
                refactored auth/middleware.js · 8 files · 142 lines · all tests green
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-qa-teal/20 text-text-body text-[11px] px-2.5 py-1.5 rounded-[10px] rounded-tr-[2px] max-w-[80%]">
                run the e2e suite again
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-surface/80 text-text-body text-[11px] px-2.5 py-1.5 rounded-[10px] rounded-tl-[2px] max-w-[85%]">
                <span className="font-mono text-[10px] text-qa-teal">running...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="font-mono text-[10px] text-text-dim mt-4 text-center italic">
        check your night-time autopilot from bed before sleep
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Visual selector — picks the right component by gem id
// ─────────────────────────────────────────────────────────────────
export function GemVisual({ gemId }) {
  switch (gemId) {
    case 'pixel-agents': return <PixelAgentsVisual />
    case 'mempalace': return <MemPalaceVisual />
    case 'suzu-mcp': return <SuzuVisual />
    case 'tool-search': return <ToolSearchVisual />
    case 'quinn-jinx': return <QuinnJinxVisual />
    case 'channels': return <ChannelsVisual />
    default: return null
  }
}
