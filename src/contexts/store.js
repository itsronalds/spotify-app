import { createContext, useContext, useEffect, useState } from 'react'

const StoreContext = createContext(null)

export const StoreContextProvider = ({ children }) => {
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    albumsFromLocalStorage()
  }, [])

  const albumsFromLocalStorage = () => {
    const albums = window.localStorage.getItem('artistsAlbums') ? JSON.parse(window.localStorage.getItem('artistsAlbums')) : []

    if (albums?.length > 0) {
      setAlbums(albums)
    }
  }

  const setAlbum = (album) => {
    const albums = window.localStorage.getItem('artistsAlbums') ? JSON.parse(window.localStorage.getItem('artistsAlbums')) : []
    albums.push(album)

    window.localStorage.setItem('artistsAlbums', JSON.stringify(albums))
    setAlbums(albums)
  }

  const removeAlbum = (album) => {
    const filterAlbums = albums.filter((element)  => element.id !== album.id)

    window.localStorage.setItem('artistsAlbums', JSON.stringify(filterAlbums))
    setAlbums(filterAlbums)
  }

  const value = { albums, setAlbum, removeAlbum }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStorageContext = () => useContext(StoreContext)