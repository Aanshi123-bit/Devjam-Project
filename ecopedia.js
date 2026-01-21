// Elements
const ecoToggle = document.getElementById("eco-toggle");
const ecoChat = document.getElementById("eco-chat");
const ecoClose = document.getElementById("eco-close");
const ecoInput = document.getElementById("eco-input");
const ecoSend = document.getElementById("eco-send");
const ecoMessages = document.getElementById("eco-messages");

// Toggle chat visibility
ecoToggle.addEventListener("click", () => {
  ecoChat.style.display = ecoChat.style.display === "flex" ? "none" : "flex";
});

// Close button
ecoClose.addEventListener("click", () => {
  ecoChat.style.display = "none";
});

// Add message function
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type;
  div.innerText = text;
  ecoMessages.appendChild(div);
  ecoMessages.scrollTop = ecoMessages.scrollHeight;
}

// Greeting on first open
let greeted = false;
ecoToggle.addEventListener("click", () => {
  if (!greeted) {
    addMessage("I’m EcoPedia, your eco-friendly assistant. Ask me anything about sustainability, green habits and more!", "eco-bot");
    greeted = true;
  }
});

// Function to handle query
async function askEco() {
  const query = ecoInput.value.trim();
  if (!query) return;

  addMessage(query, "eco-user");
  ecoInput.value = "";
  addMessage("Searching Wikipedia...", "eco-bot");

  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    const data = await response.json();
    if (data.extract) {
      addMessage(data.extract, "eco-bot");
    } else {
      addMessage("Sorry, I couldn't find an answer on Wikipedia.", "eco-bot");
    }
  } catch (error) {
    addMessage("Oops! Something went wrong. Try again later.", "eco-bot");
    console.error(error);
  }
}

// Send on button click
ecoSend.addEventListener("click", askEco);

// Send on Enter key
ecoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    askEco();
  }
});
