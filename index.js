async function fetchData(){
    const binance = new ccxt.binance()
    const coinLsit = ['NEAR/USDT', 'CELO/USDT', 'AUCTION/USDT', 'SAND/USDT']
    var dataSet = []
    for(const coin of coinLsit){
        var prices = await binance.fetchOHLCV(coin, '4h', undefined, 5)
        console.log(prices)
        var coinData = {
            label: coin,
            borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderRadius: 100,
            borderSkipped: false,
            order: 1
        }
        coinData.data = prices.map(price => {return price[4]})
        dataSet.push(coinData)
    }
    var targetPrices = [
        {
            label: 'Target Price for NEAR',
            data: ['30','30','30','30','30'],
            borderColor: dataSet.find(o => o.label == 'NEAR/USDT')['borderColor'],
            backgroundColor: 'transparent',
            type: 'line',
            order: 0
        },
        {      
            label: 'Target Price for CELO',
            data: ['7','7','7','7','7'],
            borderColor: dataSet.find(o => o.label == 'CELO/USDT')['borderColor'],
            backgroundColor: 'transparent',
            type: 'line',
            order: 0
        },
        {      
            label: 'Target Price for AUCTION',
            data: ['16.9','16.9','16.9','16.9','16.9'],
            borderColor: dataSet.find(o => o.label == 'AUCTION/USDT')['borderColor'],
            backgroundColor: 'transparent',
            type: 'line',
            order: 0
        },
        {      
            label: 'Target Price for SAND',
            data: ['3.6','3.6','3.6','3.6','3.6'],
            borderColor: dataSet.find(o => o.label == 'SAND/USDT')['borderColor'],
            backgroundColor: 'transparent',
            type: 'line',
            order: 0
        }
    ]
    targetPrices.forEach(targetPrice => {
        dataSet.push(targetPrice)
    });
    return dataSet
}

async function reloadChart(){
    const coinData = await fetchData();
    const ctx = document.getElementById('myChart').getContext('2d');
    var data = {
        labels: ['Last 16 hours', 'Last 12 hours', 'Last 8 hours', 'Last 4 hours', 'Current Hour'],
        datasets: coinData
      }
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Crypto Chart'
          }
        }
      }
      });
}

