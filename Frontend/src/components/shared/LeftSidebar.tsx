import { useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
//import { useUserContext } from '@/context/AuthContext';
import { sidebarLinks } from '@/constants/inde';
import { INavLink } from '@/types';


const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  //const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) {
      navigate('/signin');
    }
  }, [isSuccess]);
  return (
    <nav className="leftsidebar">
      <div className='flex flex-col gap-3 lg:gap-11'>
        
        <ul className="flex flex-col lg:gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.label}
                className={`leftsidebar-link group ${isActive
                  && 'bg-primary-500'}`}>
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`w-10 h-10 group-hover:invert-white 
                ${isActive && 'invert-white'}`} />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      <Button variant="ghost" className="bg-slate-700 gap-4" onClick={() => signOut()}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium md:base-medium lg:base-medium">
          Logout
        </p>
      </Button>

    </nav>
  )
}

export default LeftSidebar