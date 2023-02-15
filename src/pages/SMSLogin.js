
import 'bootstrap/dist/css/bootstrap.css'
import React from 'react'
import logo from '../assets/images/store.png';
import Avatar from '@mui/material/Avatar'
import { Container, Row, Col, Form } from 'reactstrap';
import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useRequestsmsOTPMutation } from '../features/auth/authApiSlice'
import { setPublicCredentials, selectPublicToken } from '../features/auth/authSlice'
import { useAccessTokenMutation } from '../features/auth/authApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import useTitle from '../hooks/useTitle'
import { TextField } from '@material-ui/core';
import swal from 'sweetalert';
// import GoogleLogin from './GoogleSignIn'

export const SMSLogin = () => {
    useTitle('Login')
    // let notif 
    const navigate = useNavigate()
  
    const dispatch = useDispatch()
    const ref = useRef(null);
    const [phone, setPhone] = useState('')

    const isSellerLoggedIn = JSON.parse(localStorage.getItem("s_flog"))
    
    const isCustomerLoggedIn = JSON.parse(localStorage.getItem("c_flog"))

    useEffect(()=>{
        if(isSellerLoggedIn){
            navigate('/fatandcap/auth/seller')  
        }else if(isCustomerLoggedIn){
            navigate('/fatandcap/home') 
        }
    },[isSellerLoggedIn, isCustomerLoggedIn, navigate])
  
    const fat_w_acc = useSelector(selectPublicToken)

    const [otpRequest, { isError }] = useRequestsmsOTPMutation()
   
    const [getAccessToken, { isSuccess }] = useAccessTokenMutation()
 

    useEffect(()=>{
        //get access token
        if(fat_w_acc === null){
          const { fat_w_acc } = getAccessToken().unwrap()
          if(isSuccess){
          dispatch(setPublicCredentials({ fat_w_acc }))
          }
        }
      },[dispatch, getAccessToken, isSuccess, fat_w_acc])

    useEffect(()=>{
        ref.current.focus()
    }, [])

    const handleLoginWithSMS = async (e) => {
        e.preventDefault()
        try {
            await otpRequest({ phone }).unwrap()
                setPhone('')
                navigate('/fatandcap/auth/smslogin') 
        } catch (err) {
            if (!err.status) {
                swal({
                    title: "Server error!",
                    text: "No Server Response",
                    icon: "error",
                    button: "Ok",
                  });
            }   else {
                swal({
                    title: "Notification",
                    text: `${err.data?.message}`,
                    icon: "error",
                    button: "Ok",
                  });
            ref.current.focus();
            }
        }
   
    }

    const handleUserPhone = (e) => setPhone(e.target.value)

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
                {/* login with phone */}
                <Form className="formLogin px-4"  onSubmit={handleLoginWithSMS}>
                    <h4 className='form-title text-center fw-bold'>Sign In</h4>
                    <Col className='mb-4 mt-3'>
                        <TextField
                            ref={ref}
                            className="form-control"
                            type="text"
                            id="phone"
                            variant="standard"
                            value={phone}
                            onChange={handleUserPhone}
                            label="Enter Mobile Number"
                            required
                            />
                    </Col>
                    <Col className='mb-2'>
                        <button className="public-btn py-2 w-100">Get Code</button>
                    </Col>   
                    <Col className='d-flex justify-content-between mb-2'>
                        <Link style={{fontWeight: 'bold', fontSize: '11px', color: '#4B4A80'}} className='ms-1' to="/fatandcap/auth/forgotpassword">Forgot Password?</Link>
                        <Link style={{fontWeight: 'bold', fontSize: '11px', color: '#4B4A80'}} className='ms-1' >Sign In with Password</Link>
                    </Col>   
                    <Col className='d-flex justify-content-center mb-2'>
                        <Link style={{fontWeight: 'bold', fontSize: '12px', color: '#4B4A80'}} to="/fatandcap/auth/register"><small style={{fontSize: '12px', marginRight: '5px'}}>New to FatAndCap?</small>Create Account
                        </Link>
                    </Col> 
                    <Col className='d-flex justify-content-center mb-2'>
                        <Link style={{fontWeight: 'bold', fontSize: '12px', color: '#4B4A80'}} to="/fatandcap/auth/sellersignup"><small style={{fontSize: '12px', marginRight: '5px'}}>Want to be a seller?</small>Create Account</Link>
                    </Col>         
                </Form>
            </Col>
        </Row>
    </Container>
  )
}

export default SMSLogin
