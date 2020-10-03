import { browser } from 'webextension-polyfill-ts'

const contentLoaded = async (tabId: number) => {
  await browser.pageAction.show(tabId)
}

browser.pageAction.onClicked.addListener(async (tab) => {
  tab.id &&
    (await browser.tabs.sendMessage(tab.id, {
      id: 'pageAction',
    }))
})

browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url) {
    browser.tabs.sendMessage(tabId, { id: 'urlChanged' })
  }
})

browser.runtime.onMessage.addListener(async (message, sender) => {
  const { id } = message
  const { tab } = sender
  switch (id) {
    case 'contentLoaded':
      return tab?.id && (await contentLoaded(tab.id))
  }
})
