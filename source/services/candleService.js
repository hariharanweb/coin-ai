import axios from 'axios';
import _ from "lodash";

const fetchCandles = async (marketPair, limit = 180) => {
    const response = await axios
        .get(`https://public.coindcx.com/market_data/candles?pair=${marketPair}&interval=1m&limit=${limit}`)
        .catch(error => {
            if(error.response){
                console.log(error.response.data);
                return {
                    data: []
                };
            }
        });
    return response.data.map((candle, index) => {
        return {
            ...candle,
            index,
            date: new Date(candle.time).toTimeString()
        }
    })
}

const getMarketData = async investingMarket => {
    const candles = await fetchCandles(investingMarket.pair);
    if (candles.length === 0) return null;
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
}

export default {
    fetchCandles,
    getMarketData
}