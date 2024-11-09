import React from 'react'
import darkLogo from '../../assets/riftrock inverted logo with white text.svg';
import lightLogo from '../../assets/RiftRock Mining Services.svg';

export default function RiftRockLogoWithText({ isDarkMode = false, className = "" }) {
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
