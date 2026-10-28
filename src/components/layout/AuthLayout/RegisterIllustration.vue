<template>
  <div
    class="journey-grid"
    role="img"
    aria-label="Quatro momentos ilustrativos do HackIFC: conectar-se com pessoas, desenvolver soluções, evoluir durante o processo e apresentar o projeto."
  >
    <div class="journey-card" aria-hidden="true">
      <div class="card-top">
        <span class="stage-icon mdi mdi-account-group-outline" />
        <span class="stage-number">01</span>
      </div>
      <strong>Conecte-se</strong>
      <p>Conheça pessoas e forme equipes.</p>
    </div>
    <div class="journey-card" aria-hidden="true">
      <div class="card-top">
        <span class="stage-icon mdi mdi-code-braces" />
        <span class="stage-number">02</span>
      </div>
      <strong>Desenvolva</strong>
      <p>Transforme ideias em soluções.</p>
    </div>
    <div class="journey-card" aria-hidden="true">
      <div class="card-top">
        <span class="stage-icon mdi mdi-trending-up" />
        <span class="stage-number">03</span>
      </div>
      <strong>Evolua</strong>
      <p>Aprenda durante o desenvolvimento.</p>
    </div>
    <div class="journey-card" aria-hidden="true">
      <div class="card-top">
        <span class="stage-icon mdi mdi-presentation" />
        <span class="stage-number">04</span>
      </div>
      <strong>Apresente</strong>
      <p>Compartilhe seu projeto e suas conquistas.</p>
    </div>
  </div>
</template>

<style scoped>
.journey-grid {
  display: grid;
  width: 100%;
  max-width: 520px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.journey-card {
  position: relative;
  display: flex;
  min-height: 132px;
  flex-direction: column;
  border: 1px solid #d7e5f7;
  border-radius: 10px;
  background: rgb(255 255 255 / 78%);
  padding: 13px 16px 15px;
}

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

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stage-icon {
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #eaf2ff;
  color: #2563eb;
  font-size: 19px;
}

.stage-number {
  color: #a5bad6;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .08em;
}

.journey-card strong {
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.journey-card p {
  margin-top: 3px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.4;
}
</style>
