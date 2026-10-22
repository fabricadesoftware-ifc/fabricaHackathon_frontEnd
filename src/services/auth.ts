import { http } from '@/services/http'

import type {
  Usuario,
  LoginResponse,
  RegistroPayload,
  RegistroResponse,
} from '@/types/usuario'

export function login(username: string, password: string) {
  return http.post<LoginResponse>('/token/', {
    username,
    password,
  })
}

export function refreshToken(refresh: string) {
  return http.post<{ access: string }>('/token/refresh/', {
    refresh,
  })
}

export function registrarUsuario(payload: RegistroPayload) {
  return http.post<RegistroResponse>('/auth/registro/', payload)
}

export function obterUsuarioAtual() {
  return http.get<Usuario>('/me/')
}
// Atualiza o próprio perfil (nome, sobrenome e/ou foto). Com foto, usa multipart.
export function atualizarPerfil(dados: {
  first_name?: string
  last_name?: string
  foto?: File | null
}) {
  const { foto, ...texto } = dados

  if (foto) {
    const form = new FormData()
    for (const [chave, valor] of Object.entries(texto)) {
      if (valor !== undefined) form.append(chave, valor)
    }
    form.append('foto_perfil', foto)
    return http.patch<Usuario>('/me/', form)
  }

  return http.patch<Usuario>('/me/', texto)
}
