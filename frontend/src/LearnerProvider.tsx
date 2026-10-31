import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_LEARNER_STATE,
  normalizeLearnerState,
  type LearnerState,
} from '../../shared/learner-state'
import { fetchLearnerState, saveLearnerState } from './api'
import { LearnerContext } from './learner-context'
const CACHE_KEY = 'saathi-learner-state'

function cacheState(state: LearnerState): boolean {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function LearnerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(DEFAULT_LEARNER_STATE)
  const stateRef = useRef(state)
  const writeQueue = useRef(Promise.resolve())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [localStorageError, setLocalStorageError] = useState(false)

  const loadRemote = useCallback(async () => {
    const remote = await fetchLearnerState()
    stateRef.current = remote
    setState(remote)
    setSaveError(false)
    setLoadError(false)
    setLocalStorageError(!cacheState(remote))
  }, [])

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const cached = window.localStorage.getItem(CACHE_KEY)
        if (cached) {
          const parsed: unknown = JSON.parse(cached)
          const normalized = normalizeLearnerState(parsed)
          if (!normalized) {
            throw new Error('Saved browser preferences use an unsupported format.')
          }
          if (active) {
            stateRef.current = normalized
            setState(normalized)
          }
        }
      } catch {
        if (active) setLocalStorageError(true)
      }

      try {
        await loadRemote()
      } catch {
        if (active) setLoadError(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [loadRemote])

  const persist = useCallback(async (next: LearnerState) => {
    setSaving(true)
    const queuedWrite = writeQueue.current
      .catch(() => undefined)
      .then(() => saveLearnerState(next))
    writeQueue.current = queuedWrite.then(
      () => undefined,
      () => undefined,
    )

    try {
      const saved = await queuedWrite
      stateRef.current = saved
      setState(saved)
      setSaveError(false)
      setLoadError(false)
      setLocalStorageError(!cacheState(saved))
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }, [])

  const update = useCallback(
    async (patch: Partial<LearnerState>) => {
      const current = stateRef.current
      const next: LearnerState = {
        ...current,
        ...patch,
        accessibility: patch.accessibility ?? current.accessibility,
      }
      stateRef.current = next
      setState(next)
      if (!cacheState(next)) setLocalStorageError(true)
      await persist(next)
    },
    [persist],
  )

  const retrySave = useCallback(async () => {
    await persist(stateRef.current)
  }, [persist])

  const retryLoad = useCallback(async () => {
    setLoading(true)
    try {
      await loadRemote()
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [loadRemote])

  return (
    <LearnerContext.Provider
      value={{
        state,
        loading,
        saving,
        saveError,
        loadError,
        localStorageError,
        update,
        retrySave,
        retryLoad,
      }}
    >
      {children}
    </LearnerContext.Provider>
  )
}
