import React,{ useRef, useEffect, useState } from 'react'
import logo from '../../assets/images/store.png'
import user from '../../assets/images/user.jpg'
import SearchForm from '../../pages/AutoCompleteSearch'
import { useNavigate, NavLink, Link } from 'react-router-dom'
import { Container, Row, CloseButton, PopoverHeader, PopoverBody, UncontrolledPopover } from 'reactstrap'
import { useSendLogoutMutation } from '../../features/auth/authApiSlice'
import { selectCurrentCart } from '../../features/auth/authSlice'
import { useGetCustomerQuery } from '../../pages/AccountControler/customerApiSlice'
import { useSelector } from 'react-redux'
import useAuth from '../../hooks/useAuth'
import classNames from 'classnames';
import useSticky from './UseSticky';
import Spinner from '../Spinner/Spinner'
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingBasket from '@mui/icons-material/ShoppingCart'
import Avatar from '@mui/material/Avatar'
import { 
  FaBars, 
  FaUserCircle,
  FaCartPlus, 
  FaSignInAlt, 
  FaHome, 
  FaUserCog,
  FaStoreAlt
} from 'react-icons/fa'
import './nav.css'
import LogoutIcon from '@mui/icons-material/Logout';
import PopOver from './PopOver'

const Header = () => {

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: 0,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
      fontSize: '10px',
    },
  }));



  const menuItem = [
    {
        path: "/fatandcap/home",
        name: "Home",
        icon: <FaHome />
    },
    {
      path: "/fatandcap/shop/product?search=store",
      name: "Store",
      icon: <FaHome />
  },
    {
        path: "/fatandcap/auth/register",
        name: "Sign Up",
        icon: <FaSignInAlt />
    },
    {
        path: "/fatandcap/auth/login",
        name: "Sign In",
        icon: <FaSignInAlt />
    },
  ]
  
  const customerMenu = [
    {
      path: "/fatandcap/home",
      name: "Home",
      icon: <FaStoreAlt />
    },
    {
      path: "/fatandcap/shop/product?search=store",
      name: "Store",
      icon: <FaHome />
    }
   ]
  
  const sellerMenu = [
    {
        path: "/fatandcap/auth/seller/",
        name: "Product list",
        icon: <FaUserCircle />
    },
    {
      path: "/fatandcap/auth/seller/manageorder",
      name: "Manage Order",
      icon: <FaUserCog />
    },
    {
      path: "/fatandcap/auth/seller/manageproduct",
      name: "Manage Product",
      icon: <FaUserCog />
    },
    {
        path: "/fatandcap/auth/seller/AccountSetting",
        name: "Manage Account",
        icon: <FaUserCog />
    }
  ]

  const adminMenu = [
    {
        path: "/fatandcap/auth/userseller",
        name: "Product list",
        icon: <FaUserCircle />
    },
    {
        path: "/userseller/AccountSetting",
        name: "Manage Account",
        icon: <FaUserCog />
    }
  ]
  
  const menuCart = [
    {
        path: "/fatandcap/auth/customer/cart",
        name: "Cart",
        icon: <FaCartPlus />
    },
  ]
  const { _id, isSeller, isCustomer, isAdmin } = useAuth()

  const { sticky, stickyRef } = useSticky();

  const navigate = useNavigate()

  const headerRef = useRef(null)

  const[isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen (!isOpen)

  const cart = useSelector(selectCurrentCart)

  const { customer } = useGetCustomerQuery("customerList", {
    selectFromResult: ({ data }) => ({
        customer: data?.entities[_id]
      }),
  })

  const getTotalQuantity = () => {
    let total = 0
    cart?.forEach(item => {
      total += item.quantity
    })
    return total
  }

  const [sendLogout, {
      isLoading,
      isSuccess
  }] = useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess){
      navigate('/fatandcap/auth/login')
      localStorage.removeItem('s_flog')
      localStorage.removeItem('c_flog')
      window.location.reload(false)
    }
  }, [isSuccess, navigate])
  
  if (isLoading) return <div><Spinner /></div>;
  

  return <header ref={headerRef}>
      <Container fluid>
          <Row>
              <nav className={classNames('nav', { sticky })} ref={stickyRef}>
                  <div className='navbar'>
                      <div className="logo-home">
                          <NavLink to={isSeller  ? '/fatandcap/auth/seller' :  isAdmin ?  '/fatandcap/auth/userseller/' : '/fatandcap/home/'}>
                              <Avatar alt="FatAndCap" src={logo} sx={{ width: 60, height: 50 }} variant="square" />
                          </NavLink>
                          <div>
                            { !isSeller && !isAdmin ? <SearchForm /> : '' } 
                          </div>
                      </div>
                      <div className='nav-links' style={{left: !isOpen? "-100%"  : "0"}}>
                          <div className="sidebar-logo">
                              <NavLink className="logo-name" to={isSeller  ? '/seller' :  isAdmin ?  '/fatandcap/auth/userseller/' : '/fatandcap/home/'} onClick={toggle}>
                               <Avatar alt="FatAndCap" src={logo} sx={{ width: 60, height: 50, marginLeft: 0.5 }} variant="square" />
                               
                              </NavLink>
                              <div className='fa-close' style={{left: isOpen ? "0"  : "100%"}}>
                                  <CloseButton onClick={toggle} />
                              </div>
                             
                          </div>
                          {/* Public */}
                 
                          { 
                           (!isSeller) && (!isCustomer) && (!isAdmin) && menuItem.map((item, index) =>(
                                  <NavLink to={item.path} key={index} className="links" onClick={toggle} activeclassname="active">
                                      {/* <div className="nav-icon">{item.icon}</div> */}
                                      <div className="nav-text">{item.name}</div>
                                  </NavLink>
                            )) 
                          }
                            {/* End of Public */}

                          {/* Customer */}
                          {
                          (isCustomer) &&  customerMenu.map((item, index) =>(
                                  <NavLink to={item.path} key={index} className="links" onClick={toggle} activeclassname="active">
                                      {/* <div className="nav-icon">{item.icon}</div> */}
                                      <div className="nav-text">{item.name}</div>
                                  </NavLink>
                              ))
                          } 
                          {/* End of Customer */}

                           {/* Admin */}
                           {
                           (isAdmin) && adminMenu.map((item, index) =>(
                                  <NavLink to={item.path} key={index} className="links" onClick={toggle} activeclassname="active">
                                      {/* <div className="nav-icon">{item.icon}</div> */}
                                      <div className="nav-text">{item.name}</div>
                                  </NavLink>
                              ))
                          }
                        {/* End of Admin */}


                        {/* Seller */}
                          {
                           (isSeller) && sellerMenu.map((item, index) =>(
                                  <NavLink to={item.path} key={index} className="links" onClick={toggle} activeclassname="active">
                                      {/* <div className="nav-icon">{item.icon}</div> */}
                                      <div className="nav-text">{item.name}</div>
                                  </NavLink>
                              ))
                          }
                        {/* End of Seller */}
                            

                        {/* Customer only */}
                          {
                           (!isSeller && !isAdmin) && menuCart.map((cart, index) =>(
                                  <NavLink to={cart.path} key={index} className="links" onClick={toggle} activeclassname="active">
                                        <IconButton aria-label="cart" onClick={() => isCustomer ?  navigate('/fatancap/auth/customer/cart') : ''}>
                                          <StyledBadge badgeContent={isCustomer ? getTotalQuantity() || '0' : '0'} color="secondary">
                                            <ShoppingBasket />
                                          </StyledBadge>
                                        </IconButton>
                                      
                                      {/* <div className="nav-text">{cart.name}</div> */}
                                  </NavLink>
                              ))
                          }  
                          {
                            (isCustomer) && 
                              <>
                                <div style={{cursor: 'pointer'}} className="links" activeclassname="active"> 
                                  <PopOver />
                                </div>     
                              </>
                          }

                          {/* For Seller and admin  only*/}
                          {
                            (isSeller || isAdmin) && 
                            <NavLink className="links">
                                <Avatar className='account-img' alt="..." src={customer?.image === "null" ? user : customer?.image} sx={{ width: 30, height: 30, zIndex: '10'}}  id="PopoverLegacy" />
                      
                                <UncontrolledPopover
                                        placement="bottom"
                                        target="PopoverLegacy"
                                        trigger="legacy"
                                >
                                    <PopoverHeader className='text-center'>
                                     <small>Log Out</small>
                                    </PopoverHeader>
                                    <PopoverBody>
                                    <div >                                      
                                        <Link className='btn border py-1 mb-1 w-100' style={{fontSize: '12px', fontWeight: 'bold',color: '#000', border: '1px solid #E1E0FF'}} onClick={sendLogout}>
                                            <LogoutIcon /> 
                                        </Link>
                                    </div>
                                      </PopoverBody>
                                  </UncontrolledPopover>
                              </NavLink> 
                            }
                      </div>

                      <FaBars className="fa-bars" onClick={toggle}/>
                  </div>
              </nav>
            <div className='div'
                  style={{
                    height: sticky ? `${stickyRef.current?.clientHeight}px` : '0px',
                  }}
                />
        </Row>
      </Container>
  </header>

};

export default Header;


