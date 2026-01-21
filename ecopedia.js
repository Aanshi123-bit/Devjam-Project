const toggle = document.getElementById("eco-toggle");
const chat = document.getElementById("eco-chat");
const closeBtn = document.getElementById("eco-close");
const messages = document.getElementById("eco-messages");
const input = document.getElementById("eco-input");
const send = document.getElementById("eco-send");

// Toggle chat
toggle.addEventListener("click", () => chat.style.display = "flex");
closeBtn.addEventListener("click", () => chat.style.display = "none");

// Add message to chat
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type === "user" ? "eco-user" : "eco-bot";
  div.innerHTML = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// Initial greeting
addMessage("I’m EcoPedia, your eco-friendly assistant. Ask me anything about sustainability, green habits and more!", "bot");

// Main function
async function askEcoPedia() {
  const query = input.value.trim();
  if (!query) return;

  addMessage(query, "user");
  input.value = "";

  addMessage("Searching for answers...", "bot");

  let responseText = "";

  try {
    // --- Wikipedia API ---
    const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
    const wikiData = await wikiRes.json();
    if (wikiData.extract) responseText += `<strong>Wikipedia:</strong> ${wikiData.extract}<br><br>`;

    // --- OpenWeatherMap example ---
    // Replace CITY_NAME and YOUR_API_KEY with actual values if you want live weather info
    /*
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=CITY_NAME&appid=YOUR_API_KEY&units=metric`);
    const weatherData = await weatherRes.json();
    responseText += `<strong>Weather:</strong> ${weatherData.weather[0].description}, ${weatherData.main.temp}°C<br><br>`;
    */

    // --- NewsAPI example ---
    // Replace YOUR_API_KEY with your NewsAPI key
    /*
    const newsRes = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=YOUR_API_KEY`);
    const newsData = await newsRes.json();
    if(newsData.articles && news

