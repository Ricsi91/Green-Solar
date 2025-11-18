document.addEventListener("DOMContentLoaded", () => {
    // ===== ÁRAJÁNLATOK BETÖLTÉSE =====
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
    const quoteList = document.getElementById("quoteList");
    const newCount = document.getElementById("newCount");
    const openOrderBtn = document.getElementById("openOrderBtn");
  
    let selectedQuote = null; // melyik árajánlat van kijelölve (checkbox)
  
    // ===== LISTA KIRAJZOLÁSA =====
    function renderQuotes() {
      quoteList.innerHTML = "";
  
      const unread = quotes.filter(q => !q.opened).length;
      newCount.textContent = unread > 0 ? String(unread) : "";
  
      quotes.forEach((q, index) => {
        const item = document.createElement("div");
        item.classList.add("quote-item");
        if (!q.opened) item.classList.add("unread");
  
        item.innerHTML = `
          <label class="quote-check" onclick="event.stopPropagation()">
            <input type="checkbox" class="selectQuote" data-index="${index}">
          </label>
          <div class="quote-text">
            <strong>${q.name}</strong> — ${q.date}
          </div>
        `;
  
        // kattintás: részletező modal megnyitása középen
        item.addEventListener("click", () => {
          openQuoteDetails(q, index);
        });
  
        quoteList.appendChild(item);
      });
  
      // checkbox változás: pontosan 1 legyen kijelölve
      document.querySelectorAll(".selectQuote").forEach(cb => {
        cb.addEventListener("change", () => {
          document.querySelectorAll(".selectQuote").forEach(x => {
            if (x !== cb) x.checked = false;
          });
          selectedQuote = cb.checked ? parseInt(cb.dataset.index, 10) : null;
          openOrderBtn.disabled = (selectedQuote === null);
        });
      });
  
      localStorage.setItem("quotes", JSON.stringify(quotes));
    }
  
    // ===== RÉSZLETEZŐ MODAL =====
    const detailsModal = document.getElementById("quoteDetailsModal");
    const detailsBox = document.getElementById("quoteDetailsBox");
    const closeDetails = document.getElementById("closeDetails");
  
    function openQuoteDetails(q, idx) {
      // megjelöljük olvasottnak és frissítjük a számlálót
      if (!q.opened) {
        q.opened = true;
        localStorage.setItem("quotes", JSON.stringify(quotes));
        renderQuotes();
      }
  
      detailsBox.innerHTML = `
        <p><strong>Név:</strong> ${q.name}</p>
        <p><strong>Cím:</strong> ${q.address}</p>
        <p><strong>Telefonszám:</strong> ${q.phone}</p>
        <p><strong>Email:</strong> ${q.email}</p>
        <p><strong>Típus:</strong> ${q.type || "-"}</p>
        <p><strong>Éves fogyasztás:</strong> ${q.consumption || "-"} kWh</p>
        <p><strong>Elhelyezés:</strong> ${q.placement || "-"}</p>
        <p><strong>Megjegyzés:</strong> ${q.message || "-"}</p>
        <p><strong>Dátum:</strong> ${q.date}</p>
      `;
      detailsModal.style.display = "flex";
    }
  
    closeDetails.addEventListener("click", () => detailsModal.style.display = "none");
    window.addEventListener("click", (e) => {
      if (e.target === detailsModal) detailsModal.style.display = "none";
    });
  
    // ===== TERMÉKEK BETÖLTÉSE SELECTBE =====
    function loadPartsIntoSelect(selectElem) {
      fetch("get_parts.php")
        .then(res => res.json())
        .then(parts => {
          selectElem.innerHTML = `<option value="">Válasszon...</option>`;
          parts.forEach(p => {
            const op = document.createElement("option");
            op.value = p.id;     // alkatresz_id
            op.textContent = p.nev;
            selectElem.appendChild(op);
          });
        })
        .catch(err => console.error("Hiba az alkatrészek töltésekor:", err));
    }
  
    // ===== SOR HOZZÁADÁSA =====
    const orderTableBody = document.getElementById("orderTableBody");
    const addRowBtn = document.getElementById("addRowBtn");
  
    function addRow() {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <select class="product-select"></select>
        </td>
        <td>
          <input type="number" min="1" value="1">
        </td>
        <td>
          <button class="delete-row">X</button>
        </td>
      `;
      const selectElem = tr.querySelector(".product-select");
      loadPartsIntoSelect(selectElem);
  
      tr.querySelector(".delete-row").onclick = () => tr.remove();
      orderTableBody.appendChild(tr);
    }
    addRowBtn.addEventListener("click", addRow);
  
    // ===== RENDELÉS MODAL =====
    const orderModal = document.getElementById("orderModal");
    const closeModal = document.getElementById("closeModal");
    const cancelOrder = document.getElementById("cancelOrder");
    const customerInfo = document.getElementById("customerInfo");
  
    openOrderBtn.addEventListener("click", () => {
      if (selectedQuote === null) return;
  
      const q = quotes[selectedQuote];
  
      customerInfo.innerHTML = `
        <p><strong>Név:</strong> ${q.name}</p>
        <p><strong>Cím:</strong> ${q.address}</p>
        <p><strong>Telefon:</strong> ${q.phone}</p>
        <p><strong>Email:</strong> ${q.email}</p>
      `;
  
      orderTableBody.innerHTML = "";
      addRow(); // első üres sor
  
      orderModal.style.display = "flex";
    });
  
    closeModal.onclick = () => orderModal.style.display = "none";
    cancelOrder.onclick = () => orderModal.style.display = "none";
    window.addEventListener("click", (e) => {
      if (e.target === orderModal) orderModal.style.display = "none";
    });
  
    // ===== KÜLDÉS (mentés adatbázisba) =====
    const sendOrder = document.getElementById("sendOrder");
    sendOrder.addEventListener("click", async () => {
      if (selectedQuote === null) {
        alert("Jelöld ki, melyik árajánlatból szeretnél rendelést leadni.");
        return;
      }
  
      const q = quotes[selectedQuote];
  
      // összegyűjtjük a sorokat
      const items = [];
      const rows = [...orderTableBody.querySelectorAll("tr")];
      for (const row of rows) {
        const partId = row.querySelector(".product-select").value;
        const qty = row.querySelector('input[type="number"]').value;
  
        if (!partId) {
          alert("Válassz terméket minden sorban!");
          return;
        }
        const qtyNum = parseInt(qty, 10);
        if (!qtyNum || qtyNum <= 0) {
          alert("A darabszám legyen 1 vagy annál nagyobb!");
          return;
        }
        items.push({ alkatresz_id: parseInt(partId, 10), mennyiseg: qtyNum });
      }
  
      const payload = {
        nev: q.name,
        helyszin: q.address,
        telefon: q.phone,
        items
      };
  
      try {
        const res = await fetch("save_project.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
  
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          console.error("Mentési hiba:", data);
          alert(data.message || "Hiba történt a mentés során.");
          return;
        }
  
        alert("Rendelés sikeresen továbbítva a raktárnak!");
        orderModal.style.display = "none";
  
      } catch (err) {
        console.error(err);
        alert("Hálózati hiba a mentés közben.");
      }
    });
  
    // ===== INDÍTÁS =====
    renderQuotes();
  });
  