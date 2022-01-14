import axios from 'axios';
import _, { isError } from 'lodash';

const fetchCandles = async (marketPair, limit = 180) => {
    const response = await axios
        .get(`https://public.coindcx.com/market_data/candles?pair=${marketPair}&interval=1m&limit=${limit}`)
        .catch(error => {
            console.log(error.response.data);
            return {
                data: []
            };
        });
    return response.data.map((candle, index) => {
        return {
            ...candle,
            index,
            date: new Date(candle.time).toTimeString()
        }
    })
}

export default {
    fetchCandles
}