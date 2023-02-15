
import React from 'react'
import { Col } from 'reactstrap'
import { useGetSellerProductQuery } from '../../../pages/productApiSlice'
import { useNavigate } from 'react-router-dom'
import {motion} from 'framer-motion'
import useAuth from '../../../hooks/useAuth'
import '../../../styles/product-card.css'

const ProductCard = ({itemId}) => {

    const navigate = useNavigate()
    const { _id } = useAuth()
    
    const { product } = useGetSellerProductQuery(_id, {
        selectFromResult: ({ data }) => ({
            product: data?.entities[itemId]
        }),
    })
    if (product) { 
        const handleViewDetails = () => navigate(`/details/${itemId}/`)
        return (
            <>
            <Col lg='2' md='6' className="mb-1">
                <div className="product_item p-2" >
                    <div className="product_img mb-2">
                    <img
                        src={`${product.itemImage.path}`}
                        alt={product.itemImage.name}   
                        height='280px' 
                        onClick={handleViewDetails}                           
                        />
                    </div>
                    <div className="product_info">
                        <p className=' text-truncate' style={{fontSize: '14px', color: '#000', fontWeight: 'bold'}}>{product.itemName}</p>
                    </div>
                    <div className="product_card-bottom d-flex align-items-center justify-content-between">
                        <span style={{fontSize: '10px', color: '#000', fontWeight: 'bold'}}>Sold: {product.itemSold}</span>
                        <span style={{fontSize: '8px', color: '#000', fontWeight: 'bold'}}>Sold: {product.itemLike.rating || 'No rating yet'}</span>
                    </div>
                    
                    <div className="product_card-bottom d-flex align-items-center justify-content-between">
                        <span className="price">&#x20B1;{product.itemPrice}</span>
                        <motion.button className='btn-cart btn btn-warning btn-sm' whileTap={{scale: 1.2}}>
                            <i className="ri-shopping-cart-fill"></i>
                        </motion.button>
                    </div>
                </div>
            </Col>
            </>
        )
     }else return null
 }

export default ProductCard
