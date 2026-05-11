/**
 * Basgiath Workshop — Google Apps Script backend
 *
 * Replaces Supabase as the persistence layer. Single Web App URL,
 * POST routed by `action` in the request body.
 *
 * Setup once:
 *   1. Open https://script.new (signed into the Google account that
 *      will own the workshop data).
 *   2. Replace the template Code.gs with the contents of this file.
 *   3. Save. Run `doSetup()` once — it creates the Spreadsheet, the
 *      Drive folder for dragon portraits, and seeds the
 *      facilitator_state row. Copy the IDs it prints into PROPS
 *      via "Project Settings → Script Properties" (or the URL bar).
 *   4. Deploy → New Deployment → Web App.
 *      Execute as: Me.
 *      Who has access: Anyone.
 *      Copy the deployment URL — that's VITE_GSHEETS_API.
 *
 * Re-deploy on every code change (or use "Manage Deployments" to
 * promote a new version of the same URL).
 *
 * Auth model: no auth. Anyone with the URL can read/write. The
 * workshop is single-day, single-cohort — acceptable.
 */

// ───────────────────────── Constants ──────────────────────────

const SHEETS = {
  STUDENTS:        'students',
  DRAGONS:         'dragons',
  DRAGON_VOTES:    'dragon_votes',
  DRAGON_MATCHES:  'dragon_matches',
  BOT_SUBMISSIONS: 'bot_submissions',
  ARENA_RUNS:      'arena_runs',
  FACILITATOR:     'facilitator_state',
}

const HEADERS = {
  [SHEETS.STUDENTS]: [
    'id', 'created_at', 'nickname', 'name', 'studio', 'role',
    'os', 'claude_code_ready', 'character_id', 'checkpoints',
    'current_page', 'xp', 'hidden_dragons_found',
  ],
  [SHEETS.DRAGONS]: [
    'id', 'created_at', 'sealed_at', 'student_id', 'nickname',
    'character_id', 'name', 'answers', 'prompt', 'image_url',
    'model_used', 'vote_count',
  ],
  [SHEETS.DRAGON_VOTES]: [
    'id', 'created_at', 'voter_nickname', 'dragon_id',
  ],
  [SHEETS.DRAGON_MATCHES]: [
    'id', 'submitted_at', 'voter_nickname', 'dragon_id',
    'guessed_nickname', 'is_correct',
  ],
  [SHEETS.BOT_SUBMISSIONS]: [
    'id', 'submitted_at', 'student_id', 'nickname', 'character_id',
    'bot_code', 'score',
  ],
  [SHEETS.ARENA_RUNS]: [
    'id', 'created_at', 'student_id', 'nickname', 'character_id',
    'run_number', 'score', 'stars_collected', 'fire_stars',
    'max_combo', 'walls_hit', 'pattern_hit', 'signet_used',
    'ticks_alive', 'bot_crashed', 'run_log_json', 'bot_code_snapshot',
  ],
  [SHEETS.FACILITATOR]: [
    'key', 'unlocked_page', 'workshop_phase', 'announcement',
    'announcement_at', 'active_round_id', 'active_timer_start',
    'active_timer_duration', 'round_ended', 'round_winners',
    'updated_at',
  ],
}

const FACILITATOR_KEY = 'singleton'

// ───────────────────────── HTTP handler ───────────────────────

function doPost(e) {
  try {
    const body = JSON.parse(e.postData?.contents || '{}')
    const action = body.action
    if (!action) return _json({ error: 'action required' }, 400)

    const handlers = {
      // students
      registerStudent,
      getStudent,
      listStudents,
      markCheckpoint,
      // dragons
      sealDragon,
      listDragons,
      // votes
      voteForDragon,
      withdrawVote,
      getMyVote,
      getMyVotes,
      // matches
      submitGuess,
      getMyGuesses,
      getMatchLeaderboard,
      // facilitator
      getFacilitatorState,
      setFacilitatorState,
      // bot submissions
      submitBot,
      getLatestSubmissionsByCharacter,
      // arena runs
      recordArenaRun,
      getMyArenaRuns,
      getArenaLeaderboard,
      resetArenaRuns,
      // progress (XP, hidden dragons)
      updateStudentProgress,
      getXpLeaderboard,
    }
    const fn = handlers[action]
    if (!fn) return _json({ error: 'unknown action: ' + action }, 400)
    const result = fn(body)
    return _json(result || { ok: true })
  } catch (err) {
    return _json({ error: err.message || String(err), stack: err.stack }, 500)
  }
}

