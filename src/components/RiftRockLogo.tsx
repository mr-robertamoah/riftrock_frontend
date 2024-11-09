import React from 'react'

export default function RiftRockLogo({ isDarkMode = false, className = "" }) {
  return (
    <img 
        className={`${className}`}
        src={
        isDarkMode ?
        "../../assets/riftrock inverted logo.svg" :
        "../../assets/riftrock logo.svg"
        }
        alt="logo" 
    />
  )
}
