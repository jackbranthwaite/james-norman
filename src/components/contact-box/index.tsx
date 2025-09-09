import React, { useEffect, useRef, useState } from 'react';
import s from './styles.module.css';
import gsap from 'gsap';
import { Button } from '../button';

export const ContactBox = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: () => void;
}) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [localState, setLocalState] = useState(false);

  const openBox = () => {
    gsap.to(boxRef.current, {
      duration: 0.25,
      opacity: 1,
      onComplete: () => setLocalState(true),
    });
  };

  const closeBox = () => {
    gsap.to(boxRef.current, {
      duration: 0.25,
      opacity: 0,
      onComplete: () => {
        setIsOpen();
      },
    });
  };

  useEffect(() => {
    if (isOpen) openBox();
    else if (!isOpen && localState) closeBox();
  }, [isOpen]);

  return (
    <div className={s.contactBox} ref={boxRef}>
      <h3 className={s.name}>James Norman</h3>
      <p className={s.phone}></p>
      <p className={s.email}>james@jnarchitecture.co.nz</p>
      <p className={s.address}>
        Level 2/158 Victoria Street,
        <br />
        Te Aro, Wellington, 6011
      </p>
      <Button onClick={() => closeBox()}>CLOSE</Button>
    </div>
  );
};
