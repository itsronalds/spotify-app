const AlbumCard = ({ image, name, publishedDate, children }) => {
  return (
    <div className="transition-all hover:-translate-y-2" style={{ maxWidth: 272 }}>
      <div>
        <img className="rounded-xl object-cover" style={{ minWidth: 272, minHeight: 241 }} src={image} alt={name} />
      </div>

      <h3 className="mt-6 text-2xl font-semibold text-white">{name}</h3>
      <span className="block mt-2 font-semibold text-white">Publicado en: {publishedDate}</span>
      
      {children}
    </div>
  )
}

export default AlbumCard