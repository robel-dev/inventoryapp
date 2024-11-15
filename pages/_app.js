import '../styles/globals.css'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark')
    document.body.classList.add('dark')
    document.documentElement.style.colorScheme = 'dark'
    document.body.style.backgroundColor = '#0a0a0a'
  }, [])

  return (
    <div className="dark bg-[#0a0a0a] min-h-screen">
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp