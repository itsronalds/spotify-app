const Header = () => {
  const isAuth = false

  return (
    !isAuth ? (
      <header className="p-6 md:px-20">
          <span className="text-3xl font-semibold text-white">Music App</span>

          <nav></nav>
      </header>)
      : (
        <header>

        </header>
      )
  )
}

export default Header