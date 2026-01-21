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

  // --- AQI by city ---
  if (/aqi|air quality/i.test(query)) {
    const locationMatch = query.match(/in\s+([a-zA-Z\s]+)/i) || query.match(/of\s+([a-zA-Z\s]+)/i);

    if (locationMatch) {
      const location = locationMatch[1].trim();

      try {
        const aqiRes = await fetch(
          `https://api.openaq.org/v2/latest?city=${encodeURIComponent(location)}&limit=1`
        );
        const aqiData = await aqiRes.json();

        if (aqiData.results && aqiData.results.length > 0) {
          const measurements = aqiData.results[0].measurements;
          let output = `<b>🌫️ Air Quality in ${location}</b>:<br>`;
          measurements.forEach((m) => {
            output += `${m.parameter.toUpperCase()}: ${m.value} ${m.unit}<br>`;
          });
          addMessage(output, "eco-bot");
        } else {
          addMessage(`Sorry, I couldn't find AQI data for ${location}.`, "eco-bot");
        }
      } catch (err) {
        console.warn("OpenAQ request failed", err);
        addMessage(`⚠️ Error fetching AQI for ${location}.`, "eco-bot");
      }

      return; // stop further processing
    }
  }

  addMessage("🔍 Searching EcoPedia...", "eco-bot");

  // --- Wikipedia search ---
  let searchQuery = query;

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
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
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
    addMessage("⚠️ Something went wrong while fetching information. Please try again.", "eco-bot");
  }

  // --- Extra eco insights ---
  // General AQI info
  if (/air|pollution|aqi|quality/i.test(query)) {
    addMessage(
      "🌫️ Air quality data is available via OpenAQ. Pollution levels vary by location — check local AQI for accurate results.",
      "eco-bot"
    );
  }

  // Environmental facts
  if (/environment|waste|water|soil/i.test(query)) {
    addMessage(
      "🌿 Environmental insights are supported by EPA Envirofacts, promoting conservation and sustainable policies.",
      "eco-bot"
    );
  }

  // Climate / CO2 info
  if (/climate|temperature|co2/i.test(query)) {
    addMessage(
      "🌎 Climate info is tracked by NASA Earth Data: global CO₂ levels, temperature trends, and climate monitoring.",
      "eco-bot"
    );
  }

  // Green habits tips
  if (/green habit|sustainable|recycle|compost/i.test(query)) {
    addMessage(
      "♻️ Tip: Reduce waste by composting, saving water, and switching to renewable energy sources. Small actions make a big impact!",
      "eco-bot"
    );
  }

  // Eco facts
  if (/fact|did you know/i.test(query)) {
    addMessage(
      "🌱 Did you know? Planting just 10 trees can absorb ~1 ton of CO₂ over 40 years!",
      "eco-bot"
    );
  }

  // Friendly responses
  if (/thank|thanks/i.test(query)) {
    addMessage(
      "🌿 You’re welcome! Keep the planet green 🌱",
      "eco-bot"
    );
  }
}
