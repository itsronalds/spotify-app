import { useEffect, useState } from 'react'

import { useAuthContext } from '../../contexts/auth'
import { useStorageContext } from '../../contexts/store'

import Header from '../../components/header'
import ArtistCard from '../../components/artistCard'
import AlbumCard from '../../components/albumCard'
import Loader from '../../components/loader'
import Button from '../../components/button'
import Pagination from '../../components/pagination'

import { searchArtistByParamsAPI, albumsByArtistAPI } from '../../api/services'

const artistsInitialState = {
  artists: [],
  total: 0
}

const artistInitialState = {
  artistId: null,
  artistName: '',
  artistAlbums: [],
  total: 0
}

const links = [{ name: 'Buscar', path: '/artists', status: true }, { name: 'My albums', path: '/my-albums', status: false },]

const Artists = () => {
  const { auth: { accessToken } } = useAuthContext()
  const { albumsByArtists, setAlbum, removeAlbum } = useStorageContext()
  const [searchText, setSearchText] = useState('')

  // Loader state
  const [isLoading, setIsLoading] = useState(false)

  // List of artists
  const [artistsList, setArtistsList] = useState(artistsInitialState)
  
  // Any artist
  const [artist, setArtist] = useState(artistInitialState)

  // Pagination state & logic
  const [currentPage, setCurrentPage] = useState(0)
  const perPage = 4
  const limit = (currentPage + 1) * perPage
  const offset = limit - perPage
  
  // define page count | if artistId is selected show albums length in other ways show artist list length
  const itemsCount = !artist.artistId ? artistsList.total : artist.total
  const pageCount = Math.ceil(itemsCount / perPage)

  useEffect(() => {
    if (!artist.artistId) {
      artistsByParams()
    } else {
      albumsByArtist()
    }
  }, [currentPage])

  const searchArtistByParams = async () => {
    setCurrentPage(0)
    setArtist(artistInitialState)

    if (!searchText) {
      return
    }

    const artistsRequestParams = [{ type: 'artist', }, { q: searchText }, { limit }, { offset }]

    setIsLoading(true)

    const artistsResponse = await searchArtistByParamsAPI(artistsRequestParams, accessToken)
    const { artists, error } = artistsResponse
    
    setIsLoading(false)
    
    if (error) {
      console.log(artistsResponse) // error = { status, message }
      return alert('error')
    }

    if (artists?.items?.length > 0) {
      return setArtistsList({ artists: artists.items, total: artists.total })
    }
  }

  const artistsByParams = async () => {
    if (!searchText) {
      return
    }

    const artistsRequestParams = [{ type: 'artist', }, { q: searchText }, { limit }, { offset }]

    setIsLoading(true)

    const artistsResponse = await searchArtistByParamsAPI(artistsRequestParams, accessToken)
    const { artists, error } = artistsResponse
    
    setIsLoading(false)
    
    
    if (error) {
      console.log(artistsResponse) // error = { status, message }
      return alert('error')
    }

    if (artists?.items?.length > 0) {
      return setArtistsList({ artists: artists.items, total: artists.total })
    }
  }

  const searchAlbumsByArtist = async (artistId, artistName) => {
    setCurrentPage(0)
    
    // reset current page to 0 but we pass number to 1
    const limit = 1 * perPage
    const offset = limit - perPage
    
    const albumsRequestParams = [{ limit }, { offset }]
    
    setIsLoading(true)

    const response = await albumsByArtistAPI(albumsRequestParams, artistId, accessToken)

    const artistAlbums = response?.items
    const total = response?.total

    setIsLoading(false)

    if (artistAlbums && artistAlbums.length > 0) {
      return setArtist({ artistId, artistName, artistAlbums, total })
    }
  }

  const albumsByArtist = async () => {
    setIsLoading(true)
    
    const albumsRequestParams = [{ limit }, { offset }]
    
    const response = await albumsByArtistAPI(albumsRequestParams, artist.artistId, accessToken)
    
    const artistAlbums = response?.items
    const total = response?.total
    
    setIsLoading(false)

    if (artistAlbums && artistAlbums.length > 0) {
      return setArtist((state) => ({ ...state, artistAlbums, total }))
    }
  }

  const handlePagination = (item) => {
    setCurrentPage(item.selected)
  }

  return (
    <>
      <Header links={links} />
      
      <div className='p-6 md:flex md:flex-col'>
        <div className='md:text-center'>
          <h1 className="mt-5 text-4xl font-bold md:text-6xl">
            <span className='text-white'>Busca tus</span><br /><span style={{ color: '#D6F379' }}>artistas</span>
          </h1>

          <span className='block mt-6 leading-8 text-white'>
            <span className='md:hidden'>Encuentra tus artistas favoritos gracias a nuestro buscador y guarda tus álbumes favoritos</span>
            <span className='hidden md:block'>Encuentra tus artistas favoritos gracias a nuestro<br/>buscador y guarda tus álbumes favoritos</span>
          </span>
        </div>

        <div>
          <div className='flex mt-8 p-2 rounded-3xl bg-white md:max-w-xl lg:max-w-2xl mx-auto'>
            <input className='w-full outline-0 px-6 font-semibold' type="text" placeholder="Nombre de artista..." onChange={(e) => setSearchText(e.target.value)} />
            <button 
              type='button' 
              className='h-12 px-6 rounded-3xl font-semibold text-black cursor-pointer' 
              style={{ minWidth: 150, backgroundColor: '#D6F379' }}
              onClick={searchArtistByParams}
              >
              Search
            </button>
          </div>
        </div>

        <div className='md:px-20'>
          {isLoading && (
            <div className='mt-10 text-center'>
              <Loader />
            </div>
          )}

          {!isLoading && (
            <>
              {!artist.artistId && (
                <>
                  {artistsList.artists.length > 0 && (
                    <span className='block mt-11 leading-8 text-white'>
                      Mostrando {perPage} resultados de {artistsList.total}
                    </span>
                  )}
                  
                  <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 md:gap-16 lg:gap-20 xl:gap-4 justify-items-center content-center'>
                    {artistsList.artists.slice(offset, limit).map(({ id, name, followers: { total }, images }) => {
                      const notFoundImageUrl = 'https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png'
                      const url = images?.[0]?.url || notFoundImageUrl

                      return <ArtistCard key={id} id={id} image={url} name={name} followers={total} getAlbums={searchAlbumsByArtist} />
                    })}
                  </div>

                  {artistsList.artists.length > 0 && (
                    <div className='mt-8 md:mt-12 flex justify-center md:justify-start'>
                      <Pagination 
                        currentPage={currentPage} 
                        pageCount={pageCount} 
                        onChange={handlePagination} 
                      />
                    </div>
                  )}

                </>
              )}

              {/* ------------------------ Display albums by Artist ------------------------ */}

              {artist.artistId && (
                <>
                  <span className='block mt-11 leading-8 text-white'>
                    Guarda tus álbumes favoritos de {artist.artistName}
                  </span>

                  <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 md:gap-16 lg:gap-20 xl:gap-4 justify-items-center content-center'>
                    {artist.artistAlbums.map((album) => {
                      const { id, images, name, release_date } = album
                      const notFoundImageUrl = 'https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png'
                      const url = images?.[0]?.url || notFoundImageUrl

                      const artistIndex = albumsByArtists.findIndex((element) => element.artistId === artist.artistId)
                      let albumIsAdded = false
                      
                      if (artistIndex !== -1) {
                        albumIsAdded = albumsByArtists[artistIndex].albums.some((element) => element.id === id)
                      }

                      return (
                        <AlbumCard key={id} id={id} image={url} name={name} publishedDate={release_date}>
                          {!albumIsAdded && (
                            <Button 
                              classname='mt-6' 
                              backgroundColor='#D6F379' 
                              color='#000' 
                              onClick={() => setAlbum(artist.artistId, artist.artistName, album)}>
                                + Add album
                            </Button>
                          )}

                          {albumIsAdded && (
                             <Button 
                              classname='mt-6' 
                              backgroundColor='#E3513D' 
                              color='#fff' 
                              onClick={() => removeAlbum(artist.artistId, album)}>
                                - Remove album
                            </Button>
                          )}
                        </AlbumCard>
                      )
                    })}

                  </div>
                  
                  {artist.artistAlbums.length > 0 && (
                    <div className='mt-12'>
                      <Pagination 
                        currentPage={currentPage} 
                        pageCount={pageCount} 
                        onChange={handlePagination} 
                      />
                    </div>
                  )}
                </>
              )}



            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Artists