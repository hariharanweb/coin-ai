import axios from 'axios';
import apiUtils from './apiUtils';
import _ from 'lodash';

const getUser = async () => {
    const body = {
        timestamp: Math.floor(Date.now())
    };
    const headers = apiUtils.getHeaders(body);
    const response = await axios.post('https://api.coindcx.com/exchange/v1/users/info', body, { headers });
    return response.data;
}

const getBalances = async () => {
    const body = {
        timestamp: Math.floor(Date.now())
    };
    const headers = apiUtils.getHeaders(body);
    const response = await axios.post('https://api.coindcx.com/exchange/v1/users/balances', body, { headers });
    return _.filter(response.data, balance => balance.balance > 0);
}

export default {
    getUser,
    getBalances
}