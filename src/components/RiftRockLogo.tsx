import React from 'react'
import lightLogo from '../../assets/riftrock logo.svg';
import darkLogo from '../../assets/riftrock inverted logo.svg';

export default function RiftRockLogo({ isDarkMode = false, className = "" }) {
  return (
    <img 
        className={`${className}`}
        src={
        isDarkMode ?
          darkLogo :
          lightLogo
        }
        alt="logo" 
    />
  )
}
