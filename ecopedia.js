// ------------------- EcoPedia JS -------------------

// Select elements
const ecoAssistant = document.getElementById("wiki-assistant");
const toggle = document.getElementById("eco-toggle");
const chat = document.getElementById("wiki-chat");
const closeBtn = document.getElementById("wiki-close");
const messages = document.getElementById("wiki-messages");
const input = document.getElementById("wiki-input");
const sendBtn = document.getElementById("wiki-send");

// Toggle chat visibility
toggle.addEventListener("click", () => {
  chat.style.display = chat.style.display === "block" ? "none" : "block";
});

closeBtn.addEventListener("click", () => {
  chat.style.display = "none";
});

// Helper function to add messages
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type;
  div.innerHTML = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// Display initial greeting
addMessage(
  "I’m EcoPedia, your eco-friendly assistant. Ask me anything about sustainability, green habits and more!",
  "wiki-bot"
);

// Wikipedia search function using Wikipedia Search API
async function searchWiki(query) {
  try {
    // Clean input
    const cleanQuery = query.trim();

    // Search endpoint
    const searchURL = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      cleanQuery
    )}&format=json&origin=*`;

    const searchResp = await fetch(searchURL);
    const searchData = await searchResp.json();

    if (
      searchData.query &&
      searchData.query.search &&
      searchData.query.search.length > 0
    ) {
      // Take the first (most relevant) result
      const pageTitle = searchData.query.search[0].title;

      // Fetch the summary
      const summaryURL = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        pageTitle
      )}`;
      const summaryResp = await fetch(summaryURL);
      const summaryData = await summaryResp.json();

      if (summaryData.extract) {
        return `<strong>${summaryData.title}</strong>: ${summaryData.extract}`;
      }
    }

    return "Sorry, I couldn't find an answer on Wikipedia.";
  } catch (err) {
    console.error(err);
    return "Oops! Something went wrong while searching Wikipedia.";
  }
}

// Handle user query
async function askEcoPedia() {
  const query = input.value.trim();
  if (!query) return;

  addMessage(query, "wiki-user");
  input.value = "";

  addMessage("Searching EcoPedia...", "wiki-bot");

  const answer = await searchWiki(query);
  addMessage(answer, "wiki-bot");
}

// Event listeners
sendBtn.addEventListener("click", askEcoPedia);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") askEcoPedia();
});
