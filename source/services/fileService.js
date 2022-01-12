import fs from 'fs';

const LAST_MARKET_JSON = "./lastMarket.json";

const storeLastMarket = markets => {
    fs.writeFileSync(LAST_MARKET_JSON, JSON.stringify(markets));
}

const readLastMarket = markets => {
    if(fs.existsSync(LAST_MARKET_JSON)){
        return JSON.parse(fs.readFileSync(LAST_MARKET_JSON, JSON.stringify(markets),"utf8"));
    }
    return [];
}

export default {
    storeLastMarket,
    readLastMarket
}