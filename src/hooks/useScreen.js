import { useState, useEffect } from 'react'

const initialState = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const useScreen = () => {
  const [screenProps, setScreenProps] = useState(initialState)

  const screenPropsListener = () => {
    const { innerWidth, innerHeight } = window

    // set window props to state
    setScreenProps({ width: innerWidth, height: innerHeight })
  }

  useEffect(() => {
    window.addEventListener('resize', screenPropsListener);

    return () => {
      window.removeEventListener('resize', screenPropsListener);
    };
  }, [])

  return screenProps
}

export default useScreen