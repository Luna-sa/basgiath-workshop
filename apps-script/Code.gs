/**
 * Basgiath Workshop - Google Apps Script backend
 *
 * Replaces Supabase as the persistence layer. Single Web App URL,
 * POST routed by `action` in the request body.
 *
 * Setup once:
 *   1. Open https://script.new (signed into the Google account that
 *      will own the workshop data).
 *   2. Replace the template Code.gs with the contents of this file.
 *   3. Save. Run `doSetup()` once - it creates the Spreadsheet, the
 *      Drive folder for dragon portraits, and seeds the
 *      facilitator_state row. Copy the IDs it prints into PROPS
 *      via "Project Settings → Script Properties" (or the URL bar).
 *   4. Deploy → New Deployment → Web App.
 *      Execute as: Me.
 *      Who has access: Anyone.
 *      Copy the deployment URL - that's VITE_GSHEETS_API.
 *
 * Re-deploy on every code change (or use "Manage Deployments" to
 * promote a new version of the same URL).
 *
 * Auth model: no auth. Anyone with the URL can read/write. The
 * workshop is single-day, single-cohort - acceptable.
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
  FEEDBACK:        'feedback',
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
    'tiebreak_dragon_ids', 'registration_closed',
    'updated_at',
  ],
  [SHEETS.FEEDBACK]: [
    'id', 'submitted_at', 'student_id', 'nickname', 'character_id',
    'rating', 'comment',
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
      getDragonImageDataUri,
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
      // feedback
      submitFeedback,
      listFeedback,
      deleteFeedback,
      // admin
      deleteStudent,
      deleteStudentsByPrefix,
      resetStudentProgress,
      resetArenaRuns,
      deleteArenaByNickname,
      addArenaRun,
      adjustXp,
      // aerie tiebreak
      getAerieTiebreakCandidates,
      startAerieTiebreak,
      endAerieTiebreak,
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
  if (!id) throw new Error('SPREADSHEET_ID not set - run doSetup() first')
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
  // NOTE: deliberately NOT calling SpreadsheetApp.flush() on every
  // append — flush adds 1-2s per write and 50 parallel registrations
  // ballooned to ~26s p50. Callers that need read-after-write
  // visibility (registerStudent, sealDragon) call flush() explicitly
  // before releasing the lock.
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
  // Apps Script Web Apps can't set arbitrary status codes - we
  // surface non-200 via the payload's `error` field. Client checks.
  return out
}

/**
 * Serialise every write-path operation behind a script-wide lock.
 * Without this, 50 simultaneous registerStudent / sealDragon /
 * voteForDragon calls race on appendRow() and silently drop ~80% of
 * inserts (verified empirically — 50 parallel registerStudent calls
 * landed only 11 rows in the sheet despite all returning HTTP 200).
 *
 * waitLock default 25s gives enough headroom for a 50-person burst
 * at ~0.3-0.5s per write. On timeout we throw, the client retries.
 */
function _withScriptLock(fn, waitMs) {
  var lock = LockService.getScriptLock()
  // Default 60s — long enough that a 50-person burst of registers
  // (each ~1-2s under the lock) doesn't starve the back of the queue.
  // Caller can override per-action: shorter for cheap ops, longer for
  // sealDragon (Drive upload).
  if (!lock.tryLock(waitMs || 60000)) {
    throw new Error('Could not acquire script lock within ' + (waitMs || 60000) + 'ms — retry')
  }
  try {
    return fn()
  } finally {
    try { lock.releaseLock() } catch (e) {}
  }
}

// ───────────────────────── Students ───────────────────────────

