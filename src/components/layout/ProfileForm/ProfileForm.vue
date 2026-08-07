<template>
  <div class="mx-auto flex w-full max-w-3xl flex-col gap-6">
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-gray-500" for="profile-nome">Nome</label>

        <Input.Root id="profile-nome" v-model="nome" :rules="requiredRule">
          <Input.Control
            class="w-full rounded-xl border border-transparent bg-gray-100 px-4 py-3 text-base text-black outline-none transition-colors data-[focused]:border-blue-600 data-[state=invalid]:border-red-500"
          />
        </Input.Root>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-gray-500" for="profile-sobrenome">Sobrenome</label>

        <Input.Root id="profile-sobrenome" v-model="sobrenome" :rules="requiredRule">
          <Input.Control
            class="w-full rounded-xl border border-transparent bg-gray-100 px-4 py-3 text-base text-black outline-none transition-colors data-[focused]:border-blue-600 data-[state=invalid]:border-red-500"
          />
        </Input.Root>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-gray-500" for="profile-username">Username</label>

      <Input.Root id="profile-username" v-model="username" :rules="requiredRule">
        <Input.Control
          class="w-full rounded-xl border border-transparent bg-gray-100 px-4 py-3 text-base text-black outline-none transition-colors data-[focused]:border-blue-600 data-[state=invalid]:border-red-500"
        />
      </Input.Root>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-gray-500" for="profile-bio">Bio</label>

      <Input.Root id="profile-bio" v-model="bio">
        <Input.Control
          as="textarea"
          class="w-full resize-none rounded-xl border border-transparent bg-gray-100 px-4 py-3 text-base text-black outline-none transition-colors data-[focused]:border-blue-600"
          :maxlength="props.bioMaxLength"
          rows="4"
        />
      </Input.Root>

      <span class="self-end text-xs text-gray-400">{{ bio.length }}/{{ props.bioMaxLength }}</span>
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-gray-500" for="profile-email">email</label>

      <Input.Root
        id="profile-email"
        v-model="email"
        :rules="emailRules"
        type="email"
      >

        <Input.Control
          class="w-full rounded-xl border border-transparent bg-gray-100 px-4 py-3 text-base text-black outline-none transition-colors data-[focused]:border-blue-600 data-[state=invalid]:border-red-500"
        />
      </Input.Root>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { FormValidationRule } from '@vuetify/v0'
  import { Input } from '@vuetify/v0'
  import { computed } from 'vue'

  interface Props {
    nome: string
    sobrenome: string
    username: string
    email: string
    bio: string
    bioMaxLength?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    bioMaxLength: 150,
  })

  const emit = defineEmits<{
    (e: 'update:nome' | 'update:sobrenome' | 'update:username' | 'update:email' | 'update:bio', value: string): void
  }>()

  const nome = computed<string>({
    get: () => props.nome,
    set: value => emit('update:nome', value),
  })

  const sobrenome = computed<string>({
    get: () => props.sobrenome,
    set: value => emit('update:sobrenome', value),
  })

  const username = computed<string>({
    get: () => props.username,
    set: value => emit('update:username', value),
  })

  const email = computed<string>({
    get: () => props.email,
    set: value => emit('update:email', value),
  })

  const bio = computed<string>({
    get: () => props.bio,
    set: value => emit('update:bio', value),
  })

  const requiredRule: FormValidationRule[] = [
    value => (typeof value === 'string' && value.trim().length > 0) || 'Campo obrigatório',
  ]

  const emailRules: FormValidationRule[] = [
    value =>
      !value || (typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) || 'Digite um e-mail válido',
  ]
</script>
