const checkbox = document.querySelector("input[name=monitorCheckbox]");
const dropdown = document.querySelector("select[name=intervalDropdown]");
let alertAudio = null;

let interval = chrome.storage.local.get(["intervalValue"], (result) => {
    if(result) {
        dropdown.value = result.intervalValue;
    }
})

checkbox.addEventListener("change", async (e) => {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // Monitor active
    if (e.target.checked && tab.title === "Service Manager") {
        const prefs = {
            monitoring: "true",
            tabId: tab.id,
            intervalTime: dropdown.value
        }
        chrome.tabs.sendMessage(tab.id, { event: 'initializeAudio' });
        chrome.runtime.sendMessage({ event: 'onStart', prefs });
    // Monitor inactive
    } else {
        const prefs = {
            monitoring: "false",
            tabId: tab.id
        }
        chrome.runtime.sendMessage({ event: 'onStop', prefs });
    }
});

chrome.storage.local.get(["monitoring"], (result) => {
    const { monitoring } = result;

    if(typeof monitoring === "undefined") {
        monitoring = "false";
        chrome.storage.local.set({ monitoring: "false" });
    }

    checkbox.checked = monitoring === "true";
});

dropdown.addEventListener("change", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.storage.local.set({ intervalValue: dropdown.value })
    const prefs = {
        monitoring: "false",
        tabId: tab.id
    }

    chrome.runtime.sendMessage({ event: 'onStop', prefs });
    checkbox.checked = false;
});