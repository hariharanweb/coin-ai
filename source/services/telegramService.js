import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();
const TELEGRAM_BOT_KEY = process.env.TELEGRAM_BOT_KEY
const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID

const postMessage = async message => {
    const response = await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_KEY}/sendMessage`,
        `chat_id=${TELEGRAM_GROUP_ID}&text=${message}&parse_mode=html`
    );
    return response.data;
}

export default {
    postMessage
}