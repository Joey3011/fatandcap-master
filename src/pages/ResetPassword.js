import React, { useRef, useState, useEffect } from 'react'

import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import {VisibilityOff} from "@material-ui/icons";
import Input from "@material-ui/core/Input";

import Avatar from '@mui/material/Avatar'
import logo from '../assets/images/store.png';
import { Container, Row, Col, Form, Button } from 'reactstrap';
import { useLocation, Navigate, useNavigate } from "react-router-dom"
import { useResetPasswordMutation } from '../features/auth/authApiSlice'
import Spinner from '../components/Spinner/Spinner'
import useTitle from '../hooks/useTitle'
import swal from 'sweetalert';
import './form.css'

export const ResetPassword = () => {
    useTitle('Reset Password')

    const isSellerLoggedIn = JSON.parse(localStorage.getItem("s_flog"))
  
    const isCustomerLoggedIn = JSON.parse(localStorage.getItem("c_flog"))
  
    useEffect(()=>{
        if(isSellerLoggedIn){
            navigate('/fatandcap/auth/seller')  
        }else if(isCustomerLoggedIn){
            navigate('/fatandcap/home') 
        }
    },[isSellerLoggedIn, isCustomerLoggedIn, navigate])


    let notif 
    const nodeRef = React.useRef(null);
    const userRef = useRef()

    const [pasword, setPassword] = useState({
        paswords: "",
        showPassword: false,
    })

    const [rePasword, setRePassword] = useState({
        repasword: "",
        showPassword: false,
    })


    const [validPassword, setValidPassword] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()
    const queryParameters = new URLSearchParams(window.location.search)

    const token = queryParameters.get("token")

    const [resetPassword, { isLoading }] =  useResetPasswordMutation()
   
    useEffect(() => {
        userRef.current.focus()
    }, [])

    const handleUserPassword = (prop) => (event) => {
        setPassword({ ...pasword, [prop]: event.target.value });
      };

    const handleUserRePassword = (prop) => (event) => {
        setRePassword({ ...rePasword, [prop]: event.target.value });
    };  

    //   show password
    const handleClickShowPassword = () => {
        setPassword({ ...pasword, showPassword: !pasword.showPassword });
    };

    const handleClickShowRePassword = () => {
        setRePassword({ ...rePasword, showPassword: !rePasword.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


  

    const handleSubmitPassword = async (e) => {
        e.preventDefault()
        let password = pasword.paswords
        let rePassword = rePasword.repasword
        try{
        await resetPassword({ password, rePassword, token}).unwrap()
            swal({
                title: "Confirmation!",
                text: "You have successfully update your password!",
                icon: "success",
                button: "Ok",
              });
            setPassword('')
            setRePassword('')
            navigate('/fatandcap/auth/login') 
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
            }
        }
        userRef.current.focus()
    }

    if (isLoading) return <div><Spinner /></div>


  return (
    <Container fluid className='public'>
          <span ref={nodeRef}>{notif}</span>
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
                {token == null ? <Navigate to="Home" state={{ from: location }} replace /> : ''}
            <Form className="formResetPassword" onSubmit={handleSubmitPassword}>
                <h5 className='form-title text-center'>Update Password</h5>
                    <Col>
                        <input 
                            id='param2'
                            value={token}
                            type="hidden"
                        />
                    </Col>
                    <Col className='mb-1'>
                        <label className='form-label' htmlFor="password">Password:</label>
                        <Input 
                            className='form-control'
                            type={pasword.showPassword ? "text" : "password"}
                            value={pasword.paswords}
                            ref={userRef}
                            onChange={handleUserPassword('paswords')}
                            placeholder='Enter New Password' 
                            endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                  >
                                    {pasword.showPassword ? <Visibility /> : <VisibilityOff />}
                                  </IconButton>
                                </InputAdornment>
                              }
                            required/>
                    </Col>
                    <Col className='mb-3'>
                        <label className='form-label' htmlFor="password">Re-Type Password:</label>
                        <Input 
                            className='form-control'
                            id="rePassowrd"
                            type={rePasword.showPassword ? "text" : "password"}
                            value={rePasword.repasword}
                            onChange={handleUserRePassword('repasword')}
                            placeholder='Re-Type Password' 
                            endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={handleClickShowRePassword}
                                    onMouseDown={handleMouseDownPassword}
                                  >
                                    {rePasword.showPassword ? <Visibility /> : <VisibilityOff />}
                                  </IconButton>
                                </InputAdornment>
                              }
                            required/>
                    </Col>
                    <Col className='d-flex justify-content-end mb-2'>
                        <Button className='public-btn btn btn-md w-100'>
                                Submit
                        </Button>
                    </Col>
                </Form>
            </Col>
        </Row>
    </Container>
  )
}

export default ResetPassword;