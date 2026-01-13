let selectedCategory = null;
const body = document.body;
const toggleBtn = document.getElementById("themeToggle");

/* Theme Toggle */
toggleBtn.onclick = () => {
  body.classList.toggle("dark");
  body.classList.toggle("light");
  toggleBtn.textContent = body.classList.contains("dark") ? "🌙" : "☀";
};

/* Class Selection (Radio-button behavior) */
document.querySelectorAll(".class-card").forEach(card => {
  card.onclick = () => {
    document.querySelectorAll(".class-card")
      .forEach(c => c.classList.remove("active"));

    card.classList.add("active");
    selectedCategory = card.dataset.class;
  };
});

/* Prediction */
async function predict() {
  const input = document.getElementById("imageInput");
  const preview = document.getElementById("preview");
  const result = document.getElementById("result");

  if (!input.files[0]) {
    alert("Please upload an image");
    return;
  }

  const file = input.files[0];
  preview.innerHTML = `<img src="${URL.createObjectURL(file)}">`;
  result.innerHTML = "🧠 AI analyzing image...";

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  const predictedMain = data.class.split("_")[0];

  document.querySelectorAll(".class-card").forEach(card => {
    card.classList.toggle(
      "active",
      card.dataset.class === predictedMain
    );
  });

  if (selectedCategory && selectedCategory !== predictedMain) {
    result.innerHTML = `
      ❌ Wrong category selected<br>
      Suggested: <b style="color:#facc15">${predictedMain}</b><br>
      Confidence: ${data.confidence}%
    `;
  } else {
    result.innerHTML = `
      ✅ Correct classification<br>
      <b>${data.class}</b><br>
      Confidence: ${data.confidence}%
    `;
  }
}
