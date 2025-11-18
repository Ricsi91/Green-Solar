document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("quoteForm");

    form.addEventListener("submit", function(e) {
        e.preventDefault(); // MEGÁLLÍTJA AZ ÁTIRÁNYÍTÁST

        let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

        const newQuote = {
            name: document.getElementById("name").value,
            address: document.getElementById("address").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            type: document.getElementById("type").value,
            consumption: document.getElementById("consumption").value,
            placement: document.getElementById("placement").value,
            message: document.getElementById("message").value,
            status: "Új",
            opened: false,
            date: new Date().toLocaleString()
        };

        quotes.push(newQuote);
        localStorage.setItem("quotes", JSON.stringify(quotes));

        alert("Árajánlatkérés sikeresen elküldve!");

        form.reset();
    });
});
