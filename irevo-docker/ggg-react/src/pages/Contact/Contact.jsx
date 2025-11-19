import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Contact.css";
import HamburgerMenu from "../../components/HamburgerMenu/HamburgerMenu";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';

const names = [
    '技術的なお問い合わせ',
    '利用方法についてのお問い合わせ',
    '料金・プランについてのお問い合わせ',
    'アカウントについてのお問い合わせ',
    'ご意見・ご要望',
    'その他',
];

// スタイル
function getStyles(uName, select_p, theme) {
    return {
        fontWeight: select_p.includes(uName)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

export default function Contact() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // ルーティング操作用

    const [form, setForm] = useState({
        title: "",
        uName: "",
        email: "",
        message: "",
        select_p: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const theme = useTheme();//スタイル
    const [select_p, setSelect_p] = useState('');

    const handleSelectChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelect_p(
            value
        );
        setForm(prev => ({ ...prev, select_p: value })); // ここで form.select_p に反映
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:3030/log/whoami", {
                    withCredentials: true
                });
                if (res.data.loggedIn) {
                    setUser(res.data.user);
                    console.log("ユーザー情報:", res.data);
                } else {
                    // 未ログインならログインページにリダイレクト
                    navigate("/login");
                }
            } catch (err) {
                console.error("ユーザー情報取得エラー:", err);
                navigate("/login"); // エラー時もログイン画面へ
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form);

        if (!form.title || !form.uName || !form.email || !form.message || !form.select_p) {
            alert('必須項目を入力してください');
            return;
        }

        try {
            const res = await axios.post('http://localhost:3030/gas/contact', {
                uName: form.uName,
                email: form.email,
                title: form.title,
                message: form.message,
                select_p: form.select_p
            }, { withCredentials: true });

            if (res.data && res.data.success) { // success に変更（サーバー側に合わせる）
                setSubmitted(true);
                setTimeout(() => {
                    setForm({ title: '', uName: '', email: '', message: '', select_p: '' });
                    setSelect_p('');
                    setSubmitted(false);
                }, 2000);
            } else {
                alert(res.data.message || '送信に失敗しました');
            }
        } catch (err) {
            console.error(err);
            alert('送信エラーが発生しました');
        }
    };


    return (
        <>
            <HamburgerMenu />
            <div className="contact-container">
                <div className="contact-card">
                    <h2 className="contact-title">お問い合わせ</h2>
                    {submitted ? (
                        <div className="contact-success">
                            お問い合わせありがとうございました。
                        </div>
                    ) : (
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <label>
                                お名前
                                <input
                                    type="text"
                                    name="uName"
                                    value={form.uName || ""}
                                    onChange={(e) => setForm({ ...form, uName: e.target.value })}
                                    required
                                    autoComplete="off"
                                />
                            </label>
                            <label>
                                メールアドレス
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <div>
                                <FormControl fullWidth >
                                    <label>
                                        <span>
                                            お問い合わせ項目<br />
                                        </span>
                                        {/* <InputLabel id="demo-multiple-name-label">お問い合わせ項目</InputLabel> */}
                                        <Select
                                            name="select_p"
                                            labelId="demo-multiple-name-label"
                                            id="demo-multiple-name"
                                            value={select_p}
                                            onChange={handleSelectChange}
                                        // input={<OutlinedInput label="Name" />}

                                        // MenuProps={MenuProps}
                                        >
                                            {names.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                    style={getStyles(name, select_p, theme)}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </label>
                                </FormControl>
                            </div>
                            <label>
                                件名
                                <input
                                    type="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                お問い合わせ内容
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    rows={5}
                                    required
                                />
                            </label>
                            <button type="submit" className="contact-btn">
                                送信
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}