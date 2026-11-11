import { readFileSync } from 'node:fs'
import { registerHooks, stripTypeScriptTypes } from 'node:module'
import { compileScript, parse } from 'vue/compiler-sfc'

// Compile the real SFC templates using the compiler already supplied by Vue.
registerHooks({
  load (url, context, nextLoad) {
    if (!url.endsWith('.vue')) {
      return nextLoad(url, context)
    }
    const { descriptor } = parse(readFileSync(new URL(url), 'utf8'), { filename: url })
    const compiled = compileScript(descriptor, { id: url, inlineTemplate: true })
    return {
      format: 'module',
      source: stripTypeScriptTypes(compiled.content),
      shortCircuit: true,
    }
  },
})
