import express from 'express';
import userService from './services/userService';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import orderService from './services/orderService';
import candleService from './services/candleService';

dotenv.config();
const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!' + new Date())
})

app.get('/user', async (req, res) => {
    const user = await userService.getUser();
    res.send(user);
})

app.get('/user/balances', async (req, res) => {
    const balances = await userService.getBalances();
    res.send(balances);
})

app.post('/user/order', async (req, res) => {
    const body = req.body;
    const recentCandle = await candleService.fetchCandles(body.marketPair, 1);
    const lastClose = recentCandle[0].close;
    const order = await orderService.order(body.marketPair, lastClose, body.amount);
    res.send(order);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})