# TicketMonitor

### Description
Browser extension for Service Manager that can be toggled on to monitor incoming tickets and alert you when a new ticket arrives.

### Requirements
TicketMonitor is supported on Chromium-based browsers. (ex: Chrome, Edge, Opera)

### Installation
Manual
1. On this page, click green <> Code button
2. Click "Download ZIP"
3. Move downloaded "TicketMonitor-main.zip" to a new folder wherever you'd like to store it (ex: Desktop)
4. Extract content of the zip into the new folder
5. Open your choice of Chromium based browser
6. Navigate to browser extensions -> manage extensions, (Edge - edge://extensions, Chrome - chrome://extensions)
7. Toggle "Developer mode" on
8. Click "Load unpacked"
9. Navigate to the new folder -> TicketMonitor-main -> src and select the src folder

### Usage
1. Navigate to "REQUESTS" page in Service Manager
2. Open TicketMonitor extension
3. Toggle the switch on
4. Set tab aside until alerted of new ticket

### Best Practice
This extension was quickly built and may experience untested issues, so it is advised now and then to manually check the incident page.
If you experience issues, please let me know so I can fix them.

### Known Issues
- Toggle is not switched off when leaving Service Manager so you'll have to manually toggle off then on when returning to a Service Manager tab.
(TicketMonitor does not interact with any tab other than the active tab when toggled on.)
- While using current version, it's best to manually toggle TicketMonitor off when you are done monitoring the incidents page.

### Roadmap
- Interval duration settings for user
- Options/settings for audio notification
- Change title to "Service Manager (monitoring)"
- Monitoring state indicator
- SLA breach alert