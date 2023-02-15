import React from 'react'
import { useGetCustomerQuery } from '../customerApiSlice'
import { useGetCustomerOrderBySellerIDQuery } from '../OrderApiSlice'
import CustomerOrderToSeller from './CustomerOrderToAdmin'
import useAuth from '../../../hooks/useAuth'
import { Container, Row, Table } from 'reactstrap';
import Spinner from '../../../components/Spinner/Spinner'

const OrderList = () => {

    const { _id } = useAuth()

    const { customer } = useGetCustomerQuery(_id, {
        selectFromResult: ({ data }) => ({
            customer: data?.entities[_id]
        }),
    })

    const {
      data: order,
      isFetching,
      isSuccess,
      isLoading,
    } = useGetCustomerOrderBySellerIDQuery(_id, {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true
    })
 
  if (isLoading) return <div><Spinner /></div>
    if(customer && isSuccess){
      const { ids } = order
     const orderContent = ids?.length && ids?.map(orderId => <CustomerOrderToSeller key={orderId} orderId={orderId} />)
    return (
            <>
            <Container fluid>
                <Row className='mb-5 pb-5'>
                {isFetching ? <div><Spinner /></div> : ''}
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Order</th>
                        <th>Order Date</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Customer</th>
                        <th>Address</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                       {orderContent}
                    </tbody>
                </Table>
                </Row>
            </Container>
            </>
        )
    }

};

export default OrderList
