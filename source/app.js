import express from 'express';
import userService from './services/userService';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import orderService from './services/orderService';
import candleService from './services/candleService';
import telegramService from './services/telegramService';
import alertingService from './services/alertingService';
import alerter from './alerter/alerter';
import marketDetails from "./services/marketDetails";
import _ from 'lodash';

dotenv.config();
const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!' + new Date())
})

app.get('/candle/:marketPair', async (req, res) => {
    const candles = await candleService.fetchCandles(req.params.marketPair);
    res.send(candles);
})

app.get('/data/:marketPair', async (req, res) => {
    const investingMarket = _.find(marketDetails, {pair: req.params.marketPair})
    const data = await candleService.getMarketData(investingMarket);
    res.send(data);
})

app.get('/marketData/:currency', async (req, res) => {
    const data = await alerter.getMarketChanges(req.params.currency)
    res.send(data);
})

// app.get('/user', async (req, res) => {
//     const user = await userService.getUser();
//     res.send(user);
// })

app.get('/user/balances', async (req, res) => {
    const balances = await userService.getBalances();
    res.send(balances);
})

// app.post('/user/order', async (req, res) => {
//     const body = req.body;
//     const recentCandle = await candleService.fetchCandles(body.marketPair, 1);
//     const lastClose = recentCandle[0].close;
//     const order = await orderService.order(body.marketPair, lastClose, body.amount);
//     res.send(order);
// })

app.post('/telegram/message', async (req, res) => {
    const response = await telegramService.postMessage(req.body.message);
    res.send(response);
})

app.get('/telegram/alert/:baseCurrency', async (req, res) => {
    const baseCurrency = req.params.baseCurrency || "INR"
    alerter.alert(baseCurrency);
    res.send("Alert Sent");
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

alertingService.run()
alertingService.runBTC()
alertingService.runUSDT()