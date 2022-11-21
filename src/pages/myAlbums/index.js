import Header from "../../components/header"
import Button from "../../components/button"
import AlbumCard from "../../components/albumCard"
import { useStorageContext } from '../../contexts/store'

const links = [{ name: 'Buscar', path: '/artists', status: false }, { name: 'My albums', path: '/my-albums', status: true },]

const notFoundImageUrl = 'https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png'

const MyAlbums = () => {
  const { albumsByArtists, removeAlbum } = useStorageContext()

  return (
    <>
      <Header links={links} />

      <div className="p-6 md:flex md:flex-col">
        <div className='md:text-center'>
          <h1 className="mt-5 text-4xl font-bold md:text-6xl">
            <span className='text-white'>Mis albunes</span><br /><span style={{ color: '#D6F379' }}>guardados</span>
          </h1>

          <span className='block mt-6 leading-8 text-white'>
            <span className='md:hidden'>Disfruta de tu música a un solo click y descubre que discos has guardado dentro de  “mis  álbumes”</span>
            <span className='hidden md:block'>Disfruta de tu música a un solo click y descubre que<br/>discos has guardado dentro de  “mis  álbumes”</span>
          </span>
        </div>

        <div className="mt-10 md:px-16 flex flex-col gap-8">
          {albumsByArtists.map((artist) => {
            return (
              <div key={artist.artistId}>
                <h3 className="text-3xl font-bold text-white">{artist.artistName}</h3>
                <div className="mt-6 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-16">
                  {artist.albums?.map((album) => {
                    const { id, images, name, release_date } = album
                    const url = images?.[0]?.url || notFoundImageUrl

                    return (
                      <AlbumCard key={id} id={id} image={url} name={name} publishedDate={release_date}>
                        <Button classname='mt-6' backgroundColor='#E3513D' color='#fff' onClick={() => removeAlbum(artist.artistId, album)}>
                          - Remove album
                        </Button>
                      </AlbumCard>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default MyAlbums