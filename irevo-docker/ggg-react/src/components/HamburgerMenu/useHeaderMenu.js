// src/components/Header/useHeaderMenu.js
import { useEffect } from 'react';

function useHeaderMenu() {
  useEffect(() => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.h_nav');

    if (!hamburger || !nav) return;

    const handleClick = () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');

      const isOpen = hamburger.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      nav.setAttribute('aria-hidden', !isOpen);
    };

    const handleOutsideClick = (e) => {
      if (
        !e.target.closest('.nav') &&
        !e.target.closest('.hamburger') &&
        nav.classList.contains('active')
      ) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', false);
        nav.setAttribute('aria-hidden', true);
      }
    };

    hamburger.addEventListener('click', handleClick);
    document.addEventListener('click', handleOutsideClick);

    return () => {
      hamburger.removeEventListener('click', handleClick);
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);
}

export default useHeaderMenu;
