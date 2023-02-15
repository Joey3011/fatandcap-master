import React from 'react'
import { useGetSellerProductQuery } from '../pages/AccountControler/productApiSlice'
import { useGetCustomerQuery } from './AccountControler/customerApiSlice'
import { selectPublicToken } from '../features/auth/authSlice'
import logo from '../assets/images/user.jpg'
import SellerProductShop from './SellerProductShop'
import { useParams } from 'react-router-dom'
import { Container, Col, Row } from 'reactstrap';
import Spinner from '../components/Spinner/Spinner'
import useTitle from '../hooks/useTitle'
import { Avatar, Rating, useMediaQuery } from '@mui/material'
import { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from "swiper/react";
// import moment from 'moment'

const SellerShop = () => {

  useTitle('Seller Shop')

    const { id } = useParams()
    const matches = useMediaQuery('(min-width:600px)');
    const token = useSelector(selectPublicToken)
    const [sellerRating, setSellerRating] = useState([])
    const [sellerComment, setSellerComment] = useState([])

    const {
        data: product,
        isFetching,
        isSuccess,
        isLoading,
      } = useGetSellerProductQuery(id, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
      })

     const { seller } = useGetCustomerQuery("customerList", {
        selectFromResult: ({ data }) => ({
          seller: data?.entities[id]
        }),
    })

    useEffect(()=>{
        async function getRating(){
         await axios.get(`https://projectapi-54nm.onrender.com/api/auth/getSellerRating`,
             {
                 headers: {
                     'Authorization': `Bearer ${token}`,
                     "Content-type": "multipart/form-data",
                 },                    
             }).then(res => {
                setSellerRating(res.data.rating)
             })
        } 
        getRating()
     },[token])  


       //get  comment
       useEffect(()=>{
        async function getComment(){
         await axios.get(`https://projectapi-54nm.onrender.com/api/auth/sellerreview`,
             {
                 headers: {
                     'Authorization': `Bearer ${token}`,
                     "Content-type": "multipart/form-data",
                 },                    
             }).then(res => {
                setSellerComment(res.data)
             })
        } 
        getComment()
     },[token])  

    const [user, setUser] = useState([])
    
    useEffect(()=>{
      sellerComment.map(id =>{
          return setUser(id.userId)
      })
     },[sellerComment])

      
    const { userimage } = useGetCustomerQuery('customerList', {
          selectFromResult: ({ data }) => ({
            userimage: data?.entities[user]
            }),
      })
      
     function characterHide(number) {
        let hideNum = [];
        for(let i = 0; i < number.length; i++){
            if(i < number.length-4){
                hideNum.push("*");
              }else{
                hideNum.push(number[i]);
            }
        }
         return hideNum.join("");
    }


    if (isLoading) return <div><Spinner /></div>
   
    if(seller && isSuccess){
        const { ids } = product
       const orderContent = ids?.length && ids?.map(itemId => <SellerProductShop key={itemId} itemId={itemId} />)
       
    return (
            <>
            <Container>
                <Row className='mb-3'>
                    <Col>

                    {/* Store for css */}
                        <div>
                            <span className='d-flex justify-content-center align-items-center my-5'>
                              <Avatar 
                                  src={seller?.image === "null" ? logo : seller?.image} 
                                  alt='' 
                                  style={{width: '60px', height: '60px', borderRadius: '50%', border: '1px solid #000'}}/>  
                              
                                  <p className='fw-bold' style={{color: '#000', marginLeft: '10px'}}>
                                   <small style={{fontSize: '16px'}}>{seller?.username} Store</small> 
                                    <span className='d-flex flex-column justify-content-start align-items-center'>
                                          <small className='d-flex flex-column justify-content-start align-items-center'>
                                              <small style={{fontSize: '9px'}} >
                                                  Store Rating
                                              </small>
                                              <Rating 
                                                  style={{fontSize: '18px'}}  
                                                  name="read-only" 
                                                  precision={0.5} 
                                                  value={parseFloat(sellerRating)} 
                                                  readOnly 
                                              /> 
                                        </small> 
                                  </span>
                                  </p>
                            </span>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Container>
                        <Row>
                         {orderContent} {isFetching ? <div><Spinner /></div> : ''}   
                        </Row>
                    </Container>  
                </Row>
                <Row>
                    <Col>
                        <Container>
                            <Row>
                                <Col>
                                    <div>
                                        <h4 className='mt-5 mb-4 text-center'>
                                           Seller Review
                                        </h4>
                                    </div>
                                    <div style={{display: !sellerComment ? 'none' : 'block'}} className='px-3 text-left '>
                                    {
                                        !matches ? (
                                            <Swiper
                                            spaceBetween={15}
                                            slidesPerView={1}
                                            modules={[Pagination]}
                                            pagination={{ clickable: true }}
                                            grabCursor={true}
                                            className="portfolio-slider"
                                            style={{}}
                                            >
                                            {
                                                sellerComment?.map((item, key) =>{
                                                    return(
                                                        <>
                                                        <SwiperSlide key={key}>
                                                        <div>
                                                            <div className='d-flex flex-row justify-content-center align-items-center mt-3 pb-3'>
                                                                <Avatar src={userimage?.image === "null" ? logo : userimage?.image} sx={{ width: 45, height: 45, marginRight: '15px' }}/> 
                                                                <span className='d-flex flex-column'>
                                                                   <small style={{fontSize: '12px'}}>
                                                                     {characterHide(item?.username)}
                                                                    </small>
                                                                    <small>
                                                                        <Rating 
                                                                            style={{fontSize: '13px'}}
                                                                            name="read-only" 
                                                                            precision={0.5} 
                                                                            value={parseFloat(item?.one !== "0" ? item.one : item?.two !== "0" ? item?.two : item?.three !== "0" ? item?.three : item?.four !== "0" ? item?.four : item?.five !== "0" ? item?.five : 0)} 
                                                                            readOnly 
                                                                            /> 
                                                                    </small> 
                                                                </span>
                                                            </div>
                                                            <div className='m-auto px-3 text-left py-3 border'>
                                                                <span style={{fontSize: '13px'}} className='px-3'>
                                                                    {item.comment}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        </SwiperSlide>
                                                        </>
                                                    )
                                                })
                                            }
                                            </Swiper>
                                        ) : (
                                            <Swiper
                                            spaceBetween={15}
                                            slidesPerView={3}
                                            modules={[Pagination]}
                                            pagination={{ clickable: true }}
                                            grabCursor={true}
                                            className="portfolio-slider"
                                            style={{}}
                                            >
                                            {
                                                sellerComment?.map((item, key) =>{
                                                    return(
                                                        <>
                                                        <SwiperSlide key={key}>
                                                        <div>
                                                            <div className='d-flex flex-row justify-content-center align-items-center mt-3 pb-3'>
                                                                <Avatar src={userimage?.image === "null" ? logo : userimage?.image} sx={{ width: 45, height: 45, marginRight: '15px' }}/> 
                                                                <span className='d-flex flex-column'>
                                                                   <small style={{fontSize: '12px'}}>
                                                                     {characterHide(item?.username)}
                                                                    </small>
                                                                    <small>
                                                                        <Rating 
                                                                            style={{fontSize: '13px'}}
                                                                            name="read-only" 
                                                                            precision={0.5} 
                                                                            value={parseFloat(item?.one !== "0" ? item.one : item?.two !== "0" ? item?.two : item?.three !== "0" ? item?.three : item?.four !== "0" ? item?.four : item?.five !== "0" ? item?.five : 0)} 
                                                                            readOnly 
                                                                            /> 
                                                                    </small> 
                                                                </span>
                                                            </div>
                                                            <div className='m-auto px-3 text-left py-3 border'>
                                                                <span style={{fontSize: '13px'}} className='px-3'>
                                                                    {item.comment}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        </SwiperSlide>
                                                        </>
                                                    )
                                                })
                                            }
                                            </Swiper>
                                        )
                                    }
                                    </div>
                                </Col>
                            </Row>
                        </Container>                           
                    </Col>
                </Row>
            </Container>
            </>
        )
    }

};
export default SellerShop
