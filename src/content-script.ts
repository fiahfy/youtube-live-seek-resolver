import { browser } from 'webextension-polyfill-ts'

const resetChat = () => {
  const chat = document.querySelector('#chat')
  const hidden = !!chat?.getAttribute('collapsed')
  const hideButton = document.querySelector('#show-hide-button a')
  if (!(hideButton instanceof HTMLElement)) {
    return
  }
  if (!hidden) {
    hideButton.click()
  }
  hideButton.click()
}

browser.runtime.onMessage.addListener((message) => {
  const { id } = message
  switch (id) {
    case 'pageAction':
      resetChat()
      break
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  await browser.runtime.sendMessage({ id: 'contentLoaded' })
})
