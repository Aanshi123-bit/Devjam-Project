// Array of eco & air-quality related facts
const leafFacts = [
  "Trees absorb carbon dioxide and release oxygen, improving air quality.",
  "Air pollution causes over 7 million premature deaths worldwide each year.",
  "Indoor air can be 2–5 times more polluted than outdoor air.",
  "Planting trees in cities can reduce air pollution by up to 30%.",
  "PM2.5 particles are so small they can enter the bloodstream.",
  "Using public transport helps reduce harmful air pollutants.",
  "Ozone at ground level is harmful, but ozone in the upper atmosphere protects us.",
  "Cleaner air improves concentration, sleep quality, and overall health."
];

function showLeafFact() {
  const factContainer = document.getElementById('leafFact');
  const randomFact = leafFacts[Math.floor(Math.random() * leafFacts.length)];
  factContainer.innerText = randomFact;
  factContainer.style.display = 'block';
  setTimeout(()=>{ factContainer.style.display = 'none'; },5000);
}