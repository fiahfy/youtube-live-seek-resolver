import { browser } from 'webextension-polyfill-ts'

let ready = false

const isVideoUrl = () => new URL(location.href).pathname === '/watch'

const isLive = () => !!document.querySelector('.ytp-time-display.ytp-live')

const getCurrentTime = () => {
  const video = document.querySelector<HTMLVideoElement>(
    'ytd-watch-flexy video.html5-main-video'
  )
  return video ? Math.floor(video.currentTime) : 0
}

const reload = () => {
  if (!isVideoUrl()) {
    return
  }
  const url = location.href.replace(/&t=\w+(&|$)/, '$1')
  const time = getCurrentTime()
  location.replace(`${url}&t=${time}`)
}

const resetChat = () => {
  const chat = document.querySelector('#chat')
  const hidden = !!chat?.getAttribute('collapsed')
  if (hidden) {
    return
  }
  const hideButton = document.querySelector<HTMLElement>('#show-hide-button a')
  if (!hideButton) {
    return
  }
  hideButton.click()
  hideButton.click()
}

const init = () => {
  if (ready) {
    return
  }
  const video = document.querySelector('ytd-watch-flexy video.html5-main-video')
  if (!video) {
    return
  }
  video.addEventListener('seeking', () => {
    if (!isLive()) {
      resetChat()
    }
  })
  ready = true
}

browser.runtime.onMessage.addListener((message) => {
  const { id } = message
  switch (id) {
    case 'urlChanged':
      return init()
    case 'pageAction':
      return reload()
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  await browser.runtime.sendMessage({ id: 'contentLoaded' })
  init()
})
