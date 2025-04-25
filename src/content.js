// console.log('content js loaded');

let interval;
let element;
let superscript;
let incidentCount;
let tempCount;
let alertAudio;

// Initialize alert audio after user toggles monitor on
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.event === "initializeAudio") {
        if(!alertAudio) {
            alertAudio = new Audio(chrome.runtime.getURL("fearstofathom.mp3"));
            alertAudio.volume = 0;
            alertAudio.play().then(() => {
                alertAudio.pause();
                alertAudio.currentTime = 0;
                alertAudio.volume = 1;
            }).catch(e => console.warn("Audio pre warm failed:", e));
        }
    }
});

// For testing purposes only
/*
setTimeout(() => {
    const incident = document.getElementById('accordion0');
    const incidentChild = incident.firstElementChild;
    const subject = incidentChild.children[15].textContent.trim();
    const requestNum = document.getElementById('requestNum').textContent.trim();

    Swal.fire({
        color: '#fff',
        title: 'A new ticket just landed!',
        icon: 'warning',
        iconColor: '#4ddfd4',
        background: '#282a2b',
        text: 'Subject - ' + subject,
        confirmButtonText: 'Take me there!',
        confirmButtonColor: '#07ada1',
        showCancelButton: true,
        cancelButtonText: 'Close',
        reverseButtons: true,
        // timer: '15000',
        // timerProgressBar: true,
        theme: 'auto',
        padding: '0 0 2.5rem',
    }).then((result) => {
        if(result.isConfirmed) {
            window.open('https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=' + requestNum);
        }
    });

    if(alertAudio) {
        alertAudio.play().catch(err => console.warn('Audio play blocked:', err));
    }
}, 15000);
*/

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
    document.title = "Service Manager (monitoring)";
    element.click();
    interval = setInterval(() => {
        tempCount = incidentCount;
        console.log(tempCount);
        element.click();
        setTimeout(() => {
            superscript = element.nextElementSibling;
            incidentCount = parseInt(superscript.textContent.trim());
            console.log(superscript);
            console.log(incidentCount);
            if(incidentCount > tempCount) {
                const incident = document.getElementById('accordion0');
                const incidentChild = incident.firstElementChild;
                const subject = incidentChild.children[15].textContent.trim();
                const requestNum = document.getElementById('requestNum').textContent.trim();

                Swal.fire({
                    color: '#fff',
                    title: 'A new ticket just landed!',
                    icon: 'warning',
                    iconColor: '#4ddfd4',
                    background: '#282a2b',
                    text: 'Subject - ' + subject,
                    confirmButtonText: 'Take me there!',
                    confirmButtonColor: '#07ada1',
                    showCancelButton: true,
                    cancelButtonText: 'Close',
                    reverseButtons: true,
                    // timer: '15000',
                    // timerProgressBar: true,
                    theme: 'auto',
                    padding: '0 0 2.5rem',
                }).then((result) => {
                    if(result.isConfirmed) {
                        window.open('https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=' + requestNum);
                    }
                });

                if(alertAudio) {
                    alertAudio.play().catch(err => console.warn('Audio play blocked:', err));
                }

                stopMonitoring();
            }
        }, 2000);
    }, 60000); // Default monitor interval, 150000 ms = 2.5 minutes
}

// Ends monitoring
function stopMonitoring() {
    if(interval) {
        clearInterval(interval);
        interval = null;
        document.title = "Service Manager";
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