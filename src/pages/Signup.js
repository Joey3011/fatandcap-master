import 'bootstrap/dist/css/bootstrap.css';
import React, { useRef, useState, useEffect } from 'react';
import logo from '../assets/images/store.png';
import Avatar from '@mui/material/Avatar';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'reactstrap';
import { useEmailRegisterMutation } from '../features/auth/authApiSlice';
import {
  setPublicCredentials,
  selectPublicToken,
} from '../features/auth/authSlice';
import { useAccessTokenMutation } from '../features/auth/authApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import useTitle from '../hooks/useTitle';
import Spinner from '../components/Spinner/Spinner';
import { MDBCheckbox } from 'mdb-react-ui-kit';
import './form.css';
import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import InputAdornment from '@material-ui/core/InputAdornment';
import { VisibilityOff } from '@material-ui/icons';
import Input from '@material-ui/core/Input';
import swal from 'sweetalert';

import { useMediaQuery } from '@mui/material';


const Signup = () => {
  useTitle('Create Account');
  const matches = useMediaQuery('(min-width:600px)');

  const userRef = useRef();
  const [fname, setFirstName] = useState('');
  const [lname, setLastName] = useState('');
  const [email, setEmail] = useState();
  // const [phone, setPhone] = useState('');
  const [role] = useState('customer');

  const [pasword, setPassword] = useState({
    paswords: '',
    showPassword: false,
  });

  const [rePasword, setRePassword] = useState({
    repasword: '',
    showPassword: false,
  });

  const fat_w_acc = useSelector(selectPublicToken);

  const navigate = useNavigate();
  const [registerNewUserEmail, { isLoading}] =
    useEmailRegisterMutation();

  const dispatch = useDispatch();

  const [getAccessToken, { isSuccess }] = useAccessTokenMutation();

  const isSellerLoggedIn = JSON.parse(localStorage.getItem('s_flog'));

  const isCustomerLoggedIn = JSON.parse(localStorage.getItem('c_flog'));

  useEffect(() => {
    if (isSellerLoggedIn) {
      navigate('/fatandcap/auth/seller');
    } else if (isCustomerLoggedIn) {
      navigate('/fatandcap/home');
    }
  }, [isSellerLoggedIn, isCustomerLoggedIn, navigate]);

  useEffect(() => {
    if (fat_w_acc === null) {
      const { fat_w_acc } = getAccessToken().unwrap();
      if (isSuccess) {
        dispatch(setPublicCredentials({ fat_w_acc }));
      }
    }
  }, [dispatch, getAccessToken, isSuccess, fat_w_acc]);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleUserFirstName = (e) => setFirstName(e.target.value);
  const handleUserLastName = (e) => setLastName(e.target.value);
  const handleUserEmail = (e) => setEmail(e.target.value);
  // const handleUserPhone = (e) => setPhone(e.target.value);

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

  //submit email signup request
  const handleSubmitCreateAccount = async (e) => {
    e.preventDefault();
    let password = pasword.paswords;
    let repassword = rePasword.repasword;
    try {
      await registerNewUserEmail({
        role,
        fname,
        lname,
        email,
        // phone,
        password,
        repassword,
      }).unwrap();
      setFirstName('');
      setLastName('');
      setEmail('');
      swal({
        title: 'Confirmation!',
        text: 'Please check your E-mail for OTP Code!',
        icon: 'success',
        button: 'Ok',
      });

      
      localStorage.setItem('mail', JSON.stringify(email));
      navigate('/fatandcap/auth/otp/submit');
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
    userRef.current.focus();
  };

  if (isLoading)
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
                <h1 className="login-title mt-3 mb-2 fs-4">
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
          <Col lg="6" md="6">
            {/* sign up with email */}
            <Form
              className="formRegister px-4 mb-5"
              onSubmit={handleSubmitCreateAccount}
            >
              <h3 className="form-title text-center fw-bold fs-4">Sign Up</h3>
              <Col className="mb1">
                <TextField
                  variant="standard"
                  className="form-control form-control-sm"
                  id="fname"
                  ref={userRef}
                  value={fname}
                  onChange={handleUserFirstName}
                  type="text"
                  label="Enter Firstname"
                  autoComplete="off"
                  required
                />
              </Col>
              <Col className="mb-1">
                <TextField
                  variant="standard"
                  className="form-control"
                  id="lname"
                  value={lname}
                  onChange={handleUserLastName}
                  type="text"
                  label="Enter Lastname"
                  autoComplete="off"
                  required
                />
              </Col>
              <Col className="mb-1">
                <TextField
                  variant="standard"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={handleUserEmail}
                  type="email"
                  label="Enter Email"
                  autoComplete="off"
                  required
                />
              </Col>
              {/* <Col className="mb-1">
                <TextField
                  className="form-control"
                  type="text"
                  id="phone"
                  variant="standard"
                  value={phone}
                  ref={userRef}
                  onChange={handleUserPhone}
                  label="Enter Mobile Number"
                  required
                />
              </Col> */}
              <Col className="mb-1">
                <label className="form-label" htmlFor="password">
                  Password:
                </label>
                <Input
                  className="form-control"
                  type={pasword.showPassword ? 'text' : 'password'}
                  value={pasword.paswords}
                  ref={userRef}
                  onChange={handleUserPassword('paswords')}
                  placeholder="Enter New Password"
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
                />
              </Col>
              <Col className="mb-4">
                <label className="form-label" htmlFor="password">
                  Re-Type Password:
                </label>
                <Input
                  className="form-control"
                  id="rePassowrd"
                  type={rePasword.showPassword ? 'text' : 'password'}
                  value={rePasword.repasword}
                  onChange={handleUserRePassword('repasword')}
                  placeholder="Re-Type Password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowRePassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {rePasword.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  required
                />
              </Col>
              <Col className="mb-2">
                <Button className="public-btn btn py-2 btn-md w-100">
                  Create Account
                </Button>
              </Col>
              <Col className="d-flex justify-content-between">
                <span
                  style={{ fontSize: '12px', color: '#4B4A80' }}
                  className="ms-1 mt-1"
                >
                  <MDBCheckbox
                    name="flexCheck"
                    value=""
                    id="flexCheckDefault"
                    label="Accept Terms and Condition and policy"
                  />
                </span>
                {/* <Link style={{fontSize: '10px', color: 'darkgoldenrod'}} className='sign-up-title fw-bold' onClick={toggle}>Sign Up with Phone Number</Link> */}
              </Col>
              <Col className="d-flex justify-content-center mb-2">
                <small
                  style={{
                    fontSize: '12px',
                    marginRight: '5px',
                    fontWeight: 'bold',
                  }}
                >
                  Have an account?
                </small>
                <Link
                  style={{
                    fontSize: '12px',
                    marginRight: '5px',
                    fontWeight: 'bold',
                  }}
                  to="/fatandcap/auth/login"
                >
                  Sign In
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
                  Want to be a seller?
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
          </Col>
        ) : (
          <Col lg="6" md="6">
            {/* sign up with email */}
            <Form
              className="formRegister px-4"
              onSubmit={handleSubmitCreateAccount}
            >
              <h3 className="form-title text-center fw-bold">Sign Up</h3>
              <Col className="mb1">
                <TextField
                  variant="standard"
                  className="form-control form-control-sm"
                  id="fname"
                  ref={userRef}
                  value={fname}
                  onChange={handleUserFirstName}
                  type="text"
                  label="Enter Firstname"
                  autoComplete="off"
                  required
                />
              </Col>
              <Col className="mb-1">
                <TextField
                  variant="standard"
                  className="form-control"
                  id="lname"
                  value={lname}
                  onChange={handleUserLastName}
                  type="text"
                  label="Enter Lastname"
                  autoComplete="off"
                  required
                />
              </Col>
              <Col className="mb-1">
                <TextField
                  variant="standard"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={handleUserEmail}
                  type="email"
                  label="Enter Email"
                  autoComplete="off"
                  required
                />
              </Col>
              {/* <Col className="mb-1">
                <TextField
                  className="form-control"
                  type="text"
                  id="phone"
                  variant="standard"
                  value={phone}
                  ref={userRef}
                  onChange={handleUserPhone}
                  label="Enter Mobile Number"
                  required
                />
              </Col> */}
              <Col className="mb-1">
                <label className="form-label" htmlFor="password">
                  Password:
                </label>
                <Input
                  className="form-control"
                  type={pasword.showPassword ? 'text' : 'password'}
                  value={pasword.paswords}
                  ref={userRef}
                  onChange={handleUserPassword('paswords')}
                  placeholder="Enter New Password"
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
                />
              </Col>
              <Col className="mb-4">
                <label className="form-label" htmlFor="password">
                  Re-Type Password:
                </label>
                <Input
                  className="form-control"
                  id="rePassowrd"
                  type={rePasword.showPassword ? 'text' : 'password'}
                  value={rePasword.repasword}
                  onChange={handleUserRePassword('repasword')}
                  placeholder="Re-Type Password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowRePassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {rePasword.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  required
                />
              </Col>
              <Col className="mb-2">
                <Button className="public-btn btn py-2 btn-md w-100">
                  Create Account
                </Button>
              </Col>
              <Col className="d-flex justify-content-between">
                <span
                  style={{ fontSize: '12px', color: '#4B4A80' }}
                  className="ms-1 mt-1"
                >
                  <MDBCheckbox
                    name="flexCheck"
                    value=""
                    id="flexCheckDefault"
                    label="Accept Terms and Condition and policy"
                  />
                </span>
                {/* <Link style={{fontSize: '10px', color: 'darkgoldenrod'}} className='sign-up-title fw-bold' onClick={toggle}>Sign Up with Phone Number</Link> */}
              </Col>
              <Col className="d-flex justify-content-center mb-2">
                <small
                  style={{
                    fontSize: '12px',
                    marginRight: '5px',
                    fontWeight: 'bold',
                  }}
                >
                  Have an account?
                </small>
                <Link
                  style={{
                    fontSize: '12px',
                    marginRight: '5px',
                    fontWeight: 'bold',
                  }}
                  to="/fatandcap/auth/login"
                >
                  Sign In
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
                  Want to be a seller?
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
          </Col>
        )}
      </Row>
    </Container>
  );
};
export default Signup;
