#!/usr/bin/env node
// Stress-test the Apps Script backend before the live workshop.
//
//   node scripts/stress-test.mjs --users 50 --url https://script.google.com/.../exec
//
// Defaults: 50 users, URL from VITE_GSHEETS_API in .env.
//
// What it does (each user runs sequentially through these steps,
// all 50 users start in parallel):
//   1. registerStudent — unique nickname stress_NNN_<rand>
//   2. updateStudentProgress — simulate 10 dragons found
//   3. sealDragon — 1 KB image stub, simulates Bond Ritual
//   4. voteForDragon — vote for someone else
//   5. getXpLeaderboard / getArenaLeaderboard / listDragons — read paths
//
// Output: per-action counts of OK / ERROR / TIMEOUT, p50/p95 latency,
// and any error messages collected.
//
// IMPORTANT: this hits the REAL Apps Script. Run it on a copy of the
// spreadsheet or accept that 50 stress_NNN rows land in production.

import fs from 'node:fs'
import path from 'node:path'

// ── args & env ────────────────────────────────────────────────────
const args = process.argv.slice(2)
function arg(name, fallback) {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : fallback
}
const N_USERS = parseInt(arg('users', '50'), 10)
const TIMEOUT_MS = parseInt(arg('timeout', '20000'), 10)
// Batch size simulates real-world arrival pattern: people don't all
// click Sign in at the exact same millisecond. With Apps Script's
// 30-concurrent-execution quota, anything beyond ~25 in flight
// starts to queue server-side and lock timeouts cascade.
const BATCH_SIZE = parseInt(arg('batch', '50'), 10)
const BATCH_DELAY_MS = parseInt(arg('batch-delay', '0'), 10)

let URL = arg('url', null)
if (!URL) {
  try {
    const env = fs.readFileSync(path.resolve('.env'), 'utf8')
    const m = env.match(/^VITE_GSHEETS_API=(.+)$/m)
    if (m) URL = m[1].trim()
  } catch {}
}
if (!URL) {
  console.error('No URL: pass --url or set VITE_GSHEETS_API in .env')
  process.exit(1)
}

console.log(`stress test: ${N_USERS} users → ${URL}`)
console.log(`timeout per call: ${TIMEOUT_MS}ms\n`)

// ── per-action metrics ────────────────────────────────────────────
const metrics = {}
function record(action, status, latencyMs, errMsg) {
  if (!metrics[action]) metrics[action] = { ok: 0, err: 0, timeout: 0, latencies: [], errors: {} }
  const m = metrics[action]
  if (status === 'ok') m.ok++
  else if (status === 'timeout') m.timeout++
  else {
    m.err++
    const key = (errMsg || 'unknown').slice(0, 80)
    m.errors[key] = (m.errors[key] || 0) + 1
  }
  m.latencies.push(latencyMs)
}

async function call(action, payload = {}) {
  const t0 = Date.now()
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload }),
      redirect: 'follow',
      signal: ctrl.signal,
    })
    const latency = Date.now() - t0
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      record(action, 'err', latency, `HTTP ${res.status}: ${text.slice(0, 60)}`)
      return null
    }
    const data = await res.json()
    if (data?.error) {
      record(action, 'err', latency, data.error)
      return null
    }
    record(action, 'ok', latency)
    return data
  } catch (e) {
    const latency = Date.now() - t0
    if (e.name === 'AbortError') {
      record(action, 'timeout', latency)
    } else {
      record(action, 'err', latency, e.message)
    }
    return null
  } finally {
    clearTimeout(timer)
  }
}

// 1×1 transparent PNG, base64. Enough payload to test sealDragon.
const TINY_PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

const CHARACTERS = ['violet', 'xaden', 'rhiannon', 'ridoc', 'liam', 'imogen']

async function simulateOneUser(idx) {
  const nickname = `qa_r1_${String(idx).padStart(3, '0')}`
  const characterId = CHARACTERS[idx % CHARACTERS.length]

  // 1. Register
  const reg = await call('registerStudent', {
    nickname,
    name: `Stress User ${idx}`,
    studio: 'StressTest Studios',
    role: 'qa',
    os: 'mac',
    claudeCodeReady: true,
    characterId,
  })
  if (!reg) return  // registration failed — skip further steps
  const studentId = reg.id || null

  // 2. Update progress (XP + 10 dragons)
  await call('updateStudentProgress', {
    studentId,
    nickname,
    xp: 400,
    hiddenDragonsFound: Array.from({ length: 10 }, (_, i) => `dragon_${i}`),
    currentPage: 12,
  })

  // 3. Seal dragon (Bond Ritual)
  await call('sealDragon', {
    nickname,
    studentId,
    characterId,
    answers: { name: `Stress Dragon ${idx}`, mood: 'fierce', breath: 'fire' },
    imageB64: TINY_PNG_B64,
    prompt: 'stress test dragon',
    modelUsed: 'gpt-image-2',
  })

  // 4. Vote for another participant's dragon (use idx as a proxy)
  const targetIdx = (idx + 1) % N_USERS
  await call('voteForDragon', {
    voterNickname: nickname,
    dragonId: `qa_r1_${String(targetIdx).padStart(3, '0')}`,
  })

  // 5. Read leaderboards (what Champions slide hits)
  await call('listDragons')
  await call('getXpLeaderboard')
  await call('getArenaLeaderboard')
}

// ── run in batches to stay under Apps Script's 30-concurrent quota ──
const t0 = Date.now()
const results = []
for (let start = 0; start < N_USERS; start += BATCH_SIZE) {
  const end = Math.min(start + BATCH_SIZE, N_USERS)
  console.log(`batch ${Math.floor(start / BATCH_SIZE) + 1}: users ${start}..${end - 1}`)
  const batchRes = await Promise.allSettled(
    Array.from({ length: end - start }, (_, i) => simulateOneUser(start + i))
  )
  results.push(...batchRes)
  if (end < N_USERS && BATCH_DELAY_MS > 0) {
    await new Promise(r => setTimeout(r, BATCH_DELAY_MS))
  }
}
const totalMs = Date.now() - t0

// ── report ────────────────────────────────────────────────────────
function p(arr, q) {
  if (!arr.length) return 0
  const s = [...arr].sort((a, b) => a - b)
  return s[Math.floor(s.length * q)] || s[s.length - 1]
}

console.log(`\n=== Results (total wall time ${(totalMs / 1000).toFixed(1)}s) ===\n`)
const actions = Object.keys(metrics).sort()
console.log('action                   ok   err  timeout  p50ms   p95ms')
console.log('-----------------------  ---  ---  -------  ------  ------')
for (const a of actions) {
  const m = metrics[a]
  console.log(
    `${a.padEnd(23)}  ${String(m.ok).padStart(3)}  ${String(m.err).padStart(3)}  ${String(m.timeout).padStart(7)}  ${String(p(m.latencies, 0.5)).padStart(6)}  ${String(p(m.latencies, 0.95)).padStart(6)}`
  )
}

console.log('\nerrors (top per action):')
for (const a of actions) {
  const errs = metrics[a].errors
  const top = Object.entries(errs).sort((x, y) => y[1] - x[1]).slice(0, 3)
  if (!top.length) continue
  console.log(`  ${a}:`)
  for (const [msg, n] of top) console.log(`    × ${n}  ${msg}`)
}

console.log('\nrejected promises:', results.filter(r => r.status === 'rejected').length)
