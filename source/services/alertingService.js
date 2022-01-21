import schedule from 'node-schedule';
import alerter from '../alerter/alerter';
const run = () => {
    const job = schedule.scheduleJob('*/15 * * * *', async () => {
        console.log(`Exec at ${new Date()}`, alerter)
        alerter.alert();
    })
    console.log('Scheduled a alerting job');
}
const runBTC = () => {
    const job = schedule.scheduleJob('*/15 * * * *', async () => {
        console.log(`Exec at ${new Date()}`, alerter)
        alerter.alert("BTC");
    })
    console.log('Scheduled a alerting job');
}

const runUSDT = () => {
    const job = schedule.scheduleJob('*/15 * * * *', async () => {
        console.log(`Exec at ${new Date()}`, alerter)
        alerter.alert("USDT");
    })
    console.log('Scheduled a alerting job');
}

export default {
    run,
    runBTC,
    runUSDT
}