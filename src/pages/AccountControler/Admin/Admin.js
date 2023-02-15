import React from 'react'
import { useGetSellerProductQuery } from '../../AccountControler/productApiSlice'
import { useGetCustomerQuery } from '../customerApiSlice'
import SellerProductCard from '../SellerPage/SellerProdctCard'
import useAuth from '../../../hooks/useAuth'
import { Container, Col, Row } from 'reactstrap';
import Clock from '../../../components/shop/Clock';
import {motion} from 'framer-motion';
import Spinner from '../../../components/Spinner/Spinner'

const Admin = () => {

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
       const url = `${customer.bgImage}`
       const bgStyle={
         backgroundImage: 
          `url(${url})`,
          width: '100%',
          height: '320px',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundBlendMode: 'multiply',
          backgroundColor: 'rgba(65, 105, 225, 0.1)',
          zIndex: '-1'
       }
    return (
            <>
            <Container fluid>
                <Row>
                <section className="landingpage_section" style={bgStyle}>
                 </section>
                </Row>
                <Row>
                    <Container>
                      <Row>
                      {itemContent} {isFetching ? <div><Spinner /></div> : ''}   
                      </Row>
                    </Container>  
                </Row>
                <Row>
                  <section className="timer_count mt-4">
                    <Container fluid>
                      <Row>
                        <Col lg='6' md='6'>

                        <div className="clock_top-content">
                          <h4 className="text-white fs-6 mb-2">Limited Time Offers</h4>
                          <h3 className="text-white fs-5 mb-3">Iphone 13 pro</h3>
                        </div>  
                          <Clock />

                          <motion.button whileTap={{scale: 1.2}}className="store_btn">Visit Store</motion.button>
                        </Col>
                        <Col lg='5' md='6'className="text-end">
                          
                        </Col>
                        
                      </Row>
                    </Container>
                  </section>
                </Row>
            </Container>
            </>
        )
    }

};

export default Admin
