import apiUtils from "./apiUtils";
import axios from "axios";
import marketDetails from "./marketDetails";
import _ from "lodash";

const order = async (marketPair, marketPrice, amount) => {
    const marketDetail = _.find(marketDetails, marketDetail => marketDetail.pair === marketPair)
    console.log(amount, marketPrice);
    const quantity = toFixed((amount / marketPrice), marketDetail.target_currency_precision);
    const market = marketDetail.symbol;
    const body = {
        "side": "buy",
        "order_type": "market_order", 
        "market": market, 
        "total_quantity": quantity,
        "timestamp": Math.floor(Date.now())
    }
    const headers = apiUtils.getHeaders(body);
    console.log(JSON.stringify(body), headers, marketDetail)

    const response = await axios
        .post('https://api.coindcx.com/exchange/v1/orders/create', body, { headers })
        .catch(error => {
            console.log(error.response.data);
            return error;
        });
    return response.data;

}
const toFixed = (num, fixed) => {
    console.log(num, fixed)
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}
export default {
    order
}