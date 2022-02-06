import dotenv from 'dotenv';
import _ from 'lodash';
import candleService from '../services/candleService';
import marketDetails from '../services/marketDetails';
import telegramService from '../services/telegramService';
import userService from '../services/userService';

dotenv.config();
const BULL_THRESHOLD_TO_NOTIFY = process.env.BULL_THRESHOLD_TO_NOTIFY;
const BULL_VOLUME_THRESHOLD_TO_NOTIFY = process.env.BULL_VOLUME_THRESHOLD_TO_NOTIFY ?? 10;

const getMarketChanges = async (baseCurrency = "INR") => {
    const investingMarkets = marketDetails.filter(marketDetail =>
        marketDetail.base_currency_short_name === baseCurrency
    );
    const responses = investingMarkets.map(async investingMarket => {
        return await candleService.getMarketData(investingMarket);
    })
    return await Promise.all(responses).then(marketChanges => {
        const filtered = _.filter(marketChanges, marketChange => marketChange !== null)
        return _.sortBy(filtered, 'changePercent').reverse()
    });
}

const checkLastMarket = (marketChange, lastMarkets) => {
    const lastMarket = lastMarkets[marketChange.symbol]
    if (lastMarket) {
        const changeFromLast = marketChange.changePercent - lastMarket.changePercent;
        return changeFromLast > 0.5 || changeFromLast < -0.5;
    } else return true;
}
const formatNumber = num => {
    if (num < 0) {
        return `-(${num.toPrecision(2) * -1})`
    }
    return num.toPrecision(2)
}

function addLinks(message) {
    message = message + '\n<a href="http://go.coindcx.com">Open App</a>\n'
    message = message + '\n<a href="https://coin-alertor.herokuapp.com/telegram/alert/INR">INR Alerts</a>\n'
    message = message + '\n<a href="https://coin-alertor.herokuapp.com/telegram/alert/BTC">BTC Alerts</a>\n'
    return message + '\n<a href="https://coin-alertor.herokuapp.com/telegram/alert/USDT">USDT Alerts</a>\n'
}

const getMessageToSend = (message, data, type) => {
    message = message + `------By ${type}----\n`
    message = message +
        data.map(marketChange =>
            `<a href="${marketChange.url}">${marketChange.symbol}</a>` +
            ` - M ${formatNumber(marketChange.changePercent)} ` +
            ` - V ${formatNumber(marketChange.changeVolumePercent)}\n`
        ).join("")
    return message;
}

const alert = (baseCurrency = "INR") => Promise.all([getMarketChanges(baseCurrency), userService.getBalances()]).then(values => {
    const marketChanges = values[0];
    const balances = values[1];
    let lastMarkets = [];
    lastMarkets = _.keyBy(lastMarkets, lastMarket => lastMarket.symbol);
    const bearInvestments = marketChanges
        .filter(marketChange => {
            const balanceFound = _.find(balances, balance => balance.currency === marketChange.currency)
            return balanceFound
                && marketChange.changePercent < -3.5
                && marketChange.recentCandleValue * balanceFound.balance > 20
        });

    let filteredByValue = marketChanges.filter(marketChange =>
        marketChange.changePercent > BULL_THRESHOLD_TO_NOTIFY
        && marketChange.lastCandleDeviationPercent > -0.5
        && checkLastMarket(marketChange, lastMarkets)
    ).slice(0, 3);
    let filteredByVolume = marketChanges.filter(marketChange =>
        marketChange.changeVolumePercent > BULL_THRESHOLD_TO_NOTIFY
        && marketChange.lastCandleDeviationPercent > -0.5
    ).slice(0, 3);
    filteredByValue = filteredByValue.concat(bearInvestments);
    let message = `<b>Markets Now for ${baseCurrency}\n</b>`;
    if (filteredByValue.length > 0 || filteredByVolume.length > 0) {
        if (filteredByValue.length > 0) {
            message = getMessageToSend(message, filteredByValue, 'Value');
        }
        if (filteredByValue.length > 0) {
            message = getMessageToSend(message, filteredByValue, 'Volume');
        }
        message = addLinks(message);
        telegramService.postMessage(message);
    }
});

export default {
    alert
}

