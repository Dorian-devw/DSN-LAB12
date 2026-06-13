const apiKey = process.env.API_FOOTBALL_KEY;
fetch('https://v3.football.api-sports.io/leagues?search=World Cup', {
  headers: { 'x-apisports-key': apiKey }
})
.then(res => res.json())
.then(data => {
  const wc = data.response.filter(l => l.league.name.includes('World Cup'));
  console.log(JSON.stringify(wc, null, 2));
})
.catch(console.error);
