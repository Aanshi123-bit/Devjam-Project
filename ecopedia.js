// ----- EcoPedia JS -----

// Grab all relevant elements
const ecoToggle = document.getElementById("eco-toggle");
const ecoChat = document.getElementById("eco-chat");
const ecoClose = document.getElementById("eco-close");
const ecoMessages = document.getElementById("eco-messages");
const ecoInput = document.getElementById("eco-input");
const ecoSend = document.getElementById("eco-send");

// Greeting shown only once
let greeted = false;

// Function to add a message
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type;
  div.textContent = text;
  ecoMessages.appendChild(div);
  ecoMessages.scrollTop = ecoMessages.scrollHeight;
}

// Toggle chat visibility
ecoToggle.addEventListener("click", () => {
  ecoChat.style.display = ecoChat.style.display === "block" ? "none" : "block";
  if (!greeted) {
    addMessage("I’m EcoPedia, your eco-friendly assistant. Ask me anything about sustainability, green habits and more!", "eco-bot");
    greeted = true;
  }
});

// Close button
ecoClose.addEventListener("click", () => {
  ecoChat.style.display = "none";
});

// Send function
async function sendQuery() {
  const query = ecoInput.value.trim();
  if (!query) return;

  addMessage(query, "eco-user");
  ecoInput.value = "";

  addMessage("Searching EcoPedia…", "eco-bot");

  // Process query: remove punctuation, lowercase, pick keywords
  const cleaned = query.replace(/[^\w\s]/gi, "").toLowerCase();
  const words = cleaned.split(/\s+/);

  // Try each word to find Wikipedia page (this is the content sour
