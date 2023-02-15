import React from 'react'
import { useGetSellerProductQuery } from '../AuthUserApiSlice'
import { useGetCustomerQuery } from '../customerApiSlice'
import SellerProductCard from '../SellerPage/SellerProdctCard'
import useAuth from '../../../hooks/useAuth'
import { Container, Col, Row } from 'reactstrap';
import Spinner from '../../../components/Spinner/Spinner'

const Seller = () => {

    const { _id } = useAuth()

    const { customer } = useGetCustomerQuery("customerList", {
        selectFromResult: ({ data }) => ({
            customer: data?.entities[_id]
        }),
    })

    const {
        data: product,
        isFetching,
        isSuccess,
        isLoading,
      } = useGetSellerProductQuery(_id, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
      })
   
   
    if (isLoading) return <div><Spinner /></div>
   
    if(customer && isSuccess && product ){
        const { ids } = product
       const itemContent = ids?.length && ids?.map(itemId => <SellerProductCard key={itemId} itemId={itemId} />)

    return (
            <>
            <Container fluid>
                <Row>
                    <Col className='mb-3'>
                        <p style={{marginLeft: '15px', padding: '15px 0', fontWeight: 'bold', color: '#000'}}>Welcome! {customer?.username}</p>
                    
                    </Col>
                </Row>
                <Row>
                    {itemContent} {isFetching ? <div><Spinner /></div> : ''}   
                </Row>
            </Container>
            </>
        )
    }

};

export default Seller
