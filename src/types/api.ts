/** Resposta paginada padrão do back-end. */
export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type PageParams = {
  page?: number
  page_size?: number
}

/** Mensagens de erro por campo, ex.: { email: ['Já cadastrado'] }. */
export type FieldErrors = Record<string, string[]>
