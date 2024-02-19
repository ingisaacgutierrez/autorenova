var promociones = [
    {codigo: "1MESGRATIS", imagen: "./src/images/1.png", probabilidad: 0.35},
    {codigo: "2MESESGRATIS", imagen: "./src/images/2.png", probabilidad: 0.30},
    {codigo: "3MESESGRATIS", imagen: "./src/images/3.png", probabilidad: 0.25},
    {codigo: "4MESESGRATIS", imagen: "./src/images/4.png", probabilidad: 0.10}
];

function generarCupon() {
    var rand = Math.random();
    var cupon;
    if (rand < 0.35) {
        cupon = promociones[0];
    } else if (rand < 0.65) {
        cupon = promociones[1];
    } else if (rand < 0.90) {
        cupon = promociones[2];
    } else {
        cupon = promociones[3];
    }
    var nombre = document.getElementById("nombre").value;
    document.getElementById("nombre").style.display = "none";
    document.getElementById("cupon").style.display = "block";
    document.getElementById("imagen").style.display = "block";
    document.getElementById("cupon").innerHTML = "¡Felicitaciones " + nombre + ", has ganado! Tu cupón es: ";
    document.getElementById("imagen").src = cupon.imagen;
    enviarCorreo(nombre, cupon.codigo);
}

//function enviarCorreo

