import { PAGES } from '../data/pages'
import { NARRATIVE } from '../data/narrative'
import { useLocale } from '../i18n/store'
import { usePersona } from '../store/usePersona'
import GateGuard from './GateGuard'
import CharacterCommentary from '../components/CharacterCommentary'
import HiddenDragon from '../components/HiddenDragon'
import { findDragonsBySlide } from '../data/hidden-dragons'

/**
 * Pick a localised field. Falls back to the canonical (RU) field if
 * the per-locale field is not present. So narrative entries can be
 * progressively translated - current contract is:
 *   - n.title       (RU canonical, always present)
 *   - n.title_en    (optional)
 *   - n.title_uk    (optional)
 * Same shape for subtitle / text.
 */
function pickLocalised(entry, key, lang) {
  if (!entry) return ''
  if (lang === 'en' && entry[`${key}_en`]) return entry[`${key}_en`]
  if (lang === 'uk' && entry[`${key}_uk`]) return entry[`${key}_uk`]
  return entry[key]
}

export default function PageShell({ pageIndex, subStepId, children }) {
  const page = PAGES[pageIndex]
  const lang = useLocale(s => s.lang)
  const persona = usePersona()
  if (!page) return null

  let narrativeKey
  if (subStepId && page.subSteps) {
    const subStep = page.subSteps.find(s => s.id === subStepId)
    narrativeKey = subStep?.narrativeKey
  } else {
    narrativeKey = page.narrativeKey
  }
  const rawNarrative = NARRATIVE[narrativeKey]
  const narrative = rawNarrative ? {
    title: pickLocalised(rawNarrative, 'title', lang),
    subtitle: pickLocalised(rawNarrative, 'subtitle', lang),
    text: pickLocalised(rawNarrative, 'text', lang),
  } : null

  return (
    <div className="h-screen w-full flex flex-col bg-bg pt-[52px] overflow-hidden">
      <div className="flex-1 flex flex-col items-center overflow-y-auto px-6 sm:px-10 lg:px-16 py-6 relative">
        <div className="w-full max-w-[960px] mx-auto flex flex-col flex-1 relative">
          {/* Hidden Dragons - absolute-positioned inside the scroll
              container so they scroll WITH the content (not stuck to
              the viewport edges). Coords in registry are relative to
              the 960px content frame. */}
          {findDragonsBySlide(narrativeKey).map(dragon => (
            <HiddenDragon
              key={dragon.id}
              id={dragon.id}
              style={{ position: 'absolute', ...dragon.position }}
            />
          ))}
          {/* Slide header - large, breathing. Eyebrow + divider dot
              carry the participant's persona colour so the workshop
              feels tinted to their archetype. */}
          {narrative && (
            <div className="mb-8 text-center shrink-0">
              <div
                className="font-mono text-[14px] tracking-[3px] uppercase mb-3"
                style={{ color: persona.accent }}
              >
                {page.title}
              </div>
              <h1 className="font-display text-[clamp(32px,5vw,56px)] font-semibold text-white mb-4 leading-[1.1]">
                {narrative.title}
              </h1>
              <p className="font-display italic text-[clamp(18px,2.5vw,24px)] text-text-secondary leading-relaxed max-w-2xl mx-auto">
                {narrative.text}
              </p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="w-10 h-px" style={{ backgroundColor: persona.accent + '40' }} />
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: persona.accent, boxShadow: `0 0 12px ${persona.accent}88` }}
                />
                <div className="w-10 h-px" style={{ backgroundColor: persona.accent + '40' }} />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-h-0">
            {children}
          </div>

          {/* Gate */}
          {!(page.subSteps && !subStepId) && (
            <div className="shrink-0 pb-20">
              <GateGuard pageIndex={pageIndex} subStepId={subStepId} />
            </div>
          )}
        </div>
      </div>

      {/* Character whisper - top-left floating quote from the
          chosen Empyrean archetype's bonded dragon. */}
      <CharacterCommentary slideKey={narrativeKey} position="fixed" />
    </div>
  )
}
