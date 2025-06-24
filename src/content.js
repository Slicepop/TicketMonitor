let interval;
let element;
let incidentCount; // Still useful for initial baseline or overall change, but not primary trigger
let lastKnownActionDate = null; // New variable to store the timestamp
let alertAudio;
let intervalSelection;

chrome.runtime.sendMessage({ event: "pageRefreshed" }); // handles resetting toggle state on page refresh

if (
  window.location.href.includes(
    "https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/"
  )
) {
  document.querySelectorAll("zsd-requestalert").forEach((e) => {
    e.style.borderRadius = "16px";
  });

  const style = document.createElement("style");
  style.textContent = `
    #editRequest > div.card.request-subject.common-subject-description-card.ml-0 > div {
        background-color: #c2d9ff !important;
    }
    `;
  document.head.appendChild(style);
}

// Find INCIDENTS element (only needed for the initial click, not for count)
element = document.querySelector(
  "#rightpanel > zsd-user-requestlist > div.row.rowoverride > div.mb-3.col-10 > ul > li:nth-child(2) > span"
);

// Initialize alert audio after user toggles monitor on
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.event === "initializeAudio") {
    if (!alertAudio) {
      alertAudio = new Audio(chrome.runtime.getURL("fearstofathom.mp3"));
      alertAudio.volume = 0;
      alertAudio
        .play()
        .then(() => {
          alertAudio.pause();
          alertAudio.currentTime = 0;
          alertAudio.volume = 1;
        })
        .catch((e) => console.warn("Audio pre warm failed:", e));
    }
  }
});

// Helper function to fetch incident data
async function fetchIncidentData() {
  const response = await fetch(
    "https://support.wmed.edu/LiveTime/services/v1/user/requests/search?currentPage=incident&offset=0&limit=40&sortBy=requestNumber&sortOrder=DESC&filterId=176&locale=en-GB",
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-GB,en;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": '"Brave";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "zsd-source": "LT",
      },
      referrer: "https://support.wmed.edu/LiveTime/WebObjects/LiveTime",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: '{"requestAdditionalSearchInfo":{},"searchTerm":null,"requestFilterInfo":null}',
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  const data = await response.json();
  // Ensure data has the expected structure before accessing properties
  if (
    !data ||
    typeof data.resultCount === "undefined" ||
    !Array.isArray(data.results)
  ) {
    throw new Error("Invalid API response structure.");
  }
  return data;
}