function doGet(e) {
  // Convenience GET for health-check + simple reads via querystring.
  const action = e.parameter?.action
  if (!action) {
    return _json({ ok: true, hint: 'POST with { action, ... } body' })
  }
  return doPost({ postData: { contents: JSON.stringify({ action, ...e.parameter }) } })
}

// ───────────────────────── Setup ──────────────────────────────

function doSetup() {
  const props = PropertiesService.getScriptProperties()
  // Spreadsheet
  let ssId = props.getProperty('SPREADSHEET_ID')
  if (!ssId) {
    const ss = SpreadsheetApp.create('Basgiath Workshop Data')
    ssId = ss.getId()
    props.setProperty('SPREADSHEET_ID', ssId)
  }
  const ss = SpreadsheetApp.openById(ssId)
  Object.values(SHEETS).forEach((name) => {
    let sheet = ss.getSheetByName(name)
    if (!sheet) sheet = ss.insertSheet(name)
    const existing = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0]
    const headers = HEADERS[name]
    const needsHeaders = existing.join('|') !== headers.join('|')
    if (needsHeaders) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])
      sheet.setFrozenRows(1)
    }
  })
  // Default sheet removed (it's empty "Sheet1")
  const def = ss.getSheetByName('Sheet1')
  if (def && ss.getSheets().length > 1) ss.deleteSheet(def)

  // Drive folder for portrait uploads
  let folderId = props.getProperty('DRIVE_FOLDER_ID')
  if (!folderId) {
    const folder = DriveApp.createFolder('Basgiath Workshop Dragons')
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
    folderId = folder.getId()
    props.setProperty('DRIVE_FOLDER_ID', folderId)
  }

  // Seed facilitator_state row
  const facSheet = ss.getSheetByName(SHEETS.FACILITATOR)
  if (facSheet.getLastRow() < 2) {
    facSheet.appendRow([
      FACILITATOR_KEY, 4, 'pre', '', '', '', '', 60, false, '[]',
      new Date().toISOString(),
    ])
  }

  Logger.log('SPREADSHEET_ID  : ' + ssId)
  Logger.log('DRIVE_FOLDER_ID : ' + folderId)
  Logger.log('Spreadsheet URL : ' + ss.getUrl())
  Logger.log('Drive folder URL: https://drive.google.com/drive/folders/' + folderId)
  Logger.log('All set. Now deploy as Web App (Anyone access).')
  return { spreadsheetId: ssId, driveFolderId: folderId, spreadsheetUrl: ss.getUrl() }
}

// ───────────────────────── Helpers ────────────────────────────

function _ss() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')
  if (!id) throw new Error('SPREADSHEET_ID not set — run doSetup() first')
  return SpreadsheetApp.openById(id)
}

function _sheet(name) {
  return _ss().getSheetByName(name)
}

function _allRows(sheetName) {
  const sheet = _sheet(sheetName)
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return []
  const headers = HEADERS[sheetName]
  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues()
  return values.map((row) => {
    const obj = {}
    headers.forEach((h, i) => { obj[h] = row[i] })
    return obj
  })
}

function _appendRow(sheetName, record) {
  const sheet = _sheet(sheetName)
  const headers = HEADERS[sheetName]
  const row = headers.map((h) => record[h] ?? '')
  sheet.appendRow(row)
  return record
}

function _findRowIndex(sheetName, matchFn) {
  const sheet = _sheet(sheetName)
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return -1
  const headers = HEADERS[sheetName]
  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues()
  for (let i = 0; i < values.length; i++) {
    const obj = {}
    headers.forEach((h, j) => { obj[h] = values[i][j] })
    if (matchFn(obj)) return i + 2
  }
  return -1
}

function _updateRow(sheetName, rowIndex, patch) {
  const sheet = _sheet(sheetName)
  const headers = HEADERS[sheetName]
  const current = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0]
  const obj = {}
  headers.forEach((h, i) => { obj[h] = current[i] })
  Object.assign(obj, patch)
  sheet.getRange(rowIndex, 1, 1, headers.length).setValues([headers.map((h) => obj[h] ?? '')])
  return obj
}

