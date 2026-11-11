<template>
  <div
    aria-label="Jornada ilustrativa de um hackathon: inscrição, equipe, projeto e avaliação, com um notebook de programação em 24 horas."
    class="login-illustration w-full max-w-[540px]"
    role="img"
  >
    <div aria-hidden="true" class="steps grid-cols-4 relative grid mb-[18px] text-center">
      <div class="step relative flex items-center flex-col gap-[7px] text-app-ink-muted text-[12px] font-medium">
        <span class="step-icon flex w-[40px] h-[40px] items-center justify-center border-[1px] border-app-art-icon-line rounded-[10px] bg-app-surface-plain text-app-brand-text text-[20px]"><span class="mdi mdi-account-plus-outline" /></span>
        <span>Inscrição</span>
      </div>

      <div class="step relative flex items-center flex-col gap-[7px] text-app-ink-muted text-[12px] font-medium">
        <span class="step-icon flex w-[40px] h-[40px] items-center justify-center border-[1px] border-app-art-icon-line rounded-[10px] bg-app-surface-plain text-app-brand-text text-[20px]"><span class="mdi mdi-account-group-outline" /></span>
        <span>Equipe</span>
      </div>

      <div class="step relative flex items-center flex-col gap-[7px] text-app-ink-muted text-[12px] font-medium">
        <span class="step-icon flex w-[40px] h-[40px] items-center justify-center border-[1px] border-app-art-icon-line rounded-[10px] bg-app-surface-plain text-app-brand-text text-[20px]"><span class="mdi mdi-code-braces" /></span>
        <span>Projeto</span>
      </div>

      <div class="step relative flex items-center flex-col gap-[7px] text-app-ink-muted text-[12px] font-medium">
        <span class="step-icon flex w-[40px] h-[40px] items-center justify-center border-[1px] border-app-art-icon-line rounded-[10px] bg-app-surface-plain text-app-brand-text text-[20px]"><span class="mdi mdi-check-decagram-outline" /></span>
        <span>Avaliação</span>
      </div>
    </div>

    <svg
      aria-hidden="true"
      class="notebook block w-full h-auto"
      fill="none"
      viewBox="0 0 540 238"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        fill="var(--app-art-frame)"
        height="190"
        rx="13"
        width="432"
        x="54"
        y="10"
      />

      <rect
        fill="var(--app-art-paper)"
        height="176"
        rx="8"
        width="418"
        x="61"
        y="17"
      />

      <path d="M61 25a8 8 0 0 1 8-8h402a8 8 0 0 1 8 8v24H61V25Z" fill="var(--app-art-toolbar)" />
      <circle cx="81" cy="33" fill="var(--app-art-dot)" r="4" />
      <circle cx="96" cy="33" fill="var(--app-art-dot-muted)" r="4" />
      <circle cx="111" cy="33" fill="var(--app-art-dot-muted)" r="4" />

      <rect
        fill="var(--app-art-address)"
        height="12"
        rx="6"
        width="204"
        x="168"
        y="27"
      />

      <text
        fill="var(--app-brand-accent)"
        font-family="ui-monospace, SFMono-Regular, Consolas, monospace"
        font-size="19"
        font-weight="700"
        x="83"
        y="82"
      >&lt;/&gt;</text>

      <rect
        fill="var(--app-art-code)"
        height="7"
        rx="3.5"
        width="135"
        x="83"
        y="98"
      />

      <rect
        fill="var(--app-art-code-muted)"
        height="7"
        rx="3.5"
        width="53"
        x="226"
        y="98"
      />

      <rect
        fill="var(--app-art-code-soft)"
        height="7"
        rx="3.5"
        width="67"
        x="99"
        y="116"
      />

      <rect
        fill="var(--app-art-code-accent)"
        height="7"
        rx="3.5"
        width="123"
        x="174"
        y="116"
      />

      <rect
        fill="var(--app-art-code)"
        height="7"
        rx="3.5"
        width="104"
        x="99"
        y="134"
      />

      <rect
        fill="var(--app-art-code-soft)"
        height="7"
        rx="3.5"
        width="55"
        x="211"
        y="134"
      />

      <rect
        fill="var(--app-art-code-muted)"
        height="7"
        rx="3.5"
        width="75"
        x="83"
        y="152"
      />

      <rect
        fill="var(--app-art-code-accent)"
        height="7"
        rx="3.5"
        width="111"
        x="166"
        y="152"
      />

      <rect
        fill="var(--app-art-badge)"
        height="102"
        rx="10"
        stroke="var(--app-art-panel-line)"
        width="118"
        x="329"
        y="67"
      />

      <circle
        cx="388"
        cy="105"
        fill="var(--app-art-white)"
        r="24"
        stroke="var(--app-art-clock-line)"
        stroke-width="2"
      />

      <path
        d="M388 92v14l9 6"
        stroke="var(--app-brand-accent)"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="3"
      />

      <text
        fill="var(--app-brand-accent)"
        font-family="Roboto, Arial, sans-serif"
        font-size="16"
        font-weight="700"
        text-anchor="middle"
        x="388"
        y="153"
      >24H</text>

      <path d="M33 201h474l-20 22a13 13 0 0 1-10 4H63a13 13 0 0 1-10-4l-20-22Z" fill="var(--app-art-base)" />
      <path d="M33 201h474l-7 8H40l-7-8Z" fill="var(--app-art-base-light)" />
      <path d="M225 201h90l-7 8h-76l-7-8Z" fill="var(--app-art-base-shadow)" />
    </svg>
  </div>
</template>

<style scoped>
.steps::before {
  position: absolute;
  top: 20px;
  right: 12.5%;
  left: 12.5%;
  height: 1px;
  background: var(--app-art-connector);
  content: '';
}
</style>
