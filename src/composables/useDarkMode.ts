import { useEffect, useState } from 'react'

export const useDarkMode = ({ dark = false }) => {
  const [isDarkMode, setIsDarkMode] = useState(dark)

  useEffect(() => {
    const html = document.documentElement
    if (isDarkMode) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  return { isDarkMode, setIsDarkMode }
}