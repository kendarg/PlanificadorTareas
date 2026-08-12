let modo = document.getElementById("modo");
let body = document.body;
let icon = document.getElementById("icono");

modo.addEventListener("click", function(){
let oscuro = body.classList.toggle("dark");
localStorage.setItem("modo",oscuro);

icon.classList.toggle("bi-moon-stars-fill");
icon.classList.toggle("bi-brightness-high");

});

let verdadero = localStorage.getItem("modo");
console.log("Valor recuperado de LocalStorage:", verdadero);

if(verdadero === "true"){
    body.classList.add("dark");
    icon.classList.add("bi-brightness-high");
    icon.classList.remove("bi-moon-stars-fill");
}else{
    body.classList.remove("dark");
    icon.classList.add("bi-moon-stars-fill");
    icon.classList.remove("bi-brightness-high");
}