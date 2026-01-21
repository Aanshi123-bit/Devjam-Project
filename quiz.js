document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".options").forEach(optionGroup => {
    const options = Array.from(optionGroup.children);
    options.sort(() => Math.random() - 0.5)
           .forEach(option => optionGroup.appendChild(option));
  });
});

function submitQuiz() {
  const answers = {
    q1: "B",
    q2: "B",
    q3: "C",
    q4: "B",
    q5: "A"
  };

  let score = 0;
  let total = Object.keys(answers).length;

  for (let q in answers) {
    const selected = document.querySelector(`input[name="${q}"]:checked`);
    if (selected && selected.value === answers[q]) {
      score++;
    }
  }

  const result = document.getElementById("result");

  let message = "";
  if (score === 5) {
    message = "🌳 Eco Hero! You truly love the planet!";
  } else if (score >= 3) {
    message = "🍃 Good job! You're eco-conscious.";
  } else {
    message = "🌱 Time to go greener!";
  }

  result.innerHTML = `You scored <strong>${score}/${total}</strong><br>${message}`;

}