function _deleteRow(sheetName, rowIndex) {
  _sheet(sheetName).deleteRow(rowIndex)
}

function _uuid() {
  return Utilities.getUuid()
}

function _now() {
  return new Date().toISOString()
}

function _json(payload, status) {
  const out = ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
  // Apps Script Web Apps can't set arbitrary status codes — we
  // surface non-200 via the payload's `error` field. Client checks.
  return out
}

// ───────────────────────── Students ───────────────────────────

function registerStudent({ nickname, name, studio, role, os, claudeCodeReady, characterId }) {
  if (!nickname) throw new Error('nickname required')
  const nick = String(nickname).toLowerCase().trim()
  const existing = _allRows(SHEETS.STUDENTS).find(s => String(s.nickname).toLowerCase() === nick)
  if (existing) {
    const err = new Error('Nickname taken')
    err.code = 'NICKNAME_TAKEN'
    return { error: 'NICKNAME_TAKEN', code: 'NICKNAME_TAKEN' }
  }
  const record = {
    id: _uuid(),
    created_at: _now(),
    nickname: nick,
    name: name || '',
    studio: studio || '',
    role: role || '',
    os: os || '',
    claude_code_ready: !!claudeCodeReady,
    character_id: characterId || '',
    checkpoints: '{}',
    current_page: 0,
  }
  _appendRow(SHEETS.STUDENTS, record)
  return record
}

function getStudent({ nickname, studentId }) {
  const rows = _allRows(SHEETS.STUDENTS)
  if (studentId) return rows.find(s => s.id === studentId) || null
  if (nickname) {
    const nick = String(nickname).toLowerCase().trim()
    return rows.find(s => String(s.nickname).toLowerCase() === nick) || null
  }
  return null
}

function listStudents() {
  return { students: _allRows(SHEETS.STUDENTS) }
}

function markCheckpoint({ studentId, checkpointId }) {
  if (!studentId || !checkpointId) throw new Error('studentId + checkpointId required')
  const rowIdx = _findRowIndex(SHEETS.STUDENTS, s => s.id === studentId)
  if (rowIdx < 0) throw new Error('student not found')
  const student = _allRows(SHEETS.STUDENTS).find(s => s.id === studentId)
  let checkpoints
  try { checkpoints = JSON.parse(student.checkpoints || '{}') } catch { checkpoints = {} }
  checkpoints[checkpointId] = _now()
  _updateRow(SHEETS.STUDENTS, rowIdx, { checkpoints: JSON.stringify(checkpoints) })
  return { checkpoints }
}

// ───────────────────────── Dragons ────────────────────────────

function _uploadImageToDrive(base64Data, filenameHint) {
  const folderId = PropertiesService.getScriptProperties().getProperty('DRIVE_FOLDER_ID')
  if (!folderId) throw new Error('DRIVE_FOLDER_ID not set — run doSetup()')
  const folder = DriveApp.getFolderById(folderId)
  // Strip "data:image/png;base64," prefix if present
  const cleaned = base64Data.replace(/^data:image\/[a-z]+;base64,/, '')
  const bytes = Utilities.base64Decode(cleaned)
  const blob = Utilities.newBlob(bytes, 'image/png', filenameHint + '.png')
  const file = folder.createFile(blob)
  // Anyone with link can view (folder is already public, but make
  // sure file inherits)
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
  } catch (e) {
    // If domain policy blocks public sharing this throws — falls
    // back to folder ACL which is still permissive.
  }
  // Use the direct content URL — works as <img src>
  return 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1080'
}

function sealDragon({ nickname, studentId, characterId, answers, imageB64, prompt, modelUsed }) {
  if (!nickname) throw new Error('nickname required')
  if (!imageB64) throw new Error('imageB64 required')
  const nick = String(nickname).toLowerCase().trim()
  const dragons = _allRows(SHEETS.DRAGONS)
  // Re-seal: delete prior row for same nickname
  const existingIdx = _findRowIndex(SHEETS.DRAGONS, d => String(d.nickname).toLowerCase() === nick)
  if (existingIdx > 0) _deleteRow(SHEETS.DRAGONS, existingIdx)

  const url = _uploadImageToDrive(imageB64, 'dragon-' + nick + '-' + Date.now())
  const record = {
    id: _uuid(),
    created_at: _now(),
    sealed_at: _now(),
    student_id: studentId || '',
    nickname: nick,
    character_id: characterId || '',
    name: (answers && answers.name) || 'Unnamed',
    answers: JSON.stringify(answers || {}),
    prompt: prompt || '',
    image_url: url,
    model_used: modelUsed || '',
    vote_count: 0,
  }
  _appendRow(SHEETS.DRAGONS, record)
  return record
}

