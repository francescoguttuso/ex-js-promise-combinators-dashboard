/* esercizio 1 

Scrivi la funzione getDashboardData(query), che deve:
Essere asincrona (async).
Utilizzare Promise.all() per eseguire più richieste in parallelo.
Restituire una Promise che risolve un oggetto contenente i dati aggregati.
Stampare i dati in console in un messaggio ben formattato.
Testa la funzione con la query "london"


/*
Bonus 1 - Risultato vuoto
Se l’array di ricerca è vuoto, invece di far fallire l'intera funzione, 
semplicemente i dati relativi a quella chiamata verranno settati a null e 
 la frase relativa non viene stampata.
 Testa la funzione con la query “vienna” (non trova il meteo).
*/

const getDashboardData = async (query) => {
  const nome = fetch(`http://localhost:3333/destinations?search=${query}`);
  const meteo = fetch(`http://localhost:3333/weathers?search=${query}`);
  const aeroporto = fetch(`http://localhost:3333/airports?search=${query}`);
  const risultati = await Promise.all([nome, meteo, aeroporto]);
  const dati = await Promise.all([
    risultati[0].json(),
    risultati[1].json(),
    risultati[2].json(),
  ]);
  return {
    city: dati[0].length > 0 ? dati[0][0].name : null,
    country: dati[0].length > 0 ? dati[0][0].country : null,
    temperature: dati[1].length > 0 ? dati[1][0].temperature : null,
    weather: dati[1].length > 0 ? dati[1][0].weather_description : null,
    airport: dati[2].length > 0 ? dati[2][0].name : null,
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
