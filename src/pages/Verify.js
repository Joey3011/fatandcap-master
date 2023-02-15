import React from 'react'
import logo from '../assets/images/store.png'
import Avatar from '@mui/material/Avatar'
import { Container, Row, Col } from 'reactstrap';
import { useLocation, Navigate } from "react-router-dom"
import './form.css'

export const Verify = () => {

    const location = useLocation()
    const queryParameters = new URLSearchParams(window.location.search)
    const status = queryParameters.get("status")
     
  return (
    <Container>
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
                <span>
                    <h4 className='text-center mt-5 pt-5 mb-2' style={{color: status === 'verified' ? 'green' : status === 'expired' ? 'red' : status === 'expire' ? 'red' : '' }}>
                            {status == null ? <Navigate to="/fatandcap/home" state={{ from: location }} replace /> :  status === 'verified' ? "Account verified!" : status === 'expired' ? "Activation link already expired!" : status === 'expire' ? "Reset password link already expired!" : ''}
                    </h4>
                </span>
            </Col>
        </Row>
    </Container>
  )
}

export default Verify;