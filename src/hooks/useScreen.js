import { useState, useEffect } from 'react'

const useScreen = () => {
  const { width, height } = window.screen
  const [screenProps, setScreenProps] = useState({ width, height })

  const screenPropsListener = () => {
    const { width, height } = window.screen

    // set window props to state
    setScreenProps({ width, height })
  }

  useEffect(() => {
    window.addEventListener('resize', screenPropsListener)
    return () => {
      window.removeEventListener('resize', screenPropsListener)
    };
  }, [])

  return screenProps
}

export default useScreen