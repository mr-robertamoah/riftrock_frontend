import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, Mail, Contact, Info, Server, PanelTopDashed, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import RiftRockLogo from './RiftRockLogo';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUser } from '../composables/useGetUser';
import { addUser } from '../redux/slices/auth';
import { addServices, addUsers, addUser as addDashboardUser, addService, updateUser, deleteUser } from '../redux/slices/dashboard';
import useDates from '../composables/useDates';
import Modal from './Modal';

export default function Dashboard() {
  const [fullSideBar, setFullSideBar] = useState(false)
  const [activeSection, setActiveSection] = useState('Services')
  const [showModal, setShowModal] = useState<string | null>(null)
  const navigator = useNavigate()
  const user = useSelector((state) => state.auth.value)
  const dashboardData = useSelector((state) => state.dashboard.value)
  const { getUser } = useGetUser()
  const dispatch = useDispatch()
  const { formatDate } = useDates()
  const emptyCreateServiceData = {
    title: '',
    description: '',
    details: '',
    icon: '',
    fileDescription: '',
    file: null,
  }
  const emptyCreateUserData = {
    firstName: '',
    lastName: '',
    otherNames: '',
    password: '',
    passwordConfirmation: '',
    email: '',
  }
  const  [alert, setAlert] = useState<string | null>();
  const  [loading, setLoading] = useState<boolean>(false);
  const  [createServiceData, setcreateServiceData] = useState<{
    file: File|null, title: string, description: string, id?: number|null,
    details: string, icon: string, fileDescription: string
  }>(emptyCreateServiceData);
  const  [createUserData, setCreateUserData] = useState<{
    email: string, firstName: string, lastName: string, id?: number|null,
    otherNames: string, password: string, passwordConfirmation: string
  }>(emptyCreateUserData);
  const [pages, setPages] = useState({
    'Services': {next: 1, current: 0, previous: 0},
    'Emails': {next: 1, current: 0, previous: 0},
    'Contacts': {next: 1, current: 0, previous: 0},
    'Users': {next: 1, current: 0, previous: 0},
    'Details': {next: 1, current: 0, previous: 0},
  })
  const sections = [
    {name: 'Users', icon: User},
    {name: 'Details', icon: Info},
    {name: 'Services', icon: Server},
    {name: 'Contacts', icon: Contact},
    {name: 'Emails', icon: Mail},
  ]
  type itemType = 'Users' | 'Details' | 'Services' | 'Contacts' | 'Emails'
  type modalActionsType = 'Create_Users' | 'Create_Details' | 'Create_Services' | 
    'Create_Contacts' | 'Create_Emails'

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
    setShowModal(`Create_${activeSection}`)
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
    
    if (section == 'Services' && !dashboardData.services.length) {
      initiatePageField('Services')

      getServices()
    }
    
    if (section == 'Users' && !dashboardData.users.length) {
      initiatePageField('Users')

      getUsers()
    }
  }

  async function getServices() {
    if (!pages.Services.current)
      return

    axios.get(`/services?page${pages.Services.current}`)
    .then((res) => {
      console.log(res);
      setPagesUsingMeta(res.data.meta, 'Services')

      dispatch(addServices(res.data.data))
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {

    })
  }

  async function getUsers() {
    if (!pages.Users.current)
      return
    
    axios.get(`/users?page${pages.Users.current}`)
    .then((res) => {
      console.log(res);
      setPagesUsingMeta(res.data.meta, 'Users')

      dispatch(addUsers(res.data.data))
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {

    })
  }

  function setPagesUsingMeta(
    meta: {
      total: number,
      page: number,
      limit: number,
      lastPage: number
    },
    item: itemType,
  ) {
    const data = {next: 0, current: 0, previous: 0}

    data.previous = meta.page - 1
    if (meta.page + 1 <= meta.lastPage)
      data.next = meta.page + 1
    else
      data.next = 0

    setPages(() => {
      return {
        ...pages,
        [item]: data
      }
    })
  }

  function increasePageCurrent(item: itemType) {
    increasePageField(item, 'current')
  }

  function decreasePageCurrent(item: itemType) {
    decreasePageField(item, 'current')
  }

  function increasePageField(
    item: itemType,
    field: 'next' | 'previous' | 'current',
  ) {
    const data = {...pages}
    data[item][field] += 1

    setPages(data)
  }

  function decreasePageField(
    item: itemType,
    field: 'next' | 'previous' | 'current',
  ) {
    const data = {...pages}
    data[item][field] -= 1

    setPages(data)
  }

  function resetPageField(
    item: itemType,
    field: 'next' | 'previous' | 'current',
  ) {
    const data = {...pages}
    data[item][field] = 0

    setPages(data)
  }

  function initiatePageField(item: itemType) {
      setPageField(item, 'current', 1)
      setPageField(item, 'next', 1)
  }

  function setPageField(
    item: itemType,
    field: 'next' | 'previous' | 'current',
    value: number,
  ) {
    const data = {...pages}
    data[item][field] = value

    setPages(data)
  }

  function getNextItems() {
    increasePageCurrent(activeSection)

    getItems()
  }

  function getPreviousItems() {
    decreasePageCurrent(activeSection)

    getItems()
  }

  function handleCloseModal(event) {
    event.preventDefault()
    
    setShowModal(null)

  }

  function showAlert(message: string) {
    setAlert(message)
  }

  async function createUserFromDashboard(event) {
    event.preventDefault()
    
    if (showModal == 'Edit_User')
      return updateUserFromDashboard()

    if (!createUserData.email) {
      return showAlert('Email is required.')
    }
    
    if (!createUserData.password) {
      return showAlert('Password is required.')
    }
    
    if (createUserData.password !== createUserData.passwordConfirmation) {
      return showAlert('Password confirmation has to match the password.')
    }

    setLoading(true)

    axios.post('/users', {
      ...createUserData
    })
    .then((res) => {
      console.log(res);
      dispatch(addDashboardUser(res.data))
    })
    .catch((err) => {
      console.log(err);
      showAlert(err.message ?? 'Something unfortunate happened. Try again shortly.')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  async function updateUserFromDashboard() {

    const otherUser = dashboardData.users.find((u) => u.id == createUserData.id)
    if (
      createUserData.email !== otherUser.email &&
      !createUserData.password &&
      createUserData.firstName !== otherUser.firstName &&
      createUserData.lastName !== otherUser.lastName &&
      createUserData.otherNames !== otherUser.otherNames
    ) {
      return showAlert('No new information was provided.')
    }
    
    if (
      createUserData.password &&
      createUserData.password !== createUserData.passwordConfirmation
    ) {
      return showAlert('Password confirmation has to match the password.')
    }
    const data = {...createUserData}

    if (createUserData.email == otherUser.email)
      delete data.email;

    if (createUserData.firstName == otherUser.firstName)
      delete data.firstName;

    if (createUserData.lastName == otherUser.lastName)
      delete data.lastName;

    if (createUserData.otherNames == otherUser.otherNames)
      delete data.otherNames;

    setLoading(true)

    axios.patch(`/users/${otherUser.id}`, {
      ...data
    })
    .then((res) => {
      console.log(res);
      dispatch(updateUser(res.data))
      setShowModal(null)
    })
    .catch((err) => {
      console.log(err);
      showAlert(err.message ?? 'Something unfortunate happened. Try again shortly.')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  async function deleteUserFromDashboard(event) {
    event.preventDefault()

    const otherUser = dashboardData.users.find((u) => u.id == createUserData.id)

    setLoading(true)

    axios.delete(`/users/${otherUser.id}`, {
      ...createUserData
    })
    .then((res) => {
      console.log(res);
      dispatch(deleteUser(createUserData))
      setShowModal(null)
    })
    .catch((err) => {
      console.log(err);
      showAlert(err.message ?? 'Something unfortunate happened. Try again shortly.')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  function clearCreateUserData() {
    setCreateUserData(emptyCreateUserData)
  }

  async function createServiceFromDashboard() {
    if (!createServiceData.title) {
      return showAlert('Title is required.')
    }
    
    if (!createServiceData.description) {
      return showAlert('Description is required.')
    }

    setLoading(true)

    axios.post('/services', {
      ...createServiceData
    })
    .then((res) => {
      console.log(res);
      dispatch(addService(res.data))
      clearCreateUserData()
      setShowModal(null)
    })
    .catch((err) => {
      console.log(err);
      showAlert(err.message ?? 'Something unfortunate happened. Try again shortly.')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  function getItems() {
    if (activeSection == 'Services')
      getServices()

    if (activeSection == 'Users')
      getUsers()
  }

  function clearAlert() {
    if (alert?.length)
      setAlert(null)
  }

  function changeCreateUserData(key: string, value: string) {
    clearAlert()
    setCreateUserData({
      ...createUserData,
      [key]: value,
    })
  }

  function updateCreateUserData(user) {
    const data = {...user}
    delete data.createdAt
    delete data.updatedAt
    setCreateUserData(data)
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
        <div className={`w-full relative px-2 pt-8 ${dashboardData[activeSection.toLowerCase()].length == 0 ?
          'flex justify-start gap-44 flex-col items-center': ''}`}>
          {
            !['Contacts', 'Emails'].includes(activeSection) &&
              <div className='absolute top-2 right-4 p-2'>
                <button className='rounded py-1 px-2 bg-teal-700'
                onClick={createDashboardItem}
                >create</button>
              </div>
          }
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
                      <div className='mt-3 mb-2 px-2 text-sm font-bold'>{user.role.toLowerCase().replace('_', ' ')}</div>
                      <div className='text-sm text-slate-500 text-right mb-4'>{formatDate(user.createdAt)}</div>
    
                      <div className='flex items-center justify-end gap-2'>
                        <div 
                          className='bg-blue-700 text-blue-300 w-fit py-1 px-2 rounded cursor-pointer
                            hover:bg-blue-800 hover:text-blue-200 transition-colors duration-100'
                          onClick={() => {
                            updateCreateUserData(user)
                            setShowModal('Edit_User')
                          }}
                        >edit</div>
                        <div 
                          className='bg-red-700 text-red-300 w-fit py-1 px-2 rounded cursor-pointer
                            hover:bg-red-800 hover:text-red-200 transition-colors duration-100'
                          onClick={() => {
                            setShowModal('Delete_User')
                          }}
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
          
          <div className='grid grid-cols-2 p-2 my-4 gap-5'>
            {
              (pages[activeSection].previous > 0) ?
                <div 
                  className='flex justify-end p-2 cursor-pointer'
                  title={`get previous ${activeSection}`}
                  onClick={getPreviousItems}
                  ><ChevronsLeftIcon /></div> :
                <div></div>
            }
            {
              (pages[activeSection].next > 0) ?
                <div 
                  className='flex p-2 cursor-pointer'
                  title={`get next ${activeSection}`}
                  onClick={getNextItems}
                ><ChevronsRightIcon /></div> :
                <div></div>
            }
          </div>
        </div>
      </div>

      {
        !!showModal?.length && <Modal 
          isDarkMode={true} 
          isOpen={!!showModal?.length} 
          onClose={handleCloseModal}
        >
          {/* creating user */}
          {
            ['Create_Users', 'Edit_User'].includes(showModal) &&
              <div className='py-2'>
                <div className='my-4 text-center font-bold text-slate-600'>{
                  showModal == 'Create_Users' ? 'Create a User' : 'Edit User Information'
                }</div>

                <form onSubmit={createUserFromDashboard}>

                  <label htmlFor="email"
                    className='mb-2 font-bold dark:text-slate-800 text-slate-300'
                  >Email *</label>
                  <input type="email" name="email" id="email"
                    placeholder='name@example.com'
                    className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                    value={createUserData.email ?? ''}
                    onChange={(event) => changeCreateUserData('email', event.target.value)}
                  />

                  <label htmlFor="firstName"
                    className='mb-2 font-bold dark:text-slate-800 text-slate-300'
                  >First Name</label>
                  <input type="firstName" name="firstName" id="firstName"
                    placeholder='Robert'
                    className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                    value={createUserData.firstName ?? ''}
                    onChange={(event) => changeCreateUserData('firstName', event.target.value)}
                  />

                  <label htmlFor="lastName"
                    className='mb-2 font-bold dark:text-slate-800 text-slate-300'
                  >Last Name</label>
                  <input type="lastName" name="lastName" id="lastName"
                    placeholder='Amoah'
                    className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                    value={createUserData.lastName ?? ''}
                    onChange={(event) => changeCreateUserData('lastName', event.target.value)}
                  />

                  <label htmlFor="otherNames"
                    className='mb-2 font-bold dark:text-slate-800 text-slate-300'
                  >Other Names</label>
                  <input type="otherNames" name="otherNames" id="otherNames"
                    placeholder='Paa'
                    className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                    value={createUserData.otherNames ?? ''}
                    onChange={(event) => changeCreateUserData('otherNames', event.target.value)}
                  />

                  <label htmlFor="password"
                    className='mb-2 font-bold dark:text-slate-800 text-slate-300 mt-5'
                  >Password *</label>
                  <input type="password" name="password" id="password"
                    placeholder='*************'
                    className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                    value={createUserData.password ?? ''}
                    onChange={(event) => changeCreateUserData('password', event.target.value)}
                  />

                  <label htmlFor="passwordConfirmation"
                    className='mb-2 font-bold dark:text-slate-800 text-slate-300 mt-5'
                  >Password Confirmation *</label>
                  <input type="password" name="passwordConfirmation" id="passwordConfirmation"
                    placeholder='*************'
                    className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                    value={createUserData.passwordConfirmation ?? ''}
                    onChange={(event) => changeCreateUserData('passwordConfirmation', event.target.value)}
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
          }
          
          {/* deleting user */}
          {
            'Delete_User' == showModal &&
              <div className='py-2'>
                <div className='my-4 text-center font-bold text-slate-600'>Deleting User Account</div>

                <div >
                  <div>Are you sure you want to delete user account?</div>
                  <div className='w-full flex justify-center items-center gap-4'>
                    <button
                      className='mt-10 rounded py-1 px-2 bg-blue-300 text-blue-700
                        hover:bg-blue-700 hover:text-blue-300 transition duration-100'

                      onClick={() => setShowModal(null)}
                    >cancel</button>
                    <button
                      className='mt-10 rounded py-1 px-2 bg-red-300 text-red-700
                        hover:bg-red-700 hover:text-red-300 transition duration-100'

                      onClick={deleteUserFromDashboard}
                    >delete</button>
                  </div>
                </div>
              </div>
          }
        </Modal>
      }

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
              >X</div>
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
    </div>
  )
}
