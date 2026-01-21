const toggleBtn = document.getElementById("eco-toggle");
const chatBox = document.getElementById("eco-chat");
const closeBtn = document.getElementById("eco-close");
const sendBtn = document.getElementById("eco-send");
const input = document.getElementById("eco-input");
const messages = document.getElementById("eco-messages");

let lastTopic = null; // light context memory

toggleBtn.onclick = () => {
  chatBox.style.display = "block";
  toggleBtn.style.display = "none";
};

closeBtn.onclick = () => {
  chatBox.style.display = "none";
  toggleBtn.style.display = "block";
};

sendBtn.onclick = askEco;
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

  addMessage("Searching EcoPedia...", "eco-bot");

  let searchQuery = query;

  // Handle follow-up questions
  if (
    lastTopic &&
    !query.toLowerCase().includes(lastTopic.toLowerCase())
  ) {
    searchQuery = `${lastTopic} ${query}`;
  }

  try {
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        searchQuery
      )}&format=json&origin=*`
    );

    const searchData = await searchRes.json();

    if (!searchData.query.search.length) {
      addMessage("I couldn't find anything relevant.", "eco-bot");
      return;
    }

    const title = searchData.query.search[0].title;
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
       Read more</a>`,
      "eco-bot"
    );
  } catch (err) {
    addMessage("Something went wrong. Please try again.", "eco-bot");
  }
}
