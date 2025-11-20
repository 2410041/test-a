// newreg
import HamburgerMenu from '../../components/C_Header/C_Header';
import './C_NewReg.css';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Password from '../../components/Zxcvbn/Password';
import axios from 'axios';

const C_Newreg = () => {


  const [currentPage, setCurrentPage] = useState(1);
  const formSectionsRef = useRef([]);
  const stepRefs = useRef([]);

  // プロフィール情報
  const [name1, setName1] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [representative, setRepresentative] = useState('');
  // パスワード
  const [password, setPassword] = useState('');
  // 新規登録送信処理
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({
      company_name: name1,
      representative_name: representative,
      phone_number: phone,
      email: email,
      password: password
    });

    try {
      const res = await axios.post('http://15.152.5.110:3030/newUser', {
        company_name: name1,
        representative_name: representative,
        phone_number: phone,
        email: email,
        password: password
      }, { withCredentials: true });
      alert(res.data.message);
      if (res.data.success) {
        // 登録完了後は企業側ダッシュボードへ遷移
        navigate('/C_Dashboard');
      }
    } catch (err) {
      alert('登録エラー: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    const passwordToggle = document.querySelector('.password__toggle2');

    // イベントハンドラーを関数として定義
    const handleToggleClick = (e) => {
      console.log("クリックされました");
      const input = e.target.previousElementSibling;
      const type = input.getAttribute('type');
      input.setAttribute('type', type === 'password' ? 'text' : 'password');
      e.target.classList.toggle('is-visible');
    };

    // passwordToggleが存在する場合のみリスナーを追加
    if (passwordToggle) {
      passwordToggle.addEventListener('click', handleToggleClick);
    }

    // クリーンアップ関数
    return () => {
      // リスナーを削除
      if (passwordToggle) {
        passwordToggle.removeEventListener('click', handleToggleClick);
      }
    };
  }, []); // 依存配列が空なので、コンポーネントがマウントされたときのみ実行される



  return (
    <>
      <HamburgerMenu />
      <div id="myMain">
        <div className='cnewreg-around'>
          <div className="cnewreg-container">
            <div className="cnewreg-dai">
              <span style={{ background: "linear-gradient(transparent 60%, #FFFF3199)" }}>
                新規登録
              </span>
            </div>
            <form id="multi_step_form" className="cnewreg-mawari" onSubmit={handleSubmit}>
              {/* 名前空間化したクラスを使用 */}
              <div className="cnewreg-form_section cnewreg-active_form_section" id="form_section_1">
                <div className="cnewreg-form_row">
                  <label className="cnewreg-name">会社名</label>
                  <div className="cnewreg-input_group">
                    <input type="text" name="name" className="cnewreg-name1" required="" value={name1}
                      onChange={(e) => setName1(e.target.value)} />
                  </div>
                </div>
                <div className='cnewreg-form_row'>
                  <label>代表者名</label>
                  <input type="text" name="representative" className="cnewreg-textbox-3" value={representative} onChange={(e) => setRepresentative(e.target.value)} />
                </div>
                <div className="cnewreg-form_row">
                  <label>電話番号</label>
                  <input
                    type="text"
                    name="call_number"
                    className="cnewreg-small_input"
                    placeholder="電話番号"
                    required=""
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className='cnewreg-form_row'>
                  <label>メールアドレス</label>
                  <input type="text" name="mail" className="cnewreg-textbox-3" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='cnewreg-form_row'>
                  <Password value={password} onChange={setPassword} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>

  );
};

export default C_Newreg;