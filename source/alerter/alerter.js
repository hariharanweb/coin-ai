import dotenv from 'dotenv';
import _ from 'lodash';
import candleService from '../services/candleService';
import fileService from '../services/fileService';
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
            lastCandleDeviationPercent,
            url: `https://coindcx.com/trade/${investingMarket.symbol}`
        };
    })
    return await Promise.all(responses).then(marketChanges => {
        return _.sortBy(marketChanges, 'changePercent')
            .reverse()

    });
}

const checkLastMarket = (marketChange, lastMarkets) => {
    const lastMarket = lastMarkets[marketChange.symbol]
    if (lastMarket) {
        const changeFromLast = marketChange.changePercent - lastMarket.changePercent;
        return changeFromLast > 0.5 || changeFromLast < -0.5;
    }
    else return true;
}

getMarketChanges().then(marketChanges => {
    console.log(marketChanges);
    var lastMarkets = fileService.readLastMarket();
    lastMarkets = _.keyBy(lastMarkets, lastMarket => lastMarket.symbol);

    const filtered = marketChanges.filter(marketChange =>
        marketChange.changePercent > BULL_THRESHOLD_TO_NOTIFY
        && marketChange.lastCandleDeviationPercent > -0.5
        && checkLastMarket(marketChange, lastMarkets)
    );
    if (filtered.length > 0) {
        fileService.storeLastMarket(filtered);
        var message = "Markets Now\n============\n"
        message = message +
            filtered.map(marketChange => `${marketChange.symbol} - ${marketChange.changePercent.toPrecision(2)} - Trend - ${marketChange.lastCandleDeviationPercent.toPrecision(2)} - ${marketChange.url}\n`)
                .join("")
        console.log(message);
        telegramService.postMessage(message);
    }
});



