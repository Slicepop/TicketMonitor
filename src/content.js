// console.log('content js loaded');

let interval;
let element;
let superscript;
let incidentCount;
let tempCount;

// Find INCIDENTS element and the number
// of incidents in it's superscript
const spans = document.querySelectorAll("span");
for(const span of spans) {
    if(span.textContent.trim() === "INCIDENTS") {
        element = span;
        superscript = span.nextElementSibling;
        // Delay due to page rendering time
        setTimeout(() => {
            incidentCount = parseInt(superscript.textContent.trim());
            console.log(incidentCount);
        }, 2000);
        break;
    }
}

// Begin monitoring incidents
// Refreshes incident queue on an interval
// and alerts user if new incident appears
function startMonitoring() {
    if(interval) return;
    element.click();
    interval = setInterval(() => {
        tempCount = incidentCount;
        element.click();
        superscript = element.nextElementSibling;
        setTimeout(() => {
            incidentCount = parseInt(superscript.textContent.trim());
        })
        if(incidentCount > tempCount) {
            alert('NEW TICKET');
        }
    }, 150000); // Default monitor interval, 150000 ms = 2.5 minutes
}

// Ends monitoring
function stopMonitoring() {
    if(interval) {
        clearInterval(interval);
        interval = null;
    }
}

// Wait for action message to either
// start or stop monitoring
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action === 'startMonitoring') {
        startMonitoring();
    } else if (request.action === 'stopMonitoring') {
        stopMonitoring();
    }
});

window.startMonitoring = startMonitoring;
window.stopMonitoring = stopMonitoring;