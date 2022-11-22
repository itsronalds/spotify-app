import { useState, useEffect } from 'react'
import useScreen from '../../hooks/useScreen'

import { useAuthContext } from '../../contexts/auth'
import { useStorageContext } from '../../contexts/store'

import Header from "../../components/header"
import Loader from '../../components/loader'
import AlbumCard from '../../components/albumCard'
import ArtistCard from '../../components/artistCard'
import ArtistDetails from '../../components/artistDetails'
import Button from '../../components/button'
import Pagination from '../../components/pagination'

import { searchArtistsByParamsAPI, albumsByArtistIdAPI } from '../../api/services'

const links = [{ name: 'Buscar', path: '/artists', status: true }, { name: 'My albums', path: '/my-albums', status: false },]

const initialDataState = {
  artists: {
    items: [],
    total: 0,
  },
  artist: {
    id: null,
    name: '',
    albums: [],
    total: 0,
  },
}

const initialCurrentPageState = 0

const initialArtistDetailsToDisplay = {
  details: {
    id: null,
    name: '',
    followers: 0,
    image: null,
  },
  isDisplayed: false
}

const initialRequestErrorState = {
  status: null,
  message: '',
}

const notFoundImageUrl = 'https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png'

const NOT_FOUND = {
  status: 404,
  message: 'No se han encontrado resultados',
}

const Message = ({ status, message }) => (
  <div className='mt-16 text-center text-white'>
    <h3 className='text-5xl font-semibold'>{status}</h3>
    <span>{message}</span>
  </div>
)

