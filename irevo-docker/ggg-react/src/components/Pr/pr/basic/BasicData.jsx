import React, { useState, useEffect } from 'react';
import './data.css';

const Data = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentInfo, setCurrentInfo] = useState({
        name: '',
        kana: '',
        dob: '',
        gender: '未選択',
        zipCode: '',
        prefecture: '',
        city: '',
        street: '',
        building: '',
        phone: '',
        email: '',
        employmentStatus: '未選択',
        address: '' // 追加: userから受け取る単一住所保存用
    });
    const [originalInfoBackup, setOriginalInfoBackup] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    // user が渡されたら currentInfo を初期化する
    useEffect(() => {
        if (!user) return;
        setCurrentInfo(prev => ({
            ...prev,
            name: user.u_Fname && user.u_Lname ? `${user.u_Fname} ${user.u_Lname}` : (user.u_nick || prev.name),
            kana: user.u_kana || prev.kana,
            dob: user.Birthday || prev.dob,
            gender: user.Gender || user.gender || prev.gender, // 大文字/小文字両対応
            zipCode: user.u_zip || prev.zipCode,
            prefecture: user.u_prefecture || prev.prefecture,
            city: user.u_city || prev.city,
            street: user.u_street || prev.street,
            building: user.u_building || prev.building,
            phone: user.u_Contact || prev.phone,
            email: user.u_Email || prev.email,
            employmentStatus: user.Employment || prev.employmentStatus,
            address: user.u_address || user.u_Address || prev.address // u_Address にも対応
        }));
    }, [user]);

    // --- 表示用 gender 判定（1 -> 男性, 2 -> 女性, 3 -> 回答なし） ---
    const displayGender = (() => {
        const g = currentInfo.gender;
        if (g === 1 || g === '1') return '男性';
        if (g === 2 || g === '2') return '女性';
        if (g === 3 || g === '3') return '記入しない'; // 回答なし（空表示）
        // 文字列で既に "男性"/"女性" 等が入っている場合はそのまま返す
        if (typeof g === 'string' && g.trim() !== '') return g;
        return undefined;
    })();

    const toggleEditMode = () => {
        if (!isEditing) setOriginalInfoBackup({ ...currentInfo });
        setIsEditing(!isEditing);
    };

    // --- 変更: handleRegister でサーバーに送信する ---
    const handleRegister = async () => {
        setIsEditing(false);
        setErrorMessage('');

        try {
            // 住所文字列の先頭にある「〒1234567」や「123-4567」を取り除いて送る
            const cleanAddress = (addr) => {
                if (!addr) return addr;
                return String(addr).trim()
                    .replace(/^〒\s*\d{3}-?\d{4}\s*/, '')
                    .replace(/^\d{3}-?\d{4}\s*/, '');
            };

            const payload = { ...currentInfo, originalEmail: user && user.u_Email ? user.u_Email : undefined };
            // 上書きで address をクリーンにする
            payload.address = cleanAddress(payload.address);

            const res = await fetch('http://localhost:3030/mypage/user_update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // ← セッション（クッキー）を送るため必須
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok || data.success === false) {
                setErrorMessage(data.message || '保存に失敗しました');
                setIsEditing(true);
                return;
            }

            // サーバーが返した最新 user で表示を更新（セッションと同期）
            if (data.user) {
                const u = data.user;
                // サーバー戻り値から表示用オブジェクトを組み立て（u_Address 優先）
                const newInfo = {
                    name: u.u_Fname && u.u_Lname ? `${u.u_Fname} ${u.u_Lname}` : (u.u_nick || ''),
                    kana: u.u_kana || '',
                    dob: u.Birthday || '',
                    gender: u.Gender || '未選択',
                    // 個別カラムがある場合はそれを、なければ u_Address を address に入れる
                    zipCode: u.u_zip || '',
                    prefecture: u.u_prefecture || '',
                    city: u.u_city || '',
                    street: u.u_street || '',
                    building: u.u_building || '',
                    // DB 仕様によっては都道府県等が無く u_Address のみの場合があるため両方対応
                    address: (u.u_Address || u.u_address) ? (u.u_prefecture || u.u_city || u.u_street || u.u_building ? (u.u_Address || u.u_address || '') : (u.u_Address || u.u_address)) : '',
                    phone: u.u_Contact || '',
                    email: u.u_Email || '',
                    employmentStatus: u.Employment || '未選択'
                };
                setCurrentInfo(newInfo);
                // 編集キャンセル用バックアップは新しい表示情報で上書きする
                setOriginalInfoBackup({ ...newInfo });
                console.log('user_update response:', data);
            }

        } catch (err) {
            console.error('保存エラー:', err);
            setErrorMessage('サーバーに接続できませんでした');
            setIsEditing(true);
        }
    };

    const handleCancel = () => {
        setCurrentInfo({ ...originalInfoBackup });
        setIsEditing(false);
    };

    const formatDob = (dob) => {
        if (!dob) return '未入力';
        const [year, month, day] = dob.split('-');
        return `${year}年${parseInt(month, 10)}月${parseInt(day, 10)}日`;
    };

    const formatAddress = () => {
        const zipCodePrefix = currentInfo.zipCode ? `〒${currentInfo.zipCode} ` : '';
        // 都道府県等があればそれを優先して組み立てる
        const hasComponents = currentInfo.prefecture || currentInfo.city || currentInfo.street || currentInfo.building;
        if (hasComponents) {
            const fullAddress = `${currentInfo.prefecture}${currentInfo.city}${currentInfo.street}${currentInfo.building}`;
            return `${zipCodePrefix}${fullAddress || '未入力'}`;
        }
        // コンポーネントが無ければ user から受け取った address を使う（あれば）
        if (currentInfo.address && String(currentInfo.address).trim() !== '') {
            return `${zipCodePrefix}${currentInfo.address}`;
        }
        return `${zipCodePrefix}未入力`;
    };

    // 🔍 郵便番号入力後、ZipCloud API で住所補完
    const handleZipCodeBlur = async () => {
        const zip = currentInfo.zipCode.replace(/[^0-9]/g, '');
        if (zip.length !== 7) {
            setErrorMessage('郵便番号は7桁で入力してください。');
            return;
        }

        try {
            const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`);
            const data = await res.json();

            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                setCurrentInfo(prev => ({
                    ...prev,
                    prefecture: result.address1,
                    city: result.address2,
                    street: result.address3
                }));
                setErrorMessage('');
            } else {
                setErrorMessage('該当する住所が見つかりませんでした。');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('住所の取得に失敗しました。');
        }
    };

    const handleInputChange = (e) => {
        const { id, value, name, type } = e.target;
        if (type === 'radio') {
            setCurrentInfo(prev => ({ ...prev, [name]: value }));
        } else {
            setCurrentInfo(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleAddressChange = (e) => {
        const { id, value } = e.target;
        setCurrentInfo(prev => ({ ...prev, [id]: value }));
    };

    return (
        <form>
            <div className="info-container">
                <div className={`section-header ${isEditing ? 'is-hidden' : 'display-mode'} basic-info-display-header`}>
                    <div className="section-title">基本情報<span className="recommend-badge">入力推奨</span></div>
                    <span className="material-icons edit-toggle-icon info-edit-toggle-icon" onClick={toggleEditMode}>edit</span>
                </div>

                <div className={`section-header ${isEditing ? 'edit-mode' : 'is-hidden'} basic-info-edit-header`}>
                    <div className="section-title">基本情報<span className="recommend-badge">入力推奨</span></div>
                </div>

                {/* 表示モード */}
                <div className={`display-mode basic-info-display-area ${isEditing ? 'is-hidden' : ''}`}>
                    <div className="info-item"><strong>氏名:</strong> {currentInfo.name || '未入力'}</div>
                    <div className="info-item"><strong>フリガナ:</strong> {currentInfo.kana || '未入力'}</div>
                    <div className="info-item"><strong>生年月日:</strong> {formatDob(currentInfo.dob)}</div>
                    <div className="info-item"><strong>性別:</strong> {displayGender || '未選択'}</div>
                    <div className="info-item"><strong>住所:</strong> {formatAddress()}</div> {/* 引数削除 */}
                    <div className="info-item"><strong>連絡先:</strong> {currentInfo.phone || '未入力'}</div>
                    <div className="info-item"><strong>メールアドレス:</strong> {currentInfo.email || '未入力'}</div>
                    <div className="info-item"><strong>就業状態:</strong> {currentInfo.employmentStatus || '未選択'}</div>
                </div>

                {/* 編集モード */}
                <div className={`edit-mode basic-info-edit-area ${isEditing ? '' : 'is-hidden'}`}>
                    <div className="input-group">
                        <label htmlFor="name">氏名:</label>
                        <input type="text" id="name" value={currentInfo.name} onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="kana">フリガナ:</label>
                        <input type="text" id="kana" value={currentInfo.kana} onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="dob">生年月日:</label>
                        <input type="date" id="dob" value={currentInfo.dob} onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <label>性別:</label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="1"
                                checked={currentInfo.gender === 1 || currentInfo.gender === '1'}
                                onChange={handleInputChange}
                            />男性
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="2"
                                checked={currentInfo.gender === 2 || currentInfo.gender === '2'}
                                onChange={handleInputChange}
                            />女性
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="3"
                                checked={currentInfo.gender === 3 || currentInfo.gender === '3'}
                                onChange={handleInputChange}
                            />記入しない
                        </label>
                    </div>

                    {/* 住所入力 */}
                    <div className="input-group">
                        <label htmlFor="zipCode" style={{width:'4rem'}}>住所:</label>
                        <div>
                            <input
                                type="text"
                                id="zipCode"
                                placeholder="郵便番号 (例: 1000001)"
                                maxLength="7"
                                value={currentInfo.zipCode}
                                onChange={handleAddressChange}
                                onBlur={handleZipCodeBlur}
                            />
                        </div>
                        <div>
                            <div style={{display:'flex'}}>
                                <label style={{width:'4rem'}}>住所：</label>
                                <input
                                    type="text"
                                    id="prefecture"
                                    placeholder="都道府県"
                                    value={currentInfo.prefecture}
                                    onChange={handleAddressChange}
                                />
                            </div>
                            <input
                                type="text"
                                id="city"
                                placeholder="市区町村"
                                value={currentInfo.city}
                                onChange={handleAddressChange}
                            />
                            <input
                                type="text"
                                id="street"
                                placeholder="番地"
                                value={currentInfo.street}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <input
                            type="text"
                            id="building"
                            placeholder="建物名・部屋番号 (任意)"
                            value={currentInfo.building}
                            onChange={handleAddressChange}
                        />
                    </div>

                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                    <div className="input-group">
                        <label htmlFor="phone">連絡先:</label>
                        <input type="text" id="phone" value={currentInfo.phone} onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">メールアドレス:</label>
                        <input type="email" id="email" value={currentInfo.email} onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <label>就業状態:</label>
                        <label><input type="radio" name="employmentStatus" value="在職中" checked={currentInfo.employmentStatus === '在職中'} onChange={handleInputChange} />在職中</label>
                        <label><input type="radio" name="employmentStatus" value="離職中" checked={currentInfo.employmentStatus === '離職中'} onChange={handleInputChange} />離職中</label>
                        <label><input type="radio" name="employmentStatus" value="学生" checked={currentInfo.employmentStatus === '学生'} onChange={handleInputChange} />学生</label>
                        <label><input type="radio" name="employmentStatus" value="未選択" checked={currentInfo.employmentStatus === '未選択'} onChange={handleInputChange} />未選択</label>
                    </div>

                    <div className="action-buttons">
                        <button type="button" onClick={handleCancel}>キャンセル</button>
                        <button type="button" onClick={handleRegister}>登録</button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Data;
