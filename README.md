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

Git
1. Clone repository
2. Open your choice of Chromium based browser
3. Navigate to browser extensions -> manage extensions, (Edge - edge://extensions, Chrome - chrome://extensions)
4. Toggle "Developer mode" on
5. Click "Load unpacked"
6. Navigate to the new folder -> TicketMonitor-main -> src and select the src folder

### Usage
1. Navigate to "REQUESTS" page in Service Manager
2. Open TicketMonitor extension
3. Select refresh interval duration (if not selected will default to 1 min)
4. Toggle the switch on
5. Set tab aside until alerted of new ticket

### Best Practice
If you experience issues while using TicketMonitor, please let me know so I can fix them.
<br>
If you have feature ideas or opinions about functionality, also let me know so I can tailor TicketMonitor to best assist all users!

### Roadmap
- Options/settings for audio notification
- SLA breach alert

### Changelog
Version 0.3.0 (4/28)
- Interval selection stored between uses
- Monitoring toggles off upon closing tab
- Monitoring toggles off when changing interval
- Updated icon to eye logo

Version 0.2.0 (4/25)
- Interval duration settings
- Alert + sound notification when a new ticket appears
- Title updates to "Service Manager 👁 (monitoring)" to indicate monitor state
- Updated styles to "boxy" look for consistency
- Bugfix: toggle not updating after page refresh