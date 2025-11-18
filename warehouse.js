document.addEventListener("DOMContentLoaded", () => {

  // ===== KIJELENTKEZÉS =====
  const logout = document.getElementById("logoutBtn");
  if (logout) {
    logout.addEventListener("click", () => {
      sessionStorage.clear();
      window.location.href = "login.html";
    });
  }

  // ===== JOBB OLDALI TÁBLÁZAT, KÉZI KÉSZLETNÖVELÉS =====
  const manualModal   = document.getElementById("orderModal");
  const productSelect = document.getElementById("productSelect");
  const amountInput   = document.getElementById("orderAmount");
  const orderOk       = document.getElementById("orderOk");
  const orderCancel   = document.getElementById("orderCancel");
  const tableBody     = document.getElementById("stockBody");

  document.getElementById("orderBtn").addEventListener("click", () => {
    // feltöltjük a selectet a jobb oldali táblából
    productSelect.innerHTML = "";
    [...tableBody.querySelectorAll("tr")].forEach(row => {
      const id   = row.children[0].textContent.trim();
      const name = row.children[1].textContent.trim();
      const op   = document.createElement("option");
      op.value   = id;
      op.textContent = `${id} - ${name}`;
      productSelect.appendChild(op);
    });
    amountInput.value = "";
    manualModal.style.display = "flex";
  });

  orderCancel.addEventListener("click", () => {
    manualModal.style.display = "none";
  });

  // Raktárkészlet (alkatresz_id -> { nev, qty })
  let stockMap = {};

  // Kézi készletnövelés: táblázat + stockMap frissítése
  orderOk.addEventListener("click", () => {
    const id = productSelect.value;
    const n  = parseInt(amountInput.value, 10);
    if (!n || n <= 0) {
      alert("Érvényes darabszámot adj meg!");
      return;
    }

    let rowFound = null;
    [...tableBody.querySelectorAll("tr")].forEach(row => {
      if (row.children[0].textContent.trim() === id) {
        rowFound = row;
      }
    });

    if (rowFound) {
      const cur    = parseInt(rowFound.children[2].textContent.trim(), 10) || 0;
      const newQty = cur + n;
      rowFound.children[2].textContent = newQty;
      if (stockMap[id]) {
        stockMap[id].qty = newQty;
      }
    }

    manualModal.style.display = "none";
  });

  // ===== BAL OLDAL: RENDELÉSLISTA =====
  const ordersListEl    = document.getElementById("ordersList");
  const newOrderCountEl = document.getElementById("newOrderCount");

  const seenKey   = "warehouse_seen_orders";
  let seenOrders  = new Set(JSON.parse(localStorage.getItem(seenKey) || "[]"));

  // ===== RAKTÁR BETÖLTÉSE DB-BŐL (get_products.php) =====
  async function loadStock() {
    try {
      const res = await fetch("get_products.php");
      if (!res.ok) {
        console.error("get_products.php HTTP hiba:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      stockMap = {};
      tableBody.innerHTML = "";

      data.forEach(item => {
        const id   = String(item.id);
        const name = item.nev;
        const qty  = parseInt(item.qty, 10) || 0;

        stockMap[id] = { nev: name, qty };

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${id}</td>
          <td>${name}</td>
          <td>${qty}</td>
        `;
        tableBody.appendChild(tr);
      });

      console.log("Raktárkészlet betöltve:", stockMap);
    } catch (e) {
      console.error("get_products.php hiba:", e);
    }
  }

  // ===== RENDELÉSEK BETÖLTÉSE (get_warehouse_orders.php) =====
  let orders = [];

  async function loadOrders() {
    try {
      const res = await fetch("get_warehouse_orders.php");
      if (!res.ok) {
        console.error("get_warehouse_orders.php HTTP hiba:", res.status, res.statusText);
        return;
      }
      const data = await res.json();
      orders = Array.isArray(data) ? data : [];
      renderOrders();
    } catch (e) {
      console.error("get_warehouse_orders.php hiba:", e);
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

  // ===== RÉSZLETEZŐ MODAL =====
  const detailsModal      = document.getElementById("orderDetailsModal");
  const closeDetailsModal = document.getElementById("closeDetailsModal");
  const customerBox       = document.getElementById("orderCustomerBox");
  const itemsBody         = document.getElementById("orderItemsBody");
  const forwardBtn        = document.getElementById("forwardBtn");

  let currentOrder = null;

  function openOrderDetails(ord) {
    currentOrder = ord;

    if (!seenOrders.has(ord.order_key)) {
      seenOrders.add(ord.order_key);
      localStorage.setItem(seenKey, JSON.stringify(Array.from(seenOrders)));
      renderOrders();
    }

    customerBox.innerHTML = `
      <p><strong>Név:</strong> ${ord.nev}</p>
      <p><strong>Cím:</strong> ${ord.helyszin || "-"}</p>
      <p><strong>Telefon:</strong> ${ord.telefon || "-"}</p>
      <p><strong>Dátum:</strong> ${ord.datum}</p>
      <p><strong>Státusz:</strong> ${ord.statusz || "-"}</p>
    `;

    itemsBody.innerHTML = "";

    // ord.items a get_warehouse_orders.php-ból: [{ alkatresz_id, mennyiseg }]
    ord.items.forEach(it => {
      const key = String(it.alkatresz_id);
      const st  = stockMap[key] || { nev: it.nev || "Ismeretlen", qty: 0 };
      const enough = (st.qty >= it.mennyiseg);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${st.nev}</td>
        <td>${it.mennyiseg}</td>
        <td>${st.qty}</td>
        <td>${enough ? "✔" : "❌"}</td>
      `;
      itemsBody.appendChild(tr);
    });

    detailsModal.style.display = "flex";
  }

  closeDetailsModal.addEventListener("click", () => {
    detailsModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === detailsModal) {
      detailsModal.style.display = "none";
    }
  });

  // ===== TOVÁBBÍTÁS SZERELŐKNEK =====
  forwardBtn.addEventListener("click", async () => {
    if (!currentOrder) return;

    const ok = confirm("Biztosan továbbítod a rendelést a szerelőknek?");
    if (!ok) return;

    try {
      const res = await fetch("forward_to_mechanic.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row_ids: currentOrder.row_ids })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        alert(data.message || "Hiba történt a továbbításkor.");
        return;
      }

      alert("Rendelés továbbítva a szerelőknek.");
      detailsModal.style.display = "none";
      await loadOrders();
    } catch (e) {
      console.error("forward_to_mechanic.php hiba:", e);
      alert("Hálózati hiba a továbbítás közben.");
    }
  });

  // ===== INDÍTÁS =====
  (async () => {
    await loadStock();   // raktárkészlet az alkatresz táblából (get_products.php)
    await loadOrders();  // projektek + tételek (get_warehouse_orders.php)
  })();

});
