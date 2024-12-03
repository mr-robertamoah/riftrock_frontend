import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../composables/useDarkMode';
import RiftRockLogo from './RiftRockLogo';
import { ThemeToggle } from './ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser, removeUser } from '../redux/slices/auth';

function Login() {

  const  {isDarkMode, setIsDarkMode} = useDarkMode({ dark: localStorage.getItem('theme') === 'dark' });
  const  [loginData, setLoginData] = useState({ email: '', password: '' });
  const  [alert, setAlert] = useState<string | null>();
  const  [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  function toggleTheme() {
    setIsDarkMode(!isDarkMode)
  }

  function showAlert(message: string) {
    setAlert(message)
  }

  function clearAlert() {
    if (alert?.length)
      setAlert(null)
  }

  async function submitLogin(event) {
    event.preventDefault()
    if (!loginData.email) {
      return showAlert('Email is required.')
    }
    
    if (!loginData.password) {
      return showAlert('Password is required.')
    }

    setLoading(true)

    axios.post('/auth/login', {
      ...loginData
    })
    .then((res) => {
      console.log(res);
      localStorage.setItem('access_token', res.data.access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`
      dispatch(addUser(res.data.user))
      goHome()
    })
    .catch((err) => {
      console.log(err);
      localStorage.removeItem('access_token');
      dispatch(removeUser())
      let message = err.message

      if (err.status == 401)
        message = 'Invalid email or password'

      showAlert(message ?? 'Something unfortunate happened. Try again shortly.')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  function goHome() {
    console.log('here');
    navigate('/')
  }

  function changeLoginData(key: 'email' | 'password', value: string) {
    clearAlert()
    setLoginData({
      ...loginData,
      [key]: value,
    })
  }

  return (
    <div className="dark:bg-slate-900 bg-white h-screen flex justify-center items-center">
      <div 
        className='w-[90%] sm:w-[80%] md:w-[60%] h-[60vh] dark:bg-slate-400 rounded-md relative
          bg-slate-700'
      >
        <div 
          className='absolute -top-14 left-0 right-0 flex justify-center'
          onClick={goHome}
        >
          <RiftRockLogo
            className='w-36 h-36'
            isDarkMode={isDarkMode}
          />
        </div>

        <div className='mt-24 w-[90%] mx-auto'>
          <div className='w-full text-center text-[30px] font-bold uppercase dark:text-slate-800 text-slate-200'
          >login</div>
          <form onSubmit={submitLogin} className='p-5'>
            <label htmlFor="email"
              className='mb-2 font-bold dark:text-slate-700 text-slate-300'
            >Email</label>
            <input type="email" name="email" id="email"
              placeholder='name@example.com'
              className='w-full p-2 rounded mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
              value={loginData.email}
              onChange={(event) => changeLoginData('email', event.target.value)}
            />

            <label htmlFor="password"
              className='mb-2 font-bold dark:text-slate-700 text-slate-300 mt-5'
            >Password</label>
            <input type="password" name="password" id="password"
              placeholder='*************'
              className='w-full p-2 rounded focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
              value={loginData.password}
              onChange={(event) => changeLoginData('password', event.target.value)}
            />

            <div className='w-full flex justify-end'>
              <button
                type='submit'
                className='mt-10 rounded py-1 px-2 bg-slate-300 text-slate-700
                  dark:bg-slate-700 dark:text-slate-300'
              >submit</button>
            </div>
          </form>
        </div>
      </div>

      {
        alert?.length ?
          <div className='absolute top-3 left-0 right-0 transition-all duration-200 z-50'>
            <div 
              className='bg-red-700 text-red-200 rounded p-2 py-4 w-[90%] md:w-[70%] text-center
                mx-auto relative transition-all duration-200'
            >
              {alert}

              <div 
                className='absolute rounded-full w-6 h-6 p-2 text-red-700 bg-red-200 flex
                  justify-center items-center -top-2 -right-2 font-bold cursor-pointer'
                onClick={clearAlert}
              >&times;</div>
            </div>
          </div> :
          <></>
      }

      {
        loading ?
          <div className='absolute top-3 left-0 right-0 transition-all duration-200 z-50'>
            <div 
              className='bg-green-700 text-green-200 rounded p-2 py-4 w-[90%] md:w-[70%] text-center
                mx-auto relative transition-all duration-200'
            >
              logging in
            </div>
          </div> :
          <></>
      }

      <ThemeToggle
        onToggle={toggleTheme} 
        isDarkMode={isDarkMode}
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className="absolute top-6 right-6 mt-2"
      >
      </ThemeToggle>
    </div>
  );
}

export default Login;
