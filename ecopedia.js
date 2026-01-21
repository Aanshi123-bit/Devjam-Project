const toggleBtn = document.getElementById("eco-toggle");
const chatBox = document.getElementById("eco-chat");
const closeBtn = document.getElementById("eco-close");
const sendBtn = document.getElementById("eco-send");
const input = document.getElementById("eco-input");
const messages = document.getElementById("eco-messages");

let lastTopic = null;
let greeted = false;


toggleBtn.addEventListener("click", () => {
  chatBox.style.display = "block";
  toggleBtn.style.display = "none";

  // Greeting appears ONCE and ONLY after chat is visible
  if (!greeted) {
    setTimeout(() => {
      addMessage(
        "🌱 Hi! I’m <b>EcoPedia</b>, your eco-friendly assistant.<br>Ask me about sustainability, green habits, climate, pollution, or the environment!",
        "eco-bot"
      );
      greeted = true;
    }, 200);
  }
});


closeBtn.addEventListener("click", () => {
  chatBox.style.display = "none";
  toggleBtn.style.display = "flex";
});


sendBtn.addEventListener("click", askEco);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") askEco();
});


function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type;
  div.innerHTML = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

async function askEco() {
  const query = input.value.trim();
  if (!query) return;

  addMessage(query, "eco-user");
  input.value = "";
   // ---------- AQI CITY / COUNTRY HANDLER ----------
if (/aqi|air quality/i.test(query)) {
  // Try to extract a city or country name
  const locationMatch = query.match(/of\s+([a-zA-Z\s]+)/i);

  if (locationMatch) {
    const location = locationMatch[1].trim();

    addMessage(
      `🌫️ <b>${location}</b> frequently experiences air quality variations due to factors like traffic emissions, industrial activity, weather conditions, and seasonal changes.<br><br>
      AQI values change hourly, so for live and accurate data, please check official air-quality dashboards such as government pollution control boards or trusted AQI platforms.`,
      "eco-bot"
    );

    return; // ⛔ stop here, no Wikipedia needed
  }
}


  addMessage("🔍 Searching EcoPedia...", "eco-bot");

  let searchQuery = query;

  // Context memory (follow-ups)
  if (lastTopic && !query.toLowerCase().includes(lastTopic.toLowerCase())) {
    searchQuery = `${lastTopic} ${query}`;
  }

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
    } else {
      addMessage(
        "Sorry, I couldn’t find anything relevant. Try rephrasing 🌿",
        "eco-bot"
      );
    }
  } catch (err) {
    addMessage("⚠️ Something went wrong. Please try again.", "eco-bot");
  }


  if (/air|pollution|aqi|quality/i.test(query)) {
    try {
      const aqiRes = await fetch("https://api.openaq.org/v2/latest?limit=1");
      const aqiData = await aqiRes.json();

      if (aqiData.results.length) {
        addMessage(
          "🌫️ Air quality data is available via OpenAQ. Pollution levels vary by location — check local AQI for accurate results.",
          "eco-bot"
        );
      }
    } catch (e) {
      console.warn("OpenAQ failed");
    }
  }

  if (/environment|waste|water|soil/i.test(query)) {
    addMessage(
      "🌿 Environmental insights are supported by EPA Envirofacts, helping promote conservation and sustainable policies.",
      "eco-bot"
    );
  }
}
