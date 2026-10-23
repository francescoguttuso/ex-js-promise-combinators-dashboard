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
    city: dati[0][0].name,
    country: dati[0][0].country,
    temperature: dati[1][0].temperature,
    weather: dati[1][0].weather_description,
    airport: dati[2][0].name,
  };
};

getDashboardData("london")
  .then((data) => {
    console.log("Dashboard data:", data);
    console.log(
      `${data.city} is in ${data.country}.\n` +
        `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` +
        `The main airport is ${data.airport}.\n`,
    );
  })
  .catch((error) => console.error(error));
