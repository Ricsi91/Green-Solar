document.addEventListener("DOMContentLoaded", () => {
    fetch("product.php")
        .then(res => res.json())
        .then(data => renderProducts(data))
        .catch(err => console.error("Hiba:", err));
});

function renderProducts(products) {
    const container = document.querySelector(".product-grid");
    container.innerHTML = "";

    products.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";

        const imgPath = p.kep && p.kep.trim() !== "" 
                        ? p.kep 
                        : "img/no-image.png"; // ha nincs kép

        card.innerHTML = `
            <img src="${imgPath}" alt="${p.nev}">
            <h2>${p.nev}</h2>
            ${p.leiras ? `<p class="desc">${p.leiras}</p>` : ""}
            <p class="price">${Number(p.ar).toLocaleString("hu-HU")} Ft</p>
            <div class="actions">
                <button class="cart">Kosárba</button>
            </div>
        `;

        container.appendChild(card);
    });
}