// Begin monitoring incidents
function startMonitoring() {
  if (interval) return;

  document.title = "👁 Service Manager";
  element.click(); // Click to ensure the incident list is active

  // Initial fetch to set the baseline incidentCount and lastKnownActionDate
  fetchIncidentData()
    .then((data) => {
      incidentCount = data.resultCount; // Set initial count
      console.log(`Initial incident count: ${incidentCount}`);

      if (data.results && data.results.length > 0) {
        const latestIncident = data.results[0];
        const lastActionDateValue = latestIncident.values.find(
          (v) => v.columnName === "lastActionDate"
        );
        if (lastActionDateValue) {
          // Convert the date string to a Date object for reliable comparison
          lastKnownActionDate = new Date(lastActionDateValue.value);
          console.log(
            `Initial last action date: ${lastKnownActionDate.toLocaleString()}`
          );
        }
      }
    })
    .catch((error) => {
      console.error("Error during initial fetch for incident data:", error);
      // You might want to stop monitoring or show an error to the user here
      return; // Prevent starting the interval if initial fetch fails
    });

  interval = setInterval(async () => {
    try {
      const data = await fetchIncidentData();
      const newIncidentCount = data.resultCount;
      console.log(`Current fetched incident count: ${newIncidentCount}`);

      let isNewActivity = false;
      let subject = "Subject not found";
      let requestNum = "N/A";

      if (data.results && data.results.length > 0) {
        const currentLatestIncident = data.results[0];
        const currentLastActionDateValue = currentLatestIncident.values.find(
          (v) => v.columnName === "lastActionDate"
        );

        if (currentLastActionDateValue) {
          const currentLastActionDate = new Date(
            currentLastActionDateValue.value
          );

          if (
            !lastKnownActionDate || // If it's the very first check after a refresh (or error)
            currentLastActionDate.getTime() > lastKnownActionDate.getTime()
          ) {
            // New activity detected (either new ticket or existing ticket updated)
            isNewActivity = true;
            // Update lastKnownActionDate to the latest one
            lastKnownActionDate = currentLastActionDate;

            // Extract subject and request number for the alert
            const subjectValue = currentLatestIncident.values.find(
              (v) => v.columnName === "subject"
            );
            if (subjectValue) {
              subject = subjectValue.value;
            }

            const requestNumValue = currentLatestIncident.values.find(
              (v) => v.columnName === "requestNumber"
            );
            if (requestNumValue) {
              requestNum = requestNumValue.value;
            }
          }
        }
      }

      // Also check if resultCount explicitly increased, for a robust check
      // This handles cases where new ticket appears *after* the latest in the current view
      if (!isNewActivity && newIncidentCount > incidentCount) {
        isNewActivity = true;
        console.log("New incident count detected as primary trigger.");
        // In this case, you might need to refetch details specifically for the new incident
        // or assume the first one is the "new" one if sortOrder is DESC
        if (data.results && data.results.length > 0) {
          const latestIncident = data.results[0]; // Still assuming newest is first
          const subjectValue = latestIncident.values.find(
            (v) => v.columnName === "subject"
          );
          if (subjectValue) {
            subject = subjectValue.value;
          }
          const requestNumValue = latestIncident.values.find(
            (v) => v.columnName === "requestNumber"
          );
          if (requestNumValue) {
            requestNum = requestNumValue.value;
          }
        }
      }

      // Update incidentCount for baseline for next loop, regardless of alert
      incidentCount = newIncidentCount;

      if (isNewActivity) {
        // SweetAlert
        Swal.fire({
          color: "#fff",
          title: "A new ticket or update just landed!",
          icon: "warning",
          iconColor: "#4ddfd4",
          background: "#282a2b",
          text: "Subject - " + subject,
          confirmButtonText: "Take me there!",
          confirmButtonColor: "#07ada1",
          showCancelButton: true,
          cancelButtonText: "Close",
          reverseButtons: true,
          theme: "auto",
          padding: "0 0 2.5rem",
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(
              "https://support.wmed.edu/LiveTime/WebObjects/LiveTime.woa/wa/LookupRequest?sourceId=New&requestId=" +
                requestNum
            );
          }
        });

        if (alertAudio) {
          alertAudio
            .play()
            .catch((err) => console.warn("Audio play blocked:", err));
        }
      } else {
        console.log("No new activity detected.");
      }
    } catch (error) {
      console.error("Error during interval fetch:", error);
      // Decide what to do on fetch errors: stop monitoring, retry, etc.
      // For now, it just logs and continues
    }
  }, intervalSelection); // Using intervalSelection here
}

// Ends monitoring
function stopMonitoring() {
  if (interval) {
    clearInterval(interval);
    interval = null;
    document.title = "Service Manager";
    lastKnownActionDate = null; // Reset on stop
    console.log("Monitoring stopped. lastKnownActionDate reset.");
  }
}

// Wait for action message to either
// start or stop monitoring
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startMonitoring") {
    chrome.storage.local.get(["intervalTime"], (result) => {
      intervalSelection = result.intervalTime * 60000; // interval selection (minutes) * 60000ms
      if (result.intervalTime === "0" || !result.intervalTime) {
        intervalSelection = 60000;
      } // default to 1 min if 0 or undefined
      console.log(
        `Monitoring interval set to: ${intervalSelection / 1000} seconds.`
      );
      startMonitoring();
    });
  } else if (request.action === "stopMonitoring") {
    stopMonitoring();
  }
});

window.startMonitoring = startMonitoring;
window.stopMonitoring = stopMonitoring;
