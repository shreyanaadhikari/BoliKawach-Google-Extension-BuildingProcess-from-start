# BoliKawach-Google-Extension-BuildingProcess-from-start
Here I will document each and every day's progress that I did in order to contribute for our project "BoliKawach", an online Nepali Hate speech detection platform.  

🎯 Project Overview
Nepali-language hate speech on social media (Facebook, Instagram, YouTube, TikTok) is rarely covered by existing moderation tools, which are built primarily for English. BoliKawach aims to close that gap by scanning visible comments on supported platforms, running them through a trained hate speech classifier, and visually flagging hateful content directly on the page.<br>

👥 Team & Scope
This project is a two-person collaboration with a clear division of work:<br>

Partner — ML & Data: Dataset collection, EDA, preprocessing, model training, evaluation, and API deployment for the hate speech classifier.<br>

Shreyana — Extension & Design: Chrome extension architecture, UI/UX design, cross-platform comment scraping, and integration with the model's API.<br>

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
<img width="690" height="132" alt="Screenshot 2026-07-26 at 14 15 23" src="https://github.com/user-attachments/assets/eded6699-1b96-4c8c-863c-7ae475c6ed45" />
(This isn't meant to offend anyone, I just added this screenshot to track my progress and to realize what i built is actually working. Please do not take it or think of it otherwise.)<br>

-->Progress Log (Instagram & YouTube)<br>
- Extended detection beyond Facebook by writing instagram.js and youtube.js, reusing the same content script structure (mock detection + visual flagging + MutationObserver for dynamically loaded comments)
- For Instagram, tried the same aria-label*="Comment by" selector used on Facebook first, since both are Meta-owned and share some infrastructure and confirmed working without needing a separate DevTools investigation
- For YouTube, targeted #content-text inside ytd-comment-thread-renderer/ytd-comment-view-model, YouTube's stable custom element structure for comments
- Registered both new content scripts in manifest.json under content_scripts, each scoped to their platform's domain
- Tested live on both platforms and confirmed real comments (including Nepali and romanized Nepali text) are being scanned and logged correctly
- Noted a key finding: the mock detection logic only flags comments containing a small hardcoded word list, so real hateful comments without those exact words correctly return not_hate, this confirmed the extension's scanning/flagging pipeline works correctly, and highlighted that real accuracy will only come once the trained ML model's API replaces the mock
<img width="1034" height="718" alt="Screenshot 2026-07-26 at 14 26 56" src="https://github.com/user-attachments/assets/8c45985e-0fbc-46ee-be99-b93a7f9051ff" />
<img width="1034" height="316" alt="Screenshot 2026-07-26 at 14 21 18" src="https://github.com/user-attachments/assets/0e283096-a30c-45cb-a1bb-daac2e918123" /><br>

-->Progress Log (Designing the Logo)
<img width="544" height="522" alt="Screenshot 2026-07-26 at 14 54 03" src="https://github.com/user-attachments/assets/22b46309-7aa1-47c5-9211-95e69d9f615e" /><br>
(final logo)<br>

- I exported the same logo in 16px, 48px and 128px then created a folder called "icons" in my main folder and added all those icon files.
<img width="128" height="128" alt="icon128" src="https://github.com/user-attachments/assets/acbb46b3-c32c-486b-a14c-5360c3c30ce2" />
<img width="48" height="48" alt="icon48" src="https://github.com/user-attachments/assets/c27ac1f2-dd22-4339-b4a8-e75dd4ff5388" />
<img width="16" height="16" alt="icon16" src="https://github.com/user-attachments/assets/46a194d6-be8d-46f0-8d41-f489efa3cb2f" /><br>

- Then I updated my manifest.json file and reloaded my extension card.<br>
<img width="843" height="522" alt="Screenshot 2026-07-26 at 15 15 20" src="https://github.com/user-attachments/assets/19b291e3-cbe4-44ed-9511-93dc02507c5f" /><br>
(will continue from here now)














