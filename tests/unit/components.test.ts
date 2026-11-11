import assert from 'node:assert/strict'
import { test } from 'node:test'
import AppButton from '../../src/components/ui/AppButton/AppButton.vue'
import FilterChipGroup from '../../src/components/ui/FilterChipGroup/FilterChipGroup.vue'
import StatusProject from '../../src/components/ui/statusProject.vue'
import StatusEdition from '../../src/components/ui/statusSelect.vue'
import { click, findAll, mount, textContent } from '../helpers/renderer.ts'

test('AppButton emits once, blocks disabled/loading clicks and restores after loading', async () => {
  let clicks = 0
  const component = mount(AppButton, { label: 'Salvar', variant: 'primary', onClick: () => clicks++ })
  try {
    const button = findAll(component.root, 'button')[0]!
    click(button)
    assert.equal(clicks, 1)
    await component.update({ disabled: true })
    click(button)
    assert.equal(clicks, 1)
    await component.update({ disabled: false, loading: true })
    assert.equal(button.props.disabled, true)
    assert.equal(button.props['aria-busy'], true)
    assert.equal(button.props['data-loading'], true)
    click(button)
    assert.equal(clicks, 1)
    await component.update({ loading: false })
    assert.equal(Boolean(button.props.disabled), false)
    assert.equal(button.props['aria-busy'], undefined)
    click(button)
    assert.equal(clicks, 2)
  } finally {
    component.unmount()
  }
})

test('AppButton preserves label and icon order for both positions and all variants', () => {
  for (const variant of ['primary', 'secondary', 'text']) {
    for (const iconPosition of ['left', 'right']) {
      const component = mount(AppButton, { variant, label: 'Continuar', icon: '→', iconPosition })
      try {
        const button = findAll(component.root, 'button')[0]!
        assert.equal(textContent(button).replace(/\s/g, ''), iconPosition === 'left' ? '→Continuar' : 'Continuar→')
      } finally {
        component.unmount()
      }
    }
  }
})

test('project status supports default/card presentation and reacts to status and label changes', async () => {
  for (const variant of ['default', 'card']) {
    const component = mount(StatusProject, { status: 'ativo', label: 'Em andamento', variant })
    try {
      assert.match(textContent(component.root), /Em andamento/)
      const dot = findAll(component.root, 'span')[1]!
      assert.equal(dot.props['aria-hidden'], 'true')
      const activeClass = dot.props.class
      await component.update({ status: 'finalizado', label: 'Finalizado' })
      assert.match(textContent(component.root), /Finalizado/)
      assert.notEqual(dot.props.class, activeClass)
    } finally {
      component.unmount()
    }
  }
})

test('edition status supports every state and variant with a decorative dot', () => {
  for (const status of ['inscricoes', 'avaliacao', 'andamento', 'finalizado']) {
    for (const variant of ['default', 'card', 'evaluation']) {
      const component = mount(StatusEdition, { status, variant, label: status })
      try {
        assert.match(textContent(component.root), new RegExp(status))
        const spans = findAll(component.root, 'span')
        assert.equal(spans[1]!.props['aria-hidden'], 'true')
        assert.equal(String(spans[0]!.props.class).includes('undefined'), false)
      } finally {
        component.unmount()
      }
    }
  }
})

test('filter variants expose pressed state, emit selection and update the selected indicator', async () => {
  for (const variant of ['chips', 'underline']) {
    let selection = ''
    const component = mount(FilterChipGroup, {
      variant, 'modelValue': 'PENDENTE',
      'options': [{ label: 'Pendentes', value: 'PENDENTE' }, { label: 'Aprovadas', value: 'APROVADA' }],
      'onUpdate:modelValue': (value: string) => {
        selection = value
      },
    })
    try {
      const buttons = findAll(component.root, 'button')
      assert.equal(buttons[0]!.props['aria-pressed'], true)
      assert.equal(buttons[1]!.props['aria-pressed'], false)
      click(buttons[1]!)
      assert.equal(selection, 'APROVADA')
      await component.update({ modelValue: selection })
      assert.equal(buttons[0]!.props['aria-pressed'], false)
      assert.equal(buttons[1]!.props['aria-pressed'], true)
      if (variant === 'underline') {
        assert.match(String(buttons[1]!.props.class), /border-\[#2563eb\]/)
      }
    } finally {
      component.unmount()
    }
  }
})
