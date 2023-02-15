import React, { useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { PopoverHeader, PopoverBody, UncontrolledPopover, FormGroup, Input, Button,Table, Container, Row, Col} from 'reactstrap'
import { selectCurrentCart } from '../../../features/auth/authSlice'
import Paypal from '../../../features/auth/Paypal'
import { useGetCustomerQuery } from '../customerApiSlice'
import CartItem from './CartProduct'
import CartSummary from './CartSummary'
import EmptyCart from './EmptyCart'
import useAuth from '../../../hooks/useAuth'
import useTitle from '../../../hooks/useTitle'
import {regions, provinces, cities, barangays} from 'select-philippines-address'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'

const Cart = () => {
  useTitle('Submit Cart Order')
  
  let address = ''

  const cart = useSelector(selectCurrentCart)
  const { _id } = useAuth()

  const[isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen (!isOpen)

  const [getAddress, setAddress] = useState('default')

  const [shippingAddress, setShippingAddress] = useState('')

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
      })
      return total
    }

    const getTotal = () => {
      let totalQuantity = 0
      let totalPrice = 0
      let deliveryFee = 0
      cart.forEach(item => {
        totalQuantity += item.quantity
        totalPrice += item.price * totalQuantity
        deliveryFee += item.fee 
      })
      return {totalPrice, totalQuantity, deliveryFee}
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
      setShippingAddress(`${regionAddr} ${street} ${barangayAddr} ${cityAddr} ${provinceAddr}`)
    },[regionAddr, street, barangayAddr, cityAddr, provinceAddr])

    if(getAddress === 'default'){
      address = customer?.address
    }else{
      address = shippingAddress
    }

  let amount = getTotal().totalPrice + getTotal().deliveryFee

  return (
    <Container>
      <Row>
        <Col style={{display: !isOpen ? 'block' : 'none'}}>
            <Table responsive className='m-auto'>
                <thead>
                    <tr>
                      <th>
                      <span>
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
                      <tr className='d-flex justify-content-center'>
                        <td style={{width: '50px'}}>
                          <Input
                              id='default'
                              name='getAddress'
                              type="radio"
                              value='default'
                              onChange={handleGetAddress}
                              checked = {getAddress === 'default'}
                            />
                        </td>
                          <td style={{width: '250px'}}>
                            <small>
                              Default address on file
                            </small>
                          </td>
                          <td style={{width: '350px'}}>
                              <small style={{color: !customer?.address ? 'red' : '#000'}}>
                                  {!customer?.address ? 'No delivery address on file' : customer?.address} 
                              </small>
                          </td>
                      </tr>
                      <tr className='d-flex justify-content-center'>
                          <td style={{width: '50px'}}>
                            <Input
                                id='other'
                                name='getAddress'
                                type="radio"
                                value='other'
                                onChange={handleGetAddress}
                                checked={getAddress === 'other'}
                              />
                          </td>
                          <td style={{width: '250px'}}>
                            <small>
                              Ship to other address
                            </small>
                          </td>
                          <td style={{width: '350px'}}>
                            {/* Dropdown Adress */}
                              <Button 
                                className='btn-light border-0 px-3'
                                id="PopoverLegacy1"
                                type="button"
                                >
                                <small style={{fontSize: '14px'}}>{regionAddr === "" ? 'Select Location' : `${regionAddr} ${street} ${barangayAddr} ${cityAddr} ${provinceAddr}`}  <KeyboardArrowDownIcon /></small> 
                              </Button>
                              <UncontrolledPopover 
                                placement="bottom"
                                target="PopoverLegacy1"
                                trigger="legacy"
                                >
                              <PopoverHeader>
                                  Location
                              </PopoverHeader>
                              <PopoverBody>
                                  <FormGroup>
                                    <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select" onChange={province} onSelect={region}>
                                        <option>---Select Region---</option>
                                            {
                                              regionData && regionData.length > 0 && regionData.map((item) => <option
                                              key={item.region_code} value={item.region_code}>{item.region_name}</option>)
                                            }
                                        </select>
                                      </FormGroup>
                                      <FormGroup>
                                        <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select"  onChange={city}>
                                            <option>---Select Province---</option>
                                              {
                                                provinceData && provinceData.length > 0 && provinceData.map((item) => <option
                                                key={item.province_code} value={item.province_code}>{item.province_name}</option>)
                                              }
                                        </select>
                                      </FormGroup>
                                      <FormGroup>
                                        <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select"  onChange={barangay}>
                                          <option>---Select City---</option>
                                            {
                                              cityData && cityData.length > 0 && cityData.map((item) => <option
                                              key={item.city_code} value={item.city_code}>{item.city_name}</option>)
                                            }
                                          </select>
                                      </FormGroup>
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
                                      <FormGroup>
                                        <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select"  onChange={brgy}>
                                            <option>---Select Barangay---</option>
                                              {
                                                barangayData && barangayData.length > 0 && barangayData.map((item) => <option
                                                key={item.brgy_code} value={item.brgy_code}>{item.brgy_name}</option>)
                                              }
                                            </select>
                                      </FormGroup>
                                      <Input 
                                        type='hidden'
                                        id='shippingAddress'   
                                        value={shippingAddress}                          
                                        />
                                  </PopoverBody>
                              </UncontrolledPopover> 
                          
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
                              fee = {item.fee * item.quantity}
                              color={item.color}
                              size={item.size}
                              quantity={item.quantity}
                              total = {item.price * item.quantity}
                              />
                          })
                      )
                    }
                    <tr className='d-flex justify-content-center align-items-center'>
                      <td style={{width: '300px'}} className='my-3'>
                      {
                            getTotalQuantity() === 0 ? '' : 
                                  (
                          
                                      <p style={{fontSize: '14px'}}  className="text-danger pb-3 ps-5 ms-5 fw-bold">
                                          Total: ({getTotal().totalQuantity} items) 
                                          : <span>&#36;{getTotal().totalPrice}</span>
                                      </p>
                   
                                  )
                            }
                      </td>
                      <td style={{width: '300px'}} className='my-3'>
                      {
                            getTotalQuantity() === 0 ? '' : 
                                  (
                                      <Button className='text-center px-4 ms-5 fw-bold'  onClick={toggle} >
                                          <small>Check Out</small>
                                      </Button>
                                 )
                            }
                      </td>
                    </tr>
                  </tbody>
                </Table>
            </Col>
          </Row>
            
            {/* Next */}

          <Row style={{display: !isOpen ? 'none' : 'block'}}>
              <Col>
                  <Table className='m-auto' responsive>
                      <thead>
                          <tr>
                            <th>
                            <span>
                                <Button className='btn-light text-center me-5 px-2' onClick={toggle}>
                                  <ArrowCircleLeftIcon /> <small className='ms-1 fw-bold'>Back</small>
                                </Button> 
                                <h4 className='text-center fw-bold m-3'>
                                  Total Amount Summary
                                </h4>
                            </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                                {
                                getTotalQuantity() === 0 ? (<EmptyCart />) : 
                                  (
                                    cart?.map(item => {
                                      return  <CartSummary
                                          key= {item.id}
                                          id ={item.id}
                                          image={item.image}
                                          itemName={item.itemName}
                                          fee = {item.fee * item.quantity}
                                          price={item.price} 
                                          color={item.color}
                                          size={item.size}
                                          quantity={item.quantity}
                                          total = {item.price * item.quantity}
                                          />
                                      })
                                  )
                                }
                          <tr className='d-flex justify-content-center mt-3'>
                            <td className='my-2' style={{width: '300px'}}>
                            {
                                  getTotalQuantity() === 0 ? '' : 
                                        (
                                        <div>
                                          <p style={{fontSize: '14px'}}  className="text-danger mt-2 pb-2 pe-4 border-bottom fw-bold">
                                                Shipping Fee
                                                : <span className='ms-4'>&#36;{getTotal().deliveryFee}</span>
                                            </p>

                                            <p style={{fontSize: '14px'}}  className="text-danger mt-2 pb-2 pe-4 border-bottom fw-bold">
                                                Total: ({getTotal().totalQuantity} items) 
                                                : <span className='ms-3'>&#36;{getTotal().totalPrice}</span>
                                            </p>

                                            <p style={{fontSize: '16px', fontWeight: 'bold'}}  className="text-danger fw-bold mt-4 pe-2 pb-2 border-bottom">
                                                Total amount 
                                                : <span className='ms-2'>&#36;{(getTotal().totalPrice + getTotal().deliveryFee)}</span>
                                            </p>
                                        </div>
                                        )
                                  }
                            </td>
                            <td className='my-2' style={{width: '300px'}}>
                            {
                                  getTotalQuantity() === 0 ? '' : 
                                        (
                                        <div className='ms-5 w-100 mb-5'>
                                            <Paypal  {... {amount, address} }  />
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
