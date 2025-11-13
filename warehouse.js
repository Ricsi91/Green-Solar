// =========================
// RAKTÁRKÉSZLET BEOLVASÁSA
// =========================

const stock = {};
document.querySelectorAll("#stockBody tr").forEach(row => {
    const id = row.children[0].textContent.trim();
    const name = row.children[1].textContent.trim();
    const qty = parseInt(row.children[2].textContent.trim());
    stock[id] = { name, qty };
});

// =========================
// MINTA RENDELÉSEK
// =========================

let orders = [
    {
        id: 1,
        nev: "Kovács Imre",
        datum: "2025-01-24",
        statusz: "Új rendelés",
        megnyitva: false,
        tetel: [
            { termek: "1001", kell: 4 },
            { termek: "1002", kell: 1 }
        ]
    },
    {
        id: 2,
        nev: "Kiss Péter",
        datum: "2025-01-23",
        statusz: "Áru rendelés alatt",
        megnyitva: true,
        tetel: [
            { termek: "1003", kell: 10 }
        ]
    }
];

// =========================
// UI FRISSÍTÉS
// =========================

const orderList = document.getElementById("orderList");
const newOrderCount = document.getElementById("newOrderCount");
const orderDetails = document.getElementById("orderDetails");

function updateOrderList() {

    orderList.innerHTML = "";
    let uj = 0;

    orders.forEach(ord => {

        if (!ord.megnyitva) uj++;

        const li = document.createElement("li");
        li.textContent = `${ord.nev} – ${ord.datum} – ${ord.statusz}`;
        if (!ord.megnyitva) li.classList.add("new");

        li.addEventListener("click", () => openOrder(ord.id));
        orderList.appendChild(li);
    });

    if (uj > 0) {
        newOrderCount.textContent = uj;
        newOrderCount.classList.remove("hidden");
    } else {
        newOrderCount.classList.add("hidden");
    }
}

updateOrderList();

// =========================
// RENDELÉS MEGNYITÁSA
// =========================

function openOrder(id) {
    const ord = orders.find(o => o.id === id);
    ord.megnyitva = true;
    updateOrderList();

    let html = `
        <h3>${ord.nev}</h3>
        <p><strong>Dátum:</strong> ${ord.datum}</p>
        <p><strong>Állapot:</strong> ${ord.statusz}</p>

        <table>
            <thead>
                <tr>
                    <th>Termék</th>
                    <th>Kell</th>
                    <th>Raktáron</th>
                    <th>Elég?</th>
                </tr>
            </thead>
            <tbody>
    `;

    ord.tetel.forEach(t => {
        const stockItem = stock[t.termek];
        const enough = stockItem.qty >= t.kell;

        html += `
            <tr class="${enough ? "" : "low"}">
                <td>${stockItem.name}</td>
                <td>${t.kell}</td>
                <td>${stockItem.qty}</td>
                <td>${enough ? "✔" : "❌"}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>

        <div class="actions">
            <button onclick="setStatus(${id}, 'Áru rendelés alatt')">Áru rendelés alatt</button>
            <button onclick="setStatus(${id}, 'Továbbítva')">Továbbítva</button>
        </div>
    `;

    orderDetails.innerHTML = html;
    orderDetails.classList.remove("hidden");
}

// =========================
// ÁLLAPOT VÁLTÁS
// =========================

function setStatus(id, newStatus) {
    const ord = orders.find(o => o.id === id);
    ord.statusz = newStatus;
    openOrder(id);
    updateOrderList();
}
