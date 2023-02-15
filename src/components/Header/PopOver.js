import { Avatar, useMediaQuery } from '@mui/material';
import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Button, ButtonToolbar, OverlayTrigger, Popover } from 'react-bootstrap';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { useSendLogoutMutation } from '../../features/auth/authApiSlice'
import { useGetCustomerQuery } from '../../pages/AccountControler/customerApiSlice'
import user from '../../assets/images/user.jpg'
import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';
import Spinner from '../Spinner/Spinner';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'


export const PopOver = () => {
    const { _id } = useAuth()
    const navigate = useNavigate()
    const [sendLogout, {
        isLoading,
        isSuccess
    }] = useSendLogoutMutation()
  
    const { customer } = useGetCustomerQuery("customerList", {
        selectFromResult: ({ data }) => ({
            customer: data?.entities[_id]
          }),
      })

    useEffect(() => {
      if (isSuccess){
        navigate('/fatandcap/auth/login')
        localStorage.removeItem('s_flog')
        localStorage.removeItem('c_flog')
        window.location.reload(false)
      }
    }, [isSuccess, navigate])
    const matches = useMediaQuery('(min-width:600px)')
    if (isLoading) return <div><Spinner /></div>; 
      const popoverFocus = (
        
  
            !matches ? (
     
            <Popover id="popover-trigger-click-root-close" title="Popover bottom" className='w-100 p-3'> 
                <div> 
                    <Link className='btn py-1 mb-1 align-self-center w-100' style={{fontSize: '12px', fontWeight: 'bold', color: '#000', border: '1px solid #E1E0FF'}} to='/fatandcap/auth/customer/deliverylocation'>
                        <AddLocationAltIcon/>  <small className='ms-2'>Address</small>
                    </Link>
                </div>

                <div>
                    <Link className='btn py-1 mb-1 align-self-center w-100' style={{fontSize: '12px', fontWeight: 'bold',color: '#000', border: '1px solid #E1E0FF'}} to='/fatandcap/auth/customer/AccountSetting'>
                        <SettingsApplicationsIcon /> <small  className='ms-2'>Account</small> 
                    </Link>
                </div>

                <div >
                    <Link className='btn py-1 mb-1 align-self-center w-100' style={{fontSize: '12px', fontWeight: 'bold',color: '#000', border: '1px solid #E1E0FF'}} to='/fatandcap/auth/customer/manageorder'>
                    <LocalGroceryStoreIcon /> <small  className='ms-2'>Order</small>
                    </Link>
                </div>

                <div >
                                                            
                <Link className='btn py-1 mb-1 align-self-center w-100' style={{fontSize: '12px', fontWeight: 'bold', color: '#000', border: '1px solid #E1E0FF'}} onClick={sendLogout}>
                    <LogoutIcon />  <small  className='ms-2'>Log Out</small>
                    </Link>
                </div>
                    </Popover>
        ) 
        : 
        (
            <Popover id="popover-trigger-click-root-close" title="Popover bottom" className='w-100 p-3'> 
            <div > 
                <Link className='btn py-1 mb-1 w-100' onClick={`legacy`} style={{fontSize: '12px', fontWeight: 'bold',color: '#000', border: '1px solid #E1E0FF'}} to='/fatandcap/auth/customer/deliverylocation'>
                    <AddLocationAltIcon/>  <small className='ms-2'>Address</small>
                </Link>
            </div>

            <div>
                <Link className='btn py-1 mb-1 w-100' onClick={`legacy`} style={{fontSize: '12px', fontWeight: 'bold',color: '#000', border: '1px solid #E1E0FF'}} to='/fatandcap/auth/customer/AccountSetting'>
                    <SettingsApplicationsIcon /> <small  className='ms-2'>Account</small> 
                </Link>
            </div>

            <div >
                <Link className='btn py-1 mb-1 w-100' onClick={`legacy`} style={{fontSize: '12px', fontWeight: 'bold',color: '#000', border: '1px solid #E1E0FF'}} to='/fatandcap/auth/customer/manageorder'>
                <LocalGroceryStoreIcon /> <small  className='ms-2'>Order</small>
                </Link>
            </div>

            <div >                                      
                <Link className='btn py-1 mb-1 w-100' style={{fontSize: '12px', fontWeight: 'bold',color: '#000', border: '1px solid #E1E0FF'}} onClick={sendLogout}>
                    <LogoutIcon />  <small  className='ms-2'>Log Out</small>
                </Link>
            </div>
            </Popover>
            )
      )
            
     
      
return(
<ButtonToolbar className='mt-3'>
    <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popoverFocus}>
        <Button style={{background: '#E1E0FF', border: 'none', color: '#4B4A80'}}>
            <span className='d-flex flex-row justify-content-center align-items-center'>
                <Avatar alt="..." src={customer?.image === "null" ? user : customer?.image} sx={{ width: 30, height: 30, zIndex: '10'}} /> <span  className='ms-2'><KeyboardArrowDownIcon /></span>
            </span>
        </Button>
    </OverlayTrigger>
  </ButtonToolbar>
)
}
export default PopOver