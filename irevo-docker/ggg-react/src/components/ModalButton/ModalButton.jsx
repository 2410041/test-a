import './ModalButton.css';
import React from 'react';
import useModalButton from './useModalButton';




function ModalButton() {

    useModalButton(); // モーダル制御のカスタムフックを実行
    
  return (
    <>
        <div className="main-content">
            <button id="openModalBtn1">
                <span className="dli-plus-circle1">
                <span></span>
                </span>
                情報を編集する
            </button>
            </div>

            <div id="myModal1" className="modal1">
            <div className="modal-content1">
                <span className="close-button1">&times;</span>
                <h2>データを入力してください</h2>
                <form action="" method="post" id="modalForm1">
                <label
                    htmlFor="modal_input_field"
                    style={{ display: 'block', marginBottom: '10px' }}
                >
                    あなたのメッセージ:
                </label>
                <input
                    type="text"
                    id="modal_input_field1"
                    name="modal_input_field"
                    style={{
                    width: '90%',
                    padding: '10px',
                    marginBottom: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    }}
                    placeholder="ここに何か入力してください"
                    required
                />
                <input
                    type="submit"
                    name="submit_modal_data"
                    value="データを送信"
                    style={{
                    padding: '12px 25px',
                    margin: '0 auto',
                    fontSize: '1.1em',
                    backgroundColor: '#0056BB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    }}
                />
                </form>
            </div>
        </div>
    </>
  );
}

export default ModalButton;