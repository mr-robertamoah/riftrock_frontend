import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { About } from './About';
import { Services } from './Services';
import { Contact } from './Contact';
import { Projects } from './Projects';
import { Equipment } from './Equipment';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../redux/slices/auth';
import { useNavigate } from 'react-router-dom';
import { useGetUser } from '../composables/useGetUser';
import { addDetails, addServices } from '../redux/slices/dashboard';

function Home() {

  const  [isDarkMode, setIsDarkMode] = useState(false);
  const  [showUserDetials, setShowUserDetials] = useState(false);
  const user = useSelector((state) => state.auth.value);
  const homeData = useSelector((state) => state.dashboard.value);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { getUser: getAuthUser } = useGetUser()

  useEffect(() => {
    getAll()
    getUser()
    if (typeof window !== 'undefined') {
      setIsDarkMode(localStorage.getItem('theme') === 'dark')
      return
    }

    setIsDarkMode(false)
  }, [])

  useEffect(() => {
    if (user) return

    callable()
  }, [])

  async function callable() {
    const u = await getAuthUser(user)

    if (u) dispatch(addUser(u))
  }

  function toggleTheme(theme: boolean) {
    setIsDarkMode(theme)
  }

  function getUserName() {
    let name = ''
    if (user?.firstName)
        name += user.firstName
    if (user?.lastName)
        name += ` ${user.lastName}`
    if (user?.otherNames)
        name += `, ${user.otherNames}`

    return name
  }

  async function getUser() {
    axios.get('/auth/user', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    })
    .then(res => {
        console.log(res);
        dispatch(addUser(res.data))
    })
    .catch(error => {
        console.log(error);
    })
  }

  async function getAll() {
    axios.get('')
    .then(res => {
        console.log(res);
        dispatch(addDetails(res.data.details))
        dispatch(addServices(res.data.services.data))
    })
    .catch(error => {
        console.log(error);
    })
  }

  return (
    <div className="bg-slate-900 relative">
      <Navbar isDarkMode={isDarkMode} />
      <Hero onToggle={toggleTheme} />
      <About isDarkMode={isDarkMode} />
      <Equipment />
      <Projects />
      <Services />
      <Contact isDarkMode={isDarkMode} />
      {
        user && (
            <div 
                className={`fixed top-20 h-20 cursor-pointer ${showUserDetials ? 'w-[50%] sm:w-[40%]' : 'w-3'} 
                    bg-slate-700 dark:bg-slate-300 rounded-r-md p-2`}
                onClick={() => setShowUserDetials(true)}
            >
                {
                    showUserDetials &&
                    <div className='text-slate-200 dark:text-slate-700 w-full px-1'>
                        <div 
                            className='font-bold w-full overflow-x-hidden overflow-ellipsis capitalize'
                        >{ getUserName() }</div>
                        <div className='text-sm text-center'>{ user.email }</div>
                        <div className='flex justify-between items-center'>
                            <div className='text-xs mt-1 text-slate-700 dark:text-slate-300 lowercase font-bold'>{ user.role }</div>
                            <button
                                onClick={() => navigate('/dashboard')}
                                type='button'
                                className='mt-10 rounded py-1 px-2 bg-slate-300 text-slate-700
                                dark:bg-slate-700 dark:text-slate-300'
                            >dashboard</button>
                        </div>
                        <div
                            className='rounded-full w-6 h-6 p-2 flex justify-center items-center cursor-pointer
                                bg-slate-300 text-slate-700 absolute -top-2 -right-2 font-bold
                                dark:bg-slate-700 dark:text-slate-300'
                            onClick={(event) => {
                                event.stopPropagation();
                                setShowUserDetials(false)}
                            }
                        >X</div>
                    </div>
                }
            </div>
        )
      }
    </div>
  );
}

export default Home;
