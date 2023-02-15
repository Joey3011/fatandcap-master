import React from 'react'
import { useGetCustomerQuery } from '../customerApiSlice'
import useAuth from '../../../hooks/useAuth'


const Customer = () => {
  
  const { _id } = useAuth()

  const { customer } = useGetCustomerQuery("customerList", {
    selectFromResult: ({ data }) => ({
        customer: data?.entities[_id]
      }),
  })
  if(customer){
    return  <div style={{minHeight: '100vh'}}>
        <p className='text-center text-primary fw-bold mt-5 pt-5'>Welcome {customer.firstName}!</p>
    </div>
  }

};

export default Customer
