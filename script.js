document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.querySelector("#felhasznalokTabla tbody");
  const hozzaadBtn = document.getElementById("hozzaad");
  const torlesBtn = document.getElementById("torlesGomb");

  // 🔹 Adatok betöltése
  function betoltFelhasznalok() {
    fetch("proba.php?action=read")
      .then(res => res.json())
      .then(data => {
        tabla.innerHTML = "";

        if (!data || data.length === 0) {
          const tr = document.createElement("tr");
          const td = document.createElement("td");
          td.colSpan = 6;
          td.textContent = "Nincs adat a táblában.";
          td.style.textAlign = "center";
          tr.appendChild(td);
          tabla.appendChild(tr);
          return;
        }

        data.forEach(user => {
          const tr = document.createElement("tr");

          // 🔹 Checkbox cella
          const tdCb = document.createElement("td");
          const cb = document.createElement("input");
          cb.type = "checkbox";
          cb.className = "row-check";
          cb.dataset.id = user.ID;
          tdCb.appendChild(cb);

          // 🔹 További cellák
          const tdID = document.createElement("td");
          tdID.textContent = user.ID;

          const tdNev = document.createElement("td");
          tdNev.textContent = user.Név;

          const tdFelhasznalo = document.createElement("td");
          tdFelhasznalo.textContent = user.Felhasználónév;

          const tdJelszo = document.createElement("td");
          tdJelszo.textContent = user.Jelszó;

          const tdJog = document.createElement("td");
          tdJog.textContent = user.Jogosultság ?? "-"; // ha nincs megadva, kötőjel

          tr.append(tdCb, tdID, tdNev, tdFelhasznalo, tdJelszo, tdJog);
          tabla.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Hiba a betöltésnél:", err);
        tabla.innerHTML = "<tr><td colspan='6' style='text-align:center;'>Hiba történt az adatok lekérésekor.</td></tr>";
      });
  }

  // 🔹 Új felhasználó hozzáadása
  hozzaadBtn.addEventListener("click", () => {
    const nev = document.getElementById("nev").value.trim();
    const felhasznalo = document.getElementById("felhasznalonev").value.trim();
    const jelszo = document.getElementById("jelszo").value.trim();

    if (!nev || !felhasznalo || !jelszo) {
      alert("Minden mezőt ki kell tölteni!");
      return;
    }

    fetch("proba.php?action=add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nev, felhasznalo, jelszo })
    })
      .then(() => {
        document.getElementById("nev").value = "";
        document.getElementById("felhasznalonev").value = "";
        document.getElementById("jelszo").value = "";
        betoltFelhasznalok();
      })
      .catch(err => console.error("Hiba a hozzáadásnál:", err));
  });

  // 🔹 Kijelöltek törlése
  torlesBtn.addEventListener("click", () => {
    const kijeloltek = [...document.querySelectorAll(".row-check:checked")];
    if (kijeloltek.length === 0) {
      alert("Nincs kijelölt sor!");
      return;
    }

    if (!confirm("Biztosan törölni szeretnéd a kijelölt sorokat?")) return;

    const ids = kijeloltek.map(cb => cb.dataset.id);

    fetch("proba.php?action=deleteMany", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids })
    })
      .then(() => betoltFelhasznalok())
      .catch(err => console.error("Hiba a törlésnél:", err));
  });

  // 🔹 Betöltés induláskor
  betoltFelhasznalok();
});
