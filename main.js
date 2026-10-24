/* esercizio 1 

Scrivi la funzione getDashboardData(query), che deve:
Essere asincrona (async).
Utilizzare Promise.all() per eseguire più richieste in parallelo.
Restituire una Promise che risolve un oggetto contenente i dati aggregati.
Stampare i dati in console in un messaggio ben formattato.
Testa la funzione con la query "london"

Bonus 1 - Risultato vuoto
Se l’array di ricerca è vuoto, invece di far fallire l'intera funzione, 
semplicemente i dati relativi a quella chiamata verranno settati a null e 
 la frase relativa non viene stampata.
 Testa la funzione con la query “vienna” (non trova il meteo).

 Bonus 2 - Chiamate fallite
Attualmente, se una delle chiamate fallisce, Promise.all() rigetta l'intera operazione.

Modifica getDashboardData() per usare Promise.allSettled(), in modo che:
Se una chiamata fallisce, i dati relativi a quella chiamata verranno settati a null.
Stampa in console un messaggio di errore per ogni richiesta fallita.
Testa la funzione con un link fittizio per il meteo (es. https://www.meteofittizio.it).

*/

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Errore HTTP: ${response.status}`);
  }
  const obj = await response.json();
  return obj;
};

const getDashboardData = async (query) => {
  const [nomi, meteo, aeroporti] = await Promise.allSettled([
    fetchJson(`http://localhost:3333/destinations?search=${query}`),
    fetchJson(`http://localhost:3333/weathers?search=${query}`),
    fetchJson(`http://localhost:3333/airports?search=${query}`),
  ]);

  if (nomi.status === "rejected") {
    console.error("Errore nella richiesta del nome");
  }
  if (meteo.status === "rejected") {
    console.error("Errore nella richiesta del meteo");
  }
  if (aeroporti.status === "rejected") {
    console.error("Errore nella richiesta dell'aeroporto ");
  }
  const dati = [
    nomi.status === "fulfilled" ? nomi.value : null,

    meteo.status === "fulfilled" ? meteo.value : null,

    aeroporti.status === "fulfilled" ? aeroporti.value : null,
  ];

  return {
    city: dati[0] !== null && dati[0].length > 0 ? dati[0][0].name : null,
    country: dati[0] !== null && dati[0].length > 0 ? dati[0][0].country : null,
    temperature:
      dati[1] !== null && dati[1].length > 0 ? dati[1][0].temperature : null,
    weather:
      dati[1] !== null && dati[1].length > 0
        ? dati[1][0].weather_description
        : null,
    airport: dati[2] !== null && dati[2].length > 0 ? dati[2][0].name : null,
  };
};

getDashboardData("london")
  .then((data) => {
    console.log("Dashboard data:", data);
    console.log(`${data.city} is in ${data.country}.\n`);

    if (data.temperature !== null && data.weather !== null) {
      console.log(
        `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`,
      );
    }

    console.log(`The main airport is ${data.airport}.\n`);
  })
  .catch((error) => console.error(error));