function listDragons() {
  const rows = _allRows(SHEETS.DRAGONS).map(d => {
    let parsed = {}
    try { parsed = JSON.parse(d.answers || '{}') } catch {}
    return { ...d, answers: parsed }
  })
  // Sort by vote_count desc, sealed_at asc
  rows.sort((a, b) => {
    const av = Number(a.vote_count || 0), bv = Number(b.vote_count || 0)
    if (av !== bv) return bv - av
    return String(a.sealed_at).localeCompare(String(b.sealed_at))
  })
  return { dragons: rows }
}

// ───────────────────────── Votes ──────────────────────────────

// Each voter may cast up to MAX_VOTES_PER_VOTER unique votes
// (different dragons). Voting for the same dragon twice is silently
// idempotent — does not add a second vote.
var MAX_VOTES_PER_VOTER = 3

function voteForDragon({ voterNickname, dragonId }) {
  if (!voterNickname || !dragonId) throw new Error('voterNickname + dragonId required')
  const nick = String(voterNickname).toLowerCase().trim()
  // Find all existing votes by this voter
  const myVotes = _allRows(SHEETS.DRAGON_VOTES).filter(v =>
    String(v.voter_nickname).toLowerCase() === nick
  )
  // Already voted for this dragon — idempotent no-op
  if (myVotes.some(v => v.dragon_id === dragonId)) {
    return { dragon_id: dragonId, votes_used: myVotes.length, alreadyCast: true }
  }
  // Quota check
  if (myVotes.length >= MAX_VOTES_PER_VOTER) {
    return {
      error: 'QUOTA_EXCEEDED',
      code: 'QUOTA_EXCEEDED',
      votes_used: myVotes.length,
      max: MAX_VOTES_PER_VOTER,
    }
  }
  _appendRow(SHEETS.DRAGON_VOTES, {
    id: _uuid(),
    created_at: _now(),
    voter_nickname: nick,
    dragon_id: dragonId,
  })
  _incrementDragonVote(dragonId, +1)
  return { dragon_id: dragonId, votes_used: myVotes.length + 1, max: MAX_VOTES_PER_VOTER }
}

function withdrawVote({ voterNickname, dragonId }) {
  if (!voterNickname) throw new Error('voterNickname required')
  const nick = String(voterNickname).toLowerCase().trim()
  // If dragonId given — remove that specific vote.
  // If omitted — remove ALL votes by this voter (legacy "withdraw all" usage).
  const all = _allRows(SHEETS.DRAGON_VOTES)
  const sheet = _sheet(SHEETS.DRAGON_VOTES)
  // Iterate from bottom so deletions don't shift indices
  for (let i = all.length - 1; i >= 0; i--) {
    const v = all[i]
    if (String(v.voter_nickname).toLowerCase() !== nick) continue
    if (dragonId && v.dragon_id !== dragonId) continue
    sheet.deleteRow(i + 2) // +2: header row + 1-based
    if (v.dragon_id) _incrementDragonVote(v.dragon_id, -1)
  }
  return { ok: true }
}

// Returns array of {dragon_id, created_at} for all votes by this voter.
function getMyVotes({ voterNickname }) {
  if (!voterNickname) return { votes: [] }
  const nick = String(voterNickname).toLowerCase().trim()
  const votes = _allRows(SHEETS.DRAGON_VOTES)
    .filter(v => String(v.voter_nickname).toLowerCase() === nick)
    .map(v => ({ dragon_id: v.dragon_id, created_at: v.created_at }))
  return { votes, max: MAX_VOTES_PER_VOTER }
}

// Back-compat shim — old single-vote API. Returns the first vote or null.
function getMyVote({ voterNickname }) {
  const r = getMyVotes({ voterNickname })
  return (r.votes && r.votes[0]) || null
}

