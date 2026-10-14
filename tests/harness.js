export const results = []

export function test(name, fn) {
  try {
    fn()
    results.push({ name, ok: true })
  } catch (error) {
    results.push({ name, ok: false, message: error.message })
  }
}

export function equal(actual, expected) {
  const a = JSON.stringify(actual)
  const b = JSON.stringify(expected)
  if (a !== b) throw new Error(`expected ${b} but got ${a}`)
}

export function render(list, summary) {
  const failed = results.filter(r => !r.ok).length
  list.innerHTML = results.map(r => {
    const detail = r.message ? `: ${r.message}` : ''
    return `<li class="${r.ok ? 'pass' : 'fail'}">${r.ok ? 'PASS' : 'FAIL'} ${r.name}${detail}</li>`
  }).join('')
  summary.textContent = `${results.length - failed} passed, ${failed} failed`
}
