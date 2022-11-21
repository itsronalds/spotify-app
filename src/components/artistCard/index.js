const ArtistCard = ({ image, name, followers, onClick }) => {
    return (
      <div className="artist-card transition-all p-6 rounded-3xl text-white cursor-pointer hover:text-black hover:-translate-y-2" onClick={onClick}>
        <div>
          <img className="rounded-xl object-cover" style={{ minWidth: 272, minHeight: 241, maxWidth: 272, maxHeight: 241 }} src={image} alt={name} />
        </div>
  
        <h3 className="mt-6 text-2xl font-semibold">{name}</h3>
        <span className="block mt-4 font-semibold text-sm">Followers: {followers}</span>
      </div>
    )
  }
  
  export default ArtistCard