import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, Mail, Contact, Info, Server, PanelTopDashed } from 'lucide-react';
import RiftRockLogo from './RiftRockLogo';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUser } from '../composables/useGetUser';
import { addUser } from '../redux/slices/auth';

export default function Dashboard() {
  const [fullSideBar, setFullSideBar] = useState(false)
  const [activeSection, setActiveSection] = useState('Services')
  const navigator = useNavigate()
  const user = useSelector((state) => state.auth.value)
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

    async function callable() {
      return await getUser()
    }

    const u = callable()
    
    if (!u) goHome()

    dispatch(addUser(u))
  }, [])

  function goHome() {
    navigator('/')
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

          <div className='text-sm text-slate-300'>{user?.email && ''}</div>
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
              sections.map((section) => (
                <div className={`${section.name == activeSection ? 
                  'font-bold' : 
                  'text-slate-300 '} 
                  mt-4 hover:text-slate-100 cursor-pointer grid items-center gap-2 w-full
                  ${fullSideBar ? ' grid-cols-2 px-4' : ' grid-cols-1 px-auto'}`}
                  onClick={() => setActiveSection(section.name)}
                >
                  {
                    (section.name == 'Users' && user?.role == 'USER') ?
                      <></> :
                      <div>
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
          
          <div className='p-6'>main</div>
        </div>
      </div>
    </div>
  )
}