const Artists = () => {
  /* Contexts hooks */
  const { auth: { accessToken } } = useAuthContext()
  const { albumsByArtists, setAlbum, removeAlbum } = useStorageContext()

  /* Screen custom hook */
  const { width: screenWidth } = useScreen()

  /* Previous width size */
  const [previousScreenWidth, setPreviousScreenWidth] = useState(screenWidth)

  const [data, setData] = useState(initialDataState)

  /* Search artists by text state */
  const [searchText, setSearchText] = useState('')

  /* Pagination state & logic */
  const [currentPage, setCurrentPage] = useState(initialCurrentPageState)
  const perPage = 4
  const limit = (currentPage + 1) * perPage
  const offset = limit - perPage
  const itemsCount = !data.artist.id ? data.artists.total : data.artist.total
  const pageCount = Math.ceil(itemsCount / perPage)

  /* Request loading state */
  const [isLoading, setIsLoading] = useState(false)

  /* Display artist details state */
  const [artistDetailsToDisplay, setArtistDetailsToDisplay] = useState(initialArtistDetailsToDisplay)

  /* Request error state */
  const [requestError, setRequestError] = useState(initialRequestErrorState)

  useEffect(() => {
    handleRequest()
  }, [currentPage])

  useEffect(() => {
    searchAlbumsByArtistId(true)
  }, [data.artist.id])

  useEffect(() => {
    let thread = true

    if (thread && screenWidth < 768 && previousScreenWidth >= 768) {
      searchAlbumsByArtistId(true)
    } else if (thread && screenWidth >= 768 && previousScreenWidth < 768) {
      searchArtistsByParams(true)
    }

    return () => thread = false
  }, [screenWidth])

  const handleRequest = () => {
    const { id: artistId } = data.artist

    if (!artistId || screenWidth >= 768) {
      return searchArtistsByParams()
    }
    searchAlbumsByArtistId()
  }

  const searchArtistsByParams = async (initialSearch = false) => {
    if (!searchText) {
      return
    }

    setRequestError(initialRequestErrorState)

    /* Reset states */
    if (initialSearch) {
      setCurrentPage(0)
      setData(initialDataState)
    }

    const paginationLimit  = initialSearch ? perPage : limit - offset
    const paginationOffset = initialSearch ? initialCurrentPageState : offset

    /* Request params */
    const params = [{ type: 'artist', }, { q: searchText }, { limit: paginationLimit }, { offset: paginationOffset }]

    setIsLoading(true)

    const response = await searchArtistsByParamsAPI(params, accessToken)

    setIsLoading(false)

    /* When request is finished set current screen width */
    setPreviousScreenWidth(screenWidth)

    if (response?.error) {
      const { status } = response.error

      if (status === 401 || status === 403) {
        window.location.href = '/'
      }

      return
    }

    if (response?.artists?.items?.length) {
      const { artists: { items, total } } = response
      const artistIndex = items.findIndex((elem) => elem.name === searchText)
      
      // We cant found albums, only set Artists
      if (artistIndex === -1) {
        setRequestError({ status: NOT_FOUND.status, message: NOT_FOUND.message  })
        return setData((state) => ({ ...state, artists: { ...state.artists, items, total } }))
      }
      
      /* Extract artist data */
      const { id, name } = items[artistIndex]

      /* Set individual artists & all artists founded */
      return setData((state) => ({ ...state, artists: { ...state.artists, items, total }, artist: { ...state.artist, id, name }, }))
    }

    setRequestError({ status: NOT_FOUND.status, message: NOT_FOUND.message  })
  }

  const searchAlbumsByArtistId = async (initialSearch = false) => {
    if (!data.artist.id) {
      return
    }

    setRequestError(initialRequestErrorState)

    if (initialSearch) {
      setCurrentPage(0) 
    }

    const paginationLimit  = initialSearch ? perPage : limit - offset
    const paginationOffset = initialSearch ? initialCurrentPageState : offset

    const params = [{ limit: paginationLimit }, { offset: paginationOffset }]

    setIsLoading(true)

    const response = await albumsByArtistIdAPI(params, data.artist.id, accessToken)
    
    setIsLoading(false)

    /* When request is finished set current screen width */
    setPreviousScreenWidth(screenWidth)

    if (response?.error) {
      const { status } = response.error

      if (status === 401 || status === 403) {
        window.location.href = '/'
      }

      return
    }
    
    if (response?.items?.length) {
      const { items, total } = response
      return setData((state) => ({ ...state, artist: { ...state.artist, albums: items, total } }))
    }

    setRequestError({ status: NOT_FOUND.status, message: NOT_FOUND.message  })
  }

  const selectArtistHandler = (id, name, followers, image) => {
    setArtistDetailsToDisplay({ details: { id, name, followers, image }, isDisplayed: true })
  }

  const paginationHandler = (item) => {
    setCurrentPage(item.selected)
  } 

  const loader = <div className='mt-10 text-center'><Loader /></div>

  return (
    <>
      <Header links={links} />

      {artistDetailsToDisplay.isDisplayed 
        ?
        <ArtistDetails {...artistDetailsToDisplay.details} />
        :
        <div className="p-6 md:px-20 md:flex md:flex-col">
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
              <button type='button' className='h-12 px-6 rounded-3xl font-semibold text-black cursor-pointer' style={{ minWidth: 150, backgroundColor: '#D6F379' }} onClick={() => searchArtistsByParams(true)}>
                Search
              </button>
            </div>
          </div>

          {isLoading 
            ? loader
            : 
            <>
              {/* Show albums by selected artist */}
              {screenWidth < 768
                ? 
                <>
                  {data.artist.albums.length > 0 
                    ?
                    <>
                      <span className='block mt-11 leading-8 text-white'>
                        Guarda tus álbumes favoritos de {data.artist.name}
                      </span>

                      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 md:gap-16 lg:gap-20 xl:gap-4 justify-items-center content-center'>
                        {data.artist.albums.map((album) => {
                          const { id, images, name, release_date } = album
                          const url = images?.[0]?.url || notFoundImageUrl
  
                          const artistIndex = albumsByArtists.findIndex((element) => element.artistId === data.artist.id)
                          let albumIsAdded = false
                          
                          if (artistIndex !== -1) {
                            albumIsAdded = albumsByArtists[artistIndex].albums.some((element) => element.id === id)
                          }
  
                          return (
                            <AlbumCard key={id} id={id} image={url} name={name} publishedDate={release_date}>
                              {!albumIsAdded 
                                ?
                                <Button 
                                  classname='mt-6' 
                                  backgroundColor='#D6F379' 
                                  color='#000' 
                                  onClick={() => setAlbum(data.artist.id, data.artist.name, album)}>
                                    + Add album
                                </Button>
                                :
                                <Button 
                                  classname='mt-6' 
                                  backgroundColor='#E3513D' 
                                  color='#fff' 
                                  onClick={() => removeAlbum(data.artist.id, album)}>
                                    - Remove album
                                </Button>
                              }
                            </AlbumCard>
                          )
                        })}
                      </div>

                      <div className='mt-12 flex justify-center md:justify-start'>
                        <Pagination currentPage={currentPage} pageCount={pageCount} onChange={paginationHandler} />
                      </div>
                    </>
                    :
                    <Message {...requestError} />
                  }
                </>
                :
                <>
                  {/* Show artists list */}
                  {data.artists.items.length > 0
                    ?
                    <>
                      <span className='block mt-11 leading-8 text-white'>
                        Mostrando {perPage} resultados de {data.artists.total}
                      </span>

                      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 md:gap-16 lg:gap-18 justify-items-center content-center'>
                        {data.artists.items.map(({ id, name, followers: { total }, images }) => {
                          const url = images?.[0]?.url || notFoundImageUrl
                          return <ArtistCard key={id} image={url} name={name} followers={total} onClick={() => selectArtistHandler(id, name, total, url )} />
                        })}
                      </div>

                      <div className='mt-12 flex justify-center md:justify-start'>
                        <Pagination currentPage={currentPage} pageCount={pageCount} onChange={paginationHandler} />
                      </div>
                    </>
                    :
                    <Message status={NOT_FOUND.status} message={NOT_FOUND.message} />
                  }
                </>
              }
            </>
          }
        </div>
      }
    </>
  )
}

export default Artists