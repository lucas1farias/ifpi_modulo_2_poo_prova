

function obterAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}
console.log(obterAleatorio(1, 11))