function registerStudent({ nickname, name, studio, role, os, claudeCodeReady, characterId }) {
  return _withScriptLock(function () {
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
    // Explicit flush: the client fires updateStudentProgress and
    // getStudent right after this returns; without flush they run
    // in a fresh execution context that sees a stale snapshot.
    SpreadsheetApp.flush()
    return record
  })
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

/**
 * Delete a student row (and cascade their dragon + votes + arena runs).
 * Used by the facilitator admin UI. Caller passes nickname OR studentId.
 */
function deleteStudent({ nickname, studentId, cascade }) {
  return _withScriptLock(function () {
    if (!nickname && !studentId) throw new Error('nickname or studentId required')
    const nick = nickname ? String(nickname).toLowerCase().trim() : null

    let removed = 0
    // students
    let rowIdx = -1
    if (studentId) rowIdx = _findRowIndex(SHEETS.STUDENTS, s => s.id === studentId)
    if (rowIdx < 0 && nick) rowIdx = _findRowIndex(SHEETS.STUDENTS, s => String(s.nickname).toLowerCase() === nick)
    if (rowIdx > 0) { _deleteRow(SHEETS.STUDENTS, rowIdx); removed++ }

    if (cascade === false) return { ok: true, removed }

    // dragons (by nickname)
    if (nick) {
      const allDragons = _allRows(SHEETS.DRAGONS)
      const dSheet = _sheet(SHEETS.DRAGONS)
      for (let i = allDragons.length - 1; i >= 0; i--) {
        if (String(allDragons[i].nickname).toLowerCase() === nick) {
          dSheet.deleteRow(i + 2)
          removed++
        }
      }
      // dragon_votes (this nickname as voter)
      const allVotes = _allRows(SHEETS.DRAGON_VOTES)
      const vSheet = _sheet(SHEETS.DRAGON_VOTES)
      for (let i = allVotes.length - 1; i >= 0; i--) {
        if (String(allVotes[i].voter_nickname).toLowerCase() === nick) {
          vSheet.deleteRow(i + 2)
          removed++
        }
      }
      // arena_runs
      const allArena = _allRows(SHEETS.ARENA_RUNS)
      const aSheet = _sheet(SHEETS.ARENA_RUNS)
      for (let i = allArena.length - 1; i >= 0; i--) {
        if (String(allArena[i].nickname).toLowerCase() === nick) {
          aSheet.deleteRow(i + 2)
          removed++
        }
      }
      // bot_submissions
      const allBots = _allRows(SHEETS.BOT_SUBMISSIONS)
      const bSheet = _sheet(SHEETS.BOT_SUBMISSIONS)
      for (let i = allBots.length - 1; i >= 0; i--) {
        if (String(allBots[i].nickname).toLowerCase() === nick) {
          bSheet.deleteRow(i + 2)
          removed++
        }
      }
    }
    SpreadsheetApp.flush()
    return { ok: true, removed }
  }, 60000)
}

/**
 * Bulk-delete every student whose nickname starts with the given prefix
 * (+ cascade their dragons / votes / runs). Used to wipe stress-test
 * rows in one call: `{ action: 'deleteStudentsByPrefix', prefix: 'qa_' }`.
 */
function deleteStudentsByPrefix({ prefix }) {
  return _withScriptLock(function () {
    if (!prefix) throw new Error('prefix required')
    const pfx = String(prefix).toLowerCase().trim()
    if (pfx.length < 2) throw new Error('prefix too short — refuse to mass-delete with < 2 chars')

    const targets = _allRows(SHEETS.STUDENTS)
      .filter(s => String(s.nickname).toLowerCase().startsWith(pfx))
      .map(s => String(s.nickname).toLowerCase())

    let removedRows = 0
    const sheetsToScan = [SHEETS.STUDENTS, SHEETS.DRAGONS, SHEETS.ARENA_RUNS, SHEETS.BOT_SUBMISSIONS]
    for (const sn of sheetsToScan) {
      const all = _allRows(sn)
      const sheet = _sheet(sn)
      for (let i = all.length - 1; i >= 0; i--) {
        if (targets.indexOf(String(all[i].nickname).toLowerCase()) >= 0) {
          sheet.deleteRow(i + 2)
          removedRows++
        }
      }
    }
    // votes use voter_nickname
    const allVotes = _allRows(SHEETS.DRAGON_VOTES)
    const vSheet = _sheet(SHEETS.DRAGON_VOTES)
    for (let i = allVotes.length - 1; i >= 0; i--) {
      if (targets.indexOf(String(allVotes[i].voter_nickname).toLowerCase()) >= 0) {
        vSheet.deleteRow(i + 2)
        removedRows++
      }
    }
    SpreadsheetApp.flush()
    return { ok: true, studentsMatched: targets.length, rowsRemoved: removedRows, nicknames: targets }
  }, 120000)
}

/**
 * Reset a student's progress while keeping their registration row.
 * Use case: facilitator (anastasiia) tested the full flow herself
 * and now wants to take the workshop fresh in front of participants
 * without losing the nickname/character pick that's already pinned
 * to her live registration.
 *
 * Wipes: dragon row, dragon_votes cast, arena_runs, bot_submissions.
 * Clears on student row: xp, hidden_dragons_found, checkpoints, current_page.
 */
function resetStudentProgress({ nickname }) {
  return _withScriptLock(function () {
    if (!nickname) throw new Error('nickname required')
    const nick = String(nickname).toLowerCase().trim()

    // Find the student row — don't delete it
    const rowIdx = _findRowIndex(SHEETS.STUDENTS, s => String(s.nickname).toLowerCase() === nick)
    if (rowIdx < 0) return { ok: false, error: 'student not found' }

    // Wipe dependent rows
    let removed = 0
    const wipeMatching = function (sheetName, fieldName) {
      const all = _allRows(sheetName)
      const sheet = _sheet(sheetName)
      for (let i = all.length - 1; i >= 0; i--) {
        if (String(all[i][fieldName]).toLowerCase() === nick) {
          sheet.deleteRow(i + 2)
          removed++
        }
      }
    }
    wipeMatching(SHEETS.DRAGONS, 'nickname')
    wipeMatching(SHEETS.DRAGON_VOTES, 'voter_nickname')
    wipeMatching(SHEETS.DRAGON_MATCHES, 'voter_nickname')
    wipeMatching(SHEETS.ARENA_RUNS, 'nickname')
    wipeMatching(SHEETS.BOT_SUBMISSIONS, 'nickname')
    // Also clear any feedback this nickname submitted — when an admin
    // resets a student's progress they typically want a fully clean
    // slate, including the participant's own feedback row.
    if (SHEETS.FEEDBACK) wipeMatching(SHEETS.FEEDBACK, 'nickname')

    // Reset student progress fields (keep id, nickname, name, character_id, etc)
    _updateRow(SHEETS.STUDENTS, rowIdx, {
      xp: 0,
      hidden_dragons_found: '[]',
      checkpoints: '{}',
      current_page: 0,
    })
    SpreadsheetApp.flush()
    return { ok: true, nickname: nick, rowsRemoved: removed }
  }, 60000)
}

function markCheckpoint({ studentId, checkpointId }) {
  return _withScriptLock(function () {
    if (!studentId || !checkpointId) throw new Error('studentId + checkpointId required')
    const rowIdx = _findRowIndex(SHEETS.STUDENTS, s => s.id === studentId)
    if (rowIdx < 0) throw new Error('student not found')
    const student = _allRows(SHEETS.STUDENTS).find(s => s.id === studentId)
    let checkpoints
    try { checkpoints = JSON.parse(student.checkpoints || '{}') } catch { checkpoints = {} }
    checkpoints[checkpointId] = _now()
    _updateRow(SHEETS.STUDENTS, rowIdx, { checkpoints: JSON.stringify(checkpoints) })
    return { checkpoints }
  })
}

// ───────────────────────── Dragons ────────────────────────────

function _uploadImageToDrive(base64Data, filenameHint) {
  const folderId = PropertiesService.getScriptProperties().getProperty('DRIVE_FOLDER_ID')
  if (!folderId) throw new Error('DRIVE_FOLDER_ID not set - run doSetup()')
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
    // If domain policy blocks public sharing this throws - falls
    // back to folder ACL which is still permissive.
  }
  // Use the direct content URL - works as <img src>
  return 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1080'
}

