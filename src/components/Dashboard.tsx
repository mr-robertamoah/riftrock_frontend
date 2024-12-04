import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, Mail, Contact, Info, Server, PanelTopDashed, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import RiftRockLogo from './RiftRockLogo';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUser } from '../composables/useGetUser';
import { addUser } from '../redux/slices/auth';
import { addServices, addUsers, addUser as addDashboardUser, addService, updateUser, deleteUser, addContacts, deleteContact, updateContact, addDetails, updateDetail, deleteService } from '../redux/slices/dashboard';
import useDates from '../composables/useDates';
import Modal from './Modal';
import * as Icons from 'lucide-react';

export default function Dashboard() {
  const [fullSideBar, setFullSideBar] = useState(false)
  const [activeSection, setActiveSection] = useState('Services')
  const [showModal, setShowModal] = useState<string | null>(null)
  const navigator = useNavigate()
  const user = useSelector((state) => state.auth.value)
  const dashboardData = useSelector((state) => state.dashboard.value)
  const { getUser } = useGetUser()
  const dispatch = useDispatch()
  const imageRef = useRef(null)
  const imgRef = useRef(null)
  const [imgSrc, setImgSrc] = useState()
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
  const emptyDetailData = {
    key: '', 
    info: '', 
    value: {},
  }
  const emptyContactData = {
    email: '', name: '', message: '',
  }
  const emptyPasswordData = {
    password: '', 
    passwordConfirmation: '',
  }
  const emptyUserData = {
    firstName: '', lastName: '',
    otherNames: '',
  }
  const  [loading, setLoading] = useState<boolean>(false);
  const  [createServiceData, setCreateServiceData] = useState<{
    file: File|null, title: string, description: string, id?: number|null,
    details: string, icon: string, fileDescription: string,
    serviceFiles?: Array<{id: number, fileId: string, serviceId: string, file: {id: number, url: string, description: string, name: string}}> 
  }>(emptyCreateServiceData);
  const  [createUserData, setCreateUserData] = useState<{
    email: string, firstName: string, lastName: string, id?: number|null,
    otherNames: string, password: string, passwordConfirmation: string
  }>(emptyCreateUserData);
  const  [createContactData, setCreateContactData] = useState<{
    email: string, name: string, message: string, id?: number
  } | null>(emptyContactData);
  const  [detailData, setDetailData] = useState<{
    key: string, 
    info?: string, 
    value: { message?: string, gold?: string, black?: string, tagline?: string }, 
    id?: number
  } | null>(emptyDetailData);
  const  [passwordData, setPasswordData] = useState<{
    password: string, 
    passwordConfirmation: string,
  }>(emptyPasswordData);
  const  [userData, setUserData] = useState<{
    firstName: string, lastName: string,
    otherNames: string,
  }>(emptyUserData);
  const [pages, setPages] = useState({
    'Services': {next: 0, current: 0, previous: 0},
    'Emails': {next: 0, current: 0, previous: 0},
    'Contacts': {next: 0, current: 0, previous: 0},
    'Users': {next: 0, current: 0, previous: 0},
    'Details': {next: 0, current: 0, previous: 0},
  })
  const sections = [
    {name: 'Users', icon: User},
    {name: 'Details', icon: Info},
    {name: 'Services', icon: Server},
    {name: 'Contacts', icon: Contact},
    {name: 'Emails', icon: Mail},
  ]
  const emptyAlert = {
    message: '',
    type: '',
  }
  const  [alert, setAlert] = useState<{message: string, type: string}>(emptyAlert);
  type itemType = 'Users' | 'Details' | 'Services' | 'Contacts' | 'Emails'
  type modalActionsType = 'Create_Users' | 'Create_Details' | 'Create_Services' | 
    'Create_Contacts' | 'Create_Emails'

  useEffect(() => {
    clickedSection()
    if (user) return

    callable()
  }, [])

  useEffect(() => {
    resetUserData()
  }, [user])

  useEffect(() => {
    if (imgSrc && imgRef.current) {
      imgRef.current.src = imgSrc;
    }
  }, [imgSrc, imgRef.current]);

  async function callable() {
    const u = await getUser(user)

    if (!u) goHome()

    dispatch(addUser(u))
  }

  function createDashboardItem() {
    setShowModal(`Create_${activeSection}`)
    if (activeSection == 'Services')
      clearCreateServiceData()
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

  function showSuccessAlert(message: string) {
    setAlert({
      message,
      type: 'Success'
    })
  }

  function showFailureAlert(message: string) {
    setAlert({
      message,
      type: 'Failure'
    })
  }

  function clearAlert() {
    if (alert?.message?.length)
      setAlert(emptyAlert)
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
    
    if (section == 'Contacts' && !dashboardData.contacts.length) {
      initiatePageField('Contacts')

      getContacts()
    }
    
    if (section == 'Users' && !dashboardData.users.length) {
      initiatePageField('Users')

      getUsers()
    }
    
    if (section == 'Details' && !dashboardData.details.length)
      getDetails()
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

  async function getContacts() {
    if (!pages.Contacts.current)
      return

    axios.get(`/contacts?page${pages.Contacts.current}`)
    .then((res) => {
      console.log(res);
      setPagesUsingMeta(res.data.meta, 'Contacts')

      dispatch(addContacts(res.data.data))
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

  async function getDetails() {
    if (dashboardData.details.length) return
    
    axios.get(`/details`)
    .then((res) => {
      console.log(res);

      dispatch(addDetails(res.data))
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

  async function createUserFromDashboard(event) {
    event.preventDefault()
    
    if (showModal == 'Edit_User')
      return updateUserFromDashboard()

    if (!createUserData.email) {
      return showFailureAlert('Email is required.')
    }
    
    if (!createUserData.password) {
      return showFailureAlert('Password is required.')
    }
    
    if (createUserData.password !== createUserData.passwordConfirmation) {
      return showFailureAlert('Password confirmation has to match the password.')
    }

    setLoading(true)

    axios.post('/users', {
      ...createUserData
    })
    .then((res) => {
      console.log(res);
      dispatch(addDashboardUser(res.data))
      setShowModal(null)
      clearCreateUserData()
    })
    .catch((err) => {
      console.log(err);
      showFailureAlert(err.message ?? 'Something unfortunate happened. Try again shortly.')
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
      return showFailureAlert('No new information was provided.')
    }
    
    if (
      createUserData.password &&
      createUserData.password !== createUserData.passwordConfirmation
    ) {
      return showFailureAlert('Password confirmation has to match the password.')
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
      clearCreateUserData()
    })
    .catch((err) => {
      console.log(err);
      showFailureAlert(err.message ?? 'Something unfortunate happened. Try again shortly.')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  async function updateAccountInformation(event) {
    event.preventDefault()

    if (
      userData.firstName == user.firstName &&
      userData.lastName == user.lastName &&
      userData.otherNames == user.otherNames
    ) {
      return showFailureAlert('No new information was provided.')
    }

    setLoading(true)

    axios.patch(`/users`, {
      ...userData
    })
    .then((res) => {
      console.log(res);
      dispatch(addUser(res.data))
      resetUserData()
    })
    .catch((err) => {
      console.log(err);
      showFailureAlert(err.message ?? 'Something unfortunate happened. Try again shortly.')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  async function updateAccountPassword(event) {
    event.preventDefault()

    if (
      !passwordData.password
    ) {
      return showFailureAlert('Password is required.')
    }
    
    if (
      passwordData.password &&
      passwordData.password !== passwordData.passwordConfirmation
    ) {
      return showFailureAlert('Password confirmation has to match the password.')
    }

    setLoading(true)

    axios.patch(`/users/password`, {
      ...passwordData
    })
    .then((res) => {
      console.log(res);
      clearPasswordData()
    })
    .catch((err) => {
      console.log(err);
      showFailureAlert(err.message ?? 'Something unfortunate happened. Try again shortly.')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  async function deleteContactFromDashboard(event) {
    event.preventDefault()
    if (!createContactData) return

    setLoading(true)

    axios.delete(`/contacts/${createContactData.id}`)
    .then((res) => {
      console.log(res);
      dispatch(deleteContact(createContactData))
      setShowModal(null)
    })
    .catch((err) => {
      console.log(err);
      showFailureAlert(err.message ?? 'Something unfortunate happened. Try again shortly.')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  async function markContactFromDashboard(event) {
    event.preventDefault()
    if (!createContactData) return

    setLoading(true)

    axios.patch(`/contacts/${createContactData.id}`)
    .then((res) => {
      console.log(res);
      dispatch(updateContact(res.data))
      setShowModal(null)
    })
    .catch((err) => {
      console.log(err);
      showFailureAlert(err.message ?? 'Something unfortunate happened. Try again shortly.')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  async function updateDetailFromDashboard(event) {
    event.preventDefault()

    if (!detailData) return

    const detail = dashboardData.details.find((u) => u.id == detailData.id)
    if (
      (detail.value.message && detail.value.message == detailData.value.message) &&
      (detail.value.gold && detail.value.gold == detailData.value.gold) &&
      (detail.value.tagline && detail.value.tagline == detailData.value.tagline) &&
      (detail.value.black && detail.value.black == detailData.value.black)
    ) {
      return showFailureAlert('No new information was provided.')
    }

    setLoading(true)

    axios.patch(`/details/${detail.id}`, {
      value: JSON.stringify(detailData.value)
    })
    .then((res) => {
      console.log(res);
      dispatch(updateDetail(res.data))
      setShowModal(null)
      clearDetailData()
    })
    .catch((err) => {
      console.log(err);
      showFailureAlert(err.message ?? 'Something unfortunate happened. Try again shortly.')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  async function deleteServiceFromDashboard() {
    if (!createServiceData) return

    setLoading(true)

    axios.delete(`/services/${createServiceData.id}`)
    .then((res) => {
      console.log(res);
      dispatch(deleteService(createServiceData))
      setShowModal(null)
    })
    .catch((err) => {
      console.log(err);
      showFailureAlert(err.message ?? 'Something unfortunate happened. Try again shortly.')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  function clearCreateUserData() {
    setCreateUserData(emptyCreateUserData)
  }

  function clearCreateServiceData() {
    setCreateServiceData(emptyCreateServiceData)
  }

  function clearDetailData() {
    setDetailData(emptyDetailData)
  }

  function clearUserData() {
    setUserData(emptyUserData)
  }

  function clearContactData() {
    setCreateContactData(emptyContactData)
  }

  function clearPasswordData() {
    setPasswordData(emptyPasswordData)
  }

  function resetUserData() {
    if (!user) return
    setUserData({
      firstName: user.firstName,
      lastName: user.lastName,
      otherNames: user.otherNames
    })
  }

  async function createServiceFromDashboard(event) {
    event.preventDefault()

    if (!createServiceData.title) {
      return showFailureAlert('Title is required.')
    }
    
    if (!createServiceData.description) {
      return showFailureAlert('Description is required.')
    }

    const formData = new FormData()
    formData.append('title', createServiceData.title)
    formData.append('description', createServiceData.description)
    formData.append('details', createServiceData.details)
    formData.append('icon', createServiceData.icon)
    if (createServiceData.file) {
      formData.append('file', createServiceData.file)
      formData.append('fileDescription', createServiceData.fileDescription)
    }

    setLoading(true)

    axios.post('/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => {
      console.log(res);
      dispatch(addService(res.data))
      clearCreateServiceData()
      setShowModal(null)
    })
    .catch((err) => {
      console.log(err);
      showFailureAlert(err.message ?? 'Something unfortunate happened. Try again shortly.')
    })
    .finally(() => {
      setLoading(false)
    })
  }

  async function makeUserAdmin(u) {
    setLoading(true)

    axios.patch('/users/make-admin', {
      userId: u.id
    })
    .then((res) => {
      console.log(res);
      dispatch(updateUser(res.data))
    })
    .catch((err) => {
      console.log(err);
      showFailureAlert(err.message ?? 'Something unfortunate happened. Try again shortly.')
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

  function changeCreateUserData(key: string, value: string) {
    clearAlert()
    setCreateUserData({
      ...createUserData,
      [key]: value,
    })
  }

  function changeCreateServiceData(key: string, value: string) {
    clearAlert()
    setCreateServiceData({
      ...createServiceData,
      [key]: value,
    })
  }

  function changeUserData(key: string, value: string) {
    clearAlert()
    setUserData({
      ...userData,
      [key]: value,
    })
  }

  function changePasswordData(key: 'password' | 'passwordConfirmation', value: string) {
    clearAlert()
    setPasswordData({
      ...passwordData,
      [key]: value,
    })
  }

  function changeDetailData(key: string, value: string) {
    clearAlert()
    if (!detailData) return
    setDetailData({
      id: detailData.id,
      key: detailData.key,
      info: detailData.info,
      value: {
        ...detailData?.value,
        [key]: value,
      }
    })
  }

  function updateCreateUserData(user) {
    const data = {...user}
    delete data.createdAt
    delete data.updatedAt
    setCreateUserData(data)
  }

  function updateCreateServiceData(service) {
    const data = {...service}
    delete data.createdAt
    delete data.updatedAt
    setCreateServiceData(data)
  }

  function updateDetailData(detail) {
    const data = {...detail}
    delete data.createdAt
    delete data.updatedAt
    setDetailData(data)
  }

  function updateCreateContactData(contact) {
    const data = {...contact}
    delete data.createdAt
    delete data.updatedAt
    setCreateContactData(data)
  }

  function chooseImage() {
    imageRef.current.value = ''
    imageRef.current.click()
  }

  function removeFile() {
    imageRef.current.value = ''
    setCreateServiceData({
      ...createServiceData,
      file: null
    })
    setImgSrc(null)
  }

  async function fileSelected() {
    if (!activeSection.includes('Service')) return
    const file = imageRef.current?.files?.[0]
    readFile(file)
    await setCreateServiceData({
      ...createServiceData,
      file
    })

  }

  function readFile(file) {
    if (!file) return

    const reader = new FileReader()
    
    reader.onload = (async (event) => {
      setImgSrc(event.target.result)
    })

    reader.readAsDataURL(file)
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
        {/* nav section */}
        <div className={`${fullSideBar ? 'min-w-[200px]' : 'w-fit'} p-2 bg-slate-600 min-h-screen`}>
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
            <div className={`${'Account' == activeSection ? 
              'font-bold' : 
              'text-slate-300 '} 
              mt-4 hover:text-slate-100 cursor-pointer items-center gap-2 w-full
              `}
              onClick={() => {
                resetUserData()
                clickedSection('Account')
              }}
            >
              {
                fullSideBar ?
                  <div 
                    title={'your account'}
                    className={`grid ${fullSideBar ? ' grid-cols-2 px-4' : ' grid-cols-1 px-auto'}`}>
                    <div className={`${fullSideBar ? 'pl-2' : 'mx-auto w-fit'}`}>U</div>
                    <div className='text-ellipsis w-full overflow-hidden'>{user.email}</div>
                  </div> :
                  <div
                    title={'your account'}
                    className='text-center'
                  >U</div>
                }
            </div>

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
                      <div 
                        title={fullSideBar ? '' : section.name}
                        className={`grid ${fullSideBar ? ' grid-cols-2 px-4' : ' grid-cols-1 px-auto'}`}>
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
        {/* main section */}
        <div 
          className={`w-full relative px-2 pt-8 ${activeSection !== 'Account' && dashboardData[activeSection.toLowerCase()].length == 0 ?
          'flex justify-start gap-44 flex-col items-center': ''}`}>
          {
            user ?
            <div>
              {
                !['Contacts', 'Emails', 'Details', 'Account'].includes(activeSection) &&
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
                      dashboardData.services.map((service) => {
                        const IconComponent = Icons[service.icon] ?? Icons.HelpCircle

                        return <div key={service.id} 
                          className='rounded h-fit bg-slate-300 shadow-md shadow-yellow-700 text-slate-700 p-2
                            '>
                          <div className="w-12 h-12 bg-yellow-700 dark:bg-yellow-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                            <IconComponent className="w-6 h-6 dark:text-slate-900 text-slate-400" />
                          </div>
                          <div className='text-center font-bold'>{service.title}</div>
                          <div className='mt-3 mb-2 px-2'>{service.description}</div>
                          <div className='text-sm text-slate-500 text-right mb-4'>{formatDate(service.createdAt)}</div>
        
                          <div className='flex items-center justify-end gap-2'>
                            {
                              (service.details?.length > 0 || service.serviceFiles.length) &&
                                <div 
                                  className='bg-green-700 text-green-300 w-fit py-1 px-2 rounded cursor-pointer
                                    hover:bg-green-800 hover:text-green-200 transition-colors duration-100'
                                  onClick={() => {
                                    updateCreateServiceData(service)
                                    setShowModal('View_Service')
                                  }}
                                >view</div>
                              }
                            <div 
                              className='bg-blue-700 text-blue-300 w-fit py-1 px-2 rounded cursor-pointer
                                hover:bg-blue-800 hover:text-blue-200 transition-colors duration-100'
                              onClick={() => {
                                updateCreateServiceData(service)
                                setShowModal('Edit_Service')
                              }}
                            >edit</div>
                            <div 
                              className='bg-red-700 text-red-300 w-fit py-1 px-2 rounded cursor-pointer
                                hover:bg-red-800 hover:text-red-200 transition-colors duration-100'
                              onClick={() => {
                                updateCreateServiceData(service)
                                setShowModal('Delete_Service')
                              }}
                            >delete</div>
                          </div>
                        </div> 
                      })
                    }
        
                    {
                      dashboardData.services.length === 0 && <div className='col-span-3 text-center text-lg text-slate-700'
                      >No services available</div>
                    }
                  </div>
                </div>
              }
              {/* contacts */}
              {
                activeSection == 'Contacts' &&
                <div>
                  <div
                    className='p-6 gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                    {
                      dashboardData.contacts.map((contact) => (
                        <div key={contact.id} 
                          className={`rounded h-fit ${contact.seen ? 'bg-green-300' : 'bg-slate-300'} shadow-md shadow-yellow-700 text-slate-700 p-2
                            `}>
                          <div></div>
                          <div className='text-center font-bold'>{contact.name?.length ? contact.name : 'No name'}</div>
                          <div className='mt-3 mb-2 px-2'>{contact.message}</div>
                          <div className='text-sm text-slate-500 text-right mb-4'>{formatDate(contact.createdAt)}</div>
        
                          <div className='flex items-center justify-end gap-2'>
                            {
                              !contact.seen &&
                                <div 
                                  className='bg-green-700 text-green-300 w-fit py-1 px-2 rounded cursor-pointer
                                    hover:bg-green-800 hover:text-green-200 transition-colors duration-100'
                                  onClick={() => {
                                    updateCreateContactData(contact)
                                    setShowModal('Mark_Contact')
                                  }}
                                >mark as seen</div>
                              }
                            <div 
                              className='bg-red-700 text-red-300 w-fit py-1 px-2 rounded cursor-pointer
                                hover:bg-red-800 hover:text-red-200 transition-colors duration-100'
                              onClick={() => {
                                updateCreateContactData(contact)
                                setShowModal('Delete_Contact')
                              }}
                            >delete</div>
                          </div>
                        </div> 
                      ))
                    }
        
                    {
                      dashboardData.contacts.length === 0 && <div className='col-span-3 text-center text-lg text-slate-700'
                      >No contacts available</div>
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
                      dashboardData.users.map((u) => (
                        <div key={u.id} 
                          className='rounded h-fit bg-slate-300 shadow-md shadow-yellow-700 text-slate-700 p-2
                            '>
                          <div></div>
                          <div className='text-center font-bold'>{getUserName(u)}</div>
                          <div className='mt-3 mb-2 px-2'>{u.email}</div>
                          <div className='mt-3 mb-2 px-2 text-sm font-bold'>{u.role.toLowerCase().replace('_', ' ')}</div>
                          <div className='text-sm text-slate-500 text-right mb-4'>{formatDate(u.createdAt)}</div>
        
                          <div className='flex items-center justify-end gap-2'>
                            {
                              (user.role == 'SUPER_ADMIN' && u.role == 'USER') &&
                                <div 
                                  className='bg-green-700 text-green-300 w-fit py-1 px-2 rounded cursor-pointer
                                    hover:bg-green-800 hover:text-green-200 transition-colors duration-100'
                                  onClick={() => {
                                    makeUserAdmin(u)
                                  }}
                                >make admin</div>
                            }
                            <div 
                              className='bg-blue-700 text-blue-300 w-fit py-1 px-2 rounded cursor-pointer
                                hover:bg-blue-800 hover:text-blue-200 transition-colors duration-100'
                              onClick={() => {
                                updateCreateUserData(u)
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
                activeSection == 'Details' &&
                <div>
                  <div
                    className='p-6 gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                    {
                      dashboardData.details.map((detail) => (
                        <div key={detail.id} 
                          className='rounded h-fit bg-slate-300 shadow-md shadow-yellow-700 text-slate-800 p-2
                            '
                        >
                          <div className='text-center font-bold capitalize'>{detail.key?.toLowerCase()?.replace('_', ' ')}</div>
                          {
                            detail.value.tagline?.length > 0 &&
                              <div className='mt-3 mb-2 px-2'><div className='text-blue-700 text-sm font-bold'>Tagline</div>{detail.value.tagline}</div>
                          }
                          {
                            detail.value.message?.length > 0 &&
                              <div className='mt-3 mb-2 px-2'>{detail.value.message}</div>
                          }
                          {
                            detail.value.gold?.length > 0 &&
                              <div className='mt-3 mb-2 px-2'><div className='text-yellow-700 text-sm font-bold'>Gold</div>{detail.value.gold}</div>
                          }
                          {
                            detail.value.black?.length > 0 &&
                              <div className='mt-3 mb-2 px-2'><div className='text-slate-800 text-sm font-bold'>Black</div>{detail.value.black}</div>
                          }
                          {
                            detail.info?.length > 0 &&
                              <div className='mt-3 my-4 px-2 text-slate-600'><div className='text-black text-sm font-bold'>Note</div>{detail.info}</div>
                          }
                          <div className='text-sm text-slate-500 text-right mb-4'>{formatDate(detail.updatedAt)}</div>
        
                          <div className='flex items-center justify-end gap-2'>
                            <div 
                              className='bg-blue-700 text-blue-300 w-fit py-1 px-2 rounded cursor-pointer
                                hover:bg-blue-800 hover:text-blue-200 transition-colors duration-100'
                              onClick={() => {
                                updateDetailData(detail)
                                setShowModal('Edit_Detail')
                              }}
                            >edit</div>
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

              {/* Account */}
              {
                activeSection == 'Account' &&
                <div>
                  <div
                    className='p-6 gap-3 grid grid-cols-1'>
                    <div>
                      <div className='text-center font-bold mb-4'>Your Information</div>
                      <form 
                        onSubmit={updateAccountInformation}
                        className='rounded bg-slate-200 p-3'
                      >
                        <label htmlFor="firstName"
                          className='mb-2 font-bold dark:text-slate-800 text-slate-500'
                        >First Name</label>
                        <input type="firstName" name="firstName" id="firstName"
                          placeholder='Robert'
                          className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                          value={userData.firstName ?? ''}
                          onChange={(event) => changeUserData('firstName', event.target.value)}
                        />

                        <label htmlFor="lastName"
                          className='mb-2 font-bold dark:text-slate-800 text-slate-500'
                        >Last Name</label>
                        <input type="lastName" name="lastName" id="lastName"
                          placeholder='Amoah'
                          className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                          value={userData.lastName ?? ''}
                          onChange={(event) => changeUserData('lastName', event.target.value)}
                        />

                        <label htmlFor="otherNames"
                          className='mb-2 font-bold dark:text-slate-800 text-slate-500'
                        >Other Names</label>
                        <input type="otherNames" name="otherNames" id="otherNames"
                          placeholder='Paa'
                          className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                          value={userData.otherNames ?? ''}
                          onChange={(event) => changeUserData('otherNames', event.target.value)}
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

                    <div>
                      <div className='text-center font-bold mb-4'>Change Password</div>
                      <form 
                        onSubmit={updateAccountPassword}
                        className='rounded bg-slate-200 p-3'
                      >
                        <label htmlFor="password"
                          className='mb-2 font-bold dark:text-slate-800 text-slate-500 mt-5'
                        >Password *</label>
                        <input type="password" name="password" id="password"
                          placeholder='*************'
                          className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                          value={passwordData.password ?? ''}
                          onChange={(event) => changePasswordData('password', event.target.value)}
                        />

                        <label htmlFor="passwordConfirmation"
                          className='mb-2 font-bold dark:text-slate-800 text-slate-500 mt-5'
                        >Password Confirmation *</label>
                        <input type="password" name="passwordConfirmation" id="passwordConfirmation"
                          placeholder='*************'
                          className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                          value={passwordData.passwordConfirmation ?? ''}
                          onChange={(event) => changePasswordData('passwordConfirmation', event.target.value)}
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
                </div>
              }
              
              {
                activeSection !== 'Account' &&
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
              }
            </div> :
            <div className='w-full min-h-60 flex items-center justify-center text-red-300 font-bold'>Not Authorized</div>
          }
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
          
          {/* creating service */}
          {
            ['Create_Services', 'Edit_Service'].includes(showModal) &&
              <div className='py-2'>
                <div className='my-4 text-center font-bold text-slate-600'>{
                  showModal == 'Create_Services' ? 'Create a Service' : 'Edit Service Information'
                }</div>

                <form onSubmit={createServiceFromDashboard}>

                  <input name="title" id="title"
                    placeholder='title'
                    className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                    value={createServiceData.title ?? ''}
                    onChange={(event) => changeCreateServiceData('title', event.target.value)}
                  />
                  <div 
                    className='text-sm text-blue-600 mb-4'
                  >This is the title of the service. It is required.</div>

                  <textarea cols={3} name="description" id="description"
                    placeholder='description'
                    className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                    value={createServiceData.description ?? ''}
                    onChange={(event) => changeCreateServiceData('description', event.target.value)}
                  />
                  <div 
                    className='text-sm text-blue-600 -mt-1 mb-4'
                  >Give a short description to the service. It is required.</div>

                  <textarea cols={6} name="details" id="details"
                    placeholder='details'
                    className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                    value={createServiceData.details ?? ''}
                    onChange={(event) => changeCreateServiceData('details', event.target.value)}
                  />
                  <div 
                    className='text-sm text-blue-600 -mt-1 mb-4'
                  >You can give a more detailed description of the service. It is optional.</div>

                  <div 
                    className={`rounded transition-colors duration-100
                      w-fit py-1 px-2 cursor-pointer
                      ${createServiceData.file ? 
                        'text-blue-800 hover:text-blue-300 bg-blue-500 hover:bg-blue-800' : 
                        'text-green-800 hover:text-green-300 bg-green-500 hover:bg-green-800'}`}
                    onClick={chooseImage}
                  >{createServiceData.file ? 'change file' : 'add file'}</div>
                  <div 
                    className='text-sm text-blue-600 mb-4'
                  >Add an image to show when someone chooses to show details of a service. It is optional.</div>

                  {
                    imgSrc && (
                      <div className='rounded p-2 mx-auto bg-slate-700 flex justify-center items-center w-fit relative'>
                        <img 
                          className='w-28'
                          ref={imgRef}
                          id='service_file'
                          alt="selected file" />
                        <div 
                          className='absolute rounded-full p-1 -top-2 -right-2 w-5 h-5 bg-slate-500 
                            text-slate-100 cursor-pointer flex justify-center items-center'
                          onClick={removeFile}
                        >&times;</div>
                      </div>
                    )
                  }
                  {
                    createServiceData.file &&
                      <input name="fileDescription" id="fileDescription"
                        placeholder='a description of the file'
                        className='w-full p-2 rounded mt-2 bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                        value={createServiceData.fileDescription ?? ''}
                        onChange={(event) => changeCreateServiceData('fileDescription', event.target.value)}
                      />
                  }
                  <input 
                    hidden 
                    type="file" 
                    accept='image/*'
                    ref={imageRef} 
                    onChange={fileSelected}
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
          
          {/* view service */}
          {
            'View_Service' == showModal &&
              <div className='py-2'>
                <div className='my-4 text-center font-bold text-slate-600'
                >{createServiceData.title}</div>

                <div className=''>
                  <div className='text-slate-700 text-center'>Description</div>
                  <div>{createServiceData.description}</div>
                  {
                    createServiceData.serviceFiles?.length &&
                    <div>
                      <div className='text-slate-700 text-center mt-4'>Attached file</div>
                      <div className='flex justify-center w-fit rounded p-2 mx-auto bg-slate-800'>
                        <img
                          src={createServiceData.serviceFiles[0].file.url}
                          alt={createServiceData.title}
                          className='w-[60%] rounded'
                        />
                      </div>
                    </div>
                  }

                  {
                    !!createServiceData.details?.length &&
                    <div>
                      <div className='text-slate-700 text-center mt-4'>Details</div>
                      <div className='mt-3 w-[90%] mx-auto text-justify'>{createServiceData.details}</div>
                    </div>
                  }
                </div>
              </div>
          }
          
          {/* updating details */}
          {
            ['Edit_Detail'].includes(showModal) &&
              <div className='py-2'>
                <div className='my-4 text-center font-bold text-slate-600'>Edit Detail Information</div>
                {
                  !!detailData?.info?.length &&
                    <div className='mt-3 my-4 px-2 text-slate-600'><div className='text-black text-sm font-bold'>Note</div>{detailData.info}</div>
                }
                <form onSubmit={updateDetailFromDashboard}>

                  <label htmlFor="key"
                    className='mb-2 font-bold dark:text-slate-800 text-slate-300'
                  >Key</label>
                  <input type="text" name="key" id="key" disabled
                    className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                    value={detailData?.key?.toLowerCase().replace('_', ' ') ?? ''}
                  />

                  {
                    !!detailData?.value?.tagline?.length &&
                      <div>
                        <label htmlFor="tagline"
                          className='mb-2 font-bold dark:text-slate-800 text-slate-300'
                        >Tagline</label>
                        <textarea name="tagline" id="tagline"
                          placeholder='your tagline message'
                          className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                          value={detailData?.value.tagline ?? ''}
                          onChange={(event) => changeDetailData('tagline', event.target.value)}
                        />
                      </div>
                  }

                  {
                    !!detailData?.value?.message?.length &&
                      <div>
                        <label htmlFor="message"
                          className='mb-2 font-bold dark:text-slate-800 text-slate-300'
                        >Message</label>
                        <textarea name="message" id="message"
                          placeholder='your message'
                          className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                          value={detailData?.value.message ?? ''}
                          onChange={(event) => changeDetailData('message', event.target.value)}
                        />
                      </div>
                  }

                  {
                    !!detailData?.value?.gold?.length &&
                      <div>
                        <label htmlFor="gold"
                          className='mb-2 font-bold dark:text-slate-800 text-slate-300'
                        >Gold Message</label>
                        <textarea name="gold" id="gold"
                          placeholder='your gold message'
                          className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                          value={detailData?.value.gold ?? ''}
                          onChange={(event) => changeDetailData('gold', event.target.value)}
                        />
                      </div>
                  }

                  {
                    !!detailData?.value?.black?.length &&
                      <div>
                        <label htmlFor="black"
                          className='mb-2 font-bold dark:text-slate-800 text-slate-300'
                        >Black Message</label>
                        <textarea name="black" id="black"
                          placeholder='your black message'
                          className='w-full p-2 rounded bg-slate-600 placeholder-slate-400 text-slate-100 focus:bg-slate-600 mb-4 focus:ring-4 focus:ring-offset-indigo-700 focus:outline-none'
                          value={detailData?.value.black ?? ''}
                          onChange={(event) => changeDetailData('black', event.target.value)}
                        />
                      </div>
                  }

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
          
          {/* deleting contact */}
          {
            'Delete_Contact' == showModal &&
              <div className='py-2'>
                <div className='my-4 text-center font-bold text-slate-600'>Deleting Contact</div>

                <div >
                  <div>Are you sure you want to the contact?</div>
                  <div className='w-full flex justify-center items-center gap-4'>
                    <button
                      className='mt-10 rounded py-1 px-2 bg-blue-300 text-blue-700
                        hover:bg-blue-700 hover:text-blue-300 transition duration-100'

                      onClick={() => setShowModal(null)}
                    >cancel</button>
                    <button
                      className='mt-10 rounded py-1 px-2 bg-red-300 text-red-700
                        hover:bg-red-700 hover:text-red-300 transition duration-100'

                      onClick={deleteContactFromDashboard}
                    >delete</button>
                  </div>
                </div>
              </div>
          }
          
          {/* deleting service */}
          {
            'Delete_Service' == showModal &&
              <div className='py-2'>
                <div className='my-4 text-center font-bold text-slate-600'>Deleting Service</div>

                <div >
                  <div>Are you sure you want to the service?</div>
                  <div className='w-full flex justify-center items-center gap-4'>
                    <button
                      className='mt-10 rounded py-1 px-2 bg-blue-300 text-blue-700
                        hover:bg-blue-700 hover:text-blue-300 transition duration-100'

                      onClick={() => setShowModal(null)}
                    >cancel</button>
                    <button
                      className='mt-10 rounded py-1 px-2 bg-red-300 text-red-700
                        hover:bg-red-700 hover:text-red-300 transition duration-100'

                      onClick={deleteServiceFromDashboard}
                    >delete</button>
                  </div>
                </div>
              </div>
          }
          
          {/* marking contact */}
          {
            'Mark_Contact' == showModal &&
              <div className='py-2'>
                <div className='my-4 text-center font-bold text-slate-600'>Marking Contact</div>

                <div >
                  <div>You are about to mark the contact as seen?</div>
                  <div className='w-full flex justify-center items-center gap-4'>
                    <button
                      className='mt-10 rounded py-1 px-2 bg-blue-300 text-blue-700
                        hover:bg-blue-700 hover:text-blue-300 transition duration-100'

                      onClick={() => setShowModal(null)}
                    >cancel</button>
                    <button
                      className='mt-10 rounded py-1 px-2 bg-green-300 text-green-700
                        hover:bg-green-700 hover:text-green-300 transition duration-100'

                      onClick={markContactFromDashboard}
                    >continue</button>
                  </div>
                </div>
              </div>
          }
        </Modal>
      }

      {/* alerting */}
      {
        (['Success', 'Failure'].includes(alert?.type) && alert?.message.length) ?
        <div className='fixed top-3 left-0 right-0 transition-all duration-200 z-50'>
          <div 
            className={`${alert.type == 'Success' ? 
                'bg-green-700 text-green-200' : 
                'bg-red-700 text-red-200'
              } rounded p-2 py-4 w-[90%] md:w-[70%] text-center
              mx-auto relative transition-all duration-200`}
          >
            {alert.message}

            <div 
              className={`absolute rounded-full w-6 h-6 p-2 flex
                justify-center items-center -top-2 -right-2 font-bold cursor-pointer ${alert.type == 'Success' ? 
                'text-green-700 bg-green-200' : 
                'text-red-700 bg-red-200'
              }`}
              onClick={clearAlert}
            >&times;</div>
          </div>
        </div> :
        <></>
      }

      {
        loading ?
          <div className='fixed top-3 left-0 right-0 transition-all duration-200 z-50'>
            <div 
              className='bg-green-700 text-green-200 rounded p-2 py-4 w-[90%] md:w-[70%] text-center
                mx-auto relative transition-all duration-200'
            >
              loading
            </div>
          </div> :
          <></>
      }
    </div>
  )
}
