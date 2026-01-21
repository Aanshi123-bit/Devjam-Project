const messages = document.getElementById("eco-messages");
const input = document.getElementById("eco-input");
const sendBtn = document.getElementById("eco-send");
const toggleBtn = document.getElementById("eco-toggle");
const chatBox = document.getElementById("eco-chat");
const closeBtn = document.getElementById("eco-close");

toggleBtn.addEventListener("click", () => {
  chatBox.style.display = "block";
  toggleBtn.style.display = "none";
  // Show greeting on first open
  if (!chatBox.dataset.greeted) {
    addMessage(
      "I’m EcoPedia, your eco-friendly assistant. Ask me anything about sustainability, green habits, and more!",
      "eco-bot"
    );
    chatBox.dataset.greeted = "true";
  }
});

closeBtn.addEventListener("click", () => {
  chatBox.style.display = "none";
  toggleBtn.style.display = "flex";
});


function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type;
  div.innerHTML = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}


function cleanQuery(query) {
  return query
    .toLowerCase()
    .replace(/^(what is|who is|tell me about|define|explain)\s+/i, "")
    .replace(/[?.!]+$/, "")  // Remove trailing punctuation
    .trim();
}



async function fetchWikiSummary(query) {
  try {
    const clean = cleanQuery(query);
    const title = clean.replace(/\s+/g, "_"); // spaces -> underscores
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.extract) {
      return data.extract;
    } else {
      return "Sorry, I couldn't find an answer on Wikipedia.";
    }
  } catch (err) {
    console.error(err);
    return "Sorry, something went wrong while fetching data.";
  }
}


async function handleInput() {
  const query = input.value.trim();
  if (!query) return;

  addMessage(query, "eco-user");
  input.value = "";

  addMessage("Searching EcoPedia...", "eco-bot");

  const response = await fetchWikiSummary(query);
  addMessage(response, "eco-bot");
}


sendBtn.addEventListener("click", handleInput);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleInput();
});
