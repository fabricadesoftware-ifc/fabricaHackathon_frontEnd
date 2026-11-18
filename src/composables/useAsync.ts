import { onScopeDispose, ref, type Ref } from 'vue'
import { startNavigationLoading } from '@/composables/useNavigationLoading'
import { ApiError } from '@/services/http'

export interface AsyncState<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<ApiError | null>
  run: () => Promise<void>
}

/** Executa uma chamada e expõe data/loading/error para as telas. */
export function useAsync<T> (fn: () => Promise<T>, immediate = true): AsyncState<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  let requestId = 0
  let finishLoading: (() => void) | null = null

  onScopeDispose(() => {
    requestId++
    finishLoading?.()
    finishLoading = null
  })

  async function run () {
    const currentRequest = ++requestId
    const finishPrevious = finishLoading
    finishLoading = startNavigationLoading()
    finishPrevious?.()
    loading.value = true
    error.value = null
    try {
      const result = await fn()
      if (currentRequest === requestId) {
        data.value = result
      }
    } catch (error_) {
      if (currentRequest === requestId) {
        error.value = error_ instanceof ApiError
          ? error_
          : new ApiError('client', error_ instanceof Error ? error_.message : 'Erro inesperado.')
      }
    } finally {
      if (currentRequest === requestId) {
        loading.value = false
        finishLoading?.()
        finishLoading = null
      }
    }
  }

  if (immediate) {
    run()
  }
  return { data, loading, error, run }
}
