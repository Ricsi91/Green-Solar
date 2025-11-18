document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const hiba = document.getElementById("hibaUzenet");

  loginBtn.addEventListener("click", () => {
    const felhasznalonev = document.getElementById("felhasznalonev").value.trim();
    const jelszo = document.getElementById("jelszo").value.trim();

    // előző hibaüzenet törlése
    hiba.textContent = "";

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
        const text = await res.text();

        if (!res.ok) {
          // ha nem 200, próbáljuk kiírni a nyers választ
          console.error("Szerverhiba válasz:", text);
          throw new Error("Szerverhiba: " + res.status);
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Nem sikerült JSON-né alakítani a választ:", text);
          throw new Error("Érvénytelen JSON válasz az auth.php-től");
        }

        return data;
      })
      .then((data) => {
        console.log("Login válasz:", data);

        // auth.php sikeres válasz: { status: "ok", user: {...} }
        if (data.status === "ok" && data.user) {
          // 🔹 user objektum elmentése – EZT fogja használni az auth.js
          sessionStorage.setItem("user", JSON.stringify(data.user));

          // Ha máshol még a 'felhasznalo' kulcsra hivatkozol, maradhat ez is:
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
