import express from 'express';
import userService from './services/userService';
import dotenv from 'dotenv';

dotenv.config();
const app = express()
const port = 3000

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})