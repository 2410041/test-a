import { useEffect } from 'react';

function useModalButton() {
  useEffect(() => {
    // モーダル1
    const openModalBtn = document.getElementById('openModalBtn');
    const myModal = document.getElementById('myModal');
    const closeButton = document.querySelector('.close-button');
    const body = document.body;
    const modalForm = document.getElementById('modalForm');

    function openModal() {
      myModal?.classList.add('active');
      body.classList.add('modal-open');
    }

    function closeModal() {
      myModal?.classList.remove('active');
      body.classList.remove('modal-open');
    }

    openModalBtn?.addEventListener('click', openModal);
    closeButton?.addEventListener('click', closeModal);

    const handleKeydown = (event) => {
      if ((event.key === 'Escape' || event.key === 'Esc') && myModal?.classList.contains('active')) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeydown);

    modalForm?.addEventListener('submit', closeModal);

    // クリーンアップ
    return () => {
      openModalBtn?.removeEventListener('click', openModal);
      closeButton?.removeEventListener('click', closeModal);
      document.removeEventListener('keydown', handleKeydown);
      modalForm?.removeEventListener('submit', closeModal);
    };
  }, []);

  useEffect(() => {
    // モーダル2
    const openModalBtn1 = document.getElementById('openModalBtn1');
    const myModal1 = document.getElementById('myModal1');
    const closeButton1 = document.querySelector('.close-button1');
    const body = document.body;
    const modalForm1 = document.getElementById('modalForm1');

    function openModal1() {
      myModal1?.classList.add('active1');
      body.classList.add('modal-open1');
    }

    function closeModal1() {
      myModal1?.classList.remove('active1');
      body.classList.remove('modal-open1');
    }

    openModalBtn1?.addEventListener('click', openModal1);
    closeButton1?.addEventListener('click', closeModal1);

    const handleKeydown1 = (event) => {
      if ((event.key === 'Escape' || event.key === 'Esc') && myModal1?.classList.contains('active1')) {
        closeModal1();
      }
    };

    document.addEventListener('keydown', handleKeydown1);

    modalForm1?.addEventListener('submit', closeModal1);

    // クリーンアップ
    return () => {
      openModalBtn1?.removeEventListener('click', openModal1);
      closeButton1?.removeEventListener('click', closeModal1);
      document.removeEventListener('keydown', handleKeydown1);
      modalForm1?.removeEventListener('submit', closeModal1);
    };
  }, []);

  return null; // JSXは別に書かれている前提で、ここではイベント処理だけ
}

export default useModalButton;