function _incrementDragonVote(dragonId, delta) {
  const rowIdx = _findRowIndex(SHEETS.DRAGONS, d => d.id === dragonId)
  if (rowIdx < 0) return
  const current = _allRows(SHEETS.DRAGONS).find(d => d.id === dragonId)
  const next = Math.max(0, Number(current.vote_count || 0) + delta)
  _updateRow(SHEETS.DRAGONS, rowIdx, { vote_count: next })
}

// ───────────────────────── Matches ────────────────────────────

function submitGuess({ voterNickname, dragonId, dragonOwnerNickname, guessedNickname }) {
  if (!voterNickname || !dragonId || !guessedNickname) {
    throw new Error('voterNickname, dragonId, guessedNickname required')
  }
  const nick = String(voterNickname).toLowerCase().trim()
  const guess = String(guessedNickname).toLowerCase().trim()
  const owner = String(dragonOwnerNickname || '').toLowerCase().trim()
  const isCorrect = guess === owner
  // Replace any existing guess by this voter for this dragon
  const idx = _findRowIndex(SHEETS.DRAGON_MATCHES,
    m => String(m.voter_nickname).toLowerCase() === nick && m.dragon_id === dragonId)
  if (idx > 0) _deleteRow(SHEETS.DRAGON_MATCHES, idx)
  _appendRow(SHEETS.DRAGON_MATCHES, {
    id: _uuid(),
    submitted_at: _now(),
    voter_nickname: nick,
    dragon_id: dragonId,
    guessed_nickname: guess,
    is_correct: isCorrect,
  })
  return { is_correct: isCorrect }
}

function getMyGuesses({ voterNickname }) {
  if (!voterNickname) return { guesses: [] }
  const nick = String(voterNickname).toLowerCase().trim()
  const rows = _allRows(SHEETS.DRAGON_MATCHES)
    .filter(m => String(m.voter_nickname).toLowerCase() === nick)
  return { guesses: rows }
}

function getMatchLeaderboard() {
  const rows = _allRows(SHEETS.DRAGON_MATCHES)
  const byVoter = {}
  rows.forEach(m => {
    const k = String(m.voter_nickname).toLowerCase()
    if (!byVoter[k]) byVoter[k] = { voter_nickname: k, correct: 0, total: 0 }
    byVoter[k].total += 1
    if (m.is_correct === true || m.is_correct === 'TRUE') byVoter[k].correct += 1
  })
  const out = Object.values(byVoter).sort((a, b) => {
    if (b.correct !== a.correct) return b.correct - a.correct
    return a.total - b.total
  })
  return { leaderboard: out }
}

// ───────────────────────── Facilitator ────────────────────────

function getFacilitatorState() {
  const rows = _allRows(SHEETS.FACILITATOR)
  return rows[0] || null
}

function setFacilitatorState({ patch }) {
  if (!patch) throw new Error('patch required')
  const rowIdx = _findRowIndex(SHEETS.FACILITATOR, r => r.key === FACILITATOR_KEY)
  if (rowIdx < 0) {
    _appendRow(SHEETS.FACILITATOR, { key: FACILITATOR_KEY, ...patch, updated_at: _now() })
  } else {
    _updateRow(SHEETS.FACILITATOR, rowIdx, { ...patch, updated_at: _now() })
  }
  return getFacilitatorState()
}

// ───────────────────────── Bot submissions ────────────────────

function submitBot({ studentId, nickname, characterId, botCode }) {
  if (!nickname || !botCode) throw new Error('nickname + botCode required')
  const record = {
    id: _uuid(),
    submitted_at: _now(),
    student_id: studentId || '',
    nickname: String(nickname).toLowerCase().trim(),
    character_id: characterId || '',
    bot_code: botCode,
    score: 0,
  }
  _appendRow(SHEETS.BOT_SUBMISSIONS, record)
  return record
}

function getLatestSubmissionsByCharacter() {
  const rows = _allRows(SHEETS.BOT_SUBMISSIONS)
  const byChar = {}
  rows.forEach(r => {
    const k = r.character_id
    if (!byChar[k] || String(r.submitted_at) > String(byChar[k].submitted_at)) {
      byChar[k] = r
    }
  })
  return { submissions: Object.values(byChar) }
}

