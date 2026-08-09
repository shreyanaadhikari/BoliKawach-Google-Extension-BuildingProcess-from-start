// background.js
// Handles all API calls on behalf of content scripts. Requests are queued
// and sent one at a time with a small delay between them, instead of firing
// dozens at once when a page loads many comments at once (e.g. YouTube).
// This reduces load on the backend server, which can otherwise return
// 502 errors under a burst of simultaneous requests.

const API_URL = "https://bolikawach.onrender.com/check";
const DELAY_BETWEEN_REQUESTS_MS = 400;

let queue = [];
let isProcessing = false;

function processQueue() {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  const { text, sendResponse } = queue.shift();

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    })
    .then((data) => sendResponse({ success: true, data }))
    .catch((err) => sendResponse({ success: false, error: err.message }))
    .finally(() => {
      setTimeout(() => {
        isProcessing = false;
        processQueue();
      }, DELAY_BETWEEN_REQUESTS_MS);
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "BOLIKAWACH_CHECK") {
    queue.push({ text: message.text, sendResponse });
    processQueue();
    return true; // keeps the message channel open for the async response
  }
});