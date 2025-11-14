<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Raktárkezelés</title>
    <link rel="stylesheet" href="warehouse.css">
</head>

<body>

    <!-- FELSŐ FEJLÉC -->
    <header class="top-header">
        <div class="contact-info">
            <span>Email: info@greensolar.hu</span>
            <span>Telefon: +36 30 123 4567</span>
        </div>
    </header>

    <header class="main-header">
        <div class="logo">
            <a href="homepage.php">Green Solar</a>
        </div>
        <nav class="menu">
            <a href="homepage.php">Kezdőlap</a>
            <a href="product.php">Termékek</a>
            <a href="services.php">Szolgáltatások</a>
            <a href="warehouse.php" class="active">Raktár</a>
            <a href="index.php" class="admin-btn">Admin</a>
            <a id="logoutBtn" class="logout-btn">Kijelentkezés</a>
        </nav>
    </header>

    <main>

        <div class="layout">

            <!-- BAL OLDALI MENÜ -->
            <div class="left-menu">

                <button id="orderBtn">Áru rendelés</button>

                <h3 class="orders-title">
                    Fogyasztói rendelések 
                    <span id="newOrderCount" class="new-order-count">3</span>
                </h3>

                <div class="orders-box" id="ordersList">

                    <div class="order-item new">
                        <span class="order-name">Kovács Béla</span>
                        <span class="order-date">2025-02-02</span>
                        <span class="order-status">Áru rendelés alatt</span>
                    </div>

                    <div class="order-item">
                        <span class="order-name">Nagy Mária</span>
                        <span class="order-date">2025-02-01</span>
                        <span class="order-status">Továbbítva</span>
                    </div>

                    <div class="order-item">
                        <span class="order-name">Szabó László</span>
                        <span class="order-date">2025-01-30</span>
                        <span class="order-status">Továbbítva</span>
                    </div>

                </div>

            </div>

            <!-- JOBB OLDAL – TÁBLÁZAT -->
            <div class="content">
                <h2>Raktárkészlet</h2>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Termék neve</th>
                                <th>Darabszám</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1001</td>
                                <td>Napelem panel 450W</td>
                                <td>12</td>
                            </tr>
                            <tr>
                                <td>1002</td>
                                <td>Inverter 5kW</td>
                                <td>4</td>
                            </tr>
                            <tr>
                                <td>1003</td>
                                <td>Kábel szett</td>
                                <td>35</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </main>

    <footer>
        © <?php echo date('Y'); ?> Green Solar – Minden jog fenntartva
    </footer>

    <div id="orderModal" class="modal">
        <div class="modal-content">
            <h2>Áru rendelése</h2>

            <label>Válaszd ki a terméket:</label>
            <select id="productSelect"></select>

            <label>Darabszám:</label>
            <input type="number" id="orderAmount" min="1" placeholder="0">

            <div class="modal-buttons">
                <button id="orderCancel">Mégse</button>
                <button id="orderOk" class="ok">OK</button>
            </div>
        </div>
    </div>

<script>
document.addEventListener("DOMContentLoaded", () => {

    const logout = document.getElementById("logoutBtn");
    if (logout) {
      logout.addEventListener("click", () => {
          sessionStorage.clear();
          window.location.href = "login.php";
      });
    }

    const modal = document.getElementById("orderModal");
    const productSelect = document.getElementById("productSelect");
    const amountInput = document.getElementById("orderAmount");
    const orderOk = document.getElementById("orderOk");
    const orderCancel = document.getElementById("orderCancel");

    const table = document.querySelector("table tbody");

    document.getElementById("orderBtn").addEventListener("click", () => {
        productSelect.innerHTML = "";

        [...table.querySelectorAll("tr")].forEach(row => {
            const id = row.children[0].textContent.trim();
            const name = row.children[1].textContent.trim();
            const option = document.createElement("option");
            option.value = id;
            option.textContent = `${id} - ${name}`;
            productSelect.appendChild(option);
        });

        amountInput.value = "";
        modal.style.display = "flex";
    });

    orderCancel.addEventListener("click", () => {
        modal.style.display = "none";
    });

    orderOk.addEventListener("click", () => {
        const selectedId = productSelect.value;
        const amount = parseInt(amountInput.value);

        if (!amount || amount <= 0) {
            alert("Érvényes darabszámot adj meg!");
            return;
        }

        [...table.querySelectorAll("tr")].forEach(row => {
            if (row.children[0].textContent.trim() === selectedId) {
                let current = parseInt(row.children[2].textContent);
                row.children[2].textContent = current + amount;
            }
        });

        modal.style.display = "none";
    });
});
</script>

</body>
</html>
