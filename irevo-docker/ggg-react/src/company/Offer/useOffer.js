import { useEffect } from 'react';
import axios from 'axios';

function useOffer() {
    useEffect(() => {
    // 主要なDOM要素の取得
    const pageIndicator = document.getElementById('page_indicator'); // ページインジケータ全体
    const steps = pageIndicator?.querySelectorAll('.offer-step'); // 各ステップ（円とテキスト）の要素
        const formSections = document.querySelectorAll('.offer-form_section'); // 各フォームセクション（ページ）の要素
        const prevButton = document.getElementById('prev_button'); // 「前へ」ボタン
        const nextButton = document.getElementById('next_button'); // 「次へ」ボタン
        const submitButtonContainer = document.getElementById('submit_button_container'); // 送信ボタンのコンテナ
        const multiStepForm = document.getElementById('multi_step_form'); // フォーム全体

        if (!pageIndicator || !steps || !formSections || !prevButton || !nextButton || !submitButtonContainer || !multiStepForm) {
            return; // 必要な要素が見つからない場合は処理を中断
        }
        

        let currentPage = 1; // 現在表示されているページの番号（初期値は1）
    // NodeList を配列に変換してインデックスベースで扱う（HTML の data-page が不正でも対応するため）
    const stepArray = Array.from(steps || []);

        /**
         * 指定されたページ番号のフォームセクションを表示し、ページインジケータの状態とボタンの表示を更新する関数。
         * @param {number} pageNumber - 表示するページの番号。
         */
        function showPage(pageNumber) {
            // console.log(`(${pageNumber})`);

            // 全てのフォームセクションからアクティブクラスを削除
            formSections.forEach(section => {
                section.classList.remove('offer-active_form_section');
            });
            // 指定されたページ番号のフォームセクションにアクティブクラスを追加して表示
            document.getElementById(`form_section_${pageNumber}`)?.classList.add('offer-active_form_section');

            // ページインジケータの各ステップの状態を更新（DOM 順で判定）
            stepArray.forEach(step => {
                const circle = step.querySelector('.offer-circle'); // ステップの円
                const img = circle?.querySelector('img'); // 円内のアイコン
                const span = circle?.querySelector('span'); // 円内の数字
                const stepNum = stepArray.indexOf(step) + 1; // DOM の順番をページ番号として使用

                // 全てのステップからアクティブ/完了クラスを削除
                step.classList.remove('offer-active_class');
                step.classList.remove('offer-completed_class');

                if (stepNum < pageNumber) {
                    step.classList.add('offer-completed_class');
                    if (img) img.style.display = 'block';
                    if (span) span.style.display = 'none';
                } else if (stepNum === pageNumber) {
                    step.classList.add('offer-active_class');
                    if (img) img.style.display = 'block';
                    if (span) span.style.display = 'none';
                } else {
                    if (img) img.style.display = 'none';
                    if (span) span.style.display = 'block';
                }
            });

            // ボタンの表示/非表示を制御
            // 1ページ目の場合、「前へ」ボタンを非表示
            if (pageNumber === 1) {
                prevButton.style.display = 'none';
            } else {
                prevButton.style.display = 'inline-block'; // それ以外のページでは表示
            }

            // 最後のページの場合、「次へ」ボタンを非表示にし、「送信」ボタンを表示
            if (pageNumber === formSections.length) {
                nextButton.style.display = 'none';
                submitButtonContainer.style.display = 'flex';
            } else {
                nextButton.style.display = 'inline-block'; // それ以外のページでは表示
                submitButtonContainer.style.display = 'none'; // 最後のページ以外では「送信」ボタンを非表示
            }
        }

        /**
         * 指定されたフォーム内の必須入力項目が全て入力されているかを確認する関数。
         * 未入力の場合は枠線を赤くし、最初の未入力項目にフォーカスを設定しますが、アラートは表示しません。
         * @param {HTMLElement} section - チェック対象のフォーム要素。
         * @returns {object} isValid: 全ての必須項目が有効なら true、そうでなければ false。
         * firstInvalid: 最初の未入力項目（なければ null）。
         */
        function validateSection(section) {
            console.log(`(${section.id})`);
            const requiredInputs = section.querySelectorAll('[required]'); // 必須入力項目を取得
            let sectionValid = true; // 有効かどうかのフラグ
            let firstInvalidInputInSection = null; // 最初の未入力項目

            requiredInputs.forEach(input => {
                // テキスト系、SELECT、TEXTAREA を含めて検証する
                const tag = (input.tagName || '').toLowerCase();
                const type = input.type || '';
                const isTextLike = ['text', 'number', 'email', 'url', 'tel', 'password', 'search'].includes(type);
                if (isTextLike || tag === 'textarea' || tag === 'select' || input instanceof HTMLInputElement && input.type === 'checkbox' || input instanceof HTMLInputElement && input.type === 'radio') {
                    // checkbox/radio の必須は checked を確認
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        if (!input.checked) {
                            sectionValid = false;
                            if (!firstInvalidInputInSection) firstInvalidInputInSection = input;
                            input.style.outline = '2px solid red';
                        } else {
                            input.style.outline = '';
                        }
                    } else {
                        // 値が空または空白のみの場合
                        if ((input.value || '').toString().trim() === '') {
                            sectionValid = false;
                            if (!firstInvalidInputInSection) firstInvalidInputInSection = input;
                            input.style.borderColor = 'red';
                        } else {
                            input.style.borderColor = '#007bff';
                        }
                    }
                }
            });

            console.log(`(${section.id}) 結果: ${sectionValid}`);
            return { isValid: sectionValid, firstInvalid: firstInvalidInputInSection };
        }

        /*
        フォーム全体の全ページの必須入力項目が全て入力されているかを確認する関数。
        一つでも未入力の必須項目がある場合、アラートを表示し、最初の未入力項目があるページに移動してフォーカスします。
        */
        function validateAllPages() {
            // すべてのフォームが正しく入力されているかどうかの状態を管理するフラグ
            let areAllFormsCompletelyValid = true;
            // 全てのフォームの中で、一番最初に未入力だった項目を保存する変数
            let firstEmptyFieldFound = null;

            // ページごとにフォームのセクションを順番にチェックしていきます
            for (let i = 0; i < formSections.length; i++) {
                const currentSection = formSections[i]; // 今見ているフォームのセクション
                // そのセクションの内容が正しいか検証します
                const validationCheckResult = validateSection(currentSection);

                // もし現在のセクションに未入力や間違いがあれば
                if (!validationCheckResult.isValid) {
                    // 全体のフォームも「未完了」の状態にします
                    areAllFormsCompletelyValid = false;

                    // まだ最初の未入力項目が見つかっていなければ、今回の未入力項目を記録します
                    if (!firstEmptyFieldFound) {
                        firstEmptyFieldFound = validationCheckResult.firstInvalid;
                    }
                }
            }

            // 全ての必須項目が入力されていない場合
            if (!areAllFormsCompletelyValid) {
                // ユーザーにアラートで知らせます
                alert('すべての必須項目が入力されていません。');

                // もし未入力の項目が見つかっていれば
                if (firstEmptyFieldFound) {
                    // その未入力項目があるページの番号を取得します
                    // 例: 'form_section_3' から '3' を取り出す
                    const pageNumberOfEmptyField = parseInt(firstEmptyFieldFound.closest('.offer-form_section').id.replace('form_section_', ''));

                    // 現在のページを、未入力項目があるページに切り替えます
                    currentPage = pageNumberOfEmptyField;
                    // 該当するページを画面に表示します
                    showPage(currentPage);
                    // そして、その未入力項目にカーソルを合わせます（入力しやすくするため）
                    firstEmptyFieldFound.focus();
                }
                console.log("必須だっつってんだろ");
            } else {
                // 全ての必須項目が正しく入力されていれば
                console.log("必須は埋まっている");
            }

            // 最終的に、全てのフォームが有効だったかどうかを返します
            return areAllFormsCompletelyValid;
        }

        // ページインジケータのクリックイベントリスナー
        function handleStepClick(event) {
            event.preventDefault(); // デフォルトのリンク動作を防止
            const targetPage = parseInt(event.currentTarget.dataset.page); // クリックされたステップのページ番号を取得

            console.log(`ページインジケータ：現在のページ: ${currentPage}, ターゲットページ: ${targetPage}`);

            // 現在のページより大きな番号のページへ移動しようとする場合のみ、検証を実行
            // 例: 「1」から「3」へ直接移動する際、間のページ「2」の必須項目もチェックする
            if (targetPage > currentPage) {
                // 現在のページからターゲットページまでの間の全てのフォームセクションを検証
                for (let i = currentPage; i < targetPage; i++) {
                    const sectionToValidate = document.getElementById(`form_section_${i}`);
                    const validationResult = validateSection(sectionToValidate); // 各セクションを検証
                    if (!validationResult.isValid) {
                        // 未入力項目が見つかった場合、アラートを表示し、ページ遷移を中止
                        alert(`ページ${i}の必須項目が入力されていません。`);
                        // 未入力があったページに移動し、そこにフォーカス
                        currentPage = i;
                        showPage(currentPage);
                        validationResult.firstInvalid.focus();
                        console.log(`ページ遷移が停止：ページ ${i} に無効な項目あるよん死ねどす`);
                        return; // 処理を中断
                    }
                }
            }

            // 検証を通過した場合、または前のページへ移動する場合、または同じページをクリックした場合はそのままページ遷移
            currentPage = targetPage;
            showPage(currentPage);
            console.log(`ページ ${currentPage} へ遷移`);
        }

        // 「前へ」ボタンのクリックイベントリスナー
        function handlePrevClick() {
            console.log("前へ");
            // 現在のページが1より大きい場合のみ、ページを減らす
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage); // 更新されたページを表示
                console.log(`ページ ${currentPage} に遷移`);
            }
        }

        // 「次へ」ボタンのクリックイベントリスナー
        function handleNextClick() {
            console.log("次へ");
            // 次のページに進む前に現在のページの必須項目を検証
            const validationResult = validateSection(document.getElementById(`form_section_${currentPage}`));
            if (!validationResult.isValid) {
                // 現在のページの必須項目が未入力の場合、アラートを表示し、処理を中止
                alert('現在のページの必須項目が入力されていません。');
                validationResult.firstInvalid.focus(); // 最初の未入力項目にフォーカス
                console.log(`次のページへの遷移が停止：現在のページ (${currentPage}) に無効な項目`);
                return; // 処理を中断
            }

            // 現在のページが最後のページより小さい場合のみ、ページを増やす
            if (currentPage < formSections.length) {
                currentPage++;
                showPage(currentPage); // 更新されたページを表示
                console.log(`ページ ${currentPage} に遷移`);
            }
        }

        // フォーム送信イベントリスナー
        async function handleFormSubmit(event) {
            event.preventDefault(); // デフォルトのフォーム送信動作を防止

            console.log("フォーム送信が試行。");

            // 送信時に全てのページの必須項目をまとめてチェック
            if (!validateAllPages()) {
                console.log("検証エラー");
                return; // 処理を中止
            }

            // フォーム要素から FormData を作成（file input を含む）
            try {
                const formData = new FormData(multiStepForm);
                // 例: サーバー側で受け取るエンドポイントを '/newOffer' にしています。必要に応じて変更してください。
                const res = await axios.post('http://localhost:3030/newOffer', formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert(res.data?.message || '送信完了');
                console.log('送信結果', res.data);
            } catch (err) {
                console.error(err);
                alert('送信中にエラーが発生しました: ' + (err.response?.data?.message || err.message));
            }
        }

        /**
         * 年、月、日のプルダウンセレクタを生成する関数。
         * なんらかの理由でjsで作成。でも理由がまじでおもいだせん
         */
        function populateDateSelectors() {
            console.log("日付セレクタを生成中...nowloding......");
            const currentYear = new Date().getFullYear(); // 現在の年を取得
            const establishmentYearSelect = document.getElementById('establishment_year');
            const establishmentMonthSelect = document.getElementById('establishment_month');
            const establishmentDaySelect = document.getElementById('establishment_day');

            if (!establishmentYearSelect || !establishmentMonthSelect || !establishmentDaySelect) {
                return; // 要素が見つからない場合は処理を中断
            }

            // 既存の選択肢をクリア（デフォルトオプション以外）
            establishmentYearSelect.innerHTML = '<option value="">年</option>';
            establishmentMonthSelect.innerHTML = '<option value="">月</option>';
            establishmentDaySelect.innerHTML = '<option value="">日</option>';

            // 年のオプションを生成 (現在年から過去100年まで)
            for (let i = currentYear; i >= currentYear - 100; i--) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                establishmentYearSelect.appendChild(option);
            }

            // 月のオプションを生成 (1月から12月まで)
            for (let i = 1; i <= 12; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                establishmentMonthSelect.appendChild(option);
            }
            
            // 日のオプションを生成 (1日から31日まで)
            for (let i = 1; i <= 31; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                establishmentDaySelect.appendChild(option);
            }
            console.log("日付セレクタが完成");
        }

        // イベントリスナーの追加
        stepArray.forEach(step => {
            step.addEventListener('click', handleStepClick);
        });
        prevButton.addEventListener('click', handlePrevClick);
        nextButton.addEventListener('click', handleNextClick);
        multiStepForm.addEventListener('submit', handleFormSubmit);

        // 日付セレクタの初期生成を実行
        populateDateSelectors();

        // 勤務時間（時/分）セレクタの初期生成
        function populateTimeSelectors() {
            const startHour = document.getElementById('work_start_hour');
            const startMinute = document.getElementById('work_start_minute');
            const endHour = document.getElementById('work_end_hour');
            const endMinute = document.getElementById('work_end_minute');

            if (!startHour || !startMinute || !endHour || !endMinute) return;

            // 既存の選択肢をクリア
            startHour.innerHTML = '';
            endHour.innerHTML = '';
            startMinute.innerHTML = '';
            endMinute.innerHTML = '';

            // 時（00-23）を生成
            for (let h = 0; h < 24; h++) {
                const hh = String(h).padStart(2, '0');
                const opt1 = document.createElement('option');
                opt1.value = hh;
                opt1.textContent = hh;
                startHour.appendChild(opt1);

                const opt2 = document.createElement('option');
                opt2.value = hh;
                opt2.textContent = hh;
                endHour.appendChild(opt2);
            }

            // 分は 00 と 30 を生成
            const minutes = [0, 30];
            minutes.forEach(m => {
                const mm = String(m).padStart(2, '0');
                const optA = document.createElement('option');
                optA.value = mm;
                optA.textContent = mm;
                startMinute.appendChild(optA);

                const optB = document.createElement('option');
                optB.value = mm;
                optB.textContent = mm;
                endMinute.appendChild(optB);
            });

            // デフォルト値（任意）を設定する場合はここで設定できます。例: 09:00 - 18:00
            // startHour.value = '09'; startMinute.value = '00'; endHour.value = '18'; endMinute.value = '00';
        }

        populateTimeSelectors();

        // ページがロードされた際の初期表示
        showPage(currentPage);

        // クリーンアップ関数
        return () => {
            stepArray.forEach(step => {
                step.removeEventListener('click', handleStepClick);
            });
            prevButton.removeEventListener('click', handlePrevClick);
            nextButton.removeEventListener('click', handleNextClick);
            multiStepForm.removeEventListener('submit', handleFormSubmit);
        };
    }, []); // 依存配列を空にして、マウント時のみ実行
}

export default useOffer;