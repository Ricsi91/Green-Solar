document.addEventListener("DOMContentLoaded", () => {

    // ===== KIJELENTKEZÉS =====
    const logout = document.getElementById("logoutBtn");
    if (logout) {
      logout.addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "login.html";
      });
    }
  
    const ordersListEl    = document.getElementById("ordersList");
    const newOrderCountEl = document.getElementById("newOrderCount");
    const noSelectionEl   = document.getElementById("noSelection");
    const detailsBoxEl    = document.getElementById("detailsBox");
    const customerBoxEl   = document.getElementById("customerBox");
    const itemsBodyEl     = document.getElementById("orderItemsBody");
    const completeBtn     = document.getElementById("completeBtn");
  
    let orders = [];
    let currentOrder = null;
  
    const seenKey   = "mechanic_seen_orders";
    let seenOrders  = new Set(JSON.parse(localStorage.getItem(seenKey) || "[]"));
  
    // ===== RENDELÉSEK BETÖLTÉSE (csak statusz_id = 3) =====
    async function loadOrders() {
      try {
        const res = await fetch("get_mechanic_orders.php");
        if (!res.ok) {
          console.error("get_mechanic_orders.php HTTP hiba:", res.status, res.statusText);
          return;
        }
        const data = await res.json();
        orders = Array.isArray(data) ? data : [];
        renderOrders();
  
        // ha nincs rendelés, tisztítsuk a részleteket
        if (orders.length === 0) {
          currentOrder = null;
          noSelectionEl.style.display = "block";
          detailsBoxEl.style.display  = "none";
        }
      } catch (e) {
        console.error("get_mechanic_orders.php hiba:", e);
      }
    }
  
    function renderOrders() {
      ordersListEl.innerHTML = "";
      let unread = 0;
  
      orders.forEach(ord => {
        const isNew = !seenOrders.has(ord.order_key);
        if (isNew) unread++;
  
        const box = document.createElement("div");
        box.className = "order-item" + (isNew ? " new" : "");
  
        box.innerHTML = `
          <span class="order-name">${ord.nev}</span>
          <span class="order-date">${ord.datum}</span>
          <span class="order-status">${ord.statusz || ""}</span>
        `;
  
        box.addEventListener("click", () => openOrderDetails(ord));
  
        ordersListEl.appendChild(box);
      });
  
      newOrderCountEl.textContent = unread > 0 ? String(unread) : "";
    }
  
    function openOrderDetails(ord) {
      currentOrder = ord;
  
      // jelöljük olvasottnak
      if (!seenOrders.has(ord.order_key)) {
        seenOrders.add(ord.order_key);
        localStorage.setItem(seenKey, JSON.stringify(Array.from(seenOrders)));
        renderOrders();
      }
  
      noSelectionEl.style.display = "none";
      detailsBoxEl.style.display  = "block";
  
      customerBoxEl.innerHTML = `
        <p><strong>Név:</strong> ${ord.nev}</p>
        <p><strong>Cím:</strong> ${ord.helyszin || "-"}</p>
        <p><strong>Telefon:</strong> ${ord.telefon || "-"}</p>
        <p><strong>Dátum:</strong> ${ord.datum}</p>
        <p><strong>Státusz:</strong> ${ord.statusz || "-"}</p>
      `;
  
      itemsBodyEl.innerHTML = "";
  
      // ord.items: [{ alkatresz_id, nev, mennyiseg }]
      ord.items.forEach(it => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${it.nev || ("Termék #" + it.alkatresz_id)}</td>
          <td>${it.mennyiseg}</td>
        `;
        itemsBodyEl.appendChild(tr);
      });
    }
  
    // ===== KÉSZRE JELENTÉS GOMB =====
    completeBtn.addEventListener("click", async () => {
      if (!currentOrder) {
        alert("Nincs kiválasztott rendelés.");
        return;
      }
  
      const ok = confirm("Biztosan készre jelentitek ezt a rendelést?");
      if (!ok) return;
  
      try {
        const res = await fetch("complete_project.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ row_ids: currentOrder.row_ids })
        });
  
        const data = await res.json().catch(() => ({}));
  
        if (!res.ok || !data.success) {
          alert(data.message || "Hiba történt a készre jelentéskor.");
          return;
        }
  
        alert("Rendelés sikeresen készre jelentve.");
        currentOrder = null;
        noSelectionEl.style.display = "block";
        detailsBoxEl.style.display  = "none";
  
        await loadOrders();  // eltűnik a listából, mert már nem statusz_id = 3
      } catch (e) {
        console.error("complete_project.php hiba:", e);
        alert("Hálózati hiba a készre jelentés közben.");
      }
    });
  
    // ===== INDÍTÁS =====
    loadOrders();
  
  });
  