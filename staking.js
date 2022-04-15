async function getStakingList(){
    var allStakingList = await axios.get('https://www.binance.com/bapi/earn/v2/friendly/pos/union?pageSize=200&pageIndex=1&status=ALL')
    var responseData = allStakingList.data.data
    var coinList = []
    var dataSet = []
    var assetLabels = []
    var apyData = []

    for(var asset of responseData){
        var projectList = asset.projects
        projectList.map(object => {
            if(object.config.annualInterestRate != 0){
                var assetData = {
                    asset: object.asset,
                    duration: object.duration,
                    apy: parseFloat((object.config.annualInterestRate*100).toFixed(2))
                }
                coinList.push(assetData)
            }
        })    
    }

    //Sort Desc APY
    coinList.sort((a,b) => b.apy - a.apy)
    apyData.sort()

    console.log(coinList)

    for(const assetData of coinList){
        apyData.push(assetData.apy)
        assetLabels.push(`${assetData.asset}/${assetData.duration} (days)`)
    }

    var dataSet = [
        {
            label: `APY (%)`,
            data: apyData,
            borderColor: "#0E3548",
            color: "#0E3548",
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderRadius: 100,
            borderSkipped: false
        }
    ]
    
    var data = {
        labels: assetLabels,
        datasets: dataSet
      }
      return data
}
