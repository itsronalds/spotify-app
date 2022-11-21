import { useState, useEffect } from 'react'

import { useAuthContext } from '../../contexts/auth'
import { useStorageContext } from '../../contexts/store'

import AlbumCard from '../albumCard'
import Button from '../button'
import Pagination from '../pagination'
import Loader from '../loader'
import Verified from '../../assets/icons/Verified'

import { albumsByArtistIdAPI } from '../../api/services'

const initialCurrentPageState = 0

const initialDataState = {
  albums: [],
  total: 0,
}

const notFoundImageUrl = 'https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png'

const ArtistDetails = ({ id: artistId, name: artistName, followers, image }) => {
  const { auth: { accessToken } } = useAuthContext()
  const { albumsByArtists, setAlbum, removeAlbum } = useStorageContext()

  const [data, setData] = useState(initialDataState)

  /* Pagination state & logic */
  const [currentPage, setCurrentPage] = useState(initialCurrentPageState)
  const perPage = 4
  const limit = (currentPage + 1) * perPage
  const offset = limit - perPage
  const itemsCount = data.total
  const pageCount = Math.ceil(itemsCount / perPage)

  /* Request loading state */
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    albumsByArtistId()
  }, [currentPage])
  
  const albumsByArtistId = async () => {
    /* Request params */
    const params = [{ limit: limit - offset }, { offset }]

    setIsLoading(true)

    const response = await albumsByArtistIdAPI(params, artistId, accessToken)

    setIsLoading(false)

    if (response?.items?.length) {
      const { items: albums, total } = response
      setData({ albums, total })
    }
  }

  const paginationHandler = (item) => {
    setCurrentPage(item.selected)
  }

  const loader = <div className='mt-10 text-center'><Loader /></div>

  return (
    <div className="p-6 md:px-20">
      <div className='md:flex md:gap-14'>
        <div className="mt-4">
          <img className='object-cover rounded-full w-44 h-44 md:w-60 md:h-60' src={image} alt={artistName} />
        </div>

        <div>
          <div className='flex gap-2 items-center mt-9'>
            <Verified />
            <span className='font-semibold text-sm text-white'>Artista certificado</span>
          </div>

          <h1 className='mt-2.5 text-white font-bold text-4xl lg:text-6xl'>{artistName}</h1>

          <div className='flex flex-col gap-1 mt-16 font-semibold text-sm text-white'>
            <span className=''>Followers: {followers}</span>
            <span className=''>Oyentes mensuales: {25000}</span>
          </div>
        </div>
      </div>

      <div className='mt-16 md:mt-10 text-white'>
        <span className='md:hidden text-sm'>Guarda tus álbumes favoritos de<br/>{artistName}</span>
        <span className='hidden md:block'>Guarda tus álbumes favoritos de {artistName}</span>
      </div>

      {isLoading
        ?
        loader
        :
        <>
          <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 md:gap-16 lg:gap-20 xl:gap-4 justify-items-center content-center'>
            {data.albums.map((album) => {
              const { id, images, name, release_date } = album
              const url = images?.[0]?.url || notFoundImageUrl

              const artistIndex = albumsByArtists.findIndex((element) => element.artistId === artistId)
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
                      onClick={() => setAlbum(artistId, artistName, album)}>
                        + Add album
                      </Button>
                    :
                    <Button 
                      classname='mt-6' 
                      backgroundColor='#E3513D' 
                      color='#fff' 
                      onClick={() => removeAlbum(artistId, album)}>
                        - Remove album
                      </Button>
                  }
                </AlbumCard>
              )
            })}
          </div>

          {data.albums.length > 0 && (
            <div className='mt-12 flex justify-center md:justify-start'>
              <Pagination currentPage={currentPage} pageCount={pageCount} onChange={paginationHandler} />
            </div>
          )}
        </>
      }
    </div>
  )
}

export default ArtistDetails