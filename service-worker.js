import { fetchClient } from "./apis/fetchClient.js";
import { flip_user_status } from "./apis/auth.js";

chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    id: "openSidePanel",
    title: "Open side panel",
    contexts: ["all"],
  });
  chrome.tabs.create({ url: "rmsLogin.html" });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openSidePanel") {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (message.type === "open_side_panel") {
      await chrome.sidePanel.open({ tabId: sender.tab.id });
      await chrome.sidePanel.setOptions({
        tabId: sender.tab.id,
        path: "rmsLogin.html",
        enabled: true,
      });
    }
  })();
  if (message.message === "login") {
    flip_user_status(true, message.payload)
      .then((res) => {
        sendResponse(res);
      })
      .catch((err) => console.log(err));
    return true;
  }
});
