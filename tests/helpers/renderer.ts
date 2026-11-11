import type { Component } from 'vue'
import { createRenderer, defineComponent, h, nextTick, reactive } from 'vue'

export interface TestNode {
  type: string
  props: Record<string, unknown>
  children: TestNode[]
  parent: TestNode | null
  text: string
}

function node (type: string, text = ''): TestNode {
  return { type, props: {}, children: [], parent: null, text }
}

const renderer = createRenderer<TestNode, TestNode>({
  createElement: type => node(type),
  createText: text => node('#text', text),
  createComment: text => node('#comment', text),
  setText: (element, text) => {
    element.text = text
  },
  setElementText: (element, text) => {
    element.text = text
    element.children = []
  },
  parentNode: element => element.parent,
  nextSibling: element => element.parent?.children[element.parent.children.indexOf(element) + 1] ?? null,
  patchProp: (element, key, _previous, value) => {
    element.props[key] = value
  },
  insert (element, parent, anchor = null) {
    if (element.parent) {
      element.parent.children.splice(element.parent.children.indexOf(element), 1)
    }
    const index = anchor ? parent.children.indexOf(anchor) : parent.children.length
    parent.children.splice(index, 0, element)
    element.parent = parent
  },
  remove (element) {
    element.parent?.children.splice(element.parent.children.indexOf(element), 1)
    element.parent = null
  },
})

// Assert AppButton's public Vuetify contract without replacing its own template.
const VBtn = defineComponent({
  inheritAttrs: false,
  props: ['disabled', 'loading', 'ripple'],
  setup: (props, { attrs, slots }) => () => h('button', {
    ...attrs,
    'disabled': props.disabled,
    'data-loading': props.loading,
  }, slots.default?.()),
})

export function mount (component: Component, initialProps: Record<string, unknown>) {
  const props = reactive({ ...initialProps })
  const root = node('root')
  const app = renderer.createApp({ render: () => h(component, props) })
  app.component('v-btn', VBtn)
  app.mount(root)
  return {
    root,
    unmount: () => app.unmount(),
    async update (changes: Record<string, unknown>) {
      Object.assign(props, changes)
      await nextTick()
    },
  }
}

export function findAll (root: TestNode, type: string): TestNode[] {
  return [root, ...root.children.flatMap(child => findAll(child, '*'))]
    .filter(element => type === '*' || element.type === type)
}

export function textContent (element: TestNode): string {
  return element.type === '#comment' ? '' : element.text + element.children.map(child => textContent(child)).join('')
}

export function click (element: TestNode) {
  const handler = element.props.onClick
  if (typeof handler === 'function') {
    handler()
  }
}
