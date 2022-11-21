import { useState, useEffect } from 'react'

const useScreen = () => {
  const { innerWidth: width, innerHeight: height } = window
  const [screenProps, setScreenProps] = useState({ width, height })

  const screenPropsListener = () => {
    const { innerWidth: width, innerHeight: height } = window

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