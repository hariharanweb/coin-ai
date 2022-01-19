import dotenv from 'dotenv';
import _ from 'lodash';
import candleService from '../services/candleService';
import fileService from '../services/fileService';
import marketDetails from '../services/marketDetails';
import telegramService from '../services/telegramService';
import userService from '../services/userService';

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
            currency: investingMarket.target_currency_short_name,
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
const formatNumber = num => {
    if(num<0){
        return `-(${num.toPrecision(2)*-1})`
    }
    return num.toPrecision(2)
}
Promise.all([getMarketChanges(), userService.getBalances()]).then(values => {
    const marketChanges = values[0];
    const balances = values[1];
    var lastMarkets = [];
    lastMarkets = _.keyBy(lastMarkets, lastMarket => lastMarket.symbol);
    const investedCurrencies = balances.map(balance => balance.currency);
    const bearInvestments = marketChanges
        .filter(marketChange =>
            investedCurrencies.indexOf(marketChange.currency) > 0
            && marketChange.changePercent < -3.5
        );

    var filtered = marketChanges.filter(marketChange =>
        marketChange.changePercent > BULL_THRESHOLD_TO_NOTIFY
        && marketChange.lastCandleDeviationPercent > -0.5
        && checkLastMarket(marketChange, lastMarkets)
    );
    filtered = filtered.concat(bearInvestments)
    if (filtered.length > 0) {
        // fileService.storeLastMarket(filtered);
        var message = "<b>Markets Now\n</b>"
        message = message + "___________________\n\n"
        message = message +
            filtered.map(marketChange =>
                `<a href="${marketChange.url}">${marketChange.symbol}</a> - ${formatNumber(marketChange.changePercent)} - Trend - ${formatNumber(marketChange.lastCandleDeviationPercent)}\n`)
                .join("")
        message = message + '\n <a href="http://go.coindcx.com">Open App</a>\n'
        console.log(message);
        telegramService.postMessage(message);
    }
});



