
import React, {useEffect} from 'react'
import { Col } from 'reactstrap'
import { useGetProductQuery } from '../pages/AccountControler/productApiSlice'
import { useNavigate } from 'react-router-dom'
import {motion} from 'framer-motion'
import { useDispatch } from 'react-redux';
import useAuth from '../hooks/useAuth'
import { addToCart } from '../features/auth/authSlice'
import '../styles/product-card.css'
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

const SellerProductShop = ({itemId}) => {

    const { isCustomer } = useAuth()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        // 👇️ scroll to top on page load
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      }, []);
    
    const { product } = useGetProductQuery(itemId, {
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
                    <div className="product_info">
                        <p className='text-dark text-truncate fw-bold' style={{fontSize: '10px', color: '#000'}}>{product.itemName}</p>
                    </div>
                    <div className="product_card-bottom d-flex align-items-center justify-content-between">
                        <span style={{fontSize: '8px', color: '#000', fontWeight: 'bold'}}>Sold: {parseInt(product.itemQuantity) < 1  ? 'Out of stock' : product.itemSold === '0' ? '0' : product.itemSold}</span>
                        <span style={{fontSize: '8px', color: '#000', fontWeight: 'bold'}}>Rating: {product.itemQuantity || '0'}</span>
                    </div>
                    
                    <div className="product_card-bottom d-flex align-items-center justify-content-between">

                        <span className="price"  style={{fontSize: '14px', color: '#000'}}>&#36;{product.itemPrice}</span>

                        {/* <motion.button className='btn-cart btn btn-sm' whileTap={{scale: 1.2}} o>

                          <i className="ri-shopping-cart-line"></i>
                        </motion.button> */}

                        <motion.span whileTap={{scale: 1.2}} onClick={addItemToCart} disabled={parseInt(product.itemQuantity) < 1 ? true : false}>
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

export default SellerProductShop
