import 'bootstrap/dist/css/bootstrap.css'
import ReCAPTCHA from "react-google-recaptcha"
import logo from '../assets/images/eco-logo-removebg.png'
import React from 'react'
import { Container, Row, Col, Form, Button } from 'reactstrap'
import Avatar from '@mui/material/Avatar'
import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useVerifyEmailOtpMutation, useGetEmailOtpMutation } from '../features/auth/authApiSlice'
import useTitle from '../hooks/useTitle'
import Spinner from '../components/Spinner/Spinner'
import Input from "@material-ui/core/Input"
import swal from 'sweetalert';

export const PhoneLogin = () => {
    useTitle('Request Password')

    const recaptchaRef = React.createRef()
    const nodeRef = React.createRef(null);
    const userRef = useRef()

    const [code, setCode] = useState('')

    const [verified, setVerified] = useState(false)

    const navigate = useNavigate()

    const [submitEmailOTP, {  isSuccess, isError } ] =  useVerifyEmailOtpMutation()

    const [getEmailOTP, { isLoading } ] =  useGetEmailOtpMutation()

    const handleUserCode = (e) => setCode(e.target.value)

    
    const isSellerLoggedIn = JSON.parse(localStorage.getItem("s_flog"))
  
    const isCustomerLoggedIn = JSON.parse(localStorage.getItem("c_flog"))

    useEffect(()=>{
        if(isSellerLoggedIn){
            navigate('/fatandcap/auth/seller')  
        }else if(isCustomerLoggedIn){
            navigate('/fatandcap/home') 
        }
    },[isSellerLoggedIn, isCustomerLoggedIn, navigate])
    
    useEffect(() => {
        userRef.current.focus()
    }, [])

  // submit otp code for verification 
    const onSubmitCode = async (e) => {
        e.preventDefault()
        try{
            await submitEmailOTP({ code }).unwrap()
                swal({
                    title: "Confirmation!",
                    text: "Yeheeeey!",
                    icon: "success",
                    button: "Ok",
                  });
                setCode('')
                localStorage.removeItem("mail")
                navigate('/fatandcap/auth/login')
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
        userRef.current.focus();
    }

    // request another code
    const onSubmitGetCode = async (e) => {
        e.preventDefault()
        // get email in localstorage check signup.js how the email was save to local storage
        let email = JSON.parse(localStorage.getItem("mail"))
        try{
            //send request
            await getEmailOTP({ email }).unwrap()
            swal({
                title: "Confirmation!",
                text: "Please check your E-mail for OTP Code!",
                icon: "success",
                button: "Ok",
              });
                setCode('')
                window.location.reload(false)
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
        userRef.current.focus();
    }

    const onChange = (value) => {
       setVerified(true)
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
                    {/* Get email otp */}
                <Form className="formSubmitCode" onSubmit={onSubmitCode} style={{display: isSuccess ? 'none' : 'block'}}>
                    <h5 className='form-title text-center fw-bold'>Submit Code</h5>
                    <Col className='mb-3'>
                        <label className='form-label' htmlFor="password">OTP Code:</label>
                        <Input 
                            className='form-control form-control-sm'
                            id="code"
                            value={code}
                            ref={userRef}
                            onChange={handleUserCode}
                            type='text' 
                            placeholder='Enter Code' 
                            required/>
                    </Col>
                    <Col className='mb-1'>
                        <Button className='public-btn btn-md w-100' disabled={!verified}>Submit</Button>
                    </Col>
                    <Col className='mb-3'>
                        <Link style={{fontSize: '10px', color: 'darkgoldenrod', display: isError? "block"  : "none"}} className='ms-1 fw-bold' onClick={onSubmitGetCode}>Request Another Code?</Link>
                    </Col>
                    <Col className='m-auto'>
                    <ReCAPTCHA
                            ref={recaptchaRef}
                            name="recaptcha"
                            id="recaptcha"
                            theme='light'
                            size='normal'
                            badge ='bottomright'
                            sitekey= {`${process.env.REACT_APP_SITE_KEY}`}
                            onChange={onChange}
                            onExpired={() => {
                                recaptchaRef.current.reset()
                                setVerified(false)
                              }}
                        />
                    </Col>
                </Form>
           </Col>
        </Row>
    </Container>
  )
}


export default PhoneLogin
