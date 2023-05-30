import alerter from './source/alerter/alerter';

export const handler = async () => {
  const data = await alerter.alert('USDT')
  return {
    statusCode: 200,
    body: JSON.stringify(`Sent at ${new Date()} ${data}`),
  };
}