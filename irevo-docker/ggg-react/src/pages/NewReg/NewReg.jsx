// newreg
import HamburgerMenu from '../../components/HamburgerMenu/HamburgerMenu';
import './NewReg.css';
import Image from './iRevo.png';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Password from '../../components/Zxcvbn/Password';
import axios from 'axios';

const Resumeform = () => {


  const [currentPage, setCurrentPage] = useState(1);
  const formSectionsRef = useRef([]);
  const stepRefs = useRef([]);
  const uploadRef = useRef(null);

  // プロフィール情報
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const currentYear = new Date().getFullYear();
  const [birthYear, setBirthYear] = useState(currentYear.toString());
  const [birthMonth, setBirthMonth] = useState('1');
  const [birthDay, setBirthDay] = useState('1');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickName] = useState('');
  const [hurigana, setHurigana] = useState('');
  const [u_Address, setAddress] = useState('');
  const [Employment, setEmployment] = useState('未選択'); // 初期値を0→'未選択'に変更
  // パスワード
  const [password, setPassword] = useState('');
  // 新規登録送信処理
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 生年月日をYYYY-MM-DD形式に
    const Birthday = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

    // 性別を数値に変換（男性=1, 女性=2, 回答しない=0）
    let GenderNum = 0;
    if (gender === '男性') GenderNum = 1;
    else if (gender === '女性') GenderNum = 2;

    console.log({
      u_Fname: name1,
      u_Lname: name2,
      u_kana: hurigana,
      u_nick: nickname,
      Birthday: birthYear && birthMonth && birthDay ? Birthday : '',
      Gender: GenderNum,
      u_Contact: phone,
      u_Address: u_Address,
      u_Password: password,
      u_Email: email,
      Employment: Employment,
    });

    try {
      const res = await axios.post('http://15.152.5.110:3030/user/user', {
        u_Fname: name1,
        u_Lname: name2,
        u_kana: hurigana,
        u_nick: nickname,
        Birthday: birthYear && birthMonth && birthDay ? Birthday : '',
        Gender: GenderNum,
        u_Contact: phone,
        u_Address: u_Address,
        u_Password: password,
        u_Email: email,
        Employment: Employment,
      });
      alert(res.data.message);
      if (res.data.success) {
        navigate('/Mypage');
      }
    } catch (err) {
      alert('登録エラー: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    formSectionsRef.current = document.querySelectorAll('.form_section');
    stepRefs.current = document.querySelectorAll('.step_class');
    showPage(currentPage);

    stepRefs.current.forEach((step) => {
      step.addEventListener('click', handleStepClick);
    });

    return () => {
      stepRefs.current.forEach((step) => {
        step.removeEventListener('click', handleStepClick);
      });
    };
  }, []);

  // 日付セレクトのReact
  const years = Array.from({ length: 101 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const showPage = (pageNumber) => {
    formSectionsRef.current.forEach((section) => section.classList.remove('active_form_section'));
    const currentSection = document.getElementById(`form_section_${pageNumber}`);
    if (currentSection) currentSection.classList.add('active_form_section');

    stepRefs.current.forEach((step) => {
      const circle = step.querySelector('.circle_class');
      const img = circle.querySelector('img');
      const span = circle.querySelector('span');
      const stepNum = parseInt(step.dataset.page);

      step.classList.remove('active_class', 'completed_class');

      if (stepNum < pageNumber) {
        step.classList.add('completed_class');
        img.style.display = 'block';
        span.style.display = 'none';
      } else if (stepNum === pageNumber) {
        step.classList.add('active_class');
        img.style.display = 'block';
        span.style.display = 'none';
      } else {
        img.style.display = 'none';
        span.style.display = 'block';
      }
    });

    const prevButton = document.getElementById('prev_button');
    const nextButton = document.getElementById('next_button');
    const submitContainer = document.getElementById('submit_button_container');

    if (pageNumber === 1) {
      prevButton.style.display = 'none';
    } else {
      prevButton.style.display = 'inline-block';
    }

    if (pageNumber === formSectionsRef.current.length) {
      nextButton.style.display = 'none';
      submitContainer.style.display = 'flex';
    } else {
      nextButton.style.display = 'inline-block';
      submitContainer.style.display = 'none';
    }
  };

  const handleStepClick = (e) => {
    e.preventDefault();
    const targetPage = parseInt(e.currentTarget.dataset.page);
    if (!isNaN(targetPage)) {
      setCurrentPage(targetPage);
      showPage(targetPage);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      showPage(newPage);
    }
  };

  const handleNext = () => {
    if (currentPage < formSectionsRef.current.length) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      showPage(newPage);
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
        <div className='around'>
          <div className="container_class">
            <div className="dai">
              <span style={{ background: "linear-gradient(transparent 60%, #FFFF3199)" }}>
                新規登録
              </span>
            </div>
            <div className="page_indicator" id="page_indicator">
              <div className="line-1" />
              <a href="#" className="step_class" data-page={1}>
                <div className="circle_class">
                  <img src={Image} alt="完了" />
                  <span>1</span>
                </div>
                <div className="step_text">プロフィール</div>
              </a>
              <a href="#" className="step_class" data-page={2}>
                <div className="circle_class">
                  <img src={Image} alt="完了" />
                  <span>2</span>
                </div>
                <div className="step_text">メール・パスワード</div>
              </a>
            </div>

            <form id="multi_step_form" className="mawari" onSubmit={handleSubmit}>
              <div className="form_section" id="form_section_1">
                <div className="form_row">
                  <label className="name">名前</label>
                  <div className="input_group">
                    <span className="name-label">姓</span>
                    <input type="text" name="name" className="name1" required="" value={name1}
                      onChange={(e) => setName1(e.target.value)} />
                    <span className="name-label">名</span>
                    <input type="text" name="fname" className="name2" required="" value={name2}
                      onChange={(e) => setName2(e.target.value)} />
                  </div>
                </div>
                <div className='form_row'>
                  <label>ふりがな</label>
                  <input type="text" name="hurigana" className="textbox-3" value={hurigana} onChange={(e) => setHurigana(e.target.value)} />
                </div>
                <div className='form_row'>
                  <label>ニックネーム</label>
                  <input type="text" name="nickname" className="textbox-3" value={nickname} onChange={(e) => setNickName(e.target.value)} />
                </div>
                <div className="form_row">
                  <label>生年月日</label>
                  <div className="input_group date_inputs_container">
                    <select id="establishment_year" value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <span>
                      年
                      <select id="establishment_month" value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)}>
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <span>月</span>
                      <select id="establishment_day" value={birthDay} onChange={(e) => setBirthDay(e.target.value)}>
                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <span>日</span>
                    </span>
                  </div>
                </div>
                <div className="form_row">
                  <label className="sexual">性別</label>
                  <label>
                    <input type="radio" name="sexual" value="男性" checked={gender === '男性'}
                      onChange={(e) => setGender(e.target.value)} />
                    男性
                  </label>
                  <br />
                  <label>
                    <input type="radio" name="sexual" value="女性" checked={gender === '女性'}
                      onChange={(e) => setGender(e.target.value)} />
                    女性
                  </label>
                  <br />
                  <label>
                    <input type="radio" name="sexual" value="回答しない" checked={gender === '回答しない'}
                      onChange={(e) => setGender(e.target.value)} />
                    回答しない
                  </label>
                  <br />
                </div>
                <div className="form_row">
                  <label>携帯番号</label>
                  <input
                    type="text"
                    name="call_number"
                    className="small_input"
                    placeholder="携帯番号"
                    required=""
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className='form_row'>
                  <label>住所</label>
                  <input type="text" name="u_Address" className="textbox-3" value={u_Address} onChange={(e) => setAddress(e.target.value)} />
                </div>

                <div className="form_row">
                  <label className="Employment">就業状態</label>
                  <label>
                    <input type="radio" name="Employment" value="在職中" checked={Employment === '在職中'}
                      onChange={(e) => setEmployment(e.target.value)} />
                    在職中
                  </label>
                  <br />
                  <label>
                    <input type="radio" name="Employment" value="離職中" checked={Employment === '離職中'}
                      onChange={(e) => setEmployment(e.target.value)} />
                    離職中
                  </label>
                  <br />
                  <label>
                    <input type="radio" name="Employment" value="学生" checked={Employment === '学生'}
                      onChange={(e) => setEmployment(e.target.value)} />
                    学生
                  </label>
                  <br />
                  <label>
                    <input type="radio" name="Employment" value="未選択" checked={Employment === '未選択'}
                      onChange={(e) => setEmployment(e.target.value)} />
                    未選択
                  </label>
                  <br />
                </div>

              </div>
              <div className='form_section' id="form_section_2">
                <div className='form_row'>
                  <label>メールアドレス</label>
                  <input type="text" name="mail" className="textbox-3" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='form_row'>
                  <Password value={password} onChange={setPassword} />
                </div>
              </div>

              <div className="button_group">
                <button type="button" className="prev_button" id="prev_button" onClick={handlePrev}>
                  {'＜＜ 前へ'}
                </button>
                <button type="button" className="next_button" id="next_button" onClick={handleNext}>
                  {'次へ ＞＞'}
                </button>
              </div>
              <div className="submit_button_container" id="submit_button_container" style={{ display: 'none' }}>
                {/* <button type="submit" className="submit_button">登録</button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>

  );
};

export default Resumeform;