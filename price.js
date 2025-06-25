const API_KEY = '5HU8JZCTUM6EW7IQ'; // Replace with your real Alpha Vantage key
const tickerEl = document.getElementById('ticker');

const tickers = [
  { name: "S&P 500 (SPY)", symbol: "SPY" },
  { name: "NASDAQ 100 (QQQ)", symbol: "QQQ" },
  { name: "Dow Jones (DIA)", symbol: "DIA" },
  { name: "Russell 2000 (IWM)", symbol: "IWM" },
  { name: "VIX (VXX)", symbol: "VXX" }
];

async function fetchStock(symbol) {
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
    const data = await res.json();
    const quote = data["Global Quote"];

    if (!quote || !quote["05. price"]) throw new Error("Invalid data");

    return {
      price: parseFloat(quote["05. price"]).toFixed(2),
      changePercent: quote["10. change percent"] || '0%',
      isNegative: quote["10. change percent"]?.includes('-') || false
    };
  } catch (err) {
    console.error(`Error fetching ${symbol}:`, err.message);
    return {
      price: "N/A",
      changePercent: "N/A",
      isNegative: false
    };
  }
}

async function updateTicker() {
  tickerEl.innerHTML = '';
  for (const stock of tickers) {
    const data = await fetchStock(stock.symbol);
    const item = document.createElement('div');
    item.className = 'ticker-item';
    item.innerHTML = `
      <span class="index-name">${stock.name}:</span>
      <span class="cmp">${data.price}</span>
      <span class="change ${data.isNegative ? 'negative' : ''}">
        ${data.isNegative ? '' : '+'}${data.changePercent}
      </span>
    `;
    tickerEl.appendChild(item);
  }
}

updateTicker();
setInterval(updateTicker, 60000);
