import { existsSync } from 'node:fs'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import initSqlJs, { type Database } from 'sql.js'
import {
  DEFAULT_LEARNER_STATE,
  normalizeLearnerState,
  type LearnerState,
} from '../shared/learner-state.js'

const dataDirectory = resolve(process.env.SAATHI_DATA_DIR ?? 'data')
const databasePath = resolve(dataDirectory, 'saathi.sqlite')
const temporaryPath = resolve(dataDirectory, 'saathi.sqlite.tmp')

export async function createLearnerDatabase() {
  await mkdir(dataDirectory, { recursive: true })
  let writeQueue = Promise.resolve()

  async function persist(currentDatabase: Database) {
    const bytes = Buffer.from(currentDatabase.export())
    const write = writeQueue.then(async () => {
      await writeFile(temporaryPath, bytes)
      await rename(temporaryPath, databasePath)
    })
    writeQueue = write.catch(() => undefined)
    await write
  }

  const SQL = await initSqlJs({
    locateFile: (fileName) =>
      resolve(process.cwd(), 'node_modules', 'sql.js', 'dist', fileName),
  })

  const existingBytes = existsSync(databasePath)
    ? new Uint8Array(await readFile(databasePath))
    : undefined
  const database = existingBytes ? new SQL.Database(existingBytes) : new SQL.Database()
  database.run(
    'CREATE TABLE IF NOT EXISTS learner_state (id INTEGER PRIMARY KEY CHECK (id = 1), state_json TEXT NOT NULL)',
  )

  const rows = database.exec('SELECT state_json FROM learner_state WHERE id = 1')
  if (!rows[0]?.values[0]?.[0]) {
    database.run('INSERT INTO learner_state (id, state_json) VALUES (1, ?)', [
      JSON.stringify(DEFAULT_LEARNER_STATE),
    ])
    await persist(database)
  } else if (typeof rows[0].values[0][0] !== 'string') {
    throw new Error('The saved learner state is not valid text.')
  } else {
    const savedState: unknown = JSON.parse(rows[0].values[0][0])
    const migratedState = normalizeLearnerState(savedState)
    if (!migratedState) {
      throw new Error('The saved learner state has an unsupported format.')
    }
    if (!('lessonProgress' in (savedState as object))) {
      database.run('UPDATE learner_state SET state_json = ? WHERE id = 1', [
        JSON.stringify(migratedState),
      ])
      await persist(database)
    }
  }

  function getState(): LearnerState {
    const result = database.exec('SELECT state_json FROM learner_state WHERE id = 1')
    const value = result[0]?.values[0]?.[0]
    if (typeof value !== 'string') {
      throw new Error('The learner state could not be read from SQLite.')
    }

    const state: unknown = JSON.parse(value)
    const normalized = normalizeLearnerState(state)
    if (!normalized) {
      throw new Error('The saved learner state has an unsupported format.')
    }
    return normalized
  }

  async function saveState(state: LearnerState): Promise<LearnerState> {
    database.run(
      'INSERT INTO learner_state (id, state_json) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET state_json = excluded.state_json',
      [JSON.stringify(state)],
    )
    await persist(database)
    return getState()
  }

  return { getState, saveState }
}
