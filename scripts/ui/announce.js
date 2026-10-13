const regions = {
  polite: document.getElementById('live-polite'),
  assertive: document.getElementById('live-assertive')
}

export function announce(message, urgency = 'polite') {
  const region = regions[urgency]
  region.textContent = ''
  setTimeout(() => { region.textContent = message }, 50)
}
