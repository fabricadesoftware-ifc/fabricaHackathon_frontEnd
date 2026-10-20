import type { FieldErrors } from '@/types'

const TOKEN_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'

export function getToken (): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken (token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function getRefreshToken (): string | null {
  return localStorage.getItem(REFRESH_KEY)
}

export function setRefreshToken (token: string | null) {
  if (token) {
    localStorage.setItem(REFRESH_KEY, token)
  } else {
    localStorage.removeItem(REFRESH_KEY)
  }
}

/** Guarda o par access/refresh (ou limpa ambos com null). */
export function setTokens (tokens: { access: string, refresh: string } | null) {
  setToken(tokens?.access ?? null)
  setRefreshToken(tokens?.refresh ?? null)
}

export type ApiErrorKind = 'network' | 'client' | 'server'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status: number | null
  /** Mensagens por campo (4xx de validação). */
  readonly fields: FieldErrors

  constructor (kind: ApiErrorKind, message: string, status: number | null = null, fields: FieldErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
    this.fields = fields
  }

  /** 403 do ranking antes de a edição ser FINALIZADO: não é erro "de verdade". */
  get isRankingIndisponivel (): boolean {
    return this.status === 403 && this.message.includes('ranking')
  }
}

type Query = Record<string, string | number | boolean | null | undefined>

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  query?: Query
  body?: unknown
  signal?: AbortSignal
}

function baseUrl (): string {
  const url = import.meta.env.VITE_API_URL
  if (!url) {
    throw new Error('VITE_API_URL não está definida. Copie .env.example para .env.')
  }
  return url.replace(/\/+$/, '')
}

/** Aceita caminho relativo ("/edicoes/") ou URL absoluta (ex.: campo `next` da paginação). */
export function buildUrl (path: string, query?: Query): string {
  const url = /^https?:\/\//i.test(path) ? new URL(path) : new URL(baseUrl() + '/' + path.replace(/^\/+/, ''))
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

function extrairErros (data: unknown): { message: string | null, fields: FieldErrors } {
  const fields: FieldErrors = {}
  if (!data || typeof data !== 'object') {
    return { message: null, fields }
  }

  const obj = data as Record<string, unknown>
  const message = typeof obj.detail === 'string' ? obj.detail : null

  for (const [key, value] of Object.entries(obj)) {
    if (key === 'detail') {
      continue
    }
    if (Array.isArray(value)) {
      fields[key] = value.map(String)
    } else if (typeof value === 'string') {
      fields[key] = [value]
    }
  }
  return { message, fields }
}

export async function request<T> (path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    throw new ApiError('network', 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.')
  }

  if (response.status === 204) {
    return undefined as T
  }

  const data: unknown = await response.json().catch(() => null)

  if (response.ok) {
    return data as T
  }

  if (response.status >= 500) {
    throw new ApiError('server', 'Algo deu errado no servidor. Tente novamente em instantes.', response.status)
  }

  const { message, fields } = extrairErros(data)
  const fallback = response.status === 401
    ? 'Sua sessão expirou. Entre novamente.'
    : (response.status === 404
        ? 'Recurso não encontrado.'
        : 'Não foi possível concluir a solicitação.')
  throw new ApiError('client', message ?? fallback, response.status, fields)
}

export const http = {
  get: <T>(path: string, query?: Query, signal?: AbortSignal) => request<T>(path, { query, signal }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
