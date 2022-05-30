const moment = require("moment");
const axios = require('axios')
const delay = require("delay");
const ccxt = require('ccxt')

async function main(){
    const binance = new ccxt.binance()
    const binanceMarkets = await binance.loadMarkets()
    const binanceSymbols = binance.symbols
    const symbolsList = []

    for(const symbol of binanceSymbols){
        if(symbol.endsWith("USDT") && 
          !symbol.includes("DOWN") && 
          !symbol.includes("UP") &&
          !symbol.includes("VEN") && 
          !symbol.includes("BULL") && 
          !symbol.includes("BEAR")){
            symbolsList.push(symbol)
        }
    }

    for(const coin of symbolsList){
        const prices = await binance.fetchOHLCV(coin, '1d', undefined, 5)
        prices.reverse()
        const priceMap = prices.map(price => {
            return {
                OpenTime: moment(price[0]).format("DD/MM/yyyy HH:mm"),
                OpenPrice: price[1],
                Highest: price[2],
                Lowest: price[3],
                Current: price[4],
                Volume: price[5]
            }
        })
        //Get Average Volume in the last 5 candles
        var sum = 0;
        for( var i = 1; i < priceMap.length; i++ ){
            sum += priceMap[i].Volume
        }
        const averageVolume = sum/priceMap.length

        if((priceMap[1].Volume >= averageVolume * 1.4) && (priceMap[1].Volume <= averageVolume * 1.7)){
            console.log(`Massive Volume for: ${coin}`)
        }
    }
}

main()