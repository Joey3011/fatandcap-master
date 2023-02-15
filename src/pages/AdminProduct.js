
import React, {useEffect} from 'react'
import { Col } from 'reactstrap'
import { useGetProductQuery, useGetSellerQuery } from '../pages/AccountControler/productApiSlice'
import { useNavigate } from 'react-router-dom'
import {motion} from 'framer-motion'
import useAuth from '../hooks/useAuth'
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/auth/authSlice'
import '../styles/product-card.css'

const AdminProductCard = ({itemId}) => {

    const { isCustomer } = useAuth()
    const navigate = useNavigate()
    const dispatch = useDispatch()
   
    useEffect(() => {
        // 👇️ scroll to top on page load
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      }, []);


    const { product } = useGetProductQuery("productList", {
        selectFromResult: ({ data }) => ({
            product: data?.entities[itemId]
        }),
    })

    const { customer } = useGetSellerQuery("customerList", {
        selectFromResult: ({ data }) => ({
            customer: data?.entities[product?.sellerId]
          }),
    })

    
    if (product) { 
        const handleViewDetails = () => navigate(`/fatandcap/shop/item/details/${itemId}/`)
        return (
            <>
            <Col lg='2' md='6' className="mb-1">
                <div className="product_item p-2" >
                    <div className="product_img mb-2">
                    <img
                        src={product.itemImage[0].image}
                        alt='...'  
                        height='280px' 
                        onClick={handleViewDetails}                           
                        />
                    </div>
                    <div className="product_info">
                        <p className=' text-truncate' style={{fontSize: '12px', color: '#000', fontWeight: 'bold'}}>{product.itemName}</p>
                    </div>
                    <div className="product_card-bottom d-flex align-items-center justify-content-between">
                        <span style={{fontSize: '8px', color: '#000', fontWeight: 'bold'}}>Sold: {parseInt(product.itemQuantity) < 1  ? 'Out of stock' : product.itemSold}</span>
                        <span style={{fontSize: '8px', color: '#000', fontWeight: 'bold'}}>Rating: {product.itemReview.rating || 'No rating yet'}</span>
                    </div>
                    
                    <div className="product_card-bottom d-flex align-items-center justify-content-between">
                        <span className="price" onClick={
                            window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
                        }>&#x20B1;{product.itemPrice.includes('.00') ? product.itemPrice : product.itemPrice + '.00'}</span>
                        <motion.button className='btn-cart btn btn-warning btn-sm' whileTap={{scale: 1.2}} onClick={() => isCustomer ?  dispatch(addToCart({'sellerid': product.sellerId, 'id': product.id, 'itemName': product.itemName, 'size': '', 'price': product.itemPrice, 'image':  product.itemImage.path})) : navigate('/fatandcap/auth/login')} disabled={parseInt(product.itemQuantity) < 1 ? true : false}>
                            <i className="ri-shopping-cart-fill"></i>
                        </motion.button>
                    </div>
                </div>
            </Col>
            </>
        )
     }else return null
 }

export default AdminProductCard
