import dotenv from 'dotenv';
import _ from 'lodash';
import candleService from '../services/candleService';
import fileService from '../services/fileService';
import marketDetails from '../services/marketDetails';
import telegramService from '../services/telegramService';
import userService from '../services/userService';

dotenv.config();
const BULL_THRESHOLD_TO_NOTIFY = process.env.BULL_THRESHOLD_TO_NOTIFY;

const getMarketChanges = async (baseCurrency="INR") => {
    const investingMarkets = marketDetails.filter(marketDetail =>
        marketDetail.base_currency_short_name === baseCurrency
    );
    const responses = investingMarkets.map(async investingMarket => {
        const candles = await candleService.fetchCandles(investingMarket.pair);
        if(candles.length === 0) return null; 
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
        const  filtered = _.filter(marketChanges, marketChange => marketChange !== null)
        return _.sortBy(filtered,'changePercent').reverse()
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

const alert = (baseCurrency="INR") => Promise.all([getMarketChanges(baseCurrency), userService.getBalances()]).then(values => {
    const marketChanges = values[0];
    const balances = values[1];
    var lastMarkets = [];
    lastMarkets = _.keyBy(lastMarkets, lastMarket => lastMarket.symbol);
    const bearInvestments = marketChanges
        .filter(marketChange =>{
            const balanceFound = _.find(balances, balance=> balance.currency === marketChange.currency)
            return balanceFound
            && marketChange.changePercent < -3.5
            && marketChange.recentCandleValue * balanceFound.balance > 20
        });

    var filtered = marketChanges.filter(marketChange =>
        marketChange.changePercent > BULL_THRESHOLD_TO_NOTIFY
        && marketChange.lastCandleDeviationPercent > -0.5
        && checkLastMarket(marketChange, lastMarkets)
    );
    filtered = filtered.concat(bearInvestments)
    if (filtered.length > 0) {
        // fileService.storeLastMarket(filtered);
        var message = `<b>Markets Now for ${baseCurrency}\n</b>`
        message = message + "___________________\n\n"
        message = message +
            filtered.map(marketChange =>
                `<a href="${marketChange.url}">${marketChange.symbol}</a> - ${formatNumber(marketChange.changePercent)} - Trend - ${formatNumber(marketChange.lastCandleDeviationPercent)}\n`)
                .join("")
        message = message + '\n<a href="http://go.coindcx.com">Open App</a>\n'
        message = message + '\n<a href="https://coin-alertor.herokuapp.com/telegram/alert/INR">INR Alerts</a>\n'
        message = message + '\n<a href="https://coin-alertor.herokuapp.com/telegram/alert/BTC">BTC Alerts</a>\n'
        message = message + '\n<a href="https://coin-alertor.herokuapp.com/telegram/alert/USDT">USDT Alerts</a>\n'
        console.log(message);
        telegramService.postMessage(message);
    }
});

export default {
    alert
}

