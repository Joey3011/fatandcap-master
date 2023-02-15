import React, { useRef, useState, useEffect } from 'react'
import { Container, Row, Col, Form } from 'reactstrap'
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../../features/auth/authSlice'
import { NotificationManager } from 'react-notifications'
import { useUserUpdatePasswordMutation } from '../customerApiSlice'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import OrderList from './OrderList'
import Spinner from '../../../components/Spinner/Spinner'
import AddProduct from './AdminAddProduct'
import useAuth from '../../../hooks/useAuth'
import axios from 'axios';
import 'react-tabs/style/react-tabs.css';
import '../../form.css'
const PWD_REGEX = /^[A-z0-9!@#$%]{6,12}$/

export const Setting = () => {

    let notif 
    const { _id } = useAuth()
    const nodeRef = React.createRef(null);
    const userRef = useRef()
    const errRef = useRef()
    const token = useSelector(selectCurrentToken)
    const [getOldPassword, setOldPassword] = useState('')
    const [getNewPassword, setNewPassword] = useState('')
    const [getReTypePassword, setReTypePassword] = useState('')
    const [fileProfile, setProfileImage] = useState([])
    const [fileBackgroundImage, setBackgroundImage] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [updatePassword, { isLoading }] =  useUserUpdatePasswordMutation()

    const handleProfileImage = (e) => setProfileImage(e.target.files[0])
    const handleBackgroundImage = (e) => setBackgroundImage(e.target.files[0])
    const handleOldPassword = (e) => setOldPassword(e.target.value)
    const handleNewPassword = (e) => setNewPassword(e.target.value)
    const handleReTypePassword = (e) => setReTypePassword(e.target.value)

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(getReTypePassword))
    }, [getReTypePassword])


    const handleSubmitPassword = async (e) => {
        e.preventDefault()
        await updatePassword({_id, getOldPassword, getNewPassword, getReTypePassword}).unwrap().then(payload => {
            notif = NotificationManager.success('You have successfully update your password!', 'Successful!', 3000);
            setOldPassword('')
            setNewPassword('')
            setReTypePassword('')
            window.location.reload(false)
        }).catch(err => {
            if(err.status === 400){
                notif = NotificationManager.error('All field required...', 'Error!');
            }else if(err.status === 422){
                notif = NotificationManager.error('Password does not match!', 'Error!');
            }else if(err.status === 401){
                notif = NotificationManager.error('Incorrect password...', 'Error!');
            }else if(err.status === 404){
                notif = NotificationManager.error('Unable to validate submitted information...', 'Error!');
            }else{
                notif = NotificationManager.error('An error occured while submitting request to server...', 'Error!');
            }
        })
        errRef.current.focus();
    }

    const onHandleProfile = async(e) => {
        e.preventDefault()
        const data = new FormData()
        data.append("file",fileProfile)
        data.append("_id",_id)

        await axios.patch("https://projectapi-fybs.onrender.com/api/auth/profile", data,
        {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-type": "multipart/form-data",
                },                    
            }).then(res => {
                notif = NotificationManager.success('Profile uploaded successfully!', 'Successful!', 2000);
                window.location.reload(false);
            }).catch((err)=>{
                notif = NotificationManager.error('Error occured while uploading image!', 'Error!');
            })
    }

    const onHandleBackgroundImage = async(e) => {
        e.preventDefault()
        const data = new FormData()
        data.append("file",fileBackgroundImage)
        data.append("_id",_id)

        await axios.patch("https://projectapi-fybs.onrender.com/api/auth/background", data,
        {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-type": "multipart/form-data",
                },                    
            }).then(res => {
                notif = NotificationManager.success('Background Image uploaded successfully!', 'Successful!', 3000);
                window.location.reload(false);
            }).catch((err)=>{
                notif = NotificationManager.error('Error occured while uploading image!', 'Error!');
            })
    }

    const validPwdClass = !validPassword ? 'invalidPassword' : ''
    if (isLoading) return <div><Spinner /></div>
  return (
        <>
        <Container>
            <Row>
                <Col>
                    <div ref={nodeRef}>
                        {notif}
                    </div>
                </Col>
                <Tabs style={{zIndex: '1'}}>
                    <TabList>
                        <Tab style={{fontSize: '14px', color: 'royalblue', fontWeight: 'bold'}}>Add Product</Tab>
                        <Tab style={{fontSize: '14px', color: 'royalblue', fontWeight: 'bold'}}>Manage Order</Tab>
                        <Tab style={{fontSize: '14px', color: 'royalblue', fontWeight: 'bold'}}>Change Password</Tab>
                        <Tab style={{fontSize: '14px', color: 'royalblue', fontWeight: 'bold'}}>Upload Profile Picture</Tab>
                        <Tab style={{fontSize: '14px', color: 'royalblue', fontWeight: 'bold'}}>Upload Background Picture</Tab>
                    </TabList>
                    <TabPanel>
                         <AddProduct />
                    </TabPanel>
                    <TabPanel>
                        <OrderList />
                    </TabPanel>
                    <TabPanel>
                        <Form className='formUpdate mt-5 border m-auto' onSubmit={handleSubmitPassword}>
                            <Col>
                                <span className='text-center'><h3 className='mb-3'>Update Password</h3></span>
                            </Col>
                            <Col>
                            <label style={{fontSize: "12px"}} className='form-label' htmlFor="productQuatity">Old Password:</label>
                                <input
                                    className='form-control'
                                    type='password'
                                    id='oldPassword' 
                                    ref={userRef}
                                    value={getOldPassword}
                                    onChange={handleOldPassword}
                                    placeholder='Old Password'
                                    required
                                />
                            </Col>
                            <Col>
                            <label style={{fontSize: "12px"}} className='form-label' htmlFor="productQuatity">New Password:</label>
                                <input
                                    className='form-control'
                                    type='password'
                                    id='newPassword' 
                                    value={getNewPassword}
                                    onChange={handleNewPassword}
                                    placeholder='New Password'
                                    required
                                />
                            </Col>
                            <Col className='mb-3'>
                            <label style={{fontSize: "12px"}} className='form-label' htmlFor="productQuatity">Re-Type Password:</label>
                                <input
                                    className={`${validPwdClass} form-control`}
                                    type='password'
                                    id='rePassword' 
                                    value={getReTypePassword}
                                    onChange={handleReTypePassword}
                                    placeholder='Re-Type Password'
                                    required
                                />
                            </Col>
                            <Col className='d-flex justify-content-end mb-1'>
                                <button className='btn btn-success btn-sm'>
                                    Submit
                                </button>
                            </Col>
                        </Form>
                    </TabPanel>

                    <TabPanel>
                        <Form className='formUpload mt-5 border m-auto' onSubmit={onHandleProfile}>
                            <Col>
                                <span className='text-center'><h5 className='mb-3'>Upload Image</h5></span>
                            </Col>
                            <Col className='mb-3'>
                                <input
                                    id="file"
                                    className='custom-file-input' 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleProfileImage} 
                                />
                            </Col>
                            <Col className='d-flex justify-content-end mb-1'>
                                <button className='btn btn-success btn-sm'>
                                    Upload
                                </button>
                            </Col>
                        </Form>  
                    </TabPanel>
                    <TabPanel>
                        <Form className='formBGUpload mt-5 mb-5 border m-auto' onSubmit={onHandleBackgroundImage}>
                            <Col>
                                <span className='text-center'><h5 className='mb-3'>Upload Background Image</h5></span>
                            </Col>
                            <Col className='mb-3'>
                                <input
                                    id="file"
                                    className='custom-file-input form-control form-control-sn' 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleBackgroundImage}
                                />
                            </Col>
                            <Col className='d-flex justify-content-end mb-1'>
                                <button className='btn btn-success btn-sm'>
                                    Upload
                                </button>
                            </Col>
                        </Form>  
                    </TabPanel>
                </Tabs>
            </Row>
        </Container>
    </>
  )
}

export default Setting
