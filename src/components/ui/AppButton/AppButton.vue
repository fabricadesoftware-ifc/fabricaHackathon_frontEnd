<script setup lang="ts">
import { computed } from "vue";

type Variant = "primary" | "text" | "secondary";

const props = defineProps<{
  variant: Variant;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: string;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

function handleClick() {
  if (props.disabled || props.loading) return;
  emit("click");
}

const base =
  "py-[22.5px] px-4.5 rounded-lg text-[16px] font-medium normal-case transition-all duration-150 ease-in-out";

const buttonClasses = computed(() => {
  const variants: Record<Variant, string> = {
  primary: "bg-[#2563EB] text-white hover:bg-[#2054C6]",
  text: "bg-transparent text-[#111827] shadow-none hover:bg-gray-200",
  secondary: "bg-white text-[#4B5563] hover:bg-gray-50 border border-gray-200",
};

  return `${base} ${variants[props.variant]}`;
});
</script>

<template>
  <v-btn
    v-if="props.iconPosition == 'left'"
    :class="buttonClasses"
    :disabled="props.disabled"
    @click="handleClick"
  >
    <span class="inline-flex items-center justify-center gap-1.5">
      <span
        class="text-[24px] leading-none font-light transform -translate-y-[1.5px] select-none"
      >
        {{ props.icon }}
      </span>
      <span class="leading-none">{{ props.label }}</span>
    </span>
  </v-btn>
  <v-btn
    v-else-if="props.iconPosition == 'right'"
    :class="buttonClasses"
    :disabled="props.disabled"
    @click="handleClick"
  >
    <span class="inline-flex items-center justify-center gap-1.5">
      <span class="leading-none">{{ props.label }}</span>
      <span
        class="text-[24px] leading-none font-light transform -translate-y-[1.5px] select-none"
      >
        {{ props.icon }}
      </span>
    </span>
  </v-btn>
  <v-btn
    v-else-if="!props.iconPosition && props.icon"
    :class="buttonClasses"
    :disabled="true"
    @click="handleClick"
  >
    O icone foi definido mas não foi posicionado. escolha iconPosition="left" ou
    iconPosition="right"!
  </v-btn>
  <v-btn
    v-else
    :class="buttonClasses"
    :disabled="props.disabled"
    @click="handleClick"
  >
    {{ props.label }}
  </v-btn>
</template>
