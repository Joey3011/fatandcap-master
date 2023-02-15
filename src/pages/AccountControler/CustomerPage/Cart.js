import React, { useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormGroup, Input, Button,Table, Container, Row, Col} from 'reactstrap'
import { selectCurrentCart, updateAddress } from '../../../features/auth/authSlice'
import Paypal from '../../../features/auth/Paypal'
import { useGetCustomerQuery } from '../customerApiSlice'
import {regions, provinces, cities, barangays} from 'select-philippines-address'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormHelperText, InputLabel } from '@mui/material'
import MenuItem from '@mui/material/MenuItem';
import CartItem from './CartProduct'
import CartSummary from './CartSummary'
import EmptyCart from './EmptyCart'
import useAuth from '../../../hooks/useAuth'
import useTitle from '../../../hooks/useTitle'
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import swal from 'sweetalert';
import './cartImage.css'



const Cart = () => {
  useTitle('Submit Cart Order')

  let id = []
  
  const cart = useSelector(selectCurrentCart)
  const dispatch = useDispatch()
  const { _id } = useAuth()
  const[isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen)
 

  const [getAddress, setAddress] = useState('default')

  const [isAddress, setIsAddress] = useState('')

  const [shippingAddress, setShippingAddress] = useState()

  const handleGetAddress = (e) => setAddress(e.target.value)

  const { customer } = useGetCustomerQuery("customerList", {
    selectFromResult: ({ data }) => ({
          customer: data?.entities[_id]
        }),
    })

    const getTotalQuantity = () => {
      let total = 0
      cart?.forEach(item => {
        total += item.quantity
        id = item.id
      })
      return total
    }


    const getTotal = () => {
      let totalQuantity = 0
      let totalPrice = 0
      let deliveryFee = 0
      let address = ''
      cart.forEach(item => {
        totalQuantity += item.quantity
        totalPrice += parseInt(item.price) * parseInt(item.quantity)
        deliveryFee += parseFloat(item.fee) 
        address = item.addr
      })
      return {totalPrice, totalQuantity, deliveryFee, address}
    }


    const [regionData, setRegion] = useState([]);
    const [provinceData, setProvince] = useState([]);
    const [cityData, setCity] = useState([]);
    const [barangayData, setBarangay] = useState([]);


    const [regionAddr, setRegionAddr] = useState('');
    const [provinceAddr, setProvinceAddr] = useState('');
    const [cityAddr, setCityAddr] = useState('');
    const [barangayAddr, setBarangayAddr] = useState('');
    const [street, setStreet] = useState('')

    const region = () => {
        regions().then(response => {
            setRegion(response);
        });
    }

    const handleStreet = (e) => setStreet(e.target.value)

    const province = (e) => {
        setRegionAddr(e.target.selectedOptions[0].text);
        provinces(e.target.value).then(response => {
            setProvince(response);
            setCity([]);
            setBarangay([]);
        });
    }

    const city = (e) => {
        setProvinceAddr(e.target.selectedOptions[0].text);
        cities(e.target.value).then(response => {
            setCity(response);
        });
    }

    const barangay = (e) => {
        setCityAddr(e.target.selectedOptions[0].text);
        barangays(e.target.value).then(response => {
            setBarangay(response);
        });
    }
    const brgy = (e) => {
        setBarangayAddr(e.target.selectedOptions[0].text);
    }

    useEffect(() => {
        region()
    }, [])

    useEffect(()=>{
      setShippingAddress(regionAddr !== '' ? `${regionAddr} ${street} ${barangayAddr} ${cityAddr} ${provinceAddr}` : "Select Delivery Address")
    },[regionAddr, street, barangayAddr, cityAddr, provinceAddr])

    useEffect(()=>{
      if(getAddress === 'default'){
          setIsAddress(customer?.address)
      }else if(getAddress === 'other'){
          setIsAddress(shippingAddress === "Select Delivery Address" ? "" : shippingAddress)
      }
    },[customer?.address, getAddress, shippingAddress])
   
    useEffect(()=>{
      dispatch(updateAddress({id: id, address: isAddress}))
    })

    const handleSubmit = () =>{
        if(!getTotal().address){
         swal({
           title: 'Notification!',
           text: 'No Delivery address',
           icon: 'error',
           button: 'Ok',
         });
        }
    }
   let amount = getTotal().totalPrice + getTotal().deliveryFee

  return (
    <Container>
      <Row>
        <Col style={{display: !isOpen ? 'block' : 'none'}}>
            <Table responsive className='cart'>
                <thead className='cart_tr'>
                    <tr className='cart_tr border-bottom'>
                      <th>
                      <span className='cart_tr'>
                        <h4 style={{color: '#4B4A80'}} className='text-center fw-bold m-3'>{getTotalQuantity() === 0 ? 'No Item In Cart' : 'Shopping Cart'}</h4>
                      </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody> 
                  {
                    getTotalQuantity() === 0 ? '' : 
                    (
                    <>
                      <tr className='cart_tr d-flex justify-content-between align-items-center'>
                        <td className='td_check'>
                          <Input
                              id='default'
                              name='getAddress'
                              type="radio"
                              value='default'
                              onChange={handleGetAddress}
                              checked = {getAddress === 'default'}
                            />
                        </td>
                          <td className='td_check_value'>
                            <small style={{fontSize: '13px'}}>
                              Default address on file
                            </small>
                          </td>
                          <td className='cart_td_check'>
                              <small style={{color: !customer?.address ? 'red' : '#000', fontSize: '12px'}}>
                                  {!customer?.address ? 'No delivery address on file' : customer?.address} 
                              </small>
                          </td>
                      </tr>
                      <tr className='cart_tr d-flex justify-content-between align-items-center'>
                          <td className='td_check'>
                            <Input
                                id='other'
                                name='getAddress'
                                type="radio"
                                value='other'
                                onChange={handleGetAddress}
                                checked={getAddress === 'other'}
                              />
                          </td>
                          <td className='td_check_value'>
                            <small style={{fontSize: '13px'}}>
                              Ship to other address
                            </small>
                          </td>
                          <td className='cart_td_check'>
                            {/* Dropdown Adress */}
                        <Container fluid>
                          <Row>
                            <FormControl variant="standard" sx={{  m: 1, minWidth: 150 }}>
                                    <InputLabel id="shipping" style={{fontSize: '13px'}}>
                                        {shippingAddress}
                                    </InputLabel>
                                        <Select
                                            labelId="shipping"
                                            id="shipping"
                                            value={isAddress }
                                            label="shipping"
                                            >
                                          <FormHelperText style={{fontSize: '14px'}} className='text-center'><em>---Select Address---</em></FormHelperText>
                                            <MenuItem >
                                                    <Container >
                                                        <Row className='d-flex flex-column justify-content-center align-items-center'>
                                                            <Col>
                                                                <FormGroup>
                                                                    <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select" onChange={province} onSelect={region}>
                                                                        <option>---Select Region---</option>
                                                                            {
                                                                                regionData && regionData.length > 0 && regionData.map((item) => <option
                                                                                key={item.region_code} value={item.region_code}>{item.region_name}</option>)
                                                                            }
                                                                    </select>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col>
                                                                <FormGroup>
                                                                    <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select"  onChange={city}>
                                                                    <option>---Select Province---</option>
                                                                    {provinceData && provinceData.length > 0 && provinceData.map((item) => <option
                                                                    key={item.province_code} value={item.province_code}>{item.province_name}</option>)
                                                                    }
                                                                    </select>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col>                               
                                                                <FormGroup>
                                                                    <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select"  onChange={barangay}>
                                                                    <option>---Select City---</option>
                                                                    {
                                                                    cityData && cityData.length > 0 && cityData.map((item) => <option
                                                                    key={item.city_code} value={item.city_code}>{item.city_name}</option>)
                                                                    }
                                                                    </select>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col>
                                                              <FormGroup>
                                                                <Input 
                                                                  className='form-control'
                                                                  id="street"
                                                                  type='text' 
                                                                  value={street}
                                                                  onChange={handleStreet}
                                                                  placeholder='Home #/ Street #'
                                                                  required
                                                                    />
                                                              </FormGroup>
                                                            </Col>
                                                            <Col>   
                                                                <FormGroup>
                                                                    <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select"  onChange={brgy}>
                                                                    <option>---Select Barangay---</option>
                                                                    {
                                                                    barangayData && barangayData.length > 0 && barangayData.map((item) => <option
                                                                    key={item.brgy_code} value={item.brgy_code}>{item.brgy_name}</option>)
                                                                    }
                                                                    </select>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                </MenuItem>
                                          </Select>
                                    </FormControl> 
                                </Row>  
                            </Container>                                   
                          </td>
                      </tr>
                    </>
                    )
                  }
                  {
                    getTotalQuantity() === 0 ? (<EmptyCart />) : 
                      (
                        cart?.map(item => {
                          return  <CartItem
                              key= {item.id}
                              id ={item.id}
                              image = {item.image}
                              itemName={item.itemName}
                              price={item.price} 
                              fee = {item.fee}
                              color={item.color}
                              size={item.size}
                              quantity={item.quantity}
                              total = {item.price * item.quantity}
                              />
                          })
                      )
                    }
                    <tr className='cart_tr_check_out mb-5'>
                      <td className='cart_td_checkout_total border-bottom' style={{lineHeight: '75px'}}>
                      {
                            getTotalQuantity() === 0 ? '' : 
                                  (
                          
                                      <p className="text-danger fw-bold check_out_total mt-4">
                                          Total : ({getTotal().totalQuantity} item/s) 
                                          : <span>&#36;{(getTotal().totalPrice).toFixed(3)}</span>
                                      </p>
                   
                                  )
                            }
                      </td>
                      <td className='cart_td_checkout'>
                      {
                            getTotalQuantity() === 0 ? '' : 
                                  (
                                    <div >
                                        <Button onClick={!getTotal().address ? handleSubmit  : toggle}  className='public-btn text-center fw-bold mt-4'>
                                              <small style={{fontSize: '12px'}}>Check Out</small>  
                                            <span className='del'><ShoppingCartCheckoutOutlinedIcon /></span> 
                                        </Button>
                                    </div>
                                 )
                            }
                      </td>
                    </tr>
                  </tbody>
                </Table>
            </Col>
          </Row>
            
            {/* Next */}

          <Row > 
            <Col style={{display: !isOpen ? 'none' : 'block'}}> 
              <Table responsive className='cart m-auto'>
                  <thead className='cart_tr'>
                        <tr>
                          <th>
                            <span>
                                <Button className='public-btn text-center me-5' onClick={toggle}>
                                  <ArrowCircleLeftIcon /> <small className='ms-1 fw-bold'>Back</small>
                                </Button> 
                                <h4 style={{color: '#4B4A80'}} className='text-center fw-bold m-3'>
                                  Total Amount Summary
                                </h4>
                            </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                                {
                                // getTotalQuantity() === 0 ? (<EmptyCart />) : 
                                  (
                                    cart?.map(item => {
                                      return  <CartSummary
                                          key= {item.id}
                                          id ={item.id}
                                          image={item.image}
                                          itemName={item.itemName}
                                          fee = {item.fee}
                                          price={item.price} 
                                          color={item.color}
                                          size={item.size}
                                          quantity={item.quantity}
                                          total = {item.price * item.quantity}
                                          />
                                      })
                                  )
                                }
                          <tr className='cart_tr d-flex justify-content-center mt-3'>
                            <td className='cart_td_total my-2'>
                            {
                                  getTotalQuantity() === 0 ? '' : 
                                        (
                                        <div>
                                          <p className="ship text-danger mt-2 pb-2 pe-4 border-bottom fw-bold">
                                                Shipping Fee &nbsp;&nbsp;
                                                : &nbsp;<span>&#36;{getTotal().deliveryFee}</span>
                                            </p>

                                            <p className="total text-danger mt-2 pb-1 pe-4 border-bottom fw-bold">
                                                Total: ({getTotal().totalQuantity} items)
                                                : &nbsp;&nbsp;<span>&#36;{(getTotal().totalPrice).toFixed(2)}</span>
                                            </p>

                                            <p style={{fontWeight: 'bold'}}  className="totamount text-danger fw-bold mt-2 pe-2 pb-2 border-bottom">
                                                Total amount 
                                                : <span className='ms-2'>&#36;{parseFloat(amount).toFixed(3)}</span>
                                            </p>
                                        </div>
                                        )
                                  }
                             </td>      
                             <td className='cart_td_paypal my-2'>
                            {
                                  getTotalQuantity() === 0 ? '' : 
                                        (
                                        <div className='w-100 mb-5'>
                                            <Paypal  {... {amount} }  />
                                        </div>
                                        )
                                  }
                              </td>
                          </tr>
                      </tbody>
                  </Table> 
             </Col>
         </Row>
    </Container> 
  )
 
};

export default Cart