function sealDragon({ nickname, studentId, characterId, answers, imageB64, prompt, modelUsed }) {
  return _withScriptLock(function () {
    if (!nickname) throw new Error('nickname required')
    if (!imageB64) throw new Error('imageB64 required')
    const nick = String(nickname).toLowerCase().trim()
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
    // Bond Ritual page navigates straight to Aerie which calls
    // listDragons — flush so the new dragon shows up immediately.
    SpreadsheetApp.flush()
    return record
  }, 90000)
}

// Returns the sealed dragon's image as a data URI so the certificate
// component can render it without tainting the canvas. The browser
// can't fetch the Drive thumbnail directly (no CORS headers), so we
// pull the file blob server-side via DriveApp and base64-encode it.
function getDragonImageDataUri({ nickname }) {
  if (!nickname) throw new Error('nickname required')
  const nick = String(nickname).toLowerCase().trim()
  const dragon = _allRows(SHEETS.DRAGONS).find(d => String(d.nickname).toLowerCase() === nick)
  if (!dragon) return { error: 'not_found' }
  const url = String(dragon.image_url || '')
  const m = url.match(/[?&]id=([^&]+)/)
  if (!m) return { error: 'bad_url', url }
  try {
    const blob = DriveApp.getFileById(m[1]).getBlob()
    const mime = blob.getContentType() || 'image/png'
    const b64 = Utilities.base64Encode(blob.getBytes())
    return { dataUri: 'data:' + mime + ';base64,' + b64, mime }
  } catch (e) {
    return { error: 'drive_fetch_failed', message: e && e.message ? e.message : String(e) }
  }
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
// idempotent - does not add a second vote.
var MAX_VOTES_PER_VOTER = 3

function voteForDragon({ voterNickname, dragonId }) {
  return _withScriptLock(function () {
    if (!voterNickname || !dragonId) throw new Error('voterNickname + dragonId required')
    const nick = String(voterNickname).toLowerCase().trim()
    // Find all existing votes by this voter
    const myVotes = _allRows(SHEETS.DRAGON_VOTES).filter(v =>
      String(v.voter_nickname).toLowerCase() === nick
    )
    // Already voted for this dragon - idempotent no-op
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
  })
}

function withdrawVote({ voterNickname, dragonId }) {
  return _withScriptLock(function () {
    if (!voterNickname) throw new Error('voterNickname required')
    const nick = String(voterNickname).toLowerCase().trim()
    // If dragonId given - remove that specific vote.
    // If omitted - remove ALL votes by this voter (legacy "withdraw all" usage).
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
  })
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

// Back-compat shim - old single-vote API. Returns the first vote or null.
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
  _ensureFacilitatorColumns()
  const rows = _allRows(SHEETS.FACILITATOR)
  return rows[0] || null
}

function setFacilitatorState({ patch }) {
  return _withScriptLock(function () {
    if (!patch) throw new Error('patch required')
    // GET shim passes patch as a JSON string; POST passes it as an
    // object. Normalise.
    if (typeof patch === 'string') {
      try { patch = JSON.parse(patch) } catch (e) { throw new Error('patch must be a JSON object or string: ' + e.message) }
    }
    _ensureFacilitatorColumns()
    const rowIdx = _findRowIndex(SHEETS.FACILITATOR, r => r.key === FACILITATOR_KEY)
    if (rowIdx < 0) {
      _appendRow(SHEETS.FACILITATOR, { key: FACILITATOR_KEY, ...patch, updated_at: _now() })
    } else {
      _updateRow(SHEETS.FACILITATOR, rowIdx, { ...patch, updated_at: _now() })
    }
    return getFacilitatorState()
  })
}

/**
 * Sync the facilitator_state sheet header row to the HEADERS array.
 * Used to add columns introduced by code updates without forcing
 * the operator to re-run doSetup() and risk wiping data. Idempotent.
 */
function _ensureFacilitatorColumns() {
  const sheet = _sheet(SHEETS.FACILITATOR)
  const wanted = HEADERS[SHEETS.FACILITATOR]
  const lastCol = Math.max(sheet.getLastColumn(), 1)
  const current = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
  // Already up to date — quick exit
  if (current.length >= wanted.length && wanted.every((h, i) => current[i] === h)) {
    return
  }
  // Resize + rewrite the header row, preserving any data already in
  // those columns. New columns get empty values for existing rows.
  sheet.getRange(1, 1, 1, wanted.length).setValues([wanted])
  sheet.setFrozenRows(1)
}

// ───────────────────────── Aerie tiebreak ────────────────────────
//
// Live-workshop tool. When the final voting closes with a tie at
// the top, the facilitator runs a tiebreak round: only the tied
// dragons remain visible to voters, everyone gets a fresh 3-vote
// quota, the round runs for a few minutes, the highest count wins.
//
// Implementation:
//   1. getAerieTiebreakCandidates() — finds the highest vote_count
//      and returns every dragon at that level (auto-detect)
//   2. startAerieTiebreak({ dragonIds }) — wipes ALL dragon_votes
//      rows (clean slate so quotas reset for everyone), stores the
//      tiebreak dragon list in facilitator_state.tiebreak_dragon_ids
//   3. endAerieTiebreak() — clears tiebreak_dragon_ids so the UI
//      goes back to normal Aerie view; the final vote_count of each
//      tiebreak dragon is now the result

function getAerieTiebreakCandidates() {
  const dragons = _allRows(SHEETS.DRAGONS)
  if (dragons.length === 0) return { candidates: [], maxVotes: 0 }
  const maxVotes = dragons.reduce((m, d) => Math.max(m, Number(d.vote_count) || 0), 0)
  const candidates = dragons
    .filter(d => (Number(d.vote_count) || 0) === maxVotes)
    .map(d => ({
      id: d.id,
      nickname: d.nickname,
      name: d.name,
      vote_count: Number(d.vote_count) || 0,
      character_id: d.character_id,
      image_url: d.image_url,
    }))
  return { candidates, maxVotes }
}

function startAerieTiebreak(opts) {
  // dragonIds may arrive as a real array (POST from JSON body) or as
  // a JSON-stringified array (GET param routed through doGet shim).
  // Normalise both to an array before validating.
  var dragonIds = opts && opts.dragonIds
  if (typeof dragonIds === 'string') {
    try { dragonIds = JSON.parse(dragonIds) } catch (e) { dragonIds = null }
  }
  if (!Array.isArray(dragonIds) || dragonIds.length < 2) {
    throw new Error('dragonIds array required with at least 2 entries')
  }
  return _withScriptLock(function () {
    // 1. Wipe ALL dragon_votes rows — every voter gets a fresh
    //    3-vote quota for the tiebreak round.
    const votesSheet = _sheet(SHEETS.DRAGON_VOTES)
    const allVotes = _allRows(SHEETS.DRAGON_VOTES)
    for (let i = allVotes.length - 1; i >= 0; i--) {
      votesSheet.deleteRow(i + 2)
    }
    // 2. Reset vote_count on every dragon so the UI starts from 0.
    const dragonsSheet = _sheet(SHEETS.DRAGONS)
    const allDragons = _allRows(SHEETS.DRAGONS)
    for (let i = 0; i < allDragons.length; i++) {
      _updateRow(SHEETS.DRAGONS, i + 2, { vote_count: 0 })
    }
    // 3. Write tiebreak roster to facilitator_state.
    _ensureFacilitatorColumns()
    const rowIdx = _findRowIndex(SHEETS.FACILITATOR, r => r.key === FACILITATOR_KEY)
    const payload = {
      tiebreak_dragon_ids: JSON.stringify(dragonIds),
      updated_at: _now(),
    }
    if (rowIdx < 0) {
      _appendRow(SHEETS.FACILITATOR, { key: FACILITATOR_KEY, ...payload })
    } else {
      _updateRow(SHEETS.FACILITATOR, rowIdx, payload)
    }
    SpreadsheetApp.flush()
    return { ok: true, tiebreak_dragon_ids: dragonIds, voters_reset: true }
  })
}

function endAerieTiebreak() {
  return _withScriptLock(function () {
    _ensureFacilitatorColumns()
    const rowIdx = _findRowIndex(SHEETS.FACILITATOR, r => r.key === FACILITATOR_KEY)
    if (rowIdx < 0) return { ok: true, cleared: false }
    _updateRow(SHEETS.FACILITATOR, rowIdx, {
      tiebreak_dragon_ids: '',
      updated_at: _now(),
    })
    SpreadsheetApp.flush()
    return { ok: true, cleared: true }
  })
}

// ───────────────────────── Bot submissions ────────────────────

function submitBot({ studentId, nickname, characterId, botCode }) {
  return _withScriptLock(function () {
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
  })
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
var MAX_ARENA_RUNS = 5

function recordArenaRun(body) {
 return _withScriptLock(function () {
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
 })
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
  // Six-deep tie-break cascade so the arena leaderboard never falls
  // back to "alphabetical" or "whichever inserted first". Each next
  // signal rewards a different aspect of "good flying":
  //   1. total_score          — primary, sum across all attempts
  //   2. best_run_score       — single-run peak performance
  //   3. total_fire_stars     — bonus-star hunter
  //   4. best_run_number ASC  — earlier PB = more confidence
  //   5. walls_hit ASC        — cleaner flight wins
  //   6. pattern_hit DESC     — easter-egg hunter wins on dead ties
  const out = Object.values(byNick).sort((a, b) => {
    if (b.total_score !== a.total_score) return b.total_score - a.total_score
    if (b.best_run_score !== a.best_run_score) return b.best_run_score - a.best_run_score
    if (b.total_fire_stars !== a.total_fire_stars) return b.total_fire_stars - a.total_fire_stars
    if (a.best_run_number !== b.best_run_number) return a.best_run_number - b.best_run_number
    if ((a.walls_hit || 0) !== (b.walls_hit || 0)) return (a.walls_hit || 0) - (b.walls_hit || 0)
    return (b.hit_pattern ? 1 : 0) - (a.hit_pattern ? 1 : 0)
  })
  return { leaderboard: out, max: MAX_ARENA_RUNS }
}

// ───────────────────────── Student progress ──────────────────

// Sync local workshopStore changes (XP, found dragons, page index) to the
// students sheet. Idempotent - overwrites whatever's there.
function updateStudentProgress({ studentId, nickname, xp, hiddenDragonsFound, currentPage }) {
  return _withScriptLock(function () {
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
  })
}

// ───────────────────────── Feedback ───────────────────────────

/**
 * Append a workshop feedback row. Idempotency-by-content is NOT
 * enforced — participants can submit multiple times if they want
 * to add detail. Each call appends a new row.
 *
 *   rating       1-5 (required)
 *   comment      free-form (optional, capped at 2000 chars upstream)
 *   nickname     public handle
 *   studentId    matches students.id when registered
 *   characterId  selected Threshing archetype
 */
function submitFeedback({ rating, comment, nickname, studentId, characterId }) {
  const r = Number(rating)
  if (!r || r < 1 || r > 5) throw new Error('rating must be 1-5')
  return _withScriptLock(function () {
    _ensureFeedbackSheet()
    const row = _appendRow(SHEETS.FEEDBACK, {
      id: _uuid(),
      submitted_at: _now(),
      student_id: studentId || '',
      nickname: (nickname || '').toLowerCase().trim(),
      character_id: characterId || '',
      rating: r,
      comment: String(comment || '').slice(0, 2000),
    })
    SpreadsheetApp.flush()
    return { ok: true, id: row.id }
  })
}

/**
 * Idempotently create the Feedback sheet + header row. Called by
 * submitFeedback so the workshop doesn't have to re-run doSetup()
 * after deploying this version.
 */
function _ensureFeedbackSheet() {
  const ss = _ss()
  let sheet = ss.getSheetByName(SHEETS.FEEDBACK)
  if (!sheet) {
    sheet = ss.insertSheet(SHEETS.FEEDBACK)
  }
  const headers = HEADERS[SHEETS.FEEDBACK]
  const lastCol = Math.max(sheet.getLastColumn(), 1)
  const existing = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
  if (existing.join('|') !== headers.join('|')) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    sheet.setFrozenRows(1)
  }
}

/**
 * Admin-only — delete feedback rows by id or by nickname.
 *   id        delete a single row by primary key
 *   nickname  delete EVERY row submitted under that nickname
 * If both provided, only the id is honoured.
 */
function deleteFeedback({ id, nickname }) {
  if (!id && !nickname) throw new Error('id or nickname required')
  return _withScriptLock(function () {
    _ensureFeedbackSheet()
    const sheet = _sheet(SHEETS.FEEDBACK)
    const all = _allRows(SHEETS.FEEDBACK)
    let removed = 0
    for (let i = all.length - 1; i >= 0; i--) {
      const row = all[i]
      const matchById = id && String(row.id) === String(id)
      const matchByNick = !id && nickname && String(row.nickname).toLowerCase() === String(nickname).toLowerCase()
      if (matchById || matchByNick) {
        sheet.deleteRow(i + 2)
        removed++
        if (id) break // by-id is unique, stop after first hit
      }
    }
    SpreadsheetApp.flush()
    return { ok: true, removed }
  })
}

/**
 * Admin-only — wipe ALL arena_runs rows for a given nickname, even
 * when the student record was already removed. Used to clean up
 * orphan arena rows that point at a nickname with no parent
 * student.
 */
function deleteArenaByNickname({ nickname }) {
  if (!nickname) throw new Error('nickname required')
  return _withScriptLock(function () {
    const nick = String(nickname).toLowerCase().trim()
    const sheet = _sheet(SHEETS.ARENA_RUNS)
    const all = _allRows(SHEETS.ARENA_RUNS)
    let removed = 0
    for (let i = all.length - 1; i >= 0; i--) {
      if (String(all[i].nickname).toLowerCase() === nick) {
        sheet.deleteRow(i + 2)
        removed++
      }
    }
    SpreadsheetApp.flush()
    return { ok: true, removed, nickname: nick }
  })
}

/**
 * Admin-only — list every feedback row. No auth wall on Apps Script
 * Web App so this is "obscurity over auth", same posture as the
 * other admin reads (listStudents, listDragons). If you need
 * real auth, route through a separate sheet view.
 */
function listFeedback() {
  const rows = _allRows(SHEETS.FEEDBACK)
  // Newest first
  rows.sort((a, b) => String(b.submitted_at).localeCompare(String(a.submitted_at)))
  return { feedback: rows }
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
      created_at: String(s.created_at || ''),
    }
  })
  // Top XP first. Tie-break cascade (no alphabetical anywhere — that's
  // unfair to participants whose nicknames start late in the alphabet):
  //   1. xp DESC                      — primary
  //   2. dragons_found DESC           — easter-egg engagement
  //   3. created_at ASC               — earlier registration wins ties
  //                                     (rewards early-bird signal,
  //                                     deterministic, defensible)
  rows.sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp
    if (b.dragons_found !== a.dragons_found) return b.dragons_found - a.dragons_found
    return a.created_at.localeCompare(b.created_at)
  })
  return { leaderboard: rows }
}

