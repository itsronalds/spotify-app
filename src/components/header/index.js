import { Link } from 'react-router-dom'
import useScreen from '../../hooks/useScreen'
import reactLogo from '../../assets/logo/react.png'
import LogoutIcon from '../../assets/icons/Logout'
import ThemeMode from '../../assets/icons/ThemeMode'

import { useAuthContext } from '../../contexts/auth'

const Header = ({ links }) => {
  const { auth: { isAuth } } = useAuthContext()
  const { width: screenWidth } = useScreen()

  const logout = () => {
    window.localStorage.clear()
    window.location.href = '/'
  }

  return (
    <>
      {!isAuth && (
        <header className="p-6 md:px-20">
          <Link to='/'><span className="text-3xl font-semibold text-white">Music App</span></Link>
        </header>
      )}

      {isAuth && (
        <header className="p-6 md:px-20 flex justify-between items-center">
          {screenWidth < 768 
            ? <Link to={isAuth ? '/artists' : '/'}><img className='react-logo h-14 object-fit' src={reactLogo} alt="Logo" /> </Link>
            : <Link to={isAuth ? '/artists' : '/'}><span className="text-3xl font-semibold text-white">Music App</span></Link>
          }

          <nav>
            <ul className='flex gap-3 md:gap-6 lg:gap-8 text-white font-semibold'>
              {links.map(({ name, path, status }) => {
                const style = { color: status ? '#D6F379' : '#fff', }
                return (
                  <li key={name}>
                    <Link className='w-fit p-0 m-0 text-base font-semibold' style={style} to={path}>{name}</Link>
                  </li>
                )
              })}

              <div className='w-0.5 bg-white' />

              <div className='flex justify-center items-center cursor-pointer' onClick={logout}>
                {screenWidth < 768 ? <LogoutIcon /> : 'Cerrar sesión'}
              </div>


              {screenWidth < 1280 && (
                <>
                  <div className='w-0.5 bg-white' />
                  <div className='flex justify-center items-center cursor-pointer'>
                    <ThemeMode />
                  </div>
                </>
              )}
            </ul>
          </nav>
        </header>
      )}
    </>
  )
}

export default Header