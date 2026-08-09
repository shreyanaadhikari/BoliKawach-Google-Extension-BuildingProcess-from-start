// facebook.js

function predict(text) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: "BOLIKAWACH_CHECK", text },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (response && response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response ? response.error : "Unknown error"));
        }
      }
    );
  });
}

function flagComment(el, flagged, max_score, trigger) {
  el.style.borderRadius = "6px";
  el.style.padding = "4px";

  if (flagged) {
    el.style.border = "2px solid #c71e2e";
    el.style.background = "rgba(199,30,46,0.08)";
  } else {
    el.style.border = "2px solid #2ecc71";
    el.style.background = "rgba(46,204,113,0.06)";
  }

  if (!el.dataset.bolikawachBadge) {
    const badge = document.createElement("span");
    badge.textContent = flagged
      ? ` ⚠ Hate (${max_score}/5)${trigger ? ` — "${trigger}"` : ""} `
      : ` ✓ Clean `;
    badge.style.color = flagged ? "#c71e2e" : "#2ecc71";
    badge.style.fontWeight = "bold";
    badge.style.fontSize = "11px";
    el.appendChild(badge);
    el.dataset.bolikawachBadge = "true";
  }
}

async function scanComments() {
  const comments = document.querySelectorAll('[aria-label*="Comment by"]');

  for (const comment of comments) {
    if (comment.dataset.bolikawachChecked) continue;

    const textEl = comment.querySelector('div[dir="auto"]');
    if (!textEl || !textEl.innerText.trim()) continue;

    const text = textEl.innerText;

    try {
      const { flagged, max_score, trigger } = await predict(text);
      console.log("BoliKawach:", flagged ? "HATE" : "clean", "-", text);
      flagComment(textEl, flagged, max_score, trigger);
    } catch (err) {
      console.error("BoliKawach API error:", err);
    }

    comment.dataset.bolikawachChecked = "true";
  }
}

let observer = null;

function startScanning() {
  scanComments();
  if (!observer) {
    observer = new MutationObserver(() => scanComments());
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

function stopScanning() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// Initial state on page load
chrome.storage.local.get(["bolikawachEnabled"], (result) => {
  if (result.bolikawachEnabled) startScanning();
});

// React live if the toggle is flipped in the popup while this page is open
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && "bolikawachEnabled" in changes) {
    if (changes.bolikawachEnabled.newValue) {
      startScanning();
    } else {
      stopScanning();
    }
  }
});