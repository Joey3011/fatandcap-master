import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setPublicCredentials, selectPublicToken } from '../features/auth/authSlice'
import { Swiper, SwiperSlide } from "swiper/react";
import { useAccessTokenMutation } from '../features/auth/authApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { Pagination } from 'swiper'
import '../styles/product-card.css';
import '../styles/home.css'
import axios from 'axios'
import { useMediaQuery } from '@mui/material'

const Slider = () => {
 
  const year = new Date().getFullYear();

  const dispatch = useDispatch()

  const navigate = useNavigate()
  const [getProduct, setGetProduct] = useState([])
  const token = useSelector(selectPublicToken)
  const [getAccessToken, { isSuccess }] = useAccessTokenMutation()

  const fat_w_acc = useSelector(selectPublicToken)
  
  useEffect(()=>{
    if(fat_w_acc === null){
      const { fat_w_acc } = getAccessToken().unwrap()
      if(isSuccess){
      dispatch(setPublicCredentials({ fat_w_acc }))
      }
    }
  },[dispatch, getAccessToken, isSuccess, fat_w_acc])


  const isSellerLoggedIn = JSON.parse(localStorage.getItem("s_flog"))
  
  const isCustomerLoggedIn = JSON.parse(localStorage.getItem("c_flog"))

    // get  product
    useEffect(()=>{
      async function getProduct(){
       await axios.get(`https://projectapi-54nm.onrender.com/api/auth/getproduct`,
           {
               headers: {
                   'Authorization': `Bearer ${token}`,
                   "Content-type": "multipart/form-data",
               },                    
           }).then(res => {
            setGetProduct(res.data)
           })
      } 
      getProduct()
   },[token]) 

  

  useEffect(()=>{
    if(isSellerLoggedIn){
        navigate('/fatandcap/auth/seller')  
    }else if(isCustomerLoggedIn){
        navigate('/fatandcap/home') 
    }
  },[isSellerLoggedIn, isCustomerLoggedIn, navigate])

 
  const matches = useMediaQuery('(min-width:600px)')

  if (getProduct) {
      return (
      <>
 
                      {/* get the data from  produclistjsx ten filtere/hookuseEffect*/}
                        {/* record fetched in ProductCard will be placed here*/}
                        { !matches ? 
                          (<Swiper
                              spaceBetween={30}
                              slidesPerView={2}
                              modules={[Pagination]}
                              pagination={{ clickable: true }}
                              grabCursor={true}
                              
                            >
                                           
                              {
                                getProduct?.map((item, key)=>{
                                  return(
                                        <SwiperSlide key={key} >
                                          <div className="product_item mb-3 p-2" >
                                          <div className="product_image p-1">
                                            <img 
                                              src={item.itemImage[0].image}
                                              alt='Alt'
                                              onClick={() => navigate(`/fatandcap/shop/item/details?item=${item._id}`)}
                                              />
                                            </div>
                                            </div>
                                        </SwiperSlide>
                                      )
                                  })
                                }
                                              
                          </Swiper>) : 
                            (<Swiper
                              spaceBetween={30}
                              slidesPerView={6}
                              modules={[Pagination]}
                              pagination={{ clickable: true }}
                              grabCursor={true}
                              
                            >
                                           
                              {
                                getProduct?.map((item, key)=>{
                                  return(
                                        <SwiperSlide key={key} >
                                          <div className="product_item mb-3 p-2" >
                                          <div className="product_image p-1">
                                            <img 
                                              src={item.itemImage[0].image}
                                              alt='Alt'
                                              onClick={() => navigate(`/fatandcap/shop/item/details?item=${item._id}`)}
                                              />
                                            </div>
                                            </div>
                                        </SwiperSlide>
                                      )
                                  })
                                }
                                              
                          </Swiper>)
                                  
                        }
    
      </>
    )
  }
};

export default Slider