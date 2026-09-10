
document.addEventListener("DOMContentLoaded", () => {
    const btnModo = document.getElementById("modo");
    const icon = document.getElementById("icono");
    const body = document.body;


    const esOscuro = localStorage.getItem("modo") === "true";
    if (esOscuro) {
        body.classList.add("dark");
        if (icon) {
            icon.classList.add("bi-brightness-high");
            icon.classList.remove("bi-moon-stars-fill");
        }
    }

    // Evento Click
    if (btnModo && icon) {
        btnModo.addEventListener("click", () => {
            const estaOscuro = body.classList.toggle("dark");
            localStorage.setItem("modo", estaOscuro);

            icon.classList.toggle("bi-moon-stars-fill");
            icon.classList.toggle("bi-brightness-high");
        });
    }
});