document.addEventListener("DOMContentLoaded", () => {
    const btnModoOscuro = document.getElementById("btn-modo-oscuro");
    const btnModoClaro = document.getElementById("btn-modo-claro");
    const body = document.body;

    const esOscuro = localStorage.getItem("modoOscuro") === "true";
    if (esOscuro) {
        body.classList.add("dark");
    }

    if (btnModoOscuro) {
        btnModoOscuro.addEventListener("click", (e) => {
            e.preventDefault();
            body.classList.add("dark");
            localStorage.setItem("modoOscuro", "true");
        });
    }

    if (btnModoClaro) {
        btnModoClaro.addEventListener("click", (e) => {
            e.preventDefault();
            body.classList.remove("dark");
            localStorage.setItem("modoOscuro", "false");
        });
    }
}); 