// Prepara imagens antes do envio: reduz o tamanho para que o upload não seja
// barrado por limites de corpo da requisição (ex.: nginx do servidor, ~1 MB).

const MAX_LADO = 1600
const MAX_BYTES = 900 * 1024

function carregar(arquivo: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(arquivo)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Não foi possível ler a imagem.')) }
    img.src = url
  })
}

function paraBlob(canvas: HTMLCanvasElement, tipo: string, qualidade: number): Promise<Blob | null> {
  return new Promise(resolve => canvas.toBlob(resolve, tipo, qualidade))
}

/**
 * Redimensiona (lado maior ≤ 1600 px) e comprime a imagem quando ela passa de ~900 KB.
 * Imagens pequenas seguem intactas. Se algo falhar, devolve o arquivo original.
 */
export async function prepararImagem(arquivo: File): Promise<File> {
  if (!arquivo.type.startsWith('image/')) return arquivo
  if (arquivo.size <= MAX_BYTES) return arquivo

  try {
    const img = await carregar(arquivo)
    const base = Math.min(1, MAX_LADO / Math.max(img.width, img.height))

    // Tenta qualidades decrescentes e, se preciso, reduz também as dimensões.
    // WebP mantém transparência e comprime bem; o back aceita JPEG, PNG e WebP.
    for (const fator of [1, 0.75, 0.5, 0.35]) {
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(img.width * base * fator))
      canvas.height = Math.max(1, Math.round(img.height * base * fator))
      const ctx = canvas.getContext('2d')
      if (!ctx) return arquivo
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      for (const qualidade of [0.85, 0.7, 0.55, 0.4]) {
        const blob = await paraBlob(canvas, 'image/webp', qualidade)
        if (blob && blob.type === 'image/webp' && blob.size <= MAX_BYTES) {
          return new File([blob], arquivo.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' })
        }
      }
    }
  } catch {
    // cai no original
  }
  return arquivo
}
