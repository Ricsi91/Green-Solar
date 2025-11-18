document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.querySelector("#felhasznalokTabla tbody");
  const hozzaadBtn = document.getElementById("hozzaad");
  const torlesBtn = document.getElementById("torlesGomb");
  const modositasBtn = document.getElementById("modositasGomb");
  const jogosultsagSelect = document.getElementById("jogosultsag");

  let editingId = null; // ha nem null, akkor módosítás mód

  function uritForm() {
    document.getElementById("nev").value = "";
    document.getElementById("felhasznalonev").value = "";
    document.getElementById("jelszo").value = "";
    if (jogosultsagSelect) jogosultsagSelect.value = "";
    editingId = null;
    hozzaadBtn.textContent = "➕ Hozzáadás";
  }

  // 🔹 JOGOSULTSÁGOK BETÖLTÉSE A TÁBLÁBÓL A SELECT-BE
  function loadRoles() {
    if (!jogosultsagSelect) return;

    fetch("proba.php?action=roles")
      .then(res => res.json())
      .then(data => {
        jogosultsagSelect.innerHTML = "";
        // placeholder
        const opt0 = document.createElement("option");
        opt0.value = "";
        opt0.textContent = "Válassz jogosultságot...";
        jogosultsagSelect.appendChild(opt0);

        if (!data || data.error) {
          console.error("Hiba a jogosultságok lekérésekor:", data && data.error);
          return;
        }

        data.forEach(role => {
          const op = document.createElement("option");
          op.value = role.ID; // DB ID
          op.textContent = role.Jogosultság;
          jogosultsagSelect.appendChild(op);
        });
      })
      .catch(err => {
        console.error("Hiba a jogosultságok lekérésekor:", err);
      });
  }

  // 🔹 Adatok betöltése (felhasználók)
  function betoltFelhasznalok() {
    fetch("proba.php?action=read")
      .then(res => res.json())
      .then(data => {
        tabla.innerHTML = "";

        if (!data || data.length === 0 || data.error) {
          const tr = document.createElement("tr");
          const td = document.createElement("td");
          td.colSpan = 6;
          td.textContent = data && data.error
            ? "Hiba: " + data.error
            : "Nincs adat a táblában.";
          td.style.textAlign = "center";
          tr.appendChild(td);
          tabla.appendChild(tr);
          return;
        }

        data.forEach(user => {
          const tr = document.createElement("tr");

          // Checkbox cella
          const tdCb = document.createElement("td");
          const cb = document.createElement("input");
          cb.type = "checkbox";
          cb.className = "row-check";
          cb.dataset.id = user.ID;
          tdCb.appendChild(cb);

          // Adat cellák
          const tdID = document.createElement("td");
          tdID.textContent = user.ID;

          const tdNev = document.createElement("td");
          tdNev.textContent = user.Név;

          const tdFelhasznalo = document.createElement("td");
          tdFelhasznalo.textContent = user.Felhasználónév;

          const tdJelszo = document.createElement("td");
          tdJelszo.textContent = user.Jelszó;

          const tdJog = document.createElement("td");
          tdJog.textContent = user.Jogosultság ?? "-";

          // jogosultság ID eltárolása a soron (későbbi módosításhoz)
          tr.dataset.jogid = user.JogosultsagID ?? "";

          tr.append(tdCb, tdID, tdNev, tdFelhasznalo, tdJelszo, tdJog);
          tabla.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Hiba a betöltésnél:", err);
        tabla.innerHTML =
          "<tr><td colspan='6' style='text-align:center;'>Hiba történt az adatok lekérésekor.</td></tr>";
      });
  }

  // 🔹 Hozzáadás / Mentés (új vagy módosított felhasználó)
  hozzaadBtn.addEventListener("click", () => {
    const nev = document.getElementById("nev").value.trim();
    const felhasznalo = document.getElementById("felhasznalonev").value.trim();
    const jelszo = document.getElementById("jelszo").value.trim();
    const jogId = jogosultsagSelect ? jogosultsagSelect.value : "";

    if (!nev || !felhasznalo || !jelszo) {
      alert("Minden mezőt ki kell tölteni!");
      return;
    }

    if (!jogId) {
      alert("Válassz jogosultságot!");
      return;
    }

    const body = {
      nev,
      felhasznalo,
      jelszo,
      jogosultsag_id: parseInt(jogId, 10)
    };

    let action = "add";
    if (editingId !== null) {
      action = "update";
      body.id = parseInt(editingId, 10);
    }

    fetch("proba.php?action=" + action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(async res => {
        const text = await res.text();
        let data = {};
        try {
          if (text) {
            data = JSON.parse(text);
          }
        } catch (e) {
          console.error("Nem JSON válasz (" + action + "):", text);
          alert("Szerverhiba: nem JSON válasz érkezett (" + action + ").");
          return;
        }

        if (!res.ok || data.error) {
          console.error("Hiba a " + action + " műveletnél:", data.error || res.status);
          alert("Hiba történt mentés közben: " + (data.error || res.status));
          return;
        }

        uritForm();
        betoltFelhasznalok();
      })
      .catch(err => {
        console.error("Hiba a " + action + " műveletnél:", err);
        alert("Hiba történt mentés közben.");
      });
  });

  // 🔹 Módosítás – kijelölt sor betöltése a formba
  modositasBtn.addEventListener("click", () => {
    const kijeloltek = [...document.querySelectorAll(".row-check:checked")];

    if (kijeloltek.length === 0) {
      alert("Jelölj ki egy sort a módosításhoz!");
      return;
    }
    if (kijeloltek.length > 1) {
      alert("Egyszerre csak egy felhasználót módosíthatsz!");
      return;
    }

    const cb = kijeloltek[0];
    const tr = cb.closest("tr");
    if (!tr) return;

    const nev = tr.children[2].textContent.trim();
    const felhasznalo = tr.children[3].textContent.trim();
    const jelszo = tr.children[4].textContent.trim();
    const jogId = tr.dataset.jogid || "";

    document.getElementById("nev").value = nev;
    document.getElementById("felhasznalonev").value = felhasznalo;
    document.getElementById("jelszo").value = jelszo;
    if (jogosultsagSelect && jogId) {
      jogosultsagSelect.value = String(jogId);
    }

    editingId = cb.dataset.id;   // ezt küldjük update-nél
    hozzaadBtn.textContent = "💾 Mentés";
  });

  // 🔹 Kijelöltek törlése
  torlesBtn.addEventListener("click", () => {
    const kijeloltek = [...document.querySelectorAll(".row-check:checked")];
    if (kijeloltek.length === 0) {
      alert("Nincs kijelölt sor!");
      return;
    }

    if (!confirm("Biztosan törölni szeretnéd a kijelölt sorokat?")) return;

    const ids = kijeloltek.map(cb => parseInt(cb.dataset.id, 10));

    fetch("proba.php?action=deleteMany", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids })
    })
      .then(async res => {
        const text = await res.text();
        let data = {};
        try {
          if (text) {
            data = JSON.parse(text);
          }
        } catch (e) {
          console.error("Nem JSON válasz (deleteMany):", text);
          alert("Szerverhiba: nem JSON válasz érkezett (deleteMany).");
          return;
        }

        if (!res.ok || data.error) {
          console.error("Hiba törléskor:", data.error || res.status);
          alert("Hiba történt törlés közben: " + (data.error || res.status));
          return;
        }

        betoltFelhasznalok();
      })
      .catch(err => {
        console.error("Hiba a törlésnél:", err);
        alert("Hiba történt törlés közben.");
      });
  });

  // 🔹 Induláskor: előbb jogosultságok, aztán felhasználók
  loadRoles();
  betoltFelhasznalok();
});
