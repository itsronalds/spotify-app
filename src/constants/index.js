/* -------------------------------------------- Start of Spotify credentials -------------------------------------------- */
const SPOTIFY_CLIENT_ID = 'b966274967604dc7be8e2dfe01602a2e'
const SPOTIFY_CLIENT_SECRET = '175b78cff0db4576bc6ca4eebf8f212d'
const SPOTIFY_REDIRECT_URL = 'http://localhost:3000/'
const SPOTIFY_REQUEST_URL = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${SPOTIFY_REDIRECT_URL}&scope=user-read-private`

/* -------------------------------------------- End of Spotify credentials   -------------------------------------------- */

const constants = {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URL,
  SPOTIFY_REQUEST_URL,
}

export default constants