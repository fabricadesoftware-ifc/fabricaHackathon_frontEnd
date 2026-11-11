/** Preserva URLs da API e resolve somente caminhos de mídia relativos. */
export function resolveMediaUrl (value: string): string {
  const source = value?.trim() ?? ''
  if (!source || /^(https?:|data:|blob:|\/\/)/i.test(source) || source.startsWith('/images/')) {
    return source
  }

  const apiUrl = (window as unknown as { __APP_CONFIG__?: { API_URL?: string } })
    .__APP_CONFIG__
    ?.API_URL || import.meta.env.VITE_API_URL

  try {
    return new URL(source, apiUrl).href
  } catch {
    return source
  }
}