// ───────────────────────── Arena runs ─────────────────────────

// Each participant submits up to MAX_ARENA_RUNS scored runs.
// Their leaderboard total is the SUM of all their run scores.
var MAX_ARENA_RUNS = 10

function recordArenaRun(body) {
  const {
    studentId, nickname, characterId, runNumber,
    score, starsCollected, fireStars, maxCombo, wallsHit,
    patternHit, signetUsed, ticksAlive, botCrashed,
    runLog, botCodeSnapshot,
  } = body || {}
  if (!nickname) throw new Error('nickname required')
  if (!characterId) throw new Error('characterId required')
  const rn = Number(runNumber)
  if (!Number.isInteger(rn) || rn < 1 || rn > MAX_ARENA_RUNS) {
    throw new Error('runNumber out of range (1.. ' + MAX_ARENA_RUNS + ')')
  }
  const nick = String(nickname).toLowerCase().trim()
  // Idempotent: if (nickname, character_id, run_number) already exists,
  // overwrite. Lets a re-submit replace a flaky network attempt without
  // double-counting.
  const existingIdx = _findRowIndex(SHEETS.ARENA_RUNS,
    r => String(r.nickname).toLowerCase() === nick
      && r.character_id === characterId
      && Number(r.run_number) === rn)
  const record = {
    id: existingIdx > 0 ? _allRows(SHEETS.ARENA_RUNS).find(
      r => String(r.nickname).toLowerCase() === nick
        && r.character_id === characterId
        && Number(r.run_number) === rn
    ).id : _uuid(),
    created_at: _now(),
    student_id: studentId || '',
    nickname: nick,
    character_id: characterId,
    run_number: rn,
    score: Number(score) || 0,
    stars_collected: Number(starsCollected) || 0,
    fire_stars: Number(fireStars) || 0,
    max_combo: Number(maxCombo) || 0,
    walls_hit: Number(wallsHit) || 0,
    pattern_hit: !!patternHit,
    signet_used: !!signetUsed,
    ticks_alive: Number(ticksAlive) || 0,
    bot_crashed: !!botCrashed,
    run_log_json: runLog ? (typeof runLog === 'string' ? runLog : JSON.stringify(runLog)) : '',
    bot_code_snapshot: botCodeSnapshot || '',
  }
  if (existingIdx > 0) {
    _updateRow(SHEETS.ARENA_RUNS, existingIdx, record)
  } else {
    _appendRow(SHEETS.ARENA_RUNS, record)
  }
  return { id: record.id, run_number: rn, score: record.score }
}

function getMyArenaRuns({ nickname, characterId }) {
  if (!nickname) return { runs: [], max: MAX_ARENA_RUNS }
  const nick = String(nickname).toLowerCase().trim()
  const rows = _allRows(SHEETS.ARENA_RUNS)
    .filter(r => String(r.nickname).toLowerCase() === nick
      && (!characterId || r.character_id === characterId))
    .sort((a, b) => Number(a.run_number) - Number(b.run_number))
  // Strip the heavy run_log_json + bot_code_snapshot for list views.
  // Caller can fetch a single run by id later if they want details.
  const slim = rows.map(r => ({
    id: r.id,
    run_number: Number(r.run_number),
    score: Number(r.score) || 0,
    stars_collected: Number(r.stars_collected) || 0,
    fire_stars: Number(r.fire_stars) || 0,
    max_combo: Number(r.max_combo) || 0,
    walls_hit: Number(r.walls_hit) || 0,
    pattern_hit: r.pattern_hit === true || r.pattern_hit === 'TRUE',
    signet_used: r.signet_used === true || r.signet_used === 'TRUE',
    bot_crashed: r.bot_crashed === true || r.bot_crashed === 'TRUE',
    ticks_alive: Number(r.ticks_alive) || 0,
    created_at: r.created_at,
  }))
  return { runs: slim, max: MAX_ARENA_RUNS }
}

