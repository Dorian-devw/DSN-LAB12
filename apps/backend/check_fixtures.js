const apiKey = process.env.API_FOOTBALL_KEY;
fetch('https://v3.football.api-sports.io/fixtures?league=1&season=2026', {
  headers: { 'x-apisports-key': apiKey }
})
.then(res => res.json())
.then(data => {
  console.log(JSON.stringify(data, null, 2));
})
.catch(console.error);
