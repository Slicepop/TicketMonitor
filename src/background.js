let data = {
    "event": "onStop/onStart",
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { event, prefs } = message;

    switch(event) {
        case 'onStop':
            console.log('On stop');
            chrome.storage.local.set({ monitoring: "false", tabId: prefs.tabId });
            chrome.tabs.sendMessage(prefs.tabId, { action: "stopMonitoring" });
            break;
        case 'onStart':
            console.log('On start');
            chrome.storage.local.set({ monitoring: "true", tabId: prefs.tabId });
            chrome.tabs.sendMessage(prefs.tabId, { action: "startMonitoring" });
            break;
        default:
            break;
    }

    console.log(prefs);
    chrome.storage.local.set(prefs);

    
});