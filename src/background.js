let data = {
    "event": "onStop/onStart",
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { event, prefs } = message;

    switch(event) {
        case 'onStop':
            chrome.storage.local.set({ monitoring: "false", tabId: prefs.tabId });
            chrome.tabs.sendMessage(prefs.tabId, { action: "stopMonitoring" });
            break;
        case 'onStart':
            chrome.storage.local.set({ monitoring: "true", tabId: prefs.tabId, intervalTime: prefs.intervalTime });
            chrome.tabs.sendMessage(prefs.tabId, { action: "startMonitoring" });
            break;
        case 'pageRefreshed':
            chrome.storage.local.set({ monitoring: "false" });
            break;
        default:
            break;
    }

    console.log(prefs);
    chrome.storage.local.set(prefs);
});

chrome.tabs.onRemoved.addListener((closedTabId, removeInfo) => {
    chrome.storage.local.get(["monitoring", "tabId"], (result) => {
        const { monitoring, tabId } = result;

        if(monitoring === "true" && tabId === closedTabId) {
            chrome.storage.local.set({ monitoring: "false" }, () => {
                console.log("Monitor stopped.");
            });
        }
    });
});