import {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';




// サーバのセッション（whoami）を取得して user オブジェクトを返す普通の非同期関数
export default async function fetchUser() {
    try {
        const res = await axios.get('http://15.152.5.110:3030/log/whoami', { withCredentials: true });
        if (res.data && res.data.loggedIn) {
            return res.data.user;
        }
        return null;
    } catch (err) {
        console.error('fetchUser error', err);
        return null;
    }
}