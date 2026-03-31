import { useWorkshopStore } from '../store/workshopStore'
import PageShell from '../core/PageShell'

export default function P02_Registration() {
  const user = useWorkshopStore(s => s.user)
  const setUser = useWorkshopStore(s => s.setUser)

  const inputClass = "w-full px-5 py-4 bg-surface border border-border rounded-[2px] text-white text-base placeholder:text-text-dim placeholder:italic focus:border-qa-teal focus:shadow-[0_0_0_3px_rgba(0,229,204,0.08),0_0_20px_rgba(0,229,204,0.08)] outline-none transition-all"
  const labelClass = "font-mono text-[12px] tracking-[2px] uppercase text-text-secondary block mb-2.5"

  return (
    <PageShell pageIndex={2}>
      <div className="space-y-6">
        {/* Name + Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Your Name *</label>
            <input
              type="text"
              value={user.name}
              onChange={e => setUser({ name: e.target.value })}
              placeholder="Как к тебе обращаться"
              className={inputClass}
            />
            <p className="text-xs text-text-dim mt-2 italic">Это имя будет на твоём бейдже</p>
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input
              type="email"
              value={user.email}
              onChange={e => setUser({ email: e.target.value })}
              placeholder="your@email.com"
              className={inputClass}
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <label className={labelClass}>Role</label>
          <select
            value={user.role}
            onChange={e => setUser({ role: e.target.value })}
            className={inputClass + ' appearance-none'}
          >
            <option value="">Выбери роль</option>
            <option value="manual">QA Manual</option>
            <option value="automation">QA Automation</option>
            <option value="lead">QA Lead / Manager</option>
            <option value="dev">Developer</option>
            <option value="other">Другое</option>
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className={labelClass}>AI Experience</label>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { value: 'never', label: 'Не пользовался', icon: '🌱' },
              { value: 'tried', label: 'Пробовал ChatGPT', icon: '💬' },
              { value: 'daily', label: 'Использую регулярно', icon: '⚡' },
            ].map(o => (
              <button
                key={o.value}
                onClick={() => setUser({ experience: o.value })}
                className={`flex items-center gap-2 p-3 border transition-all cursor-pointer ${
                  user.experience === o.value
                    ? 'border-qa-teal bg-qa-teal/[0.05]'
                    : 'border-border hover:border-qa-teal/25'
                }`}
              >
                <span>{o.icon}</span>
                <span className="text-xs text-text-secondary">{o.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tool + OS */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Tool</label>
            <select
              value={user.tool}
              onChange={e => setUser({ tool: e.target.value })}
              className={inputClass + ' appearance-none'}
            >
              <option value="cursor">Cursor (бесплатно)</option>
              <option value="claude">Claude Code ($20/мес)</option>
              <option value="both">Оба</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>OS</label>
            <select
              value={user.os}
              onChange={e => setUser({ os: e.target.value })}
              className={inputClass + ' appearance-none'}
            >
              <option value="mac">macOS</option>
              <option value="win">Windows</option>
              <option value="linux">Linux</option>
            </select>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
