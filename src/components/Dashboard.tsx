import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, Mail, Contact, Info, Server, PanelTopDashed, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import RiftRockLogo from './RiftRockLogo';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUser } from '../composables/useGetUser';
import { addUser } from '../redux/slices/auth';
import { addServices, addUsers } from '../redux/slices/dashboard';
import useDates from '../composables/useDates';

export default function Dashboard() {
  const [fullSideBar, setFullSideBar] = useState(false)
  const [activeSection, setActiveSection] = useState('Services')
  const navigator = useNavigate()
  const user = useSelector((state) => state.auth.value)
  const dashboardData = useSelector((state) => state.dashboard.value)
  const { getUser } = useGetUser()
  const dispatch = useDispatch()
  const { formatDate } = useDates()
  const nextPages = {
    'Services': 1,
    'Emails': 1,
    'Contacts': 1,
    'Users': 1,
  }
  const sections = [
    {name: 'Users', icon: User},
    {name: 'Details', icon: Info},
    {name: 'Services', icon: Server},
    {name: 'Contacts', icon: Contact},
    {name: 'Emails', icon: Mail},
  ]

  useEffect(() => {
    clickedSection()
    if (user) return

    callable()
  }, [])

  async function callable() {
    const u = await getUser(user)

    if (!u) goHome()

    dispatch(addUser(u))
  }

  function createDashboardItem() {
    
  }

  function getUserName(u) {
    let name = ''
    if (u?.firstName)
        name += u.firstName
    if (u?.lastName)
        name += ` ${u.lastName}`
    if (u?.otherNames)
        name += `, ${u.otherNames}`

    if (!name.length)
      name = 'No name'
    return name
  }

  function goHome() {
    navigator('/')
  }

  function clickedSection(section: string | null = null) {
    if (!section) section = activeSection

    setActiveSection(section)
    
    if (section == 'Services' && !dashboardData.services.length)
      getServices()
    
    if (section == 'Users' && !dashboardData.users.length)
      getUsers()
  }

  async function getServices() {
    axios.get(`/services?page${nextPages.Services}`)
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

  async function getUsers() {
    console.log('object');
    axios.get(`/users?page${nextPages.Users}`)
    .then((res) => {
      console.log(res);
      if (nextPages.Users + 1 <= res.data.data.lastPage)
        nextPages.Users += 1

      dispatch(addUsers(res.data.data))
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {

    })
  }

  return (
    <div className='text-white overflow-hidden'>
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
                  onClick={() => clickedSection(section.name)}
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
        <div className={`w-full relative ${dashboardData[activeSection.toLowerCase()].length == 0 ?
          'flex justify-start gap-44 flex-col items-center': ''}`}>
          <div className='absolute top-2 right-4 p-2'>
            <button className='rounded py-1 px-2 bg-teal-700'
            onClick={createDashboardItem}
            >create</button>
          </div>
          {/* services */}
          {
            activeSection == 'Services' &&
            <div>
              <div
                className='p-6 gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                {
                  dashboardData.services.map((service) => (
                    <div key={service.id} 
                      className='rounded h-fit bg-slate-300 shadow-md shadow-yellow-700 text-slate-700 p-2
                        '>
                      <div></div>
                      <div className='text-center font-bold'>{service.title}</div>
                      <div className='mt-3 mb-2 px-2'>{service.description}</div>
                      <div className='text-sm text-slate-500 text-right mb-4'>{formatDate(service.createdAt)}</div>
    
                      <div className='flex items-center justify-end gap-2'>
                        <div 
                          className='bg-green-700 text-green-300 w-fit py-1 px-2 rounded cursor-pointer
                            hover:bg-green-800 hover:text-green-200 transition-colors duration-100'
                        >view</div>
                        <div 
                          className='bg-blue-700 text-blue-300 w-fit py-1 px-2 rounded cursor-pointer
                            hover:bg-blue-800 hover:text-blue-200 transition-colors duration-100'
                        >edit</div>
                        <div 
                          className='bg-red-700 text-red-300 w-fit py-1 px-2 rounded cursor-pointer
                            hover:bg-red-800 hover:text-red-200 transition-colors duration-100'
                        >delete</div>
                      </div>
                    </div> 
                  ))
                }
    
                {
                  dashboardData.services.length === 0 && <div className='col-span-3 text-center text-lg text-slate-700'
                  >No services available</div>
                }
              </div>
            </div>
          }

          {/* users */}
          {
            activeSection == 'Users' &&
            <div>
              <div
                className='p-6 gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                {
                  dashboardData.users.map((user) => (
                    <div key={user.id} 
                      className='rounded h-fit bg-slate-300 shadow-md shadow-yellow-700 text-slate-700 p-2
                        '>
                      <div></div>
                      <div className='text-center font-bold'>{getUserName(user)}</div>
                      <div className='mt-3 mb-2 px-2'>{user.email}</div>
                      <div className='mt-3 mb-2 px-2'>{user.role}</div>
                      <div className='text-sm text-slate-500 text-right mb-4'>{formatDate(user.createdAt)}</div>
    
                      <div className='flex items-center justify-end gap-2'>
                        <div 
                          className='bg-green-700 text-green-300 w-fit py-1 px-2 rounded cursor-pointer
                            hover:bg-green-800 hover:text-green-200 transition-colors duration-100'
                        >view</div>
                        <div 
                          className='bg-blue-700 text-blue-300 w-fit py-1 px-2 rounded cursor-pointer
                            hover:bg-blue-800 hover:text-blue-200 transition-colors duration-100'
                        >edit</div>
                        <div 
                          className='bg-red-700 text-red-300 w-fit py-1 px-2 rounded cursor-pointer
                            hover:bg-red-800 hover:text-red-200 transition-colors duration-100'
                        >delete</div>
                      </div>
                    </div> 
                  ))
                }
    
                {
                  dashboardData.users.length === 0 && <div className='col-span-3 text-center text-lg text-slate-700'
                  >No users available</div>
                }
              </div>
            </div>
          }

          {/* details */}
          {
            activeSection == 'details' &&
            <div>
              <div
                className='p-6 gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                {
                  dashboardData.details.map((details) => (
                    <div key={details.id} 
                      className='rounded h-fit bg-slate-300 shadow-md shadow-yellow-700 text-slate-700 p-2
                        '>
                      <div></div>
                      <div className='text-center font-bold'>{getUserName(details)}</div>
                      <div className='mt-3 mb-2 px-2'>{details.email}</div>
                      <div className='mt-3 mb-2 px-2'>{details.role}</div>
                      <div className='text-sm text-slate-500 text-right mb-4'>{formatDate(details.createdAt)}</div>
    
                      <div className='flex items-center justify-end gap-2'>
                        <div 
                          className='bg-green-700 text-green-300 w-fit py-1 px-2 rounded cursor-pointer
                            hover:bg-green-800 hover:text-green-200 transition-colors duration-100'
                        >view</div>
                        <div 
                          className='bg-blue-700 text-blue-300 w-fit py-1 px-2 rounded cursor-pointer
                            hover:bg-blue-800 hover:text-blue-200 transition-colors duration-100'
                        >edit</div>
                        <div 
                          className='bg-red-700 text-red-300 w-fit py-1 px-2 rounded cursor-pointer
                            hover:bg-red-800 hover:text-red-200 transition-colors duration-100'
                        >delete</div>
                      </div>
                    </div> 
                  ))
                }
    
                {
                  dashboardData.details.length === 0 && <div className='col-span-3 text-center text-lg text-slate-700'
                  >No details available</div>
                }
              </div>
            </div>
          }
          
          <div className='flex justify-center items-center p-2 my-4 gap-5'>
            <div><ChevronsLeftIcon /></div>
            <div><ChevronsRightIcon /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
