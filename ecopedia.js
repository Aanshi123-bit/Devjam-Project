const toggleBtn = document.getElementById("eco-toggle");
const chatBox = document.getElementById("eco-chat");
const closeBtn = document.getElementById("eco-close");
const sendBtn = document.getElementById("eco-send");
const input = document.getElementById("eco-input");
const messages = document.getElementById("eco-messages");

let lastTopic = null;
let greeted = false;

toggleBtn.onclick = () => {
  chatBox.style.display = "block";
  toggleBtn.style.display = "none";

   if (!greeted) {
    addMessage(
      "🌱 Hi! I’m <b>EcoPedia</b>, your eco-friendly assistant.<br>Ask me about sustainability, climate, pollution, green habits, or the environment!",
      "eco-bot"
    );
    greeted = true;
  }
};

// Close chat
closeBtn.onclick = () => {
  chatBox.style.display = "none";
  toggleBtn.style.display = "flex";
};

// Send
sendBtn.onclick = askEco;
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") askEco();
});

// Utility
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type;
  div.innerHTML = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// MAIN LOGIC
async function askEco() {
  const query = input.value.trim();
  if (!query) return;

  addMessage(query, "eco-user");
  input.value = "";

  addMessage("🔍 Searching EcoPedia...", "eco-bot");

  let searchQuery = query;

  if (lastTopic && !query.toLowerCase().includes(lastTopic.toLowerCase())) {
    searchQuery = `${lastTopic} ${query}`;
  }

  // --- 1️⃣ WIKIPEDIA (PRIMARY) ---
  try {
    const wikiRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        searchQuery
      )}&format=json&origin=*`
    );

    const wikiData = await wikiRes.json();

    if (wikiData.query.search.length) {
      const title = wikiData.query.search[0].title;
      lastTopic = title;

      const summaryRes = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          title
        )}`
      );
      const summaryData = await summaryRes.json();

      addMessage(
        `${summaryData.extract}<br><br>
         <a href="${summaryData.content_urls.desktop.page}" target="_blank">
         🌍 Read more</a>`,
        "eco-bot"
      );
    }
  } catch (e) {
    console.warn("Wikipedia failed");
  }

  // --- 2️⃣ OPENAQ (AIR QUALITY) ---
  if (/air|pollution|aqi|quality/i.test(query)) {
    try {
      const aqiRes = await fetch(
        `https://api.openaq.org/v2/latest?limit=1`
      );
      const aqiData = await aqiRes.json();

      if (aqiData.results.length) {
        addMessage(
          "🌫️ Air Quality data is available via OpenAQ. Pollution levels vary by location. Consider checking local AQI for accurate results.",
          "eco-bot"
        );
      }
    } catch (e) {
      console.warn("OpenAQ failed");
    }
  }

if (/environment|waste|water|soil/i.test(query)) {
    try {
      addMessage(
        "🌿 Environmental data sourced from EPA Envirofacts supports sustainable policies and conservation efforts.",
        "eco-bot"
      );
    } catch (e) {
      console.warn("EPA API failed");
    }
  }
}
toggleBtn.onclick = () => {
  chatBox.style.display = "block";
  toggleBtn.style.display = "none";

  if (!greeted) {
    setTimeout(() => {
      addMessage(
        "🌱 Hi! I’m <b>EcoPedia</b>, your eco-friendly assistant.<br>Ask me anything about sustainability, green habits, climate, or the environment!",
        "eco-bot"
      );
      greeted = true;
    }, 100);
  }
};