/**
 * Admin only — manually inject an arena run for a participant.
 * Used when their run failed to record (network glitch, browser
 * crash mid-flight) or to grant a make-up attempt.
 *
 * Required: nickname, score. Everything else defaults sensibly so
 * a facilitator can write `nickname=X&score=42` and the row is
 * valid against the rest of the aggregate pipeline.
 */
function addArenaRun(opts) {
  const nickname = opts.nickname
  const score = Number(opts.score)
  if (!nickname) throw new Error('nickname required')
  if (Number.isNaN(score)) throw new Error('score required and must be numeric')
  return _withScriptLock(function () {
    // Resolve student id by nickname for joinability
    const student = _allRows(SHEETS.STUDENTS).find(s =>
      String(s.nickname).toLowerCase() === String(nickname).toLowerCase()
    )
    if (!student) throw new Error('student not found for nickname: ' + nickname)

    // Pick the next run number — current max for this nickname + 1.
    const existing = _allRows(SHEETS.ARENA_RUNS).filter(r =>
      String(r.nickname).toLowerCase() === String(nickname).toLowerCase()
    )
    const nextRunNumber = Number(opts.runNumber) ||
      (existing.reduce((m, r) => Math.max(m, Number(r.run_number) || 0), 0) + 1)

    const row = {
      id: _uuid(),
      created_at: _now(),
      student_id: student.id,
      nickname: String(nickname).toLowerCase(),
      character_id: opts.characterId || student.character_id || '',
      run_number: nextRunNumber,
      score: score,
      stars_collected: Number(opts.starsCollected) || 0,
      fire_stars: Number(opts.fireStars) || 0,
      max_combo: Number(opts.maxCombo) || 0,
      walls_hit: Number(opts.wallsHit) || 0,
      pattern_hit: opts.patternHit === true || opts.patternHit === 'true',
      signet_used: opts.signetUsed !== false && opts.signetUsed !== 'false',
      ticks_alive: Number(opts.ticksAlive) || 0,
      bot_crashed: opts.botCrashed === true || opts.botCrashed === 'true',
      run_log_json: opts.runLogJson || '[]',
      bot_code_snapshot: opts.botCodeSnapshot || '',
    }
    _appendRow(SHEETS.ARENA_RUNS, row)
    SpreadsheetApp.flush()
    return { ok: true, id: row.id, run_number: nextRunNumber, score }
  })
}

/**
 * Admin only — bump a student's XP up or down by `delta`. Positive
 * value adds, negative value subtracts (floors at 0). Used to
 * correct mis-awards without resetting the whole student.
 */
function adjustXp({ studentId, nickname, delta }) {
  const d = Number(delta)
  if (Number.isNaN(d) || d === 0) throw new Error('delta required and must be non-zero numeric')
  return _withScriptLock(function () {
    let rowIdx = -1
    if (studentId) {
      rowIdx = _findRowIndex(SHEETS.STUDENTS, s => s.id === studentId)
    } else if (nickname) {
      rowIdx = _findRowIndex(SHEETS.STUDENTS, s => String(s.nickname).toLowerCase() === String(nickname).toLowerCase())
    } else {
      throw new Error('studentId or nickname required')
    }
    if (rowIdx < 0) throw new Error('student not found')
    const row = _allRows(SHEETS.STUDENTS)[rowIdx - 2]
    const current = Number(row.xp) || 0
    const next = Math.max(0, current + d)
    _updateRow(SHEETS.STUDENTS, rowIdx, { xp: next })
    SpreadsheetApp.flush()
    return { ok: true, previousXp: current, newXp: next, delta: d }
  })
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
