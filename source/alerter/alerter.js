import dotenv from 'dotenv'
import _ from 'lodash';
import candleService from '../services/candleService';

dotenv.config();

const getMarketChanges = async () => {
    const investingMarkets = process.env.INVESTING_MARKETS.split(',');

    console.log('Checking alerts for Markets', investingMarkets);
    
    const responses = investingMarkets.map(investingMarket => {
        return candleService.fetchCandles(investingMarket).then(candles => {
            const meanByParameter = 'close'
            const tenPercent = Math.round(candles.length * 0.1);
            const recentCandles = candles.slice(0, tenPercent);
            const oldCandles = candles.slice(tenPercent);
    
            const recentMean = _.meanBy(recentCandles, meanByParameter)
            const oldMean = _.meanBy(oldCandles, meanByParameter)
    
            const changePercent = (recentMean - oldMean) * 100 / oldMean;
            const recentCandleValue = candles[0][meanByParameter]
            const lastCandleDeviationPercent = (recentCandleValue - recentMean)*100/recentMean;
            return {
                marketPair: investingMarket,
                recentMean,
                oldMean,
                changePercent,
                lastCandleDeviationPercent
            }
        });
    })
    return await Promise.all(responses).then(marketChanges=> {
        return _.sortBy(marketChanges, 'changePercent').reverse()
    });
}

getMarketChanges().then(marketChanges => {
    console.log(marketChanges);
});



