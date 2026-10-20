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