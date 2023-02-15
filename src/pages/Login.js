import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import InputAdornment from '@material-ui/core/InputAdornment';
import { VisibilityOff } from '@material-ui/icons';
import Input from '@material-ui/core/Input';

import logo from '../assets/images/store.png';
import Avatar from '@mui/material/Avatar';
import { Container, Row, Col, Form, Button } from 'reactstrap';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../features/auth/authSlice';
import {
  useLoginMutation,
  useRequestsmsOTPMutation,
} from '../features/auth/authApiSlice';
import {
  setPublicCredentials,
  selectPublicToken,
} from '../features/auth/authSlice';
import { useAccessTokenMutation } from '../features/auth/authApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import useTitle from '../hooks/useTitle';
import Spinner from '../components/Spinner/Spinner';
import { TextField } from '@material-ui/core';
import swal from 'sweetalert';

import { useMediaQuery } from '@mui/material';

// import GoogleLogin from './GoogleSignIn'

export const Login = () => {
  useTitle('Login');
  // let notif
  const nodeRef = React.useRef(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [pasword, setPassword] = useState({
    paswords: '',
    showPassword: false,
  });

  const [phone, setPhone] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const isSellerLoggedIn = JSON.parse(localStorage.getItem('s_flog'));

  const isCustomerLoggedIn = JSON.parse(localStorage.getItem('c_flog'));

  useEffect(() => {
    if (isSellerLoggedIn) {
      navigate('/fatandcap/auth/seller');
    } else if (isCustomerLoggedIn) {
      navigate('/fatandcap/home');
    }
  }, [isSellerLoggedIn, isCustomerLoggedIn, navigate]);

  const fat_w_acc = useSelector(selectPublicToken);

  const [login, { isLoading }] = useLoginMutation();

  const [otpRequest, { isError }] = useRequestsmsOTPMutation();

  const [getAccessToken, { isSuccess }] = useAccessTokenMutation();

  useEffect(() => {
    //get access token
    if (fat_w_acc === null) {
      const { fat_w_acc } = getAccessToken().unwrap();
      if (isSuccess) {
        dispatch(setPublicCredentials({ fat_w_acc }));
      }
    }
  }, [dispatch, getAccessToken, isSuccess, fat_w_acc]);

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    try {
      let password = pasword.paswords;
      const { accessToken } = await login({ email, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setEmail('');
      setPassword('');
      navigate('/checker');
    } catch (err) {
      if (!err.status) {
        swal({
          title: 'Server error!',
          text: 'No Server Response',
          icon: 'error',
          button: 'Ok',
        });
      } else {
        swal({
          title: 'Notification',
          text: `${err.data?.message}`,
          icon: 'error',
          button: 'Ok',
        });
      }
    }
  };

  const handleLoginWithSMS = async (e) => {
    e.preventDefault();
    try {
      await otpRequest({ phone }).unwrap();
      setEmail('');
      setPassword('');
      navigate('/fatandcap/auth/smslogin');
    } catch (err) {
      if (!err.status) {
        swal({
          title: 'Server error!',
          text: 'No Server Response',
          icon: 'error',
          button: 'Ok',
        });
      } else {
        swal({
          title: 'Notification',
          text: `${err.data?.message}`,
          icon: 'error',
          button: 'Ok',
        });
      }
      navigate('/fatandcap/auth/mobilelogin');
    }
  };

  const handleUserInput = (e) => setEmail(e.target.value);
  const handlePasswordChange = (prop) => (event) => {
    setPassword({ ...pasword, [prop]: event.target.value });
  };
  const handleUserPhone = (e) => setPhone(e.target.value);

  const handleClickShowPassword = () => {
    setPassword({ ...pasword, showPassword: !pasword.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //media query

  const matches = useMediaQuery('(min-width:600px)');


  if (isLoading || isError)
    return (
      <div>
        <Spinner />
      </div>
    );

  return (
    <Container fluid className="public">
      <Row>
        {!matches ? (
          <Col lg="6" md="6">
            <div className="text-center m-auto">
              <div className="public-title">
                <h1 className="login-title mt-3 mb-3 fs-3">
                  FatAndCap Online Shop
                </h1>
                <h4 className="sub-title fs-6">Your One-Stop-Online-Shop</h4>
              </div>
            </div>
          </Col>
        ) : (
          <Col lg="6" md="6">
            <div className="text-center m-auto">
              <Avatar
                alt="FatAndCap"
                src={logo}
                sx={{
                  width: 200,
                  height: 200,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: '8.5vh',
                }}
                variant="square"
              />
              <div className="public-title">
                <h1 className="login-title mt-3 mb-5">FatAndCap Online Shop</h1>
                <h4 className="sub-title">Your One-Stop-Online-Shop</h4>
              </div>
            </div>
          </Col>
        )}

        {!matches ? (
          <Col lg="6" md="6" style={{}}>
            <Form
              className="formLogin px-3"
              onSubmit={handleLoginWithEmail}
              style={{ display: isOpen ? 'none' : 'block' }}
            >
              <h4 className="form-title text-center fw-bold fs-5">Sign In</h4>
              {/* <Backdrop
                          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                          open={open}
                          onClick={handleClose}
                      >
                          <CircularProgress color="inherit" />
                      </Backdrop> */}

              <Col className="mt-2">
                <TextField
                  className="form-control form-control-sm"
                  id="username"
                  variant="standard"
                  label="Email Or Username"
                  value={email}
                  onChange={handleUserInput}
                  required
                />
              </Col>
              <Col className="mb-4">
                <label className="form-label" htmlFor="password">
                  Password:
                </label>
                <Input
                  className="form-control"
                  type={pasword.showPassword ? 'text' : 'password'}
                  id="password"
                  onChange={handlePasswordChange('paswords')}
                  placeholder="Password"
                  value={pasword.paswords}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {pasword.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  required
                  autoComplete="off"
                />
              </Col>

              <Col className="d-flex justify-content-between mb-2">
                {/* <button className="public-btn btn btn-warning btn-md w-100">Sign In</button> */}
                <Button
                  style={{ color: '#4B4A80' }}
                  className="public-btn btn py-2 btn-md w-100"
                >
                  Sign in
                </Button>
              </Col>

              {/* <Col className='d-flex justify-content-between mb-2'>
                          <GoogleLogin />
                      </Col>   */}
              <Col className="d-flex justify-content-between">
                <Link
                  style={{
                    fontWeight: 'bold',
                    fontSize: '10px',
                    color: '#4B4A80',
                  }}
                  className="ms-1 mb-3"
                  to="/fatandcap/auth/forgotpassword"
                >
                  Forgot Password?
                </Link>
                {/* <Link
                  style={{
                    fontWeight: 'bold',
                    fontSize: '10px',
                    color: '#4B4A80',
                  }}
                  className="ms-1 mb-3"
                  onClick={toggle}
                >
                  Sign In with Mobile Number
                </Link> */}
              </Col>

              <Col className="d-flex justify-content-center mt-3">
                <small
                  style={{
                    fontSize: '12px',
                    marginRight: '5px',
                    fontWeight: 'bold',
                  }}
                >
                  New to FatAndCap?
                </small>
                <Link
                  style={{
                    fontSize: '12px',
                    marginRight: '5px',
                    fontWeight: 'bold',
                  }}
                  to="/fatandcap/auth/register"
                >
                  Create Account
                </Link>
              </Col>

              <Col className="d-flex justify-content-center">
                <small
                  style={{
                    fontSize: '12px',
                    marginRight: '5px',
                    fontWeight: 'bold',
                  }}
                >
                  Want to a Seller?
                </small>
                <Link
                  style={{
                    fontSize: '12px',
                    marginRight: '5px',
                    fontWeight: 'bold',
                  }}
                  to="/fatandcap/auth/sellersignup"
                >
                  Click Here!
                </Link>
              </Col>
            </Form>

            {/* login with phone */}

            <Form
              className="formLogin px-4"
              onSubmit={handleLoginWithSMS}
              style={{ display: isOpen ? 'block' : 'none' }}
            >
              <h4 className="form-title text-center fw-bold">Sign In</h4>
              <Col className="mb-4 mt-2">
                <TextField
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
              <Col className="mb-2">
                <button className="public-btn py-2 w-100">Get Code</button>
              </Col>
              <Col>
                  <section className="d-flex justify-content-between align-items-center mb-2">
                      <Link
                      style={{
                        fontWeight: 'bold',
                        fontSize: '11px',
                        color: '#4B4A80',
                      }}
                      className="ms-1"
                      to="/fatandcap/auth/forgotpassword"
                    >
                      Forgot Password?
                    </Link>
                    {/* <Link
                      style={{
                        fontWeight: 'bold',
                        fontSize: '11px',
                        color: '#4B4A80',
                      }}
                      className="ms-1"
                      onClick={toggle}
                    >
                      Sign In with Password
                    </Link> */}
                  </section>
              </Col>
              <Col className="d-flex justify-content-center mb-2">
                <Link
                  style={{
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: '#4B4A80',
                  }}
                  to="/fatandcap/auth/register"
                >
                  <small style={{ fontSize: '12px', marginRight: '5px' }}>
                    New to FatAndCap?
                  </small>
                  Create Account
                </Link>
              </Col>
              <Col className="d-flex justify-content-center mb-2">
                <Link
                  style={{
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: '#4B4A80',
                  }}
                  to="/fatandcap/auth/sellersignup"
                >
                  <small style={{ fontSize: '12px', marginRight: '5px' }}>
                    Want to be a seller?
                  </small>
                  Click Here!
                </Link>
              </Col>
            </Form>
          </Col>
        ) : (
          <Col lg="6" md="6">
            <Form
              className="formLogin mb-5"
              onSubmit={handleLoginWithEmail}
              style={{ display: isOpen ? 'none' : 'block' }}
            >
              <h4 className="form-title text-center fw-bold">Sign In</h4>
              {/* <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={open}
                        onClick={handleClose}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop> */}

              <Col className="mt-2">
                <TextField
                  className="form-control form-control-sm"
                  id="username"
                  variant="standard"
                  label="Email Or Username"
                  value={email}
                  onChange={handleUserInput}
                  required
                />
              </Col>
              <Col className="mb-4">
                <label className="form-label" htmlFor="password">
                  Password:
                </label>
                <Input
                  className="form-control"
                  type={pasword.showPassword ? 'text' : 'password'}
                  id="password"
                  onChange={handlePasswordChange('paswords')}
                  placeholder="Password"
                  value={pasword.paswords}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {pasword.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  required
                  autoComplete="off"
                />
              </Col>

              <Col className="d-flex justify-content-between mb-2">
                {/* <button className="public-btn btn btn-warning btn-md w-100">Sign In</button> */}
                <Button
                  style={{ color: '#4B4A80' }}
                  className="public-btn btn py-2 btn-md w-100"
                >
                  Sign in
                </Button>
              </Col>

              {/* <Col className='d-flex justify-content-between mb-2'>
                        <GoogleLogin />
                    </Col>   */}
              <Col className="d-flex justify-content-between mb-2">
                <Link
                  style={{
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#4B4A80',
                  }}
                  className="ms-1"
                  to="/fatandcap/auth/forgotpassword"
                >
                  Forgot Password?
                </Link>
                {/* <Link
                  style={{
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#4B4A80',
                  }}
                  className="ms-1"
                  onClick={toggle}
                >
                  Sign In with Mobile Number
                </Link> */}
              </Col>

              <Col className="d-flex justify-content-center mb-2">
                <small
                  style={{
                    fontSize: '12px',
                    marginRight: '5px',
                    fontWeight: 'bold',
                  }}
                >
                  New to FatAndCap?
                </small>
                <Link
                  style={{
                    fontSize: '12px',
                    marginRight: '5px',
                    fontWeight: 'bold',
                  }}
                  to="/fatandcap/auth/register"
                >
                  Create Account
                </Link>
              </Col>

              <Col className="d-flex justify-content-center mb-2">
                <small
                  style={{
                    fontSize: '12px',
                    marginRight: '5px',
                    fontWeight: 'bold',
                  }}
                >
                  Want to a Seller?
                </small>
                <Link
                  style={{
                    fontSize: '12px',
                    marginRight: '5px',
                    fontWeight: 'bold',
                  }}
                  to="/fatandcap/auth/sellersignup"
                >
                  Click Here!
                </Link>
              </Col>
            </Form>

            {/* login with phone */}

            <Form
              className="formLogin px-4"
              onSubmit={handleLoginWithSMS}
              style={{ display: isOpen ? 'block' : 'none' }}
            >
              <h4 className="form-title text-center fw-bold">Sign In</h4>
              <Col className="mb-4 mt-3">
                <TextField
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
              <Col className="mb-2">
                <button className="public-btn py-2 w-100">Get Code</button>
              </Col>
              <Col className="d-flex justify-content-between mb-2">
                <Link
                  style={{
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#4B4A80',
                  }}
                  className="ms-1"
                  to="/fatandcap/auth/forgotpassword"
                >
                  Forgot Password?
                </Link>
                <Link
                  style={{
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#4B4A80',
                  }}
                  className="ms-1"
                  onClick={toggle}
                >
                  Sign In with Password
                </Link>
              </Col>
              <Col className="d-flex justify-content-center mb-2">
                <Link
                  style={{
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: '#4B4A80',
                  }}
                  to="/fatandcap/auth/register"
                >
                  <small style={{ fontSize: '12px', marginRight: '5px' }}>
                    New to FatAndCap?
                  </small>
                  Create Account
                </Link>
              </Col>
              <Col className="d-flex justify-content-center mb-2">
                <Link
                  style={{
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: '#4B4A80',
                  }}
                  to="/fatandcap/auth/sellersignup"
                >
                  <small style={{ fontSize: '12px', marginRight: '5px' }}>
                    Want to be a seller?
                  </small>
                  Create Account
                </Link>
              </Col>
            </Form>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Login;
