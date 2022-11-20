import constants from '../constants'

const commonParams = {
  redirect_uri: constants.SPOTIFY_REDIRECT_URL,
  client_id: constants.SPOTIFY_CLIENT_ID,
  client_secret: constants.SPOTIFY_CLIENT_SECRET,
}

export const spotifyLoginAPI = async (requiredParams) => {
  try {
    const params = { ...requiredParams, ...commonParams, }

    // Encode URL params
    const searchParams = Object.keys(params).map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&')
    //- Request URL
    const url = `https://accounts.spotify.com/api/token`

    const request = await fetch(url, {
      method: 'POST',
      body: searchParams,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })

    return { status: request.status, data: await request.json() }
  } catch (error) {
    return error
  }
}