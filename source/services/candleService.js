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
    const volume = 'volume';
    const tenPercent = Math.round(candles.length * 0.1);
    const recent = candles.slice(0, tenPercent);
    const old = candles.slice(tenPercent);
    const recentValueMean = _.meanBy(recent, meanByParameter);
    const recentVolumeMean = _.meanBy(recent, volume);
    const oldValueMean = _.meanBy(old, meanByParameter);
    const oldVolumeMean = _.meanBy(old, volume);
    const changeValuePercent = (recentValueMean - oldValueMean) * 100 / oldValueMean;
    const changeVolumePercent = (recentVolumeMean - oldVolumeMean) * 100 / oldVolumeMean;
    const recentCandleValue = candles[0][meanByParameter];
    const recentCandleVolume = candles[0][volume];
    const lastCandleDeviationPercent = (recentCandleValue - recentValueMean) * 100 / recentValueMean;
    return {
        marketPair: investingMarket.pair,
        symbol: investingMarket.symbol,
        recentMean: recentValueMean,
        oldMean: oldValueMean,
        changePercent: changeValuePercent,
        changeVolumePercent,
        recentCandleVolume,
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