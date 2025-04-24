const checkbox = document.querySelector("input[name=monitorCheckbox]");
let alertAudio = null;

checkbox.addEventListener("change", async (e) => {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // Monitor active
    if (e.target.checked && tab.title === "Service Manager") {
        const prefs = {
            monitoring: "true",
            tabId: tab.id
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

    /*
    if(monitoring === "true") {
        checkbox.checked = true;
    } else {
        checkbox.checked = false;
    }
    */
});