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

// ---- TOGGLE ----
const scanToggle = document.getElementById("scanToggle");
const toggleLabel = document.getElementById("toggleLabel");
const toggleIcon = scanToggle.querySelector(".toggle-icon");

function renderToggle(enabled) {
  if (enabled) {
    scanToggle.classList.remove("off");
    scanToggle.classList.add("on");
    toggleLabel.textContent = "Scanning is ON";
    toggleIcon.textContent = "●";
  } else {
    scanToggle.classList.remove("on");
    scanToggle.classList.add("off");
    toggleLabel.textContent = "Turn On Scanning";
    toggleIcon.textContent = "○";
  }
}

chrome.storage.local.get(["bolikawachEnabled"], (result) => {
  renderToggle(!!result.bolikawachEnabled);
});

scanToggle.addEventListener("click", () => {
  chrome.storage.local.get(["bolikawachEnabled"], (result) => {
    const newState = !result.bolikawachEnabled;
    chrome.storage.local.set({ bolikawachEnabled: newState });
    renderToggle(newState);
  });
});

// ---- MANUAL CHECK ----
const inputText = document.getElementById("inputText");
const checkBtn = document.getElementById("checkBtn");
const resultBox = document.getElementById("result");
const resultLabel = document.getElementById("resultLabel");
const resultConfidence = document.getElementById("resultConfidence");
const statusText = document.getElementById("statusText");

checkBtn.addEventListener("click", async () => {
  const text = inputText.value.trim();
  if (!text) {
    statusText.textContent = "Please enter some text";
    return;
  }

  checkBtn.disabled = true;
  statusText.textContent = "Checking... (first request may take up to a minute to wake the server)";
  resultBox.classList.add("hidden");

  try {
    const { flagged, max_score, trigger } = await predict(text);

    resultBox.classList.remove("hidden", "hate", "safe");
    resultBox.classList.add(flagged ? "hate" : "safe");
    resultLabel.textContent = flagged ? "⚠ Hate Speech Detected" : "✓ Looks Safe";
    resultConfidence.textContent = flagged
      ? `Severity: ${max_score}/5${trigger ? ` — flagged word: "${trigger}"` : ""}`
      : `Severity: ${max_score}/5`;
    statusText.textContent = "Ready";
  } catch (err) {
    statusText.textContent = "Error reaching model — server may be waking up, try again in a moment";
    console.error(err);
  } finally {
    checkBtn.disabled = false;
  }
});