document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const hiba = document.getElementById("hibaUzenet");

  loginBtn.addEventListener("click", () => {
    const felhasznalonev = document.getElementById("felhasznalonev").value.trim();
    const jelszo = document.getElementById("jelszo").value.trim();

    if (!felhasznalonev || !jelszo) {
      hiba.textContent = "Minden mezőt ki kell tölteni!";
      return;
    }

    // FormData létrehozása (POST küldéshez)
    const formData = new FormData();
    formData.append("felhasznalonev", felhasznalonev);
    formData.append("jelszo", jelszo);

    fetch("auth.php", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error("Szerverhiba: " + text);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Login válasz:", data);

        if (data.status === "ok") {
          sessionStorage.setItem("felhasznalo", JSON.stringify(data.user));
          // 🔹 Sikeres bejelentkezés után a homepage-re visz
          window.location.href = "homepage.html";
        } else {
          hiba.textContent = data.error || "Hibás felhasználónév vagy jelszó.";
        }
      })
      .catch((err) => {
        console.error("Hálózati vagy feldolgozási hiba:", err);
        hiba.textContent = "Hálózati hiba történt! Részletek a konzolban.";
      });
  });
});
