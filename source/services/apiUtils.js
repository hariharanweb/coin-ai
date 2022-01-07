import crypto from 'crypto';

const getHeaders = body => {
    const COIN_DCX_KEY=process.env.COIN_DCX_KEY;
    const COIN_DCX_SECRET=process.env.COIN_DCX_SECRET;

    const payload = new Buffer.from(JSON.stringify(body)).toString();
    const signature = crypto.createHmac('sha256', COIN_DCX_SECRET).update(payload).digest('hex')
    return {
        'X-AUTH-APIKEY': COIN_DCX_KEY,
        'X-AUTH-SIGNATURE': signature
    }
}

export default {
    getHeaders
}