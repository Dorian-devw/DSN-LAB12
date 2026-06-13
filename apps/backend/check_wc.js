require('dotenv').config();

async function checkWC() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY || '0b299191a3b845efa8dab306b25d058e';
  const response = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
    headers: { 'X-Auth-Token': apiKey }
  });
  const data = await response.json();
  console.log(JSON.stringify(data).substring(0, 500));
}

checkWC();
