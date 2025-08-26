import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="-5 -5 138 70" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M0 56V0H28C43.464 0 56 12.536 56 28V28C56 43.464 43.464 56 28 56H0Z" fill="#FFCC01"/>
    <path d="M68 56V0H96C111.464 0 124 12.536 124 28V28C124 43.464 111.464 56 96 56H68Z" fill="#FFCC01"/>
    <path d="M28.5 15L21 28.5H30L22.5 42" className="stroke-gray-900 dark:stroke-white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="91" cy="28" r="4" className="fill-gray-900 dark:fill-white"/>
    <circle cx="107" cy="28" r="4" className="fill-gray-900 dark:fill-white"/>
  </svg>
);