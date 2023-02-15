import React, { useState, useEffect, useRef } from 'react'
import Avatar from '@mui/material/Avatar'
import ReCAPTCHA from "react-google-recaptcha"
import logo from '../assets/images/store.png';
import { useRequestPasswordEmailMutation } from '../features/auth/authApiSlice'
import { NotificationManager } from 'react-notifications'
import { Form, Container, Col, Row, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner/Spinner'
import useTitle from '../hooks/useTitle'
import './form.css'
import { TextField } from '@material-ui/core'
import swal from 'sweetalert';

export const ForgotPassword = () => {
    useTitle('Request Password')

    const recaptchaRef = React.createRef()
    const nodeRef = React.createRef(null);
    const userEmail = useRef()
    const [notif, setNotif] = useState('')
    const [email, setEmail] = useState('')
    const [verified, setVerified] = useState(false)
    const navigate = useNavigate()
    const [requestPasswordEmail, { isLoading, isSuccess } ] =  useRequestPasswordEmailMutation()


    const isSellerLoggedIn = JSON.parse(localStorage.getItem("s_flog"))
  
    const isCustomerLoggedIn = JSON.parse(localStorage.getItem("c_flog"))
  
    useEffect(()=>{
        if(isSellerLoggedIn){
            navigate('/fatandcap/auth/seller')  
        }else if(isCustomerLoggedIn){
            navigate('/fatandcap/home') 
        }
    },[isSellerLoggedIn, isCustomerLoggedIn, navigate])

    const handleUserEmail = (e) => setEmail(e.target.value)

    useEffect(() => {
        userEmail.current.focus()
    }, [])


    const onSubmitRequest = async (e) => {
        e.preventDefault()
        try{
            await requestPasswordEmail({email}).unwrap()
                setEmail('')
                swal({
                    title: "Confirmation!",
                    text: "Email link sent| Please check your E-mail.",
                    icon: "success",
                    button: "Ok",
                  });
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
        userEmail.current.focus();
    }

    const onChange = (value) => {
        setVerified(true)
    }

if (isLoading) return <div><Spinner /></div>

if (isSuccess) return navigate('/fatandcap/auth/login')


  return (
    <Container fluid className='public'>
        <Row>
        <span ref={nodeRef}>{notif}</span>
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
                <Form className="formRequestPassword px-4" onSubmit={onSubmitRequest}>
                    <h5 className='form-title text-center fw-bold'>Forgot Password</h5>
                    <Col className='mb-3 mt-3'>
                        <TextField 
                            className='form-control'
                            id="email"
                            variant='standard'
                            value={email}
                            ref={userEmail}
                            onChange={handleUserEmail}
                            type='email' 
                            label='Enter Email' 
                            autoComplete='off'
                            required/>
                    </Col>
                    <Col className='mb-1'>
                        <Button className='public-btn btn text-dark bg-light py-2 w-100' disabled={!verified}>Submit</Button>
                    </Col>
                    <Col className='d-flex justify-content-center mb-3'>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            name="recaptcha"
                            id="recaptcha"
                            theme='light'
                            // size='normal'
                            badge ='bottomright'
                            sitekey= {`${process.env.REACT_APP_SITE_KEY}`}
                            onChange={onChange}
                            onExpired={() => {
                                recaptchaRef.current.reset()
                                setVerified(false)
                              }}
                        />
                    </Col>
                    <Col className='d-flex justify-content-between'>
                        <Link style={{fontWeight: 'bold', fontSize: '11px', color: '#4B4A80'}} className='ms-1' to="/fatandcap/auth/login">Sign In</Link>
                        <Link style={{fontWeight: 'bold', fontSize: '11px', color: '#4B4A80'}} className='ms-1' to="/fatandcap/auth/register">Create Account</Link>
                    </Col>  
                </Form>
            </Col>
        </Row>
    </Container>
  )
}


export default ForgotPassword
