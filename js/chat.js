const btn = document.getElementById("prajwal-ai-btn");
const chatBox = document.getElementById("prajwal-ai-chat");
const closeBtn = document.getElementById("prajwal-ai-close");
const sendBtn = document.getElementById("prajwal-ai-send");
const input = document.getElementById("prajwal-ai-text");
const messages = document.getElementById("prajwal-ai-messages");

btn.onclick = () => (chatBox.style.display = "flex");
closeBtn.onclick = () => (chatBox.style.display = "none");

sendBtn.onclick = async () => {
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, "user");
  input.value = "";

  addMessage("Thinking...", "bot");

  try {
    const res = await fetch("https://new-h9xhd0ind-prajwaln9741s-projects.vercel.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    messages.lastElementChild.textContent = data.reply || "⚠️ No reply from AI.";
  } catch (err) {
    console.error(err);
    messages.lastElementChild.textContent = "⚠️ AI unavailable right now.";
  }
};

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `pmsg ${sender}`;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}
