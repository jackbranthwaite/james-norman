import React, { ReactNode } from 'react';
import s from './styles.module.css';

export const Button = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => {
  return (
    <button className={s.button} onClick={onClick}>
      {children}
    </button>
  );
};
