<template>
  <div
    class="login-illustration"
    role="img"
    aria-label="Jornada ilustrativa de um hackathon: inscrição, equipe, projeto e avaliação, com um notebook de programação em 24 horas."
  >
    <div class="steps" aria-hidden="true">
      <div class="step">
        <span class="step-icon"><span class="mdi mdi-account-plus-outline" /></span>
        <span>Inscrição</span>
      </div>
      <div class="step">
        <span class="step-icon"><span class="mdi mdi-account-group-outline" /></span>
        <span>Equipe</span>
      </div>
      <div class="step">
        <span class="step-icon"><span class="mdi mdi-code-braces" /></span>
        <span>Projeto</span>
      </div>
      <div class="step">
        <span class="step-icon"><span class="mdi mdi-check-decagram-outline" /></span>
        <span>Avaliação</span>
      </div>
    </div>

    <svg class="notebook" viewBox="0 0 540 238" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="54" y="10" width="432" height="190" rx="13" fill="#233653"/>
      <rect x="61" y="17" width="418" height="176" rx="8" fill="#F8FBFF"/>
      <path d="M61 25a8 8 0 0 1 8-8h402a8 8 0 0 1 8 8v24H61V25Z" fill="#EAF1FB"/>
      <circle cx="81" cy="33" r="4" fill="#9EB6D7"/>
      <circle cx="96" cy="33" r="4" fill="#B9CAE2"/>
      <circle cx="111" cy="33" r="4" fill="#B9CAE2"/>
      <rect x="168" y="27" width="204" height="12" rx="6" fill="#D8E5F6"/>
      <text x="83" y="82" fill="#2563EB" font-size="19" font-weight="700" font-family="ui-monospace, SFMono-Regular, Consolas, monospace">&lt;/&gt;</text>
      <rect x="83" y="98" width="135" height="7" rx="3.5" fill="#91AFE1"/>
      <rect x="226" y="98" width="53" height="7" rx="3.5" fill="#CFDDF0"/>
      <rect x="99" y="116" width="67" height="7" rx="3.5" fill="#D2E0F2"/>
      <rect x="174" y="116" width="123" height="7" rx="3.5" fill="#A7C3EC"/>
      <rect x="99" y="134" width="104" height="7" rx="3.5" fill="#91AFE1"/>
      <rect x="211" y="134" width="55" height="7" rx="3.5" fill="#D2E0F2"/>
      <rect x="83" y="152" width="75" height="7" rx="3.5" fill="#CFDDF0"/>
      <rect x="166" y="152" width="111" height="7" rx="3.5" fill="#A7C3EC"/>
      <rect x="329" y="67" width="118" height="102" rx="10" fill="#EAF2FF" stroke="#CEDFF8"/>
      <circle cx="388" cy="105" r="24" fill="white" stroke="#BBD3F7" stroke-width="2"/>
      <path d="M388 92v14l9 6" stroke="#2563EB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="388" y="153" text-anchor="middle" fill="#2563EB" font-size="16" font-weight="700" font-family="Roboto, Arial, sans-serif">24H</text>
      <path d="M33 201h474l-20 22a13 13 0 0 1-10 4H63a13 13 0 0 1-10-4l-20-22Z" fill="#B6CBE8"/>
      <path d="M33 201h474l-7 8H40l-7-8Z" fill="#DCE8F7"/>
      <path d="M225 201h90l-7 8h-76l-7-8Z" fill="#9EB8DC"/>
    </svg>
  </div>
</template>

<style scoped>
.login-illustration {
  width: 100%;
  max-width: 540px;
}

.steps {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 18px;
  text-align: center;
}

.steps::before {
  position: absolute;
  top: 20px;
  right: 12.5%;
  left: 12.5%;
  height: 1px;
  background: #bcd2f1;
  content: '';
}

.step {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 7px;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
}

.step-icon {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid #c9dcf6;
  border-radius: 10px;
  background: #fff;
  color: #2563eb;
  font-size: 20px;
}

.notebook {
  display: block;
  width: 100%;
  height: auto;
}
</style>
