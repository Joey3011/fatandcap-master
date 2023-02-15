
import React from 'react'
import { Col } from 'reactstrap'
import { useGetProductQuery } from '../../pages/AccountControler/productApiSlice'
import { useNavigate } from 'react-router-dom'
import {motion} from 'framer-motion'
import useAuth from '../../hooks/useAuth'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/auth/authSlice'
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import 'swiper/css';
import '../../styles/product-card.css'
import 'swiper/css/pagination';

const ProductCard = ({itemId}) => {
    
    const { isCustomer } = useAuth()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { product } = useGetProductQuery("productList", {
        selectFromResult: ({ data }) => ({
            product: data?.entities[itemId]
        }),
    })
    
    const addItemToCart = () => {
         isCustomer ?  dispatch(addToCart({'sellerid': product.sellerId, 'id': product.id, 'itemName': product.itemName, 'addr': '', 'size': '', color: '', 'price': product.itemPrice, 'fee': '', 'image':  product.itemImage[0].image})) : navigate('/fatandcap/auth/login')
      }

    if (product) { 
        const handleViewDetails = () => navigate(`/fatandcap/shop/item/details?item=${itemId}`)
    
        return (
            <>
            <Col lg='2' md='12' className="mb-1 product-all">
                <div className="product_item mb-3 p-2" >
                    <div className="product_image p-1">
                        <img
                            src={product.itemImage[0].image}
                            alt='...' 
                            onClick={handleViewDetails}                           
                            />
                    </div>

                    <div className="product_info mt-1">
                        <p className='text-dark text-truncate fw-bold' style={{fontSize: '10px', color: '#4B4A80'}}>{product.itemName}</p>
                    </div>
                    <div className="product_card-bottom d-flex align-items-center justify-content-between">
                        <span style={{fontSize: '8px', color: '#4B4A80', fontWeight: 'bold'}}>Sold: {parseInt(product.itemQuantity) < 1  ? 'Out of stock' : product.itemSold === '0' ? '0' : product.itemSold}</span>
                        <span style={{fontSize: '8px', color: '#4B4A80', fontWeight: 'bold'}}>Quantity: {product.itemQuantity || 0}</span>
                    </div>
                    
                    <div className="product_card-bottom d-flex align-items-center justify-content-between">
                        <span className="price mb-1"  style={{fontSize: '16px', color: '#4B4A80'}}>&#36;{product.itemPrice}</span>
                        <motion.span className='mb-1' whileTap={{scale: 1.2}} onClick={addItemToCart} disabled={parseInt(product.itemQuantity) < 1 ? true : false}>
                            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                                <Fab 
                                    style={{zIndex: '1'}}
                                    size="small" 
                                    aria-label="add"
                                    sx={{
                                        backgroundColor:"#E1E0FF",
                                        "&:hover": {
                                            backgroundColor:"#E1E0FF"
                                        },
                                    }}
                                >
                                    <AddIcon />
                                </Fab> 
                            </Box>
                        </motion.span>
                    </div>
                </div>
            </Col>
            </>
        )
     }else return null
 }

export default ProductCard
