
import React, { useState, useEffect } from 'react'
import { Col } from 'reactstrap'
import { useGetSellerProductQuery } from '../AuthUserApiSlice'
import { selectCurrentToken } from '../../../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Rating from '@mui/material/Rating'
import useAuth from '../../../hooks/useAuth'
import axios from 'axios'
import 'react-confirm-alert/src/react-confirm-alert.css'
import '../../../styles/product-card.css'

const ProductCard = ({itemId}) => {

    const navigate = useNavigate()
    const [review, setReview] = useState(0)
    const [value, setValue] = useState([])
    const { _id } = useAuth()
    const token = useSelector(selectCurrentToken)
   //get  rating
   useEffect(()=>{
    async function getRating(){
     await axios.get(`https://projectapi-54nm.onrender.com/api/auth/ratingbyid/${itemId}`,
         {
             headers: {
                 'Authorization': `Bearer ${token}`,
                 "Content-type": "multipart/form-data",
             },                    
         }).then(res => {
            setValue(res.data.rating)
            setReview(res.data.totalReview)
         })
    } 
    getRating()
 },[itemId, token])  


    const { product } = useGetSellerProductQuery(_id, {
        selectFromResult: ({ data }) => ({
            product: data?.entities[itemId]
        }),
    })

    if (product) { 
      const handleViewDetails = () => navigate(`/fatandcap/auth/seller/product/details/${itemId}`)
        return (
            <>
            <Col lg='2' md='12' className="my-3 product-all">
                <div className="product_item p-2" >
                      <div className="product_image mb-2">
                          <img
                              src={product.itemImage[0].image}
                              alt='...' 
                              onClick={handleViewDetails}                           
                              />
                          </div>
                      <div className="product_info">
                          <p className='text-dark text-truncate fw-bold' style={{fontSize: '10px', color: '#000'}}>{product.itemName}</p>
                      </div>
                      <div className="product_card-bottom d-flex align-items-center justify-content-between">
                          <span style={{fontSize: '8px', color: '#000', fontWeight: 'bold'}}>Sold: {parseInt(product.itemQuantity) < 1  ? 'Out of stock' : product.itemSold === '0' ? '0' : product.itemSold}</span>
                          <span style={{fontSize: '8px', color: '#000', fontWeight: 'bold'}}>Quatity: {product.itemQuantity || '0'}</span>
                      </div>
                      <div className="product_card-bottom d-flex align-items-center justify-content-between">
                          <span className="price">&#36;{product.itemPrice}</span>
                          <span className='d-flex flex-column justify-content-center align-items-center'>
                              <small>
                                <Rating 
                                  style={{fontSize: '12px'}}
                                  name="read-only" 
                                  precision={0.5} 
                                  value={parseFloat(parseFloat(value))} 
                                  readOnly 
                                /> 
                              </small> 
                          </span>
                      </div>
                </div>
            </Col>
            </>
        )
     }else return null
 }

export default ProductCard
