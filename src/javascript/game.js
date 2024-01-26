// Variables globales
var timeLeft = 30;
var elem = document.getElementById('countdown');
var alertBox = document.getElementById('alert');
var gameStarted = false;
var timerId;
var flipcardSound = new Audio('./src/sounds/flipcard.mp3');
var foundPairSound = new Audio('./src/sounds/found-pair.mp3');
var foundPromoSound = new Audio('./src/sounds/found-promo.mp3');
var winGameSound = new Audio('./src/sounds/win-game.mp3');
var endTimeSound = new Audio('./src/sounds/end-time.mp3');
var clockTickingSound = new Audio('./src/sounds/clock-tiking.mp3');
var gameOver = false;

// Tiempo restante en milisegundos
var tiempoRestante = 30 * 1000;

// Event listeners
document.getElementById('iniciar').addEventListener('click', function() {
    clockTickingSound.play();
    gameStarted = true;
    timerId = setInterval(countdown, 1000);
});

document.getElementById('tablero').addEventListener('click', function() {
    if (gameStarted) {
        flipcardSound.play();
    }
    else{
        flipcardSound.pause();
        endTimeSound.play();
    }
    if (gameOver) {
        flipcardSound.pause();
        endTimeSound.play();
    }
    if (!gameStarted) {
        showAlert('Da click en el botón "Empezar juego"');
        return;
    }
});

document.getElementById('whatsapp').addEventListener('click', function() {
    window.open('https://wa.me/0980050644?text=He%20ganado%20el%20juego%20de%20memoria!', '_blank');
});

// Funciones relacionadas con el juego
function countdown() {
    if (timeLeft == 0) {
        gameOver = true;
        endTimeSound.play();
        clockTickingSound.pause();
        clockTickingSound.currentTime = 0;
        clearTimeout(timerId);
        showAlert('Se acabó el tiempo');
        elem.innerHTML = '00:00';
        setTimeout(function() {
            showAlert('Toma una captura de pantalla y envíasela a tu asesor', 15000);
            setTimeout(restartGame, 15000);
        }, 15000);
    } else {
        elem.innerHTML = '00:' + (timeLeft < 10 ? '0' + timeLeft : timeLeft);
        timeLeft--;
    }
}

function restartGame() {
    clockTickingSound.pause();
    clockTickingSound.currentTime = 0;
    timeLeft = 30;
    gameStarted = false;
    gameOver = false; // Añade esta línea
    elem.innerHTML = '00:30'; // Añade esta línea
    elem.style.display = 'block'; // Asegura que el reloj se muestre
    paresEncontrados = 0;
    cartas = desordenar(cartas);

    var cartasDOM = document.querySelectorAll('.card');
    for (var i = 0; i < cartasDOM.length; i++) {
        var carta = cartasDOM[i];
        carta.firstChild.src = './src/images/autorenova-black-card.png';
        carta.dataset.valor = cartas[i];
        carta.classList.remove('encontrado');
    }
}

// Arrays de imágenes
var imagenes = [
    './src/images/colors/amarillo.png',
    './src/images/colors/azul.png',
    './src/images/colors/morado.png',
    './src/images/colors/naranja.png',
    './src/images/colors/verde.png',
    './src/images/colors/rojo.png',
    './src/images/colors/rosado.png'
];

var promos = [
    './src/images/promos/1.png',
    './src/images/promos/2.png',
    './src/images/promos/3.png',
    './src/images/promos/4.png',
    './src/images/promos/5.png'
];

// Función para seleccionar una promo aleatoria
function seleccionarPromoAleatoria() {
    var indiceAleatorio = Math.floor(Math.random() * promos.length);
    return promos[indiceAleatorio];
}

// Duplica las imágenes para tener los pares
var cartas = imagenes.concat(imagenes);

// Agrega dos espacios vacíos para las imágenes futuras
cartas.push('', '');

// Desordena las cartas
cartas = desordenar(cartas);

// Variables para guardar las cartas seleccionadas y el número de pares encontrados
var carta1 = null;
var carta2 = null;
var paresEncontrados = 0;

// Agrega las cartas al tablero en el orden desordenado
var tablero = document.getElementById('tablero');
var promoAleatoria = seleccionarPromoAleatoria();
var bloquearTablero = false;

for (var i = 0; i < cartas.length; i++) {
    var carta = document.createElement('div');
    carta.className = 'card';

    if (cartas[i] === '') {
        cartas[i] = promoAleatoria;
    }

    carta.dataset.valor = cartas[i];
    carta.innerHTML = '<img src="./src/images/autorenova-black-card.png" alt="Card ' + (i + 1) + '">';
    carta.addEventListener('click', function() {
        if (gameOver || bloquearTablero) {
            flipcardSound.pause();
            return;
        }
        if (!gameStarted) {
            showAlert('Da click en el botón "Empezar juego"');
            return;
        }
        if (this.classList.contains('encontrado')) {
            return;
        }
        this.firstChild.src = this.dataset.valor;
        if (!carta1) {
            carta1 = this;
        } else {
            carta2 = this;
            bloquearTablero = true;
            if (carta1 !== carta2 && carta1.dataset.valor === carta2.dataset.valor) {
                paresEncontrados++;
                carta1.classList.add('encontrado');
                carta2.classList.add('encontrado');
                bloquearTablero = false;
                if (carta1.dataset.valor === promoAleatoria) {
                    foundPromoSound.play();
                } else {
                    foundPairSound.play();
                }
                if (paresEncontrados === 8) {
                    winGameSound.play();
                    clearTimeout(timerId);
                    showAlert('¡Felicidades, ganaste! Haz una captura y envíasela a tu asesor', 30000, 'alert-success');
                    setTimeout(restartGame, 30000);
                }
            } else {
                setTimeout(function() {
                    if (!carta1.classList.contains('encontrado')) {
                        carta1.firstChild.src = './src/images/autorenova-black-card.png';
                    }
                    if (!carta2.classList.contains('encontrado')) {
                        carta2.firstChild.src = './src/images/autorenova-black-card.png';
                    }
                    carta1 = null;
                    carta2 = null;
                    bloquearTablero = false;
                }, 500);
            }
        }
    });
    tablero.appendChild(carta);
}



// Función de utilidad para desordenar un array
function desordenar(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Función para mostrar alertas
function showAlert(message, duration, alertClass) {
    alertBox.style.display = 'block';
    alertBox.textContent = message;
    alertBox.className = 'alert ' + (alertClass || 'alert-danger');
    setTimeout(function() {
        alertBox.style.display = 'none';
    }, duration || 3000);
}