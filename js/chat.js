const btn = document.getElementById("prajwal-ai-btn");
const chatBox = document.getElementById("prajwal-ai-chat");
const closeBtn = document.getElementById("prajwal-ai-close");
const sendBtn = document.getElementById("prajwal-ai-send");
const input = document.getElementById("prajwal-ai-text");
const messages = document.getElementById("prajwal-ai-messages");

// Toggle chat
btn && (btn.onclick = () => {
  chatBox.style.display = "flex";
  chatBox.setAttribute("aria-hidden", "false");
});
closeBtn && (closeBtn.onclick = () => {
  chatBox.style.display = "none";
  chatBox.setAttribute("aria-hidden", "true");
});

// helper to add messages
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `pmsg ${sender}`;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
  return msg;
}

// send handler
sendBtn && (sendBtn.onclick = sendMessage);

// Enter key support
input && input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

let pendingBotMsg = null;

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, "user");
  input.value = "";

  // add a "thinking" placeholder
  pendingBotMsg = addMessage("Thinking...", "bot");

  try {
    // By default use relative path; replace with your deployed URL if needed.
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    if (!res.ok) {
      const errText = await res.text();
      pendingBotMsg.textContent = "⚠️ AI error: " + (errText || res.statusText);
      pendingBotMsg = null;
      return;
    }

    const data = await res.json();
    pendingBotMsg.textContent = data.reply || "⚠️ No reply from AI.";
    pendingBotMsg = null;
  } catch (err) {
    if (pendingBotMsg) pendingBotMsg.textContent = "⚠️ AI unavailable now.";
    pendingBotMsg = null;
    console.error("Chat error:", err);
  }
}
