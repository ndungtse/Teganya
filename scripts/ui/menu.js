export function mountMenu() {
  const toggle = document.getElementById('menu-toggle')
  const nav = document.getElementById('site-nav')
  const icon = toggle.querySelector('.icon')
  const behind = document.querySelectorAll('main, .site-footer')
  const desktop = window.matchMedia('(min-width: 768px)')
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true'

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', open)
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    nav.classList.toggle('is-open', open)
    icon.classList.toggle('icon-menu', !open)
    icon.classList.toggle('icon-close', open)
    document.body.classList.toggle('menu-open', open)
    behind.forEach(el => { el.inert = open })
  }

  desktop.addEventListener('change', event => {
    if (event.matches) setOpen(false)
  })

  toggle.addEventListener('click', () => setOpen(!isOpen()))
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false)
  })
  window.addEventListener('hashchange', () => setOpen(false))
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false)
      toggle.focus()
    }
  })
}
