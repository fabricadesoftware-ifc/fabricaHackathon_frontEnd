/** "2026-10-21" -> "21/10/2026". Devolve o texto original se não for uma data válida. */
export function formatarData (iso: string | null | undefined): string {
  if (!iso) {
    return ''
  }
  const [ano, mes, dia] = iso.slice(0, 10).split('-')
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : iso
}

/** "2026-10-21T14:00:00-03:00" -> "21/10/2026 14:00". */
export function formatarDataHora (iso: string | null | undefined): string {
  if (!iso) {
    return ''
  }
  const data = new Date(iso)
  if (Number.isNaN(data.getTime())) {
    return iso
  }
  return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

/** Heurística só para avisar na tela (a pontuação real é calculada pela API). */
export function pareceLocal (link: string): boolean {
  const texto = link.trim()
  if (!texto) {
    return false
  }
  let host: string
  try {
    host = new URL(/^https?:\/\//i.test(texto) ? texto : `http://${texto}`).hostname.toLowerCase()
  } catch {
    return false
  }
  if (host === 'localhost' || host.startsWith('127.') || host === '[::1]') {
    return true
  }
  const ip = host.match(/^(\d+)\.(\d+)\.\d+\.\d+$/)
  if (ip) {
    const a = Number(ip[1])
    const b = Number(ip[2])
    return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
  }
  return /\.(local|internal|lan|home)$/.test(host) || !host.includes('.')
}
