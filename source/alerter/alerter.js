import dotenv from 'dotenv';
import _ from 'lodash';
import candleService from '../services/candleService';
import marketDetails from '../services/marketDetails';
import telegramService from '../services/telegramService';
import userService from '../services/userService';

dotenv.config();
const BULL_THRESHOLD_TO_NOTIFY = process.env.BULL_THRESHOLD_TO_NOTIFY;
const BULL_VOLUME_THRESHOLD_TO_NOTIFY = process.env.BULL_VOLUME_THRESHOLD_TO_NOTIFY ?? 20;
const DOLLAR = "\u{1F4B0}"
const BOX = "\u{1F4E6}"

const getMarketChanges = async (baseCurrency = "INR") => {
    const investingMarkets = marketDetails.filter(marketDetail =>
        marketDetail.base_currency_short_name === baseCurrency
    );
    const responses = investingMarkets.map(async investingMarket => {
        return await candleService.getMarketData(investingMarket);
    })
    return await Promise.all(responses).then(marketChanges => {
        const filtered = _.filter(marketChanges, marketChange => marketChange !== null)
        return filtered;
    });
}

const checkLastMarket = (marketChange, lastMarkets) => {
    const lastMarket = lastMarkets[marketChange.symbol]
    if (lastMarket) {
        const changeFromLast = marketChange.changePercent - lastMarket.changePercent;
        return changeFromLast > 0.5 || changeFromLast < -0.5;
    } else return true;
}
const formatBigNum = n => {
    if (n < 1e3) return Math.floor(n);
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
};
  
const formatNumber = num => {
    if (num < 0) {
        return `(${num.toPrecision(2) * -1})`
    } else if (num > 100) {
        console.log(num)
        return formatBigNum(num)
    }

    return num.toPrecision(2)
}

function addLinks(message) {
    message = message + '\n<a href="http://go.coindcx.com">Open App</a>'
    return message + '\n<a href="https://coin-alertor.herokuapp.com/telegram/alert/USDT">Send <b>USDT Alerts</b></a>'
}

const getMessageToSend = (message, data, type) => {
    message = message + `\n------By ${type}----\n\n`
    message = message +
        data.map(marketChange =>
            `<a href="${marketChange.url}">${marketChange.symbol}</a>` +
            ` - ${DOLLAR} ${formatNumber(marketChange.changePercent)}% ` +
            ` - ${BOX} ${formatNumber(marketChange.changeVolumePercent)}%\n`
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

    let filteredByValue = _.sortBy(marketChanges, 'changePercent').reverse().filter(marketChange =>
        marketChange.changePercent > BULL_THRESHOLD_TO_NOTIFY
        && marketChange.lastCandleDeviationPercent > -0.5
        && checkLastMarket(marketChange, lastMarkets)
    ).slice(0, 5);

    let filteredByVolume = _.sortBy(marketChanges, 'changeVolumePercent').reverse().filter(marketChange =>
        marketChange.changeVolumePercent > BULL_VOLUME_THRESHOLD_TO_NOTIFY
    ).slice(0, 3);
    
    filteredByValue = filteredByValue.concat(bearInvestments);
    let message = `<b>Markets Now for ${baseCurrency}\n</b>`;
    if (filteredByValue.length > 0 || filteredByVolume.length > 0) {
        if (filteredByValue.length > 0) {
            console.log('Getting messages by Value')
            message = getMessageToSend(message, filteredByValue, 'Value');
        }
        if (filteredByVolume.length > 0) {
            console.log('Getting messages by Volume')
            message = getMessageToSend(message, filteredByVolume, 'Volume');
        }
        message = addLinks(message);
        console.log(message);
        telegramService.postMessage(message);
    }
});

export default {
    alert,
    getMarketChanges
}

