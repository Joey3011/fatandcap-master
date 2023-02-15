import React from 'react'
import { useGetCustomerQuery } from '../pages/AccountControler/customerApiSlice'
import useAuth from '../hooks/useAuth'
import { Navigate, useLocation} from 'react-router-dom'

const Chooser = () => {
  
  const { _id, isSeller, isCustomer, isAdmin } = useAuth()
  const location = useLocation()
  const { customer } = useGetCustomerQuery("customerList", {
    selectFromResult: ({ data }) => ({
        customer: data?.entities[_id]
      }),
  })

  if(customer){
    if(isCustomer){
      localStorage.setItem("c_flog", true)
    }else if(isSeller){
      localStorage.setItem("s_flog", true)
    }
    return  <div style={{minHeight: '100vh'}}>
        {isSeller ? <Navigate to="/fatandcap/auth/seller" state={{ from: location }} replace /> : isCustomer ? <Navigate to="/fatandcap/home" state={{ from: location }} replace/> : isAdmin ? <Navigate to="/fatandcap/auth/userseller" state={{ from: location }} replace/>  : ''}
    </div>
  }

};

export default Chooser
