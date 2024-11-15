import '../styles/globals.css'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add('dark')
  }, [])

  return <Component {...pageProps} />
}

export default MyApp