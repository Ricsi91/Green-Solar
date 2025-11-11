document.addEventListener("DOMContentLoaded", () => {
  const regBtn = document.getElementById("regBtn");
  const hiba = document.getElementById("hibaUzenet");

  regBtn.addEventListener("click", async () => {
    const nev = document.getElementById("nev").value.trim();
    const felhasznalo = document.getElementById("felhasznalonev").value.trim();
    const jelszo = document.getElementById("jelszo").value.trim();

    if (!nev || !felhasznalo || !jelszo) {
      hiba.textContent = "Minden mezőt ki kell tölteni!";
      return;
    }

    hiba.textContent = "Küldés folyamatban...";

    try {
      const response = await fetch("register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          nev,
          felhasznalo,
          jelszo,
          jogosultsag_id: 3
        })
      });

      const text = await response.text(); // 💡 fontos: előbb nyers szöveget olvasunk
      console.log("RAW válasz:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Nem sikerült JSON-ná alakítani a választ");
      }

      if (data.status === "ok") {
        hiba.style.color = "green";
        hiba.textContent = "✅ Sikeres regisztráció!";
        setTimeout(() => (window.location.href = "login.html"), 1500);
      } else {
        hiba.style.color = "red";
        hiba.textContent = data.error || "Hiba történt a regisztráció során!";
      }
    } catch (err) {
      console.error("Hálózati vagy feldolgozási hiba:", err);
      hiba.style.color = "red";
      hiba.textContent = "⚠️ Hálózati vagy szerverhiba!";
    }
  });
});
