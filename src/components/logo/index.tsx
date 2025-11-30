import React from 'react';
import s from './styles.module.css';
import Mobile from '@/assets/logos/375.svg';
import MobileLandscape from '@/assets/logos/440.svg';
import SmallTablet from '@/assets/logos/744.svg';
import { AnimatedLargeTablet } from './animated-large-tablet';
import { AnimatedLaptop } from './animated-laptop';
import { AnimatedLaptopSmall } from './animated-laptop-small';
import { AnimatedLaptopMedium } from './animated-laptop-medium';
import { AnimatedLaptopLarge } from './animated-laptop-large';
import { AnimatedDesktopSmall } from './animated-desktop-small';
import { AnimatedDesktopMedium } from './animated-desktop-medium';
import { AnimatedDesktopLarge } from './animated-desktop-large';

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
        <AnimatedLargeTablet />
      </div>
      <div className={s.laptop}>
        <AnimatedLaptop />
      </div>
      <div className={s.laptopSmall}>
        <AnimatedLaptopSmall />
      </div>
      <div className={s.laptopMedium}>
        <AnimatedLaptopMedium />
      </div>
      <div className={s.laptopLarge}>
        <AnimatedLaptopLarge />
      </div>
      <div className={s.desktopSmall}>
        <AnimatedDesktopSmall />
      </div>
      <div className={s.desktopMedium}>
        <AnimatedDesktopMedium />
      </div>
      <div className={s.desktopLarge}>
        <AnimatedDesktopLarge />
      </div>
    </div>
  );
};
