import dotenv from 'dotenv';
import _ from 'lodash';
import candleService from '../services/candleService';
import marketDetails from '../services/marketDetails'

dotenv.config();

const getMarketChanges = async () => {
    const investingMarkets = marketDetails.filter(marketDetail =>
        marketDetail.order_types.indexOf('market_order') >= 0 && marketDetail.base_currency_short_name === 'USDT'
    );

    const responses = investingMarkets.map(async investingMarket => {
        const candles = await candleService.fetchCandles(investingMarket.pair);
        const meanByParameter = 'close';
        const tenPercent = Math.round(candles.length * 0.1);
        const recentCandles = candles.slice(0, tenPercent);
        const oldCandles = candles.slice(tenPercent);
        const recentMean = _.meanBy(recentCandles, meanByParameter);
        const oldMean = _.meanBy(oldCandles, meanByParameter);
        const changePercent = (recentMean - oldMean) * 100 / oldMean;
        const recentCandleValue = candles[0][meanByParameter];
        const lastCandleDeviationPercent = (recentCandleValue - recentMean) * 100 / recentMean;
        return {
            marketPair: investingMarket.pair,
            symbol: investingMarket.symbol,
            recentMean,
            oldMean,
            changePercent,
            recentCandleValue,
            lastCandleDeviationPercent
        };
    })
    return await Promise.all(responses).then(marketChanges => {
        return _.sortBy(marketChanges, 'changePercent').reverse()
    });
}

getMarketChanges().then(marketChanges => {
    console.log(marketChanges);
});



