import type { FieldErrors } from '@/types'

const TOKEN_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'

// Identifica onde os tokens estão armazenados.
function getAuthStorage(): Storage {
  if (
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem(REFRESH_KEY)
  ) {
    return localStorage
  }

  return sessionStorage
}

// Recupera o access token.
export function getToken(): string | null {
  return getAuthStorage().getItem(TOKEN_KEY)
}

// Salva ou remove o access token.
export function setToken(token: string | null) {
  if (token) {
    getAuthStorage().setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  }
}

// Recupera o refresh token.
export function getRefreshToken(): string | null {
  return getAuthStorage().getItem(REFRESH_KEY)
}

// Salva ou remove o refresh token.
export function setRefreshToken(token: string | null) {
  if (token) {
    getAuthStorage().setItem(REFRESH_KEY, token)
  } else {
    localStorage.removeItem(REFRESH_KEY)
    sessionStorage.removeItem(REFRESH_KEY)
  }
}

// Salva os tokens conforme a opção "Lembrar-me".
export function setTokens(
  tokens: { access: string; refresh: string } | null,
  rememberMe = true,
) {
  // Limpa tokens anteriores.
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)

  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_KEY)

  if (!tokens) return

  const storage = rememberMe ? localStorage : sessionStorage

  storage.setItem(TOKEN_KEY, tokens.access)
  storage.setItem(REFRESH_KEY, tokens.refresh)
}

// Evita múltiplas tentativas de renovação simultâneas.
let refreshPromise: Promise<string | null> | null = null

async function renovarAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken()

  if (!refresh) return null

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(buildUrl('/token/refresh/'), {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh }),
        })

        // Refresh expirado ou inválido.
        if (!response.ok) {
          if (
            response.status === 400 ||
            response.status === 401
          ) {
            setTokens(null)
          }

          return null
        }

        const data: { access: string; refresh?: string } =
          await response.json()

        if (!data.access) {
          return null
        }

        // Mantém o armazenamento escolhido no login.
        const storage = getAuthStorage()

        storage.setItem(TOKEN_KEY, data.access)

        // Suporta rotação de refresh token, se habilitada no backend.
        if (data.refresh) {
          storage.setItem(REFRESH_KEY, data.refresh)
        }

        return data.access
      } catch {
        // Falhas de rede não invalidam necessariamente a sessão.
        return null
      }
    })().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

export type ApiErrorKind = 'network' | 'client' | 'server'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status: number | null

  // Mensagens de validação por campo.
  readonly fields: FieldErrors

  constructor(
    kind: ApiErrorKind,
    message: string,
    status: number | null = null,
    fields: FieldErrors = {},
  ) {
    super(message)

    this.name = 'ApiError'
    this.kind = kind
    this.status = status
    this.fields = fields
  }

  // Ranking indisponível antes da finalização da edição.
  get isRankingIndisponivel(): boolean {
    return (
      this.status === 403 &&
      this.message.includes('ranking')
    )
  }
}

type Query = Record<
  string,
  string | number | boolean | null | undefined
>

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  query?: Query
  body?: unknown
  signal?: AbortSignal
}

// URL base: /config.js (gerado pelo container em produção) ou .env (desenvolvimento).
function baseUrl(): string {
  const url =
    (window as unknown as { __APP_CONFIG__?: { API_URL?: string } })
      .__APP_CONFIG__?.API_URL || import.meta.env.VITE_API_URL

  if (!url) {
    throw new Error(
      'VITE_API_URL não está definida. Copie .env.example para .env.',
    )
  }

  return url.replace(/\/+$/, '')
}

