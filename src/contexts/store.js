import { createContext, useContext, useEffect, useState } from 'react'

const StoreContext = createContext(null)

export const StoreContextProvider = ({ children }) => {
  const [albumsByArtists, setAlbumsByArtists] = useState([])

  useEffect(() => {
    albumsFromLocalStorage()
  }, [])

  const albumsFromLocalStorage = () => {
    const albumsByArtists = window.localStorage.getItem('albumsByArtists') ? JSON.parse(window.localStorage.getItem('albumsByArtists')) : []

    if (albumsByArtists?.length > 0) {
      setAlbumsByArtists(albumsByArtists)
    }
  }

  const setAlbum = (artistId, artistName, album) => {
    const albumsByArtists = window.localStorage.getItem('albumsByArtists') ? JSON.parse(window.localStorage.getItem('albumsByArtists')) : []
    const index = albumsByArtists.findIndex((element) => element.artistId === artistId)
    
    if (index === -1) {
      albumsByArtists.push({ artistId, artistName, albums: [album] })
    } else {
      albumsByArtists[index].albums.push(album)
    }

    window.localStorage.setItem('albumsByArtists', JSON.stringify(albumsByArtists))
    setAlbumsByArtists(albumsByArtists)
  }

  const removeAlbum = (artistId, album) => {
    const artistIndex = albumsByArtists.findIndex((element) => element.artistId === artistId)

    if (artistIndex === -1) {
      return
    }

    const mapped = albumsByArtists.map((artist) => artist.artistId === artistId ? { ...artist, albums: [...artist.albums].filter((element) => element.id !== album.id) } : artist)
    const filterArtistsWithoutAlbums = mapped.filter((element) => element.albums.length !== 0)

    window.localStorage.setItem('albumsByArtists', JSON.stringify(filterArtistsWithoutAlbums))
    setAlbumsByArtists(filterArtistsWithoutAlbums)
  }

  const value = { albumsByArtists, setAlbum, removeAlbum }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStorageContext = () => useContext(StoreContext)