import dotenv from 'dotenv';
import _ from 'lodash';
import candleService from '../services/candleService';
import marketDetails from '../services/marketDetails';
import telegramService from '../services/telegramService';

dotenv.config();
const BULL_THRESHOLD_TO_NOTIFY = process.env.BULL_THRESHOLD_TO_NOTIFY;

const getMarketChanges = async () => {
    const investingMarkets = marketDetails.filter(marketDetail =>
        marketDetail.base_currency_short_name === 'INR'
        //    &&  marketDetail.order_types.indexOf('market_order') >= 0 
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
        return _.sortBy(marketChanges, 'changePercent')
            .reverse()

    });
}

getMarketChanges().then(marketChanges => {
    console.log(marketChanges);
    var message = "Markets Now\n============\n"
    message = message + marketChanges
        .filter(marketChanges => marketChanges.changePercent > BULL_THRESHOLD_TO_NOTIFY)
        .map(marketChange => `${marketChange.symbol} - ${marketChange.changePercent.toPrecision(2)}%\n`)
        .join("")
    console.log(message);
    telegramService.postMessage(message);
});



