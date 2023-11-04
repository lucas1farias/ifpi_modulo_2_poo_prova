

function contarPalavrasNaoRepetidas(palavrasRepetidas, palavrasNaoRepetidas) {
    const contador = {};
  
    // Inicialize o contador para todas as palavras não repetidas como zero
    palavrasNaoRepetidas.forEach((palavra) => {
      contador[palavra] = 0;
    });
  
    // Percorra as palavras repetidas e conte as ocorrências das palavras não repetidas
    palavrasRepetidas.forEach((palavraRepetida) => {
      if (palavrasNaoRepetidas.includes(palavraRepetida)) {
        contador[palavraRepetida]++;
      }
    });
  
    return contador;
}
  
const palavrasNaoRepetidas = ["a", "b", "c"];
const palavrasRepetidas = ["a", "b", "a", "d", "b", "e", "b"];

const resultado = contarPalavrasNaoRepetidas(palavrasRepetidas, palavrasNaoRepetidas);

console.log(resultado);
