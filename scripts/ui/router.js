const pages = ['dashboard', 'records', 'form', 'settings', 'about']

function currentPage() {
  const name = location.hash.replace('#/', '')
  return pages.includes(name) ? name : 'dashboard'
}

function show(focusHeading) {
  const name = currentPage()
  pages.forEach(page => {
    document.getElementById(`page-${page}`).hidden = page !== name
  })
  document.querySelectorAll('.nav-list a').forEach(link => {
    const active = link.getAttribute('href') === `#/${name}`
    if (active) link.setAttribute('aria-current', 'page')
    else link.removeAttribute('aria-current')
  })
  const heading = document.querySelector(`#page-${name} h1`)
  document.title = `${heading.textContent} - Teganya`
  if (focusHeading) heading.focus()
}

export function mountRouter() {
  window.addEventListener('hashchange', () => {
    if (location.hash.startsWith('#/')) show(true)
  })
  show(false)
}
