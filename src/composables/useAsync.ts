import { ref, type Ref } from 'vue'
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

  async function run () {
    loading.value = true
    error.value = null
    try {
      data.value = await fn()
    } catch (error_) {
      error.value = error_ instanceof ApiError
        ? error_
        : new ApiError('client', error_ instanceof Error ? error_.message : 'Erro inesperado.')
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    run()
  }
  return { data, loading, error, run }
}
