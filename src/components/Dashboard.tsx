import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, Mail, Contact, Info, Server, PanelTopDashed } from 'lucide-react';
import RiftRockLogo from './RiftRockLogo';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUser } from '../composables/useGetUser';
import { addUser } from '../redux/slices/auth';
import { addServices } from '../redux/slices/dashboard';

export default function Dashboard() {
  const [fullSideBar, setFullSideBar] = useState(false)
  const [activeSection, setActiveSection] = useState('Services')
  const navigator = useNavigate()
  const user = useSelector((state) => state.auth.value)
  const dashboardData = useSelector((state) => state.dashboard.value)
  const { getUser } = useGetUser()
  const dispatch = useDispatch()
  const sections = [
    {name: 'Users', icon: User},
    {name: 'Details', icon: Info},
    {name: 'Services', icon: Server},
    {name: 'Contacts', icon: Contact},
    {name: 'Emails', icon: Mail},
  ]

  useEffect(() => {
    if (user) return

    callable()
  }, [])

  async function callable() {
    const u = await getUser(user)

    if (!u) goHome()

    dispatch(addUser(u))
  }

  function goHome() {
    navigator('/')
  }

  function clickSection(section: string) {
    setActiveSection(section)

    if (section == 'Services' && !dashboardData.services.length)
      getServices()
  }

  async function getServices() {
    axios.get('/services')
    .then((res) => {
      console.log(res);
      dispatch(addServices(res.data.data))
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {

    })
  }

  return (
    <div className='text-white'>
      <div className='bg-slate-600 p-4'>
        <div className="flex items-center justify-between h-8">
          <motion.div
            className="flex-shrink-0 flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div onClick={goHome}>
              <RiftRockLogo
                className='w-10 h-10'
              />
            </div>
            <span className="text-white font-bold text-xl">RiftRock Mining Services</span>
          </motion.div>
          <div className='w-full text-center uppercase font-bold'>{activeSection}</div>

          <div className='text-sm text-slate-300'>{user?.email ?? ''}</div>
        </div>
      </div>
      <div className='flex justify-between'>
        <div className={`${fullSideBar ? 'min-w-[200px]' : 'w-fit'} p-2 bg-slate-600 h-screen`}>
          <div className='mx-auto w-fit'>
            <button
              onClick={() => setFullSideBar(!fullSideBar)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {fullSideBar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          {
            fullSideBar ?
              <div className='font-bold uppercase text-center mt-7'>Dashboard</div> :
              <div className={`${fullSideBar ? 'pl-4' : ''} mt-7`}>
                <PanelTopDashed className='h-6 w-6 font-bold' />
              </div>
          }

          <div className='mt-4 flex flex-col justify-end items-center'>
            {
              sections.map((section, idx) => (
                <div key={idx} className={`${section.name == activeSection ? 
                  'font-bold' : 
                  'text-slate-300 '} 
                  mt-4 hover:text-slate-100 cursor-pointer items-center gap-2 w-full
                  `}
                  onClick={() => clickSection(section.name)}
                >
                  {
                    (section.name == 'Users' && user?.role == 'USER') ?
                      <></> :
                      <div className={`grid ${fullSideBar ? ' grid-cols-2 px-4' : ' grid-cols-1 px-auto'}`}>
                        <div className={`${fullSideBar ? '' : 'mx-auto w-fit'}`}><section.icon /></div>
                        {
                          fullSideBar &&
                            <div>{section.name}</div>
                        }
                      </div>
                  }
                </div>
              ))
            }
          </div>
        </div>
        <div className='w-full'>
          
          <div className='p-6 flex justify-start gap-3 items-start flex-wrap'>
            {
              dashboardData.services.map((service) => (
                <div key={service.id} 
                  className='rounded bg-slate-300 shadow-md shadow-yellow-700 text-slate-700 p-2
                    max-w-[250px]'>
                  <div></div>
                  <div>{service.title}</div>
                  <div>{service.description}</div>
                  <div>{service.createdAt}</div>

                  <div>
                    <div>view</div>
                  </div>
                </div> 
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