function getArenaLeaderboard() {
  const rows = _allRows(SHEETS.ARENA_RUNS)
  // Aggregate by (nickname). Character is captured from the most-recent
  // run (participants don't switch characters mid-arena in v2, but the
  // schema doesn't enforce it).
  const byNick = {}
  rows.forEach(r => {
    const k = String(r.nickname).toLowerCase()
    const score = Number(r.score) || 0
    const rn = Number(r.run_number) || 0
    if (!byNick[k]) {
      byNick[k] = {
        nickname: k,
        character_id: r.character_id || '',
        runs_completed: 0,
        total_score: 0,
        best_run_score: -1,
        best_run_number: 0,
        total_fire_stars: 0,
        total_stars: 0,
        best_combo: 0,
        hit_pattern: false,
        latest_run_at: '',
      }
    }
    const agg = byNick[k]
    agg.runs_completed += 1
    agg.total_score += score
    if (score > agg.best_run_score) {
      agg.best_run_score = score
      agg.best_run_number = rn
    }
    agg.total_fire_stars += Number(r.fire_stars) || 0
    agg.total_stars += Number(r.stars_collected) || 0
    const combo = Number(r.max_combo) || 0
    if (combo > agg.best_combo) agg.best_combo = combo
    if (r.pattern_hit === true || r.pattern_hit === 'TRUE') agg.hit_pattern = true
    if (String(r.created_at) > String(agg.latest_run_at)) {
      agg.latest_run_at = String(r.created_at)
      agg.character_id = r.character_id || agg.character_id
    }
  })
  const out = Object.values(byNick).sort((a, b) => {
    if (b.total_score !== a.total_score) return b.total_score - a.total_score
    if (b.best_run_score !== a.best_run_score) return b.best_run_score - a.best_run_score
    if (b.total_fire_stars !== a.total_fire_stars) return b.total_fire_stars - a.total_fire_stars
    return a.best_run_number - b.best_run_number  // earlier PB = better
  })
  return { leaderboard: out, max: MAX_ARENA_RUNS }
}

// ───────────────────────── Student progress ──────────────────

// Sync local workshopStore changes (XP, found dragons, page index) to the
// students sheet. Idempotent — overwrites whatever's there.
function updateStudentProgress({ studentId, nickname, xp, hiddenDragonsFound, currentPage }) {
  if (!studentId && !nickname) throw new Error('studentId or nickname required')
  let rowIdx = -1
  if (studentId) {
    rowIdx = _findRowIndex(SHEETS.STUDENTS, s => s.id === studentId)
  }
  if (rowIdx < 0 && nickname) {
    const nick = String(nickname).toLowerCase().trim()
    rowIdx = _findRowIndex(SHEETS.STUDENTS, s => String(s.nickname).toLowerCase() === nick)
  }
  if (rowIdx < 0) return { ok: false, error: 'student not found' }
  const patch = {}
  if (xp != null) patch.xp = Number(xp) || 0
  if (Array.isArray(hiddenDragonsFound)) {
    patch.hidden_dragons_found = JSON.stringify(hiddenDragonsFound)
  }
  if (currentPage != null) patch.current_page = Number(currentPage) || 0
  _updateRow(SHEETS.STUDENTS, rowIdx, patch)
  return { ok: true }
}

function getXpLeaderboard() {
  const rows = _allRows(SHEETS.STUDENTS).map(s => {
    let dragons = []
    try { dragons = JSON.parse(s.hidden_dragons_found || '[]') } catch (e) {}
    return {
      nickname: s.nickname,
      name: s.name,
      character_id: s.character_id,
      xp: Number(s.xp) || 0,
      dragons_found: Array.isArray(dragons) ? dragons.length : 0,
    }
  })
  // Top XP first; tiebreak by dragons_found desc, then nickname asc.
  rows.sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp
    if (b.dragons_found !== a.dragons_found) return b.dragons_found - a.dragons_found
    return String(a.nickname).localeCompare(String(b.nickname))
  })
  return { leaderboard: rows }
}

// Facilitator escape hatch: wipe all arena runs for a nickname.
// Used if a participant's first runs were thrown away during testing.
function resetArenaRuns({ nickname }) {
  if (!nickname) throw new Error('nickname required')
  const nick = String(nickname).toLowerCase().trim()
  const sheet = _sheet(SHEETS.ARENA_RUNS)
  const all = _allRows(SHEETS.ARENA_RUNS)
  let deleted = 0
  for (let i = all.length - 1; i >= 0; i--) {
    if (String(all[i].nickname).toLowerCase() === nick) {
      sheet.deleteRow(i + 2)
      deleted++
    }
  }
  return { deleted }
}
