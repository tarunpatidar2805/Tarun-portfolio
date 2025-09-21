document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🔄 Button loading state
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    const formData = {
      name: document.getElementById("name").value,
      education: document.getElementById("education").value,
      profession: document.getElementById("profession").value,
      other: document.getElementById("other").value,
      email: document.getElementById("email").value,
      whatsapp: document.getElementById("whatsapp").value,
      description: document.getElementById("description").value,
    };

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        // ✅ Success
        submitBtn.innerText = "Submitted ✅";
        submitBtn.classList.remove("btn-primary");
        submitBtn.classList.add("btn-success");

        form.reset();
      } else {
        // ❌ Error
        submitBtn.innerText = "Send Message";
        submitBtn.disabled = false;
        alert("❌ Error: " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      // ⚠️ Server error
      submitBtn.innerText = "Send Message";
      submitBtn.disabled = false;
      alert("⚠️ Server not responding!");
      console.error(err);
    }
  });
});
