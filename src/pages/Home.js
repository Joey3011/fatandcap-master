import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Button } from 'reactstrap'
import { useGetProductQuery } from './AccountControler/productApiSlice'
import {motion} from 'framer-motion'
import useTitle from '../hooks/useTitle'
import Product from '../components/shop/ProductCard'
import Spinner from '../components/Spinner/Spinner'
import Clock from '../components/shop/Clock'
import { Carousel } from 'antd';
import PromoImg from '../assets/images/baby-clothes-02.png'
import { setPublicCredentials, selectPublicToken } from '../features/auth/authSlice'
import { useAccessTokenMutation } from '../features/auth/authApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import Slider from './Slider'
import Bannertwo from '../assets/images/banner2.jpg';
import Bannerthree from '../assets/images/banner3.jpg';
import Bannerfour from '../assets/images/banner4.jpg';
import Bannerone from '../assets/images/banner1.PNG';
import { PaginationItem, useMediaQuery } from '@mui/material'
import Box from "@mui/material/Box";
import { Pagination } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '../styles/product-card.css';
import '../styles/home.css'


const Home = () => {
  useTitle('Home')

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


  const isSellerLoggedIn = JSON.parse(localStorage.getItem("s_flog"))
  
  const isCustomerLoggedIn = JSON.parse(localStorage.getItem("c_flog"))

  useEffect(()=>{
    if(isSellerLoggedIn){
        navigate('/fatandcap/auth/seller')  
    }else if(isCustomerLoggedIn){
        navigate('/fatandcap/home') 
    }
  },[isSellerLoggedIn, isCustomerLoggedIn, navigate])

  const {
    data: item,
    isLoading,
    isFetching
  } = useGetProductQuery('productList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })
  const matches = useMediaQuery('(min-width:600px)')

  const match = useMediaQuery('only screen and (max-width: 472px)')
 
  if (isLoading) return <div><Spinner /></div>

  if (item) {
    const { ids } = item
    const itemContent = ids?.length && ids.map(itemId => <Product key={itemId} itemId={itemId} />)
    // const handleViewDetails = () => navigate(`/fatandcap/shop/item/details?item=${getProduct._id}`)
    const contentStyle = {
      height: '160px',
      lineHeight: '200px',
      textAlign: 'center',
      border: 'none'
    };
      return (
      <>
        <Container fluid>
              {/* <span>
                  <AutoCompleteSearch />
              </span> */}
            <Row>
              <Col>
                    <section>
                        <span className='d-flex justify-content-center align-items-center mt-5 pt-5'
                        style={{position: 'absolute', width: '100%', height: '160px', left: '0'}}
                        >     
                        {
                            !matches ? (
                              <motion.button whileTap={{scale: 1.1}}
                              onClick={()=>  navigate(`/fatandcap/shop/product?search=store`)}
                                className='public-btn btn py-1 px-2 fw-bold' 
                                style={{ marginTop: '-7rem', position: 'absolute', zIndex: '100', backgroundColor: 'rgba(255,255,255,0.5)', color: '#4B4A80', fontSize: '0.7rem'}}
                              >
                              SHOP NOW
                              </motion.button>
                            ) : (
                              <motion.button whileTap={{scale: 1.1}}
                              onClick={()=>  navigate(`/fatandcap/shop/product?search=store`)}
                                className='public-btn btn btn-sm py-1 px-3' 
                                style={{position: 'absolute', zIndex: '100', backgroundColor: 'rgba(255,255,255,0.5)', color: '#4B4A80', marginTop: '75px'}}
                              >
                              SHOP NOW
                              </motion.button>
                            )
                        }
                          
                        </span> 
                        <Container fluid>
                            <Row>
                              <Col>
                                  <Carousel autoplay className="landingpage_section">
                                      <div style={contentStyle}>
                                        <img src={Bannertwo} alt="" 
                                        style={{border: 'none'}}
                                        />
                                      </div>

                                      <div style={contentStyle}>
                                        <img src={Bannerthree} alt="" />
                                      </div>
                                      <div style={contentStyle}>
                                        <img src={Bannerfour} alt="" />
                                      </div>
                                      <div style={contentStyle}>
                                        <img src={Bannerone} alt="" />
                                      </div>
                                  </Carousel>
                              </Col>
                            </Row>
                        </Container>
                    </section>

                <section className="trending_products">
                    <Box
                          sx={{
                              margin: "auto",
                              width: "fit-content",
                              alignItems: "center",
                              
                          }}
                      >
        
                          <Container fluid>
                            <Row>
                              {itemContent}{isFetching ? <div><Spinner /></div> : ''}
                            </Row>
                          </Container>

                        <span >
                          <Pagination  
                            className='d-flex justify-content-center align-items-center'
                            style={{backgroundColor: '#FFFDFA',zIndex: "1"}}
                            
                                renderItem={(item) => (
                                  <PaginationItem
                                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                    {...item}
                                  />
                                )}
                              />
                        </span>
                    </Box>
                </section>

                <section className="timer_count">
                {!matches ? (
                  <Container>
                    <Row>
                      <Col lg="6" md="12">
                        <div className="clock_top-content">
                          <h4 className="text-white fs-5 mb-2">
                            Limited Time Offers
                          </h4>
                          <h3 className="text-white fs-6 mb-3">
                            Jolly pink Two babies
                          </h3>
                        </div>
                        <Clock />

                        <motion.button
                          whileTap={{ scale: 1.2 }}
                          className="store_btn w-25"
                          style={{
                            fontSize: '0.7rem',
                          }}
                          onClick={() =>
                            navigate(`/fatandcap/shop/product?search=store`)
                          }
                        >
                          Visit Store
                        </motion.button>
                      </Col>
                      <Col lg="6" md="12" className="text-end counter_img">
                        <img src={PromoImg} alt="" />
                      </Col>
                    </Row>
                  </Container>
                ) : (
                  <Container>
                    <Row>
                      <Col lg="6" md="12">
                        <div className="clock_top-content">
                          <h4 className="text-white fs-6 mb-2">
                            Limited Time Offers
                          </h4>
                          <h3 className="text-white fs-5 mb-3">
                            Jolly pink Two babies
                          </h3>
                        </div>
                        <Clock />

                        <motion.button
                          whileTap={{ scale: 1.2 }}
                          className="store_btn w-50"
                          onClick={() =>
                            navigate(`/fatandcap/shop/product?search=store`)
                          }
                        >
                          Visit Store
                        </motion.button>
                      </Col>
                      <Col lg="6" md="12" className="text-end counter_img">
                        <img src={PromoImg} alt="" />
                      </Col>
                    </Row>
                  </Container>
                )}
              </section>


                {/* new arriaval*/}

                {/* posting services data*/}

                <section className="best_deals">
                  <Container>
                    <Row>
                        <Col className='product_all'>
                              <Slider />
                        </Col>
                    </Row>
                  </Container>  
                </section>
            </Col>
            </Row>
        </Container>
      </>
    )
  }
};

export default Home