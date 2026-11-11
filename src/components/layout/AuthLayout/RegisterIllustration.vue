<template>
  <div
    aria-label="Quatro momentos ilustrativos do HackIFC: conectar-se com pessoas, desenvolver soluções, evoluir durante o processo e apresentar o projeto."
    class="journey-grid grid-cols-2 grid w-full max-w-[520px] gap-[14px]"
    role="img"
  >
    <div aria-hidden="true" class="journey-card bg-[rgb(255_255_255/78%)] relative flex min-h-[132px] flex-col border-[1px] border-[#d7e5f7] rounded-[10px] p-[13px_16px_15px]">
      <div class="card-top flex items-start justify-between mb-[8px]">
        <span class="stage-icon mdi mdi-account-group-outline flex w-[32px] h-[32px] items-center justify-center rounded-lg bg-[#eaf2ff] text-[#2563eb] text-[19px]" />
        <span class="stage-number text-[#a5bad6] text-[11px] font-bold tracking-[.08em]">01</span>
      </div>

      <strong class="text-[#334155] text-[14px] font-bold">Conecte-se</strong>
      <p class="mt-[3px] text-[#64748b] text-[12px] leading-[1.4]">Conheça pessoas e forme equipes.</p>
    </div>

    <div aria-hidden="true" class="journey-card bg-[rgb(255_255_255/78%)] relative flex min-h-[132px] flex-col border-[1px] border-[#d7e5f7] rounded-[10px] p-[13px_16px_15px]">
      <div class="card-top flex items-start justify-between mb-[8px]">
        <span class="stage-icon mdi mdi-code-braces flex w-[32px] h-[32px] items-center justify-center rounded-lg bg-[#eaf2ff] text-[#2563eb] text-[19px]" />
        <span class="stage-number text-[#a5bad6] text-[11px] font-bold tracking-[.08em]">02</span>
      </div>

      <strong class="text-[#334155] text-[14px] font-bold">Desenvolva</strong>
      <p class="mt-[3px] text-[#64748b] text-[12px] leading-[1.4]">Transforme ideias em soluções.</p>
    </div>

    <div aria-hidden="true" class="journey-card bg-[rgb(255_255_255/78%)] relative flex min-h-[132px] flex-col border-[1px] border-[#d7e5f7] rounded-[10px] p-[13px_16px_15px]">
      <div class="card-top flex items-start justify-between mb-[8px]">
        <span class="stage-icon mdi mdi-trending-up flex w-[32px] h-[32px] items-center justify-center rounded-lg bg-[#eaf2ff] text-[#2563eb] text-[19px]" />
        <span class="stage-number text-[#a5bad6] text-[11px] font-bold tracking-[.08em]">03</span>
      </div>

      <strong class="text-[#334155] text-[14px] font-bold">Evolua</strong>
      <p class="mt-[3px] text-[#64748b] text-[12px] leading-[1.4]">Aprenda durante o desenvolvimento.</p>
    </div>

    <div aria-hidden="true" class="journey-card bg-[rgb(255_255_255/78%)] relative flex min-h-[132px] flex-col border-[1px] border-[#d7e5f7] rounded-[10px] p-[13px_16px_15px]">
      <div class="card-top flex items-start justify-between mb-[8px]">
        <span class="stage-icon mdi mdi-presentation flex w-[32px] h-[32px] items-center justify-center rounded-lg bg-[#eaf2ff] text-[#2563eb] text-[19px]" />
        <span class="stage-number text-[#a5bad6] text-[11px] font-bold tracking-[.08em]">04</span>
      </div>

      <strong class="text-[#334155] text-[14px] font-bold">Apresente</strong>
      <p class="mt-[3px] text-[#64748b] text-[12px] leading-[1.4]">Compartilhe seu projeto e suas conquistas.</p>
    </div>
  </div>
</template>

<style scoped>
.journey-card:nth-child(1)::after,
.journey-card:nth-child(3)::after {
  position: absolute;
  top: 50%;
  right: -15px;
  width: 14px;
  height: 1px;
  background: #a8c7ed;
  content: '';
}

.journey-card:nth-child(2)::after,
.journey-card:nth-child(1)::before {
  position: absolute;
  bottom: -15px;
  left: 50%;
  width: 1px;
  height: 14px;
  background: #a8c7ed;
  content: '';
}

</style>
