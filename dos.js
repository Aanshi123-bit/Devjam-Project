const ecoIdeas = [
  {
    quote: "💧 Save Water, Every Drop Counts!",
    img: "https://images.pexels.com/photos/2570439/pexels-photo-2570439.jpeg"
  },
  {
    quote: "♻️ Recycle Waste, Protect Nature!",
    img: "https://images.pexels.com/photos/5678734/pexels-photo-5678734.jpeg"
  },
  {
    quote: "🌱 Use Biodegradable Products!",
    img: "https://images.pexels.com/photos/32234335/pexels-photo-32234335.jpeg"
  },
  {
    quote: "⚡ Save Electricity, Switch Off Lights!",
    img: "https://images.pexels.com/photos/13325363/pexels-photo-13325363.jpeg"
  },
  {
    quote: "🌍 Use Renewable Energy!",
    img: "https://images.pexels.com/photos/12289285/pexels-photo-12289285.jpeg"
  },
  {
    quote: "🚯 Don’t Litter, Keep Earth Clean!",
    img: "https://images.pexels.com/photos/13995379/pexels-photo-13995379.jpeg"
  }
];

// Shuffle helper
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Assign unique ideas to each card
const cards = document.querySelectorAll(".card");
const shuffledIdeas = shuffle([...ecoIdeas]);

cards.forEach((card, index) => {
  const back = card.querySelector(".card-back");
  const idea = shuffledIdeas[index]; // unique idea for this card
  back.innerHTML = `
    <img src="${idea.img}" alt="Eco Idea">
    <p>${idea.quote}</p>
  `;
});

// Flip only for animation
function flipCard(card) {
  card.classList.toggle("flipped");
}
