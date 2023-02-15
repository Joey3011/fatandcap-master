import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import {motion} from 'framer-motion'
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { setPublicCredentials, selectPublicToken } from '../../features/auth/authSlice'
import { useAccessTokenMutation } from '../../features/auth/authApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../features/auth/authSlice';
import * as Realm from 'realm-web' 
import { Pagination, PaginationItem, useMediaQuery } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import useTitle from '../../hooks/useTitle'
import useAuth from '../../hooks/useAuth';
import '../../styles/product-card.css';
import '../../styles/home.css'


const Home = () => {
  useTitle('Home')
 
  let itemId = ""

  const [product, setProductSearch] = useState([])

  const { isCustomer } = useAuth()

  const queryParameters = new URLSearchParams(window.location.search)

  let value = queryParameters.get("search")

  const year = new Date().getFullYear();

  const dispatch = useDispatch()

  const navigate = useNavigate()

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

  useEffect(()=>{
    const searchFunction = (async() =>{
        if(value.length > 0){
          try{
              const APP_ID = process.env.REACT_APP_REALM_APP_ID
              const app = new Realm.App({ id: APP_ID }) 
              const credentials = Realm.Credentials.anonymous()
              const user = await app.logIn(credentials);
              const itemSearch = await user.functions.search_Cat(value)
              setProductSearch(itemSearch)
              }catch(err){
                console.log(err)
              }
        }else{
          setProductSearch([])
        }
    })
    searchFunction()
 },[value])


 useEffect(()=>{
  const searchFunction = (async() =>{
      if(product.length < 1){
        try{
            const APP_ID = process.env.REACT_APP_REALM_APP_ID
            const app = new Realm.App({ id: APP_ID }) 
            const credentials = Realm.Credentials.anonymous()
            const user = await app.logIn(credentials);
            const itemSearch = await user.functions.searchProduct(value)
            setProductSearch(itemSearch)
            }catch(err){
              console.log(err)
            }
      }
  })
  searchFunction()
},[value, product.length])


  if (product.length > 0){
    const addItemToCart = () => {
        isCustomer ?  dispatch(addToCart({'sellerid': product.sellerId, 'id': product._id, 'itemName': product.itemName, 'addr': '', 'size': '', color: '', 'price': product.itemPrice, 'fee': '', 'image':  product.itemImage[0].image})) : navigate('/fatandcap/auth/login')
     }
       
      return (
      <>
          <Box
              sx={{
                  width: "100%",
                  alignItems: "center",
                  marginTop: '50px'                     
                }}
            >
                  <Container >
                    <Row>
                        {
                        product.map((product, key) => {
                            return(
                              <Col lg='2' md='12' className="mb-1 product-all" key={key}>
                              <div className="product_item mb-3 p-2" >
                                  <div className="product_image p-1">
                                      <img
                                          src={product.itemImage[0].image}
                                          alt='...' 
                                          onClick={() => navigate(`/fatandcap/shop/item/details?item=${itemId = product?._id}`)}                          
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
                                    )
                                })
                            }
                        </Row>
                  </Container>
              <span >
                  <Pagination  
                      className='d-flex justify-content-center align-items-center mt-3'
                      style={{backgroundColor: '#FFFDFA'}}
                      renderItem={(item) => (
                          <PaginationItem
                            slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                              {...item}
                            />
                          )}
                      />
              </span>
          </Box>
      </>
    )
  }
};

export default Home