import React, { useState, useEffect } from 'react';
import './password.css'; // Make sure this CSS file exists in your project

const Password = ({ value, onChange, minScore = 3, relaxOnNoZxcvbn = true }) => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: -1, text: 'パスワードを入力してください' });
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    symbol: false,
  });
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [zxcvbnLoaded, setZxcvbnLoaded] = useState(false);

  // Load zxcvbn library from a script tag
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/zxcvbn@4.4.2/dist/zxcvbn.js';
    script.async = true;
    document.body.appendChild(script);

    const onLoad = () => setZxcvbnLoaded(true);
    script.addEventListener('load', onLoad);

    // cleanup
    return () => {
      script.removeEventListener('load', onLoad);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  // Effect to check password strength and match whenever passwords change
  useEffect(() => {
    if (window.zxcvbn) {
      // Check strength
      const result = zxcvbn(value, []);
      const score = result.score;
    let strengthText = '';

    switch (score) {
      case 0: strengthText = '非常に弱い'; break;
      case 1: strengthText = '弱い'; break;
      case 2: strengthText = '普通'; break;
      case 3: strengthText = '良い'; break;
      case 4: strengthText = '非常に強い'; break;
      default: strengthText = '';
    }
      setPasswordStrength({ score, text: `強度: ${strengthText}` });

    // Check requirements
    setPasswordRequirements({
      length: value.length >= 6,
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      symbol: /[^A-Za-z0-9]/.test(value),
    });

    // Check if passwords match
    const match = value === confirmPassword && value !== '';
    setPasswordsMatch(match);

      // Update submit button state using zxcvbn
      setIsSubmitEnabled(score >= minScore && match);
    } else {
      // zxcvbn が利用できない場合のフォールバック
      if (relaxOnNoZxcvbn) {
        const fallbackOk = value.length >= 6 && match;
        setPasswordStrength(prev => ({ ...prev, text: fallbackOk ? '強度: 十分' : '強度: 要改善（zxcvbn未読み込み）' }));
        setIsSubmitEnabled(fallbackOk);
      } else {
        setIsSubmitEnabled(false);
      }
    }
  }, [value, confirmPassword]);

  const handlePasswordChange = (e) => {
    onChange(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="container3">
      <div className="form-group">
        <label htmlFor="password" className="form-label">
          パスワード:
        </label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="password__input"
            value={value}
            onChange={handlePasswordChange}
          />
          <button
            type="button"
            className={`password__toggle ${showPassword ? 'is-visible' : ''}`}
            onClick={() => togglePasswordVisibility('password')}
          ></button>
        </div>
        <div className="strength-meter">
          <div
            id="strength-bar"
            className={`strength-bar strength-${passwordStrength.score}`}
            style={{ width: `${((passwordStrength.score + 1) / 5) * 100}%` }}
          ></div>
        </div>
        <div id="strength-text" className="strength-text">
          {value === '' ? 'パスワードを入力してください' : passwordStrength.text}
        </div>
      </div>

      <div className="requirements-box">
        <p className="requirement-item">パスワード要件:</p>
        <p className={`requirement-item ${passwordRequirements.length ? 'fulfilled' : 'unfulfilled'}`}>
          6文字以上
        </p>
        <p className={`requirement-item ${passwordRequirements.uppercase ? 'fulfilled' : 'unfulfilled'}`}>
          大文字を含む
        </p>
        <p className={`requirement-item ${passwordRequirements.number ? 'fulfilled' : 'unfulfilled'}`}>
          数字を含む
        </p>
        <p className={`requirement-item ${passwordRequirements.symbol ? 'fulfilled' : 'unfulfilled'}`}>
          記号を含む
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="confirm-password" className="form-label">
          パスワード（確認用）:
        </label>
        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirm-password"
            className="password__input"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <button
            type="button"
            className={`password__toggle2 ${showConfirmPassword ? 'is-visible' : ''}`}
            onClick={() => togglePasswordVisibility('confirmPassword')}
          ></button>
        </div>
        <div
          id="match-message"
          className={`match-message ${confirmPassword === '' ? '' : passwordsMatch ? 'matched' : 'not-matched'}`}
        >
          {confirmPassword !== '' && (passwordsMatch ? 'パスワードが一致しました' : 'パスワードが一致しません')}
        </div>
      </div>

      <button
        type="submit"
        id="submit-button"
        className="submit-button"
        disabled={!isSubmitEnabled}
        title={!isSubmitEnabled ? 'パスワード要件（強度と一致）を満たすと有効になります' : 'アカウント登録'}
      >
        アカウント登録
      </button>

      {/* 補助メッセージ: 有効にならない理由を表示 */}
      {!isSubmitEnabled && (
        <div className="submit-hint" style={{ color: '#d00', marginTop: '0.5rem' }}>
          {!zxcvbnLoaded && relaxOnNoZxcvbn && (
            <div>パスワード強度検査ライブラリの読み込み中です。読み込みに時間がかかる場合は、6文字以上で確認用と一致しているか確認してください。</div>
          )}
          {zxcvbnLoaded && (
            <div>
              <div>{passwordStrength.text}</div>
              {!passwordsMatch && <div>確認用パスワードと一致していません。</div>}
              {(!passwordRequirements.length || !passwordRequirements.uppercase || !passwordRequirements.number) && (
                <div>6文字以上・大文字・数字を含む・記号を含むなどの要件を満たしてください。</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Password;