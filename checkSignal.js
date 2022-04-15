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

    while(true){    
        for(const coin of symbolsList){
            const prices = await binance.fetchOHLCV(coin, '1d', undefined, 2)
            console.log(`\nFetching data for ${coin}`)
            prices.reverse()
            var openPrice = prices[0][1]
            var highPrice = prices[0][2]
            var lowPrice = prices[0][3]
            var closePrice = prices[0][4]
            var previousOpenPrice = prices[1][1]
            var previousClosePrice = prices[1][4]

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
            console.log(priceMap[0])

            if(previousClosePrice * 0.9 >= closePrice){
                axios.post('https://hooks.slack.com/services/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',
                    {
                            "blocks": [
                                {
                                    "type": "section",
                                    "text": {
                                        "type": "mrkdwn",
                                        "text": `${coin} current price is <= 10% than the previous price (past 1 day) Current Price: ${closePrice}. Previous Price: ${previousClosePrice}`
                                    }
                                }
                            ]
                    })

                    axios.post('https://hooks.slack.com/services/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',
                    {
                            "blocks": [
                                {
                                    "type": "section",
                                    "text": {
                                        "type": "mrkdwn",
                                        "text": `${coin} current price is <= 10% than the previous price (past 1 day) Current Price: ${closePrice}. Previous Price: ${previousClosePrice}`
                                    }
                                }
                            ]
                    })
            }
            
            if(previousClosePrice < previousOpenPrice &&
                closePrice > openPrice && 
                ((openPrice / lowPrice) - 1) * 100 >= 2.99 &&
                ((closePrice / openPrice) - 1) * 100 <= 1.1 &&
                ((highPrice / closePrice) - 1) * 100 <= 1.1) {
                    axios.post('https://hooks.slack.com/services/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',
                    {
                            "blocks": [
                                {
                                    "type": "section",
                                    "text": {
                                        "type": "mrkdwn",
                                        "text": `Buy Signal for ${coin}`
                                    }
                                }
                            ]
                    })
                    axios.post('https://hooks.slack.com/services/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',
                    {
                            "blocks": [
                                {
                                    "type": "section",
                                    "text": {
                                        "type": "mrkdwn",
                                        "text": `Buy Signal for ${coin}`
                                    }
                                }
                            ]
                    })
            }
        }
        console.log("\n Wait 60' to continue!")
        await delay(60 * 60 * 1000);
    }
}

async function viresState(){
    var viresState = await axios.get("https://api.vires.finance/state")
    var viresResponse = viresState.data.markets
    viresResponse.forEach(coin =>
        {
            if(coin.totalSupply > coin.totalDebt && coin.totalSupplyUsd > coin.totalDebtUsd){
                console.log(`Able to withdraw ${coin.name} with APY ${(coin.supplyApy * 100).toFixed(2)}%`)
            }
        })
    console.log(viresResponse)
}
viresState()