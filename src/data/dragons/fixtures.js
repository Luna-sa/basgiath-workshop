// Fake dragon fixtures for preview mode (`?preview=N` on Aerie /
// Mosaic / Seer routes). Lets Anastasia eyeball the layout with a
// full cohort without actually running the workshop. Image is a
// single placeholder URL — Picsum seeded so each dragon has a
// visually-distinct picture (dark fantasy-leaning crops).

const RIDERS = [
  'the_dragon', 'svitlana_y', 'anastasiia', 'aksana', 'victoriyaya', 'dziubka',
  'nataliaz', 'asoba', 'alex2lai', 'vstopin', 'olgapr', 'aksanaq',
  'aheha_qa', 'mama', 'yauhen_art', 'alesyah', 'svetaaaaa', 'artems',
  'aliakseich', 'irynat', 'olgamr_bf', 'k_seh', 'evgenym', 'vika_qa_pay3',
  'darya_l', 'pavlo_qa', 'mikhail_b', 'tetiana_s', 'roman_k', 'iryna_p',
  'nazar_v', 'olha_d', 'kostia_r', 'sergii_m', 'oksana_t', 'marichka_f',
  'denys_l', 'yelyzaveta', 'bohdan_v', 'kateryna_z',
]

const NAMES = [
  'Tairn', 'Sgaeyl', 'Feirge', 'Aotrom', 'Deigh', 'Andarna',
  'Mhrael', 'Karthen', 'Nireth', 'Vhalla', 'Soren', 'Thrash',
  'Brennan', 'Aurelis', 'Kestrel', 'Pyre', 'Sable', 'Verithe',
  'Marrow', 'Cinder', 'Strix', 'Ember', 'Halcion', 'Mistral',
  'Vespera', 'Thanis', 'Drogen', 'Galdor', 'Saerin', 'Kalix',
  'Riven', 'Tempest', 'Onyx', 'Wraeth', 'Khepri', 'Ashen',
  'Tarrith', 'Solas', 'Vintra', 'Quenya',
]

const MOTTOS = [
  'I do not strike first — but I strike last.',
  'The sky chose me, not the other way around.',
  'Quietly, until quiet becomes a roar.',
  'I read the room before the room speaks.',
  'You bring orders. I bring better questions.',
  'The bond was never about obedience.',
  'A test plan written in fire.',
  'I do not chase the bug. I let it come to me.',
  'Slow on purpose. Right on instinct.',
  'My silence is not an absence.',
  'Storm-tested, storm-tempered.',
  'Loyal to the work, not the deadline.',
  'Calm hands. Sharper than the sword.',
  'Patient. Patient. Patient. Strike.',
  'I am the question your spec did not answer.',
  'The wing flies because I do not.',
  'Edge cases are the only cases I see.',
  'My fire is for what should not have shipped.',
  'A scout in a room full of soldiers.',
  'I trust the test, not the engineer who wrote it.',
]

/** Deterministic shuffle using a string seed (FNV-1a) */
function seededShuffle(arr, seed = 'preview') {
  const a = [...arr]
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  for (let i = a.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 0x5bd1e995)
    const j = Math.abs(h) % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Generate N fake dragons for preview. Single Picsum placeholder
 * image with per-dragon seed for visual variety (Picsum returns
 * different real photos for each unique seed).
 */
export function generateFakeDragons(n = 40) {
  const riders = seededShuffle(RIDERS, 'r')
  const names = seededShuffle(NAMES, 'n')
  const mottos = seededShuffle(MOTTOS, 'm')

  const out = []
  for (let i = 0; i < n; i++) {
    const nickname = riders[i % riders.length] + (i >= riders.length ? `_${Math.floor(i / riders.length)}` : '')
    const name = names[i % names.length]
    const motto = mottos[i % mottos.length]
    // Picsum returns a real photo seeded by the URL — gives 40
    // visually distinct placeholders without needing to host 40
    // images.
    const image_url = `https://picsum.photos/seed/dragon-${i + 1}/600/600`
    out.push({
      id: `fake-${i + 1}`,
      nickname,
      name,
      character_id: ['violet','xaden','rhiannon','ridoc','liam','imogen','self'][i % 7],
      answers: { motto, name, scale: '', breath: 'fire', signet: '', size: 'mid', wings: 'membranous', eyes: 'gold' },
      image_url,
      vote_count: Math.floor(Math.random() * 8),
      sealed_at: new Date(Date.now() - i * 60000).toISOString(),
    })
  }
  // Sort by vote_count desc, sealed_at asc — matches real Aerie ordering
  out.sort((a, b) => {
    if (b.vote_count !== a.vote_count) return b.vote_count - a.vote_count
    return new Date(a.sealed_at) - new Date(b.sealed_at)
  })
  return out
}

/** Fake match leaderboard for seer-reveal preview */
export function generateFakeLeaderboard(dragons, n = 12) {
  const total = dragons.length
  const voters = seededShuffle(RIDERS, 'voters').slice(0, n)
  return voters.map((nick, i) => ({
    voter_nickname: nick,
    // Top scorer gets the highest, then descend with some variance
    correct: Math.max(0, total - i * 2 - Math.floor(Math.random() * 3)),
    total,
  })).sort((a, b) => {
    if (b.correct !== a.correct) return b.correct - a.correct
    return a.total - b.total
  })
}
