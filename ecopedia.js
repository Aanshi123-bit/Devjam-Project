<script>
const toggle = document.getElementById("eco-toggle");
const chat = document.getElementById("eco-chat");
const closeBtn = document.getElementById("eco-close");
const sendBtn = document.getElementById("eco-send");
const input = document.getElementById("eco-input");
const messages = document.getElementById("eco-messages");

toggle.onclick = () => {
  chat.style.display = "flex";
  addBot("I’m EcoPedia 🌱 Ask me about sustainability, climate, air quality, or eco-friendly habits!");
};

closeBtn.onclick = () => chat.style.display = "none";

sendBtn.onclick = handleQuery;

function addUser(text) {
  messages.innerHTML += `<div class="eco-user">${text}</div>`;
}

function addBot(text) {
  messages.innerHTML += `<div class="eco-bot">${text}</div>`;
  messages.scrollTop = messages.scrollHeight;
}

async function handleQuery() {
  const q = input.value.trim();
  if (!q) return;

  addUser(q);
  input.value = "";

  if (q.toLowerCase().includes("air")) {
    getAirQuality();
  } else if (q.toLowerCase().includes("climate")) {
    getClimate();
  } else {
    searchWikipedia(q);
  }
}

/* 🌍 Wikipedia */
async function searchWikipedia(query) {
  addBot("Searching Wikipedia...");
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
  );
  const data = await res.json();
  addBot(data.extract || "I couldn’t find that topic.");
}

/* 🌫️ Air Quality (OpenAQ) */
async function getAirQuality() {
  addBot("Fetching air quality data...");
  const res = await fetch("https://api.openaq.org/v2/latest?limit=1");
  const data = await res.json();
  const pm25 = data.results[0].measurements[0].value;
  addBot(`Current PM2.5 level: ${pm25} µg/m³`);
}

/* 🌡️ Climate (Open-Meteo) */
async function getClimate() {
  addBot("Checking climate info...");
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current_weather=true"
  );
  const data = await res.json();
  addBot(`Temperature: ${data.current_weather.temperature}°C`);
}
</script>
