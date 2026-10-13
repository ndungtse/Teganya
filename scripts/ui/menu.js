export function mountMenu() {
  const toggle = document.getElementById('menu-toggle')
  const nav = document.getElementById('site-nav')
  const icon = toggle.querySelector('.icon')
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true'

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', open)
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    nav.classList.toggle('is-open', open)
    icon.classList.toggle('icon-menu', !open)
    icon.classList.toggle('icon-close', open)
  }

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
