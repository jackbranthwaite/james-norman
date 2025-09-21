'use client';
import React, { useEffect, useRef, useState } from 'react';
import s from './styles.module.css';
import { Wrapper } from '../wrapper';
import { ContactBox } from '../contact-box';
import gsap from 'gsap';
import { Logo } from '../logo';

export const Homepage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const homeRef = useRef<HTMLDivElement | null>(null);

  const openContact = () => {
    gsap.to(homeRef.current, {
      duration: 0.25,
      opacity: 0.05,
      onComplete: () => setIsOpen(true),
    });
  };

  useEffect(() => {
    if (!isOpen) gsap.to(homeRef.current, { duration: 0.5, opacity: 1 });
  }, [isOpen]);

  return (
    <Wrapper>
      <div className={s.homepageWrapper} ref={homeRef}>
        <h1 className={s.contents}>
          <span className={s.fontChange}>James Norman Architecture</span> is a
          Te Whanganui-a-Tara Wellington-based firm dedicated to thoughtful,
          context-driven design in retail and mixed use commercial, public, and
          residential spaces. After 20 years of delivering major award winning
          projects for Aotearoa New Zealand&apos;s top architecture practices,
          James has launched his own firm to bring his experience to clients
          seeking distinctive bespoke approach to architecture.{' '}
          <span
            className={`${s.fontChange} ${s.button}`}
            onClick={!isOpen ? () => openContact() : () => setIsOpen(false)}
          >
            « Get In Touch »
          </span>
        </h1>
      </div>
      <ContactBox isOpen={isOpen} setIsOpen={() => setIsOpen(false)} />
      <Logo />
    </Wrapper>
  );
};
