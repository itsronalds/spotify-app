import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthContext } from '../../contexts/auth'

import Header from '../../components/header'
import useScreen from '../../hooks/useScreen'

import ArrowIcon from '../../assets/icons/Arrow'
import ArrowRight from '../../assets/icons/ArrowRight'

import constants from '../../constants'
import { spotifyLoginAPI } from '../../api/services'

const LoginPage = () => {
  const { auth, setAuth } = useAuthContext()
  const { width: screenWidth } = useScreen()

  const navigate = useNavigate()

  useEffect(() => {
    spotifyAuthentication()
  }, [window.location.search])

  const spotifyAuthentication = async () => {
    // Get all URL params
    const URLParams = new URLSearchParams(window.location.search)

    // Get Spotify code from URL
    const spotifyCode = URLParams.get('code')
 
    // If spotify code exist make a API call to authenticate user & get a token
    if (spotifyCode) {

      // initialize request params variable
      let requestParams = {}

      if (auth.refreshToken) {
        requestParams = { refresh_token: auth.refreshToken, grant_type: 'refresh_token' }
      } else {
        requestParams = { code: spotifyCode, grant_type: 'authorization_code' }
      }

      const response = await spotifyLoginAPI(requestParams)

      // Request It's OK
      if (response?.status === 200) {
        const { access_token, refresh_token } = response.data

        navigate('/artists')

        // Set data to Auth context state
        return setAuth({ isAuth: true, accessToken: access_token, refreshToken: refresh_token })
      } 
    }
  }

  const onClick = () => {
    window.location.replace(constants.SPOTIFY_REQUEST_URL)
  }

  const evaluateArrowIconStyle = () => {
    /* this function listen the width of the screen and return the correct width of the ArrowIcon component */

    let defaultStyle = { width: 222, height : 222 }

    if (screenWidth >= 768) {
      defaultStyle = { ...defaultStyle, width: 318, height: 318 }
    } 
    
    if (screenWidth >= 1280) {
      defaultStyle = { ...defaultStyle, width: 468, height: 468 }
    }

    return defaultStyle
  }

  const arrowIconStyle = evaluateArrowIconStyle()

  return (
    <>
      <Header />

      <div className="mt-24 pb-24 flex flex-col items-center md:items-start md:px-20 lg:grid lg:grid-cols-2 gap-4">
        <ArrowIcon {...arrowIconStyle}  />

        <div className="mt-7 md:mt-20 lg:mt-0">
          <h1 className="text-4xl font-bold md:text-6xl">
            <span className='text-white'>Disfruta de la</span><br /><span style={{ color: '#D6F379' }}>mejor música</span>
          </h1>

          <span className="block mt-9 text-base text-white">
            Accede a tu cuenta para guardar tus<br/>albumes favoritos.
          </span>

          <div className="mt-10 flex items-center md:mt-28 cursor-pointer w-fit" onClick={onClick}>
            <span className='mr-7 text-base font-semibold text-white'>Log in con Spotify</span>
            <ArrowRight />
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage