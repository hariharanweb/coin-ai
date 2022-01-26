import schedule from 'node-schedule';
import alerter from '../alerter/alerter';

const scheduleJob = (min, currency) => {
    return schedule.scheduleJob(`${min} * * * *`, async () => {
        console.log(`Exec at ${new Date()} for ${currency}`)
        alerter.alert(currency);
    })
}
const run = () => {
    [0,15,30,45].forEach(time => scheduleJob(time, 'INR'))
    console.log('Scheduled a alerting job for INR');
}
const runBTC = () => {
    [5,20,35,50].forEach(time => scheduleJob(time, 'BTC'))
    console.log('Scheduled a alerting job for BTC');
}

const runUSDT = () => {
    [10,25,40,55].forEach(time => scheduleJob(time, 'USDT'))
    console.log('Scheduled a alerting job for USDT');
}

export default {
    run,
    runBTC,
    runUSDT
}