<template>
  <div
    aria-label="Jornada ilustrativa de um hackathon: inscrição, equipe, projeto e avaliação, com um notebook de programação em 24 horas."
    class="login-illustration w-full max-w-[540px]"
    role="img"
  >
    <div aria-hidden="true" class="steps grid-cols-4 relative grid mb-[18px] text-center">
      <div class="step relative flex items-center flex-col gap-[7px] text-[#64748b] text-[12px] font-medium">
        <span class="step-icon flex w-[40px] h-[40px] items-center justify-center border-[1px] border-[#c9dcf6] rounded-[10px] bg-[#fff] text-[#2563eb] text-[20px]"><span class="mdi mdi-account-plus-outline" /></span>
        <span>Inscrição</span>
      </div>

      <div class="step relative flex items-center flex-col gap-[7px] text-[#64748b] text-[12px] font-medium">
        <span class="step-icon flex w-[40px] h-[40px] items-center justify-center border-[1px] border-[#c9dcf6] rounded-[10px] bg-[#fff] text-[#2563eb] text-[20px]"><span class="mdi mdi-account-group-outline" /></span>
        <span>Equipe</span>
      </div>

      <div class="step relative flex items-center flex-col gap-[7px] text-[#64748b] text-[12px] font-medium">
        <span class="step-icon flex w-[40px] h-[40px] items-center justify-center border-[1px] border-[#c9dcf6] rounded-[10px] bg-[#fff] text-[#2563eb] text-[20px]"><span class="mdi mdi-code-braces" /></span>
        <span>Projeto</span>
      </div>

      <div class="step relative flex items-center flex-col gap-[7px] text-[#64748b] text-[12px] font-medium">
        <span class="step-icon flex w-[40px] h-[40px] items-center justify-center border-[1px] border-[#c9dcf6] rounded-[10px] bg-[#fff] text-[#2563eb] text-[20px]"><span class="mdi mdi-check-decagram-outline" /></span>
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
        fill="#233653"
        height="190"
        rx="13"
        width="432"
        x="54"
        y="10"
      />

      <rect
        fill="#F8FBFF"
        height="176"
        rx="8"
        width="418"
        x="61"
        y="17"
      />

      <path d="M61 25a8 8 0 0 1 8-8h402a8 8 0 0 1 8 8v24H61V25Z" fill="#EAF1FB" />
      <circle cx="81" cy="33" fill="#9EB6D7" r="4" />
      <circle cx="96" cy="33" fill="#B9CAE2" r="4" />
      <circle cx="111" cy="33" fill="#B9CAE2" r="4" />

      <rect
        fill="#D8E5F6"
        height="12"
        rx="6"
        width="204"
        x="168"
        y="27"
      />

      <text
        fill="#2563EB"
        font-family="ui-monospace, SFMono-Regular, Consolas, monospace"
        font-size="19"
        font-weight="700"
        x="83"
        y="82"
      >&lt;/&gt;</text>

      <rect
        fill="#91AFE1"
        height="7"
        rx="3.5"
        width="135"
        x="83"
        y="98"
      />

      <rect
        fill="#CFDDF0"
        height="7"
        rx="3.5"
        width="53"
        x="226"
        y="98"
      />

      <rect
        fill="#D2E0F2"
        height="7"
        rx="3.5"
        width="67"
        x="99"
        y="116"
      />

      <rect
        fill="#A7C3EC"
        height="7"
        rx="3.5"
        width="123"
        x="174"
        y="116"
      />

      <rect
        fill="#91AFE1"
        height="7"
        rx="3.5"
        width="104"
        x="99"
        y="134"
      />

      <rect
        fill="#D2E0F2"
        height="7"
        rx="3.5"
        width="55"
        x="211"
        y="134"
      />

      <rect
        fill="#CFDDF0"
        height="7"
        rx="3.5"
        width="75"
        x="83"
        y="152"
      />

      <rect
        fill="#A7C3EC"
        height="7"
        rx="3.5"
        width="111"
        x="166"
        y="152"
      />

      <rect
        fill="#EAF2FF"
        height="102"
        rx="10"
        stroke="#CEDFF8"
        width="118"
        x="329"
        y="67"
      />

      <circle
        cx="388"
        cy="105"
        fill="white"
        r="24"
        stroke="#BBD3F7"
        stroke-width="2"
      />

      <path
        d="M388 92v14l9 6"
        stroke="#2563EB"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="3"
      />

      <text
        fill="#2563EB"
        font-family="Roboto, Arial, sans-serif"
        font-size="16"
        font-weight="700"
        text-anchor="middle"
        x="388"
        y="153"
      >24H</text>

      <path d="M33 201h474l-20 22a13 13 0 0 1-10 4H63a13 13 0 0 1-10-4l-20-22Z" fill="#B6CBE8" />
      <path d="M33 201h474l-7 8H40l-7-8Z" fill="#DCE8F7" />
      <path d="M225 201h90l-7 8h-76l-7-8Z" fill="#9EB8DC" />
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
  background: #bcd2f1;
  content: '';
}
</style>
