import React from 'react';
import s from './styles.module.css';
import Mobile from '@/assets/logos/375.svg';
import MobileLandscape from '@/assets/logos/440.svg';
import SmallTablet from '@/assets/logos/744.svg';
import LargeTablet from '@/assets/logos/1024.svg';
import Laptop from '@/assets/logos/1440.svg';
import LaptopSmall from '@/assets/logos/1601-800.svg';
import LaptopMedium from '@/assets/logos/1600-1024.svg';
import LaptopLarge from '@/assets/logos/1601-1200.svg';

export const Logo = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.mobile}>
        <Mobile />
      </div>
      <div className={s.mobileLandscape}>
        <MobileLandscape />
      </div>
      <div className={s.smallTablet}>
        <SmallTablet />
      </div>
      <div className={s.largeTablet}>
        <LargeTablet />
      </div>
      <div className={s.laptop}>
        <Laptop />
      </div>
      <div className={s.laptopSmall}>
        <LaptopSmall />
      </div>
      <div className={s.laptopMedium}>
        <LaptopMedium />
      </div>
      <div className={s.laptopLarge}>
        <LaptopLarge />
      </div>
    </div>
  );
};
