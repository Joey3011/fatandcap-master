import 'bootstrap/dist/css/bootstrap.css'
import React from 'react'
import logo from '../assets/images/eco-logo-removebg.png'
import Avatar from '@mui/material/Avatar'
import { Container, Row, Col, Form } from 'reactstrap';
import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../features/auth/authSlice'
import { useVerifyCodeMutation } from '../features/auth/authApiSlice'
import { NotificationManager, NotificationContainer } from 'react-notifications'
import useTitle from '../hooks/useTitle'
import Spinner from '../components/Spinner/Spinner'
import { Input } from '@mui/material';
import swal from 'sweetalert';

export const PhoneLogin = () => {
    useTitle('Request Password')

    const nodeRef = React.createRef(null);
    const userRef = useRef()
    const [code, setCode] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const isSellerLoggedIn = JSON.parse(localStorage.getItem("s_flog"))
  
    const isCustomerLoggedIn = JSON.parse(localStorage.getItem("c_flog"))
  
    useEffect(()=>{
        if(isSellerLoggedIn){
            navigate('/fatandcap/auth/seller')  
        }else if(isCustomerLoggedIn){
            navigate('/fatandcap/home') 
        }
    },[isSellerLoggedIn, isCustomerLoggedIn, navigate])


    const [loginWithSMS, { isLoading } ] =  useVerifyCodeMutation()

    const handleUserCode = (e) => setCode(e.target.value)

    const onSubmitCode = async (e) => {
        e.preventDefault()
        try{
                const { accessToken } = await loginWithSMS({ code }).unwrap()
                dispatch(setCredentials({ accessToken }))
                setCode('')
                navigate('/checker')
            } catch (err) {
                if (!err.status) {
                    swal({
                        title: "Server error!",
                        text: "No Server Response",
                        icon: "error",
                        button: "Ok",
                      });
                } else {
                    swal({
                        title: "Notification",
                        text: `${err.data?.message}`,
                        icon: "error",
                        button: "Ok",
                      });
                }
            }
    }


    if (isLoading) return <div><Spinner /></div>
  return (
    <Container fluid className='public'>
        <Row>
        <Col lg='6' md='6'>
        <div className="text-center m-auto">
                    <Avatar alt="FatAndCap" src={logo} sx={{ width: 200, height: 200, marginLeft: 'auto', marginRight: 'auto', marginTop: '8.5vh' }} variant="square" />
                     <div className='public-title'>
                        <h1 className='login-title mt-3 mb-5'>FatAndCap Online Shop</h1>
                        <h4 className='sub-title'>Your One-Stop-Online-Shop</h4>
                    </div>
                </div>
            </Col>
            <Col lg='6' md='6'>
                    {/* SMS OTP */}
                <Form className="formRequestPassword" onSubmit={onSubmitCode} >
                    <h5 className='form-title text-center'>Submit Code</h5>
                    <Col className='mb-3'>
                        <label className='form-label' htmlFor="password">OTP Code:</label>
                        <Input 
                            className='form-control'
                            id="code"
                            value={code}
                            ref={userRef}
                            onChange={handleUserCode}
                            type='text' 
                            placeholder='Enter Code' 
                            required/>
                    </Col>
                    <Col className='mb-2'>
                        <button className='public-btn btn btn-md w-100'>Submit Code</button>
                    </Col>
                    <Col className='d-flex justify-content-between mb-2'>
                        <Link style={{fontSize: '10px', color: 'darkgoldenrod'}} className='ms-1 fw-bold' to="/Login">Sign In</Link>
                    </Col>  
                </Form>
            </Col>
        </Row>
    </Container>
  )
}


export default PhoneLogin
