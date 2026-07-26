# BoliKawach-Google-Extension-BuildingProcess-from-start
Here I will document each and every day's progress that I did in order to contribute for our project "BoliKawach", an online Nepali Hate speech detection platform.  

Day 1: Started with a youtube video about building a google extension sent to me by my friend and a collaborator on this project with me.<br>
Youtube video link: https://www.youtube.com/watch?v=0n809nd4Zu4<br>
Key takeaways from the video:<br>
--> manifest.json is a crucial starting point.

<img width="682" height="518" alt="Screenshot 2026-07-26 at 12 17 58" src="https://github.com/user-attachments/assets/95ac21f0-08aa-4f05-9ca9-a187056acec1" /><br>
(so far so good)

--> Went to chrome://extensions and toggled the developer mode on then clicked on "Load unpacked" and uploaded my project's folder. At first, I didn't load it clean:<br>

<img width="883" height="486" alt="Screenshot 2026-07-26 at 12 28 07" src="https://github.com/user-attachments/assets/bbf875dc-7080-4f94-b841-d04b8bb704c6" />
<img width="883" height="612" alt="Screenshot 2026-07-26 at 12 26 56" src="https://github.com/user-attachments/assets/b7863495-6d5c-4223-bbeb-99b4234b8876" />

--> I checked the warning and understood the issue, I fixed it by creating a temporary (workable) "popup.htm" file in the same folder and refreshed my extension card. It was clean then.<br>

<img width="791" height="486" alt="Screenshot 2026-07-26 at 12 29 53" src="https://github.com/user-attachments/assets/6072611f-5962-4a95-8075-d8b07a5fb39b" />

-->Added background.service_worker → created background.js (empty) → then reloaded, confirmed no error. <br>

-->Progress Log (Facebook Content Script)
- Added background.js and registered it as the service worker in manifest.json<br>
- Used Chrome DevTools to inspect Facebook's DOM and find a stable way to target comments (Facebook's class names are auto-generated and change often)<br>
- Found that [aria-label*="Comment by"] reliably selects comment containers, and the actual text sits inside a nested div[dir="auto"]<br>
- Wrote facebook.js, loops through comment containers, extracts clean text, logs it to console<br>
- Registered it in manifest.json under content_scripts, targeting https://*.facebook.com/* <br>
- Fixed a JSON syntax error (missing comma) that broke the manifest<br>
- Tested on a live Facebook post and successfully extracted real comment text, including Nepali-influenced text.<br>
<img width="643" height="397" alt="Screenshot 2026-07-26 at 13 31 41" src="https://github.com/user-attachments/assets/1be5ef00-158e-4253-ba6a-004f505ff97e" />







