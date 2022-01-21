import schedule from 'node-schedule';
import alerter from '../alerter/alerter';
const run = () => {
    const job = schedule.scheduleJob('*/10 * * * *', async () => {
        console.log(`Exec at ${new Date()}`, alerter)
        alerter.alert();
    })
    console.log('Scheduled a alerting job');
}

export default {
    run
}