// Aceita caminhos relativos e URLs absolutas da paginação.
export function buildUrl(
  path: string,
  query?: Query,
): string {
  const url = /^https?:\/\//i.test(path)
    ? new URL(path)
    : new URL(
        baseUrl() + '/' + path.replace(/^\/+/, ''),
      )

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

// Extrai mensagens de erro retornadas pela API.
function extrairErros(
  data: unknown,
): {
  message: string | null
  fields: FieldErrors
} {
  const fields: FieldErrors = {}

  if (!data || typeof data !== 'object') {
    return {
      message: null,
      fields,
    }
  }

  const obj = data as Record<string, unknown>

  const message =
    typeof obj.detail === 'string'
      ? obj.detail
      : null

  // Achata erros aninhados (ex.: { projeto: { nome_projeto: [...] } }).
  const coletar = (valor: unknown, chave: string) => {
    if (Array.isArray(valor)) {
      const textos = valor.flatMap(item =>
        item && typeof item === 'object'
          ? Object.values(item).flat().map(String)
          : [String(item)],
      )
      if (textos.length) fields[chave] = [...(fields[chave] ?? []), ...textos]
    } else if (typeof valor === 'string') {
      fields[chave] = [...(fields[chave] ?? []), valor]
    } else if (valor && typeof valor === 'object') {
      for (const [sub, v] of Object.entries(valor)) coletar(v, sub)
    }
  }

  for (const [key, value] of Object.entries(obj)) {
    if (key === 'detail') continue
    coletar(value, key)
  }

  return {
    message,
    fields,
  }
}

// Realiza as requisições HTTP.
export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  // FormData (upload): o navegador define o Content-Type com o boundary.
  const isFormData = options.body instanceof FormData

  if (options.body !== undefined && !isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  // Adiciona JWT quando existir.
  const token = getToken()

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const url = buildUrl(path, options.query)

  // Reutiliza os dados da requisição original.
  const fetchOptions: RequestInit = {
    method: options.method ?? 'GET',
    headers,
    body:
      options.body === undefined
        ? undefined
        : (isFormData ? (options.body as FormData) : JSON.stringify(options.body)),
    signal: options.signal,
  }

  let response: Response

  try {
    response = await fetch(url, fetchOptions)
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === 'AbortError'
    ) {
      throw error
    }

    throw new ApiError(
      'network',
      'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
    )
  }

  // Renova o JWT se a API retornar 401.
  if (
    response.status === 401 &&
    getRefreshToken() &&
    !path.includes('/token/')
  ) {
    // Se outra requisição já renovou o token, utiliza o novo.
    // Caso contrário, inicia uma renovação.
    const currentToken = getToken()

    const newToken =
      currentToken && currentToken !== token
        ? currentToken
        : await renovarAccessToken()

    if (newToken) {
      headers.Authorization = `Bearer ${newToken}`

      try {
        // Repete a requisição original uma única vez.
        response = await fetch(url, fetchOptions)
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          throw error
        }

        throw new ApiError(
          'network',
          'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
        )
      }
    }
  }

  // Verifica o status final, inclusive após a repetição.
  if (response.status === 204) {
    return undefined as T
  }

  const data: unknown = await response
    .json()
    .catch(() => null)

  if (response.ok) {
    return data as T
  }

  // Erros internos do servidor.
  if (response.status >= 500) {
    throw new ApiError(
      'server',
      'Algo deu errado no servidor. Tente novamente em instantes.',
      response.status,
    )
  }

  // Erros de validação e autenticação.
  const { message, fields } = extrairErros(data)

  const fallback =
    response.status === 401
      ? 'Sua sessão expirou. Entre novamente.'
      : response.status === 404
        ? 'Recurso não encontrado.'
        : 'Não foi possível concluir a solicitação.'

  throw new ApiError(
    'client',
    message ?? fallback,
    response.status,
    fields,
  )
}

// Métodos HTTP disponíveis.
export const http = {
  get: <T>(
    path: string,
    query?: Query,
    signal?: AbortSignal,
  ) =>
    request<T>(path, {
      query,
      signal,
    }),

  post: <T>(
    path: string,
    body?: unknown,
  ) =>
    request<T>(path, {
      method: 'POST',
      body,
    }),

  put: <T>(
    path: string,
    body?: unknown,
  ) =>
    request<T>(path, {
      method: 'PUT',
      body,
    }),

  patch: <T>(
    path: string,
    body?: unknown,
  ) =>
    request<T>(path, {
      method: 'PATCH',
      body,
    }),

  delete: <T>(path: string) =>
    request<T>(path, {
      method: 'DELETE',
    }),
}