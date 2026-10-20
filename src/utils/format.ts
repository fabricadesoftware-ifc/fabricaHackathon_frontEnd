/** "2026-10-21" -> "21/10/2026". Devolve o texto original se não for uma data válida. */
export function formatarData (iso: string | null | undefined): string {
  if (!iso) {
    return ''
  }
  const [ano, mes, dia] = iso.slice(0, 10).split('-')
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : iso
}
