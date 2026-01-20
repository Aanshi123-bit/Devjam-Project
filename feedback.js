document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".feedback-form");
  const feedback = document.getElementById("feedback");
  const suggestion = document.getElementById("suggestion");
  const interaction = document.getElementById("interaction");
  const ratingInputs = document.querySelectorAll("input[name='rating']");
  const submitBtn = form.querySelector("button[type='submit']");

  // Disable submit initially
  submitBtn.disabled = true;

  // Check if all fields are filled
  function validateForm() {
    const feedbackValid = feedback.value.trim() !== "";
    const suggestionValid = suggestion.value.trim() !== "";
    const interactionValid = interaction.value !== "";
    const ratingValid = Array.from(ratingInputs).some(r => r.checked);

    submitBtn.disabled = !(feedbackValid && suggestionValid && interactionValid && ratingValid);
  }

  // Attach listeners
  [feedback, suggestion, interaction, ...ratingInputs].forEach(el => {
    el.addEventListener("input", validateForm);
    el.addEventListener("change", validateForm);
  });

  // Handle submit
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop reload
    alert("🌟 Thanks for your feedback! 🌟");
    form.reset();
    submitBtn.disabled = true; // disable again after reset
  });
});
