import HamburgerMenu from '../../components/HamburgerMenu/HamburgerMenu';
import './Resumeform.css';
import Image from './iRevo.png';
import React, { useState, useEffect, useRef } from 'react';

const Resumeform = () => {


    const [currentPage, setCurrentPage] = useState(1);
    const formSectionsRef = useRef([]);
    const stepRefs = useRef([]);
    const uploadRef = useRef(null);

    // プロフィール情報
    const [name1, setName1] = useState('');
    const [name2, setName2] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [oldAddress, setOldAddress] = useState('');
    const [motivation, setMotivation] = useState('');
    const [location, setLocation] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [oldAddressHuri, setOldAddressHuri] = useState('');
    const [oldAddressContact, setOldAddressContact] = useState('');



    // 学歴・職歴
    const [entries, setEntries] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 資格・免許
    const [licenses, setLicenses] = useState([]);
    const [licenseInput, setLicenseInput] = useState({ year: '', month: '', name: '' });
    const [showLicenseInput, setShowLicenseInput] = useState(false);

    // 希望職種
    const [selectedValues, setSelectedValues] = useState([]);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const overlayRef = useRef(null);

    // 受賞歴
    const [awards, setAwards] = useState([]);
    const [awardInput, setAwardInput] = useState({ name: '', year: '', month: '' });
    const [showAwardInput, setShowAwardInput] = useState(false);

    // 自己紹介等
    const [selfIntroduction, setSelfIntroduction] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [subjects, setSubjects] = useState('');
    const [health, setHealth] = useState('');
    const [healthOther, setHealthOther] = useState('');
    const [commuteTime, setCommuteTime] = useState('');

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
    const currentYear = new Date().getFullYear();
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

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('フォームが送信されました！');
    };

    // 現在のフォーム状態をまとめてオブジェクトにする
    const collectFormData = () => {
        return {
            profile: {
                name: `${name1 || ''} ${name2 || ''}`.trim(),
                birthYear,
                birthMonth,
                birthDay,
                gender,
                phone,
                email,
                address,
                oldAddress,
                oldAddressHuri,
                oldAddressContact,
            },
            previewImage,
            entries,
            licenses,
            motivation,
            selectedValues,
            location,
        };
    };

    // ローカルストレージに下書き保存
    const handleSaveDraft = () => {
        try {
            const data = collectFormData();
            localStorage.setItem('resumeDraft', JSON.stringify(data));
            alert('下書きをローカルに保存しました。');
        } catch (err) {
            console.error(err);
            alert('保存に失敗しました。コンソールを確認してください。');
        }
    };

    // （JSONダウンロード機能は削除。下書き保存のみ対応）

    const handleUploadClick = () => {
        if (uploadRef.current) uploadRef.current.click();
    };

    const handleUploadChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (ev) => setPreviewImage(ev.target.result);
            reader.readAsDataURL(file);
        }
    };


    const jobOptions = [
        'SEシステムエンジニア',
        'PGプログラマ',
        '組込・制御エンジニア',
        'Web系エンジニア（バックエンド/サーバサイド）',
        'Web系エンジニア（フロントエンド）',
        'AI・データエンジニア',
        'QAエンジニア',
        'データサイエンティスト',
        'アプリエンジニア',
        'ゲームエンジニア',
        'ITコンサルタント',
        'PL・PM',
        'インフラエンジニア',
        'セキュリティエンジニア',
        '社内SE・情シス',
        'セールスエンジニア/プリセールス',
    ];

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setSelectedValues((prev) =>
            checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) {
            closeModal();
        }
    };

    const handleAddEntry = () => {
        const school = document.getElementById("school").value.trim();
        const faculty = document.getElementById("faculty").value.trim();
        const start = document.getElementById("startYear").value.trim();
        const end = document.getElementById("endYear").value.trim();

        const isNumber = (str) => /^[0-9]{4}$/.test(str);
        if ((start && !isNumber(start)) || (end && !isNumber(end))) {
            alert("入学年と卒業年には4桁の数字を入力してください。");
            return;
        }

        if (school || faculty || start || end) {
            const newEntry = { school, faculty, start, end };
            setEntries((prev) => [...prev, newEntry]);
        }

        document.getElementById("school").value = "";
        document.getElementById("faculty").value = "";
        document.getElementById("startYear").value = "";
        document.getElementById("endYear").value = "";
        setIsModalOpen(false);
    };

    const handleDeleteEntry = (index) => {
        setEntries((prev) => prev.filter((_, i) => i !== index));
    };

    // 受賞関連ハンドラ
    const handleAwardChange = (e) => {
        const { name, value } = e.target;
        setAwardInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddAward = () => {
        const { name, year, month } = awardInput;
        if (!name) {
            alert('受賞名を入力してください。');
            return;
        }
        setAwards((prev) => [...prev, { name, year, month }]);
        setAwardInput({ name: '', year: '', month: '' });
        setShowAwardInput(false);
    };

    const handleDeleteAward = (index) => {
        setAwards((prev) => prev.filter((_, i) => i !== index));
    };



    const handleAddLicense = () => {
        const { year, month, name } = licenseInput;

        if (!year || !month || !name) {
            alert("すべての項目を入力してください。");
            return;
        }

        setLicenses((prev) => [...prev, { year, month, name }]);
        setLicenseInput({ year: '', month: '', name: '' });
        setShowLicenseInput(false);
    };

    const handleDeleteLicense = (index) => {
        setLicenses((prev) => prev.filter((_, i) => i !== index));
    };

    const handleLicenseChange = (e) => {
        const { name, value } = e.target;
        setLicenseInput((prev) => ({ ...prev, [name]: value }));
    };




    return (
        <>
            <HamburgerMenu />
            <div id="myMain">
                <div className='around'>
                    <div className="container_class">
                        <div className="dai">
                            <span style={{ background: "linear-gradient(transparent 60%, #FFFF3199)" }}>
                                履歴書入力
                            </span>
                        </div>
                        <div className="page_indicator" id="page_indicator">
                            <div className="line" />
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
                                <div className="step_text">学歴・職歴</div>
                            </a>
                            <a href="#" className="step_class" data-page={3}>
                                <div className="circle_class">
                                    <img src={Image} alt="完了" />
                                    <span>3</span>
                                </div>
                                <div className="step_text">資格・免許</div>
                            </a>
                            <a href="#" className="step_class" data-page={4}>
                                <div className="circle_class">
                                    <img src={Image} alt="完了" />
                                    <span>4</span>
                                </div>
                                <div className="step_text">志望動機等</div>
                            </a>
                            <a href="#" className="step_class" data-page={5}>
                                <div className="circle_class">
                                    <img src={Image} alt="完了" />
                                    <span>5</span>
                                </div>
                                <div className="step_text">受賞歴</div>
                            </a>
                            <a href="#" className="step_class" data-page={6}>
                                <div className="circle_class">
                                    <img src={Image} alt="完了" />
                                    <span>6</span>
                                </div>
                                <div className="step_text">自己紹介等</div>
                            </a>
                            <a href="#" className="step_class" data-page={7}>
                                <div className="circle_class">
                                    <img src={Image} alt="完了" />
                                    <span>7</span>
                                </div>
                                <div className="step_text">確認</div>
                            </a>
                            
                        </div>


                        <form id="multi_step_form" className="mawari" action={"Resume"}/*test*/>
                            <div className="form_section" id="form_section_1">
                                <div style={{display:'flex'}}>
                                    <label className="test_name">名前</label>
                                    <div className="input_group">
                                        <div style={{display:'flex'}}>
                                            <div style={{flexDirection:'column',maxWidth:'200px'}}>
                                                <input type="text" name="name" className="name22" required="" value={name1}
                                                    onChange={(e) => setName1(e.target.value)} placeholder='姓'/>
                                            </div>
                                            <div style={{flexDirection:'column',maxWidth:'200px',paddingLeft:'60px'}}>
                                                <input type="text" name="name" className="name22" required="" value={name1}
                                                    onChange={(e) => setName1(e.target.value)} placeholder='名'/>
                                            </div>
                                        </div>
                                        <input type="text" name="fname" className="name_sub" required="" value={name2}
                                            onChange={(e) => setName2(e.target.value)} placeholder='ふりがな'/>
                                    </div>
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
                                            onChange={(e) => setGender(e.target.value)}/>
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
                                        <input type="radio" name="sexual" value="記入しない" checked={gender === '記入しない'}
                                            onChange={(e) => setGender(e.target.value)} />
                                        記入しない
                                    </label>
                                    <br />
                                    <label>
                                        <input type="radio" name="sexual" defaultValue="表示しない" checked={gender === '表示しない'}
                                            onChange={(e) => setGender(e.target.value)} />
                                        表示しない
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
                                <div className="form_row">
                                    <label>E-mail</label>
                                    <input type="text" name="mail" className="textbox-3" required="" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                                <div className="form_row">
                                    <label>現住所</label>
                                    <input
                                        type="text"
                                        name="address"
                                        className="textbox-4"
                                        required=""
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                                <div className="form_row">
                                    <label>帰省先</label>
                                    <input type="text" name="oldaddress" className="textbox-5" value={oldAddress} onChange={(e) => setOldAddress(e.target.value)}/>
                                </div>
                                <div className="form_row">
                                    <label>帰省先(フリガナ)</label>
                                    <input type="text" name="oldaddress_huri" className="textbox-6" value={oldAddressHuri} onChange={(e) => setOldAddressHuri(e.target.value)}/>
                                </div>
                                <div className="form_row">
                                    <label>帰省先(連絡先)</label>
                                    <input type="text" name="oldaddress_contact" className="textbox-6" value={oldAddressContact} onChange={(e) => setOldAddressContact(e.target.value)}/>
                                </div>
                                
                                
                                <div className="form_row">
                                    <label>証明写真</label>
                                    <span className="custom-upload" onClick={handleUploadClick}>画像を選択</span>
                                    <input
                                        type="file"
                                        id="upload"
                                        ref={uploadRef}
                                        className="hidden"
                                        accept="image/*,.pdf"
                                        onChange={handleUploadChange}
                                    />
                                    <div id="preview-container">
                                        {previewImage && (
                                            <img
                                                src={previewImage}
                                                alt="プレビュー"
                                                style={{ maxWidth: '200px', border: '1px solid #ccc', marginTop: '10px' }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form_section" id="form_section_2">
                                <label className="history">学歴・職歴</label>
                                <div className="link-open" onClick={() => setIsModalOpen(true)}>追加</div>

                                {/* モーダル */}
                                {isModalOpen && (
                                    <div className="modal-overlay" id="educationModalOverlay" style={{ display: 'flex' }}>
                                        <div className="modal2">
                                            <h3>学歴を入力</h3>
                                            <div className="form-column">
                                                <input type="text" id="school" placeholder="学校名" />
                                                <input type="text" id="faculty" placeholder="学部・学科" />
                                                <input type="text" id="startYear" placeholder="入学年（例: 2020）" />
                                                <input type="text" id="endYear" placeholder="卒業年（例: 2024）" />
                                            </div>
                                            <div className="modal-actions">
                                                <div className="link-submit" id="submit" onClick={handleAddEntry}>追加する</div>
                                                <div className="link-close" id="close" onClick={() => setIsModalOpen(false)}>閉じる</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div id="result">
                                    入力された学歴：
                                    <div id="education-list">
                                        {entries.map((entry, index) => (
                                            <div key={index} className="entry">
                                                <strong>学校名：</strong> {entry.school}<br />
                                                <strong>学部・学科：</strong> {entry.faculty}<br />
                                                <strong>在学期間：</strong> {entry.start}年 ～ {entry.end}年
                                                <div className="delete" onClick={() => handleDeleteEntry(index)}>削除</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="form_section" id="form_section_3">
                                <label className="history">資格・免許</label>
                                <div className="link-open" onClick={() => setShowLicenseInput(true)}>
                                    ＋
                                </div>

                                {showLicenseInput && (
                                    <div className="form-row">
                                        <input
                                            type="text"
                                            name="year"
                                            placeholder="取得年（例: 2022）"
                                            value={licenseInput.year}
                                            onChange={handleLicenseChange}
                                        />
                                        <input
                                            type="text"
                                            name="month"
                                            placeholder="取得月（例: 5）"
                                            value={licenseInput.month}
                                            onChange={handleLicenseChange}
                                        />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="資格名"
                                            value={licenseInput.name}
                                            onChange={handleLicenseChange}
                                        />
                                        <div className="link-submit" onClick={handleAddLicense}>
                                            追加
                                        </div>
                                    </div>
                                )}

                                <div id="license-list">
                                    {licenses.map((license, index) => (
                                        <div key={index} className="entry1">
                                            <strong>取得年月:</strong> {license.year}年 {license.month}月<br />
                                            <strong>資格名:</strong> {license.name}
                                            <div className="delete" onClick={() => handleDeleteLicense(index)}>
                                                削除
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form_section" id="form_section_4">
                                <div className="form_row">
                                    <label>志望動機</label>
                                    <div className="input_group">
                                        <textarea
                                            id="business_content"
                                            name="business_content"
                                            placeholder="志望動機を具体的にご記入ください"
                                            required=""
                                            value={motivation}
                                            onChange={(e) => setMotivation(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form_row">
                                    <label>希望職種</label>
                                    {/* 開くトリガー */}
                                    <button type='button' className="open-trigger" onClick={() => setIsModalOpen(true)}>
                                        希望職種を選ぶ
                                    </button>
                                    {/* モーダル */}
                                    {isModalOpen && (
                                        <div
                                            id="jobModalOverlay"
                                            className="jobModalOverlay"
                                            ref={overlayRef}
                                            onClick={handleOverlayClick}
                                        >
                                            <div className="modal-content">
                                                <div className="modal3">
                                                    <h2>希望職種を選択</h2>
                                                    <div className="checkbox-group">
                                                        {jobOptions.map((job) => (
                                                            <label key={job}>
                                                                <input
                                                                    type="checkbox"
                                                                    value={job}
                                                                    checked={selectedValues.includes(job)}
                                                                    onChange={handleCheckboxChange}
                                                                />{' '}
                                                                {job}
                                                            </label>
                                                        ))}
                                                    </div>
                                                    <button className="close-trigger" onClick={closeModal}>
                                                        閉じる
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="form_row">
                                    <label>
                                        <div id="selected-values-box" style={{ marginBottom: '1rem' }}>
                                            {selectedValues.length > 0 ? (
                                                <div id="selected-values">
                                                    希望職種: {selectedValues.join(', ')}
                                                </div>
                                            ) : (
                                                <div id="selected-values" style={{ display: 'none' }} />
                                            )}
                                        </div>
                                    </label>
                                </div>
                                <div className="form_row">
                                    <label>希望勤務地</label>
                                    <select required="" value={location} onChange={(e) => setLocation(e.target.value)} >
                                        <option value="">選択してください</option>
                                        <option value="北海道地方">北海道地方</option>
                                        <option value="東北地方">東北地方</option>
                                        <option value="関東地方">関東地方</option>
                                        <option value="中部地方">中部地方</option>
                                        <option value="近畿地方">近畿地方</option>
                                        <option value="中国地方">中国地方</option>
                                        <option value="四国地方">四国地方</option>
                                        <option value="九州地方">九州地方</option>
                                        <option value="全国に転勤可能">全国に転勤可能</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form_section" id="form_section_5">
                                <label className="history">受賞した賞</label>
                                <div className="link-open" onClick={() => setShowAwardInput(true)}>追加</div>

                                {showAwardInput && (
                                    <div className="form-row">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="受賞名"
                                            value={awardInput.name}
                                            onChange={handleAwardChange}
                                        />
                                        <input
                                            type="text"
                                            name="year"
                                            placeholder="受賞年（例: 2020）"
                                            value={awardInput.year}
                                            onChange={handleAwardChange}
                                        />
                                        <input
                                            type="text"
                                            name="month"
                                            placeholder="受賞月（例: 12）"
                                            value={awardInput.month}
                                            onChange={handleAwardChange}
                                        />
                                        <div className="link-submit" onClick={handleAddAward}>
                                            追加
                                        </div>
                                    </div>
                                )}

                                <div id="result">
                                    入力された受賞歴：
                                    <div id="award-list">
                                        {awards.length === 0 ? (
                                            <div>入力されていません。</div>
                                        ) : (
                                            awards.map((award, index) => (
                                                <div key={index} className="entry">
                                                    <strong>受賞名：</strong> {award.name}<br />
                                                    <strong>受賞年：</strong> {award.year || '----'}年
                                                    <strong>受賞月：</strong> {award.month || '--'}月
                                                    <div className="delete" onClick={() => handleDeleteAward(index)}>削除</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form_section" id="form_section_6">
                                <div className="form_row">
                                    <label>自己紹介</label>
                                    <textarea id="self_introduction" placeholder="自己紹介を入力してください" value={selfIntroduction} onChange={(e) => setSelfIntroduction(e.target.value)} />
                                </div>
                                <div className='linkbutton'>
                                    <a href="ResumeBot">
                                        <div className='button_link'>AIサポート</div>
                                    </a>
                                </div>
                                <div className='form_row'>
                                    <label>趣味・特技</label>
                                    <textarea id="hobbies" placeholder="趣味・特技を入力してください" value={hobbies} onChange={(e) => setHobbies(e.target.value)}></textarea>
                                </div>
                                <div className='form_row'>
                                    <label>主な履修科目</label>
                                    <textarea id="subjects" placeholder="主な履修科目を入力してください" value={subjects} onChange={(e) => setSubjects(e.target.value)}></textarea>
                                </div>
                                <div className='form_row'>
                                    <label>健康状態</label>
                                    <label>
                                        <input type="radio" name="health" id="good" value="良好" checked={health === '良好'}
                                            onChange={(e) => setHealth(e.target.value)} />
                                        良好
                                    </label>
                                    <label>
                                        <input type="radio" name="health" id="average" value="概ね良好" checked={health === '概ね良好'}
                                            onChange={(e) => setHealth(e.target.value)} />
                                        概ね良好
                                    </label>
                                    <label>
                                        <input type="radio" name="health" id="poor" value="その他" checked={health === 'その他'}
                                            onChange={(e) => setHealth(e.target.value)} />
                                        その他
                                    </label>
                                </div>
                                <div className='form_row'>
                                    <input type="text" name="health_other" placeholder="具体的な健康状態を入力してください" style={{ marginLeft: '140px'}} value={healthOther} onChange={(e) => setHealthOther(e.target.value)} />
                                </div>

                                <div className='form_row'>
                                    <label>通勤時間</label>
                                    <input type="text" name="commute_time" placeholder="通勤時間を入力してください" value={commuteTime} onChange={(e) => setCommuteTime(e.target.value)} />
                                </div>
                            </div>

                            <div className="form_section" id="form_section_7">
                                <div className="confirm-section">
                                            <label className='history'>■ プロフィール</label>
                                            <ul>
                                                <li>氏名：{(name1 || name2) ? `${name1} ${name2}` : '未入力'}</li>
                                                <li>生年月日：{(birthYear || birthMonth || birthDay) ? `${birthYear || '----'}年 ${birthMonth || '--'}月 ${birthDay || '--'}日` : '未入力'}</li>
                                                <li>性別：{gender || '未選択'}</li>
                                                <li>電話番号：{phone || '未入力'}</li>
                                                <li>メールアドレス：{email || '未入力'}</li>
                                                <li>現住所：{address || '未入力'}</li>
                                                <li>帰省先：{oldAddress || '未入力'}</li>
                                                <li>帰省先(フリガナ)：{oldAddressHuri || '未入力'}</li>
                                                <li>帰省先(連絡先)：{oldAddressContact || '未入力'}</li>
                                                <li>証明写真：{previewImage ? (<img src={previewImage} alt="証明写真" style={{ maxWidth: '120px', display: 'block', marginTop: '6px' }} />) : '未アップロード'}</li>
                                            </ul>

                                            <label className='history'>■ 学歴・職歴</label>
                                            {entries.length === 0 ? (
                                                <p>入力されていません。</p>
                                            ) : (
                                                <ul>
                                                    {entries.map((entry, index) => (
                                                        <li key={index}>
                                                            {entry.school || '（学校名未入力）'}{entry.faculty ? `（${entry.faculty}）` : ''}　{entry.start || '----'}年～{entry.end || '----'}年
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            <label className='history'>■ 資格・免許</label>
                                            {licenses.length === 0 ? (
                                                <p>入力されていません。</p>
                                            ) : (
                                                <ul>
                                                    {licenses.map((license, index) => (
                                                        <li key={index}>
                                                            {license.year || '----'}年 {license.month || '--'}月：{license.name || '（資格名未入力）'}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            <label className='history'>■ 志望動機</label>
                                            <p>{motivation || '未入力'}</p>

                                            <label className='history'>■ 希望職種</label>
                                            <p>{selectedValues.length > 0 ? selectedValues.join(', ') : '未選択'}</p>

                                            <label className='history'>■ 希望勤務地</label>
                                            <p>{location || '未選択'}</p>

                                            <label className='history'>■ 受賞歴</label>
                                            {awards.length === 0 ? (
                                                <p>入力されていません。</p>
                                            ) : (
                                                <ul>
                                                    {awards.map((award, idx) => (
                                                        <li key={idx}>{award.name} {award.year ? `(${award.year}年${award.month ? award.month + '月' : ''})` : ''}</li>
                                                    ))}
                                                </ul>
                                            )}

                                            <label className='history'>■ 自己紹介</label>
                                            <p>{selfIntroduction || '未入力'}</p>

                                            <label className='history'>■ 趣味・特技</label>
                                            <p>{hobbies || '未入力'}</p>

                                            <label className='history'>■ 主な履修科目</label>
                                            <p>{subjects || '未入力'}</p>

                                            <label className='history'>■ 健康状態</label>
                                            <p>{health || '未入力'}</p>
                                            {health === 'その他' && (
                                                <p>具体的な健康状態: {healthOther || '未入力'}</p>
                                            )}
                                            <label className='history'>■ 通勤時間</label>
                                            <p>{commuteTime || '未入力'}</p>

                                            {/* 確認画面用の保存ボタン */}
                                            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <div className="button_link" role="button" tabIndex={0} onClick={handleSaveDraft} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSaveDraft(); }}>
                                                    下書き保存
                                                </div>
                                            </div>
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
                                <button type="submit" className="submit_button">
                                    送信
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>

    );
};

export default Resumeform;