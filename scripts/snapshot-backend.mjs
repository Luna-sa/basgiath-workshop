#!/usr/bin/env node
// Snapshot every readable state from the Apps Script backend into a
// single timestamped JSON. Used as a baseline before stress-testing
// or any destructive operation, and again after cleanup to confirm
// the production state has been restored.
//
//   node scripts/snapshot-backend.mjs [--label before-stress]
//
// Writes test-snapshots/{timestamp}-{label}.json with:
//   - facilitatorState
//   - students     (full list)
//   - dragons      (full list, with vote counts)
//   - xpLeaderboard
//   - arenaLeaderboard
//   - meta: { url, takenAt, durationsMs }

import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const label = (() => {
  const i = args.indexOf('--label')
  return i >= 0 ? args[i + 1] : 'snapshot'
})()

let URL = (() => {
  const i = args.indexOf('--url')
  if (i >= 0) return args[i + 1]
  try {
    const env = fs.readFileSync(path.resolve('.env'), 'utf8')
    const m = env.match(/^VITE_GSHEETS_API=(.+)$/m)
    if (m) return m[1].trim()
  } catch {}
  return null
})()
if (!URL) { console.error('No URL'); process.exit(1) }

async function call(action) {
  const t0 = Date.now()
  try {
    const r = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action }),
    })
    const data = await r.json()
    return { ok: r.ok, status: r.status, data, durationMs: Date.now() - t0 }
  } catch (e) {
    return { ok: false, error: e.message, durationMs: Date.now() - t0 }
  }
}

const actions = [
  'getFacilitatorState',
  'listStudents',
  'listDragons',
  'getXpLeaderboard',
  'getArenaLeaderboard',
]

console.log(`Snapshot → ${URL.slice(0, 80)}...`)
const result = { meta: { url: URL, takenAt: new Date().toISOString(), label, durationsMs: {} } }

for (const a of actions) {
  process.stdout.write(`  ${a.padEnd(22)} ... `)
  const res = await call(a)
  result.meta.durationsMs[a] = res.durationMs
  if (!res.ok) {
    console.log(`FAIL ${res.error || res.status}`)
    result[a] = { error: res.error || `HTTP ${res.status}` }
    continue
  }
  const d = res.data
  // Stuff into top-level keys with the natural property name
  if (d.students) { result.students = d.students; console.log(`${d.students.length} students  ${res.durationMs}ms`) }
  else if (d.dragons) { result.dragons = d.dragons; console.log(`${d.dragons.length} dragons  ${res.durationMs}ms`) }
  else if (d.leaderboard) { result[a] = d.leaderboard; console.log(`${d.leaderboard.length} rows  ${res.durationMs}ms`) }
  else { result.facilitatorState = d; console.log(`ok  ${res.durationMs}ms`) }
}

const tsDir = path.resolve('test-snapshots')
fs.mkdirSync(tsDir, { recursive: true })
const fname = `${new Date().toISOString().replace(/[:.]/g, '-')}-${label}.json`
const fpath = path.join(tsDir, fname)
fs.writeFileSync(fpath, JSON.stringify(result, null, 2))

const counts = {
  students: result.students?.length || 0,
  dragons: result.dragons?.length || 0,
  xpRows: result.getXpLeaderboard?.length || 0,
  arenaRows: result.getArenaLeaderboard?.length || 0,
}
console.log(`\nsaved → ${fpath}`)
console.log('counts:', counts)
