const assistant = document.getElementById("wiki-assistant");
const toggle = document.getElementById("eco-toggle");
const chat = document.getElementById("wiki-chat");
const closeBtn = document.getElementById("wiki-close");
const messages = document.getElementById("wiki-messages");
const input = document.getElementById("wiki-input");
const sendBtn = document.getElementById("wiki-send");

toggle.addEventListener("click", () => {
  chat.style.display = chat.style.display === "block" ? "none" : "block";
});

closeBtn.addEventListener("click", () => {
  chat.style.display = "none";
});


function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type;
  div.innerHTML = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// --- Universal query cleaner ---
function cleanQuery(query) {
  query = query.toLowerCase();
  query = query.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
  const stopwords = ["what","is","the","a","an","about","okay","how","do","you","please","can","i","tell","me","my","and","for","of","to","in"];
  const words = query.split(" ").filter(word => !stopwords.includes(word));
  return words.join(" ");
}


async function askEcoPedia() {
  const query = input.value.trim();
  if (!query) return;

  // Initial greeting if first message
  if (messages.childElementCount === 0) {
    addMessage("I’m EcoPedia, your eco-friendly assistant. Ask me anything about sustainability, green habits and more!", "wiki-bot");
  }

  addMessage(query, "wiki-user");
  input.value = "";

  addMessage("Searching for the best answer...", "wiki-bot");


  const cleanedQuery = cleanQuery(query);

  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanedQuery)}&utf8=&format=json&origin=*`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.query.search.length > 0) {
      const snippet = data.query.search[0].snippet.replace(/<\/?[^>]+(>|$)/g, ""); // remove HTML tags
      addMessage(snippet + `... <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(data.query.search[0].title)}" target="_blank">Read more</a>`, "wiki-bot");
    } else {
      addMessage("Sorry, I couldn't find an answer on Wikipedia.", "wiki-bot");
    }
  } catch (err) {
    addMessage("Oops! Something went wrong while searching.", "wiki-bot");
    console.error(err);
  }
}

sendBtn.addEventListener("click", askEcoPedia);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") askEcoPedia();
});
