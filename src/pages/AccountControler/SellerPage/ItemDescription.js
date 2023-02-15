import  { useState, useEffect } from 'react'
import { Container, Col, Row, Input, UncontrolledAccordion, AccordionBody, AccordionItem, AccordionHeader} from 'reactstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { Carousel } from 'react-responsive-carousel'
import { useGetProductQuery, useGetSellerQuery } from '../productApiSlice'
import { 
    incrementQuantity,
    decrementQuantity,
    removeItem,
    updateSize,
    updateColor,
    addToCart, 
    selectCurrentCart, 
    selectPublicToken
    } from '../../../features/auth/authSlice'
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import DropDownAddress  from '../../AddressDropDown'
import { useDispatch, useSelector } from 'react-redux'
import useAuth from '../../../hooks/useAuth'
import useTilte from '../../../hooks/useTitle'
import { Avatar, FormHelperText, InputLabel } from '@mui/material'
import {  useGetCustomerQuery } from '../customerApiSlice'
import logo from '../../../assets/images/user.jpg'
import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "../../../styles/productdesciption.css"
import axios from 'axios'
import moment from 'moment'

export const ItemDescription = ({id, size, color}) => {

    useTilte('Product Descrition')
    const shippingFee = 0.75
    const cart = useSelector(selectCurrentCart)
    const token = useSelector(selectPublicToken)
    const { itemId } = useParams()
    const [review, setReview] = useState(0)
    const [value, setValue] = useState([])
    const { _id, isCustomer, isSeller } = useAuth()
    const [comment, setComment] = useState([])

    const { product } = useGetProductQuery("productList", {
        selectFromResult: ({ data }) => ({
            product: data?.entities[itemId]
        }),
    })  

     const [getQuantity, setQuantity] = useState('0')

    const [address, getAddress] = useState('')
    

    const [isSize, setSize] = useState('')

    size = isSize === '---Select Size---' ? '' : isSize

    const [isColor, setColor] = useState('')

    color = isColor === '---Select Color---' ? '' : isColor
    
    const navigate = useNavigate()

    const dispatch = useDispatch()
  
    
    const getTotalQuantity = () => {
        let total = 0
        cart?.forEach(item => {
            if(item.id === itemId){
                total += item.quantity
            }
        })
        return total
      }

    id = product?.id 
    
    const { seller } = useGetSellerQuery('customerList', {
        selectFromResult: ({ data }) => ({
            seller: data?.entities[product?.sellerId]
          }),
    })

    const { customer } = useGetCustomerQuery('customerList', {
        selectFromResult: ({ data }) => ({
            customer: data?.entities[_id]
          }),
    })

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


         //get  comment
    useEffect(()=>{
        async function getComment(){
         await axios.get(`https://projectapi-54nm.onrender.com/api/auth/userreview/${itemId}`,
             {
                 headers: {
                     'Authorization': `Bearer ${token}`,
                     "Content-type": "multipart/form-data",
                 },                    
             }).then(res => {
                setComment(res.data)
             })
        } 
        getComment()
     },[itemId, token])  

    useEffect(()=>{
        getAddress(customer?.address)
    },[customer?.address])
 
    function characterHide(number) {
        let hideNum = [];
        for(let i = 0; i < number.length; i++){
            if(i < number.length-4){
                hideNum.push("*");
              }else{
                hideNum.push(number[i]);
            }
        }
         return hideNum.join("");
    }

    const handleRemoveCartItem = () =>{
        dispatch(removeItem(id))
        setColor('---Select Color---')
        setSize('---Select Size---')
    }

    const handleIncrement = () => {
        if (parseInt(getQuantity) < parseInt(product.itemQuantity)) {
          setQuantity(parseInt(getQuantity) + 1)
        }
      }
      const handleDecrement = () => {
        if (parseInt(getQuantity) > 1) {
          setQuantity(parseInt(getQuantity) - 1)
        }
      }

      useEffect(()=>{
        dispatch(updateSize({id: id, sizes: size}))
      },[dispatch, id, size])

      useEffect(()=>{
        dispatch(updateColor({id: id, colors: color}))
      },[dispatch, id, color])

      const addItemToCart = () => {
        isSeller ? navigate('/fatandcap/auth/seller') : isCustomer ?  dispatch(addToCart({'sellerid': product.sellerId, 'id': product.id, 'itemName': product.itemName, 'addr': customer.address, 'size': '', color: '', 'price': product.itemPrice, 'fee': '', 'image':  product.itemImage[0].image})) : navigate('/fatandcap/auth/login')
        setColor('---Select Color---')
        setSize('---Select Size---')
      }

      const buyItem = () => {
        isSeller ? navigate('/fatandcap/auth/seller') : isCustomer ?  dispatch(addToCart({'sellerid': product.sellerId, 'id': product.id, 'itemName': product.itemName, 'addr': customer.address, 'size': '', color: '', 'price': product.itemPrice, 'fee': '', 'image':  product.itemImage[0].image})) && navigate('/fatandcap/auth/customer/cart') : navigate('/fatandcap/auth/login')
        setColor('---Select Color---')
        setSize('---Select Size---')
      }

      const cartIncrement = () => {
        if(!isCustomer){
            handleIncrement()
        }else{
            dispatch(incrementQuantity(id))
                 }
      }

      const cartDecrement = () => {
        if(!isCustomer){
            handleDecrement()
        }else{
            dispatch(decrementQuantity(id))
        }
      }
     
    if(product){
       let specs = product.itemDetails.specification[0].split(',')
       let des = product.itemDetails.dsecription[0].split(',')
       let images =product.itemImage
       let colors =product.itemDetails.color[0].split(',')
       let sizes =product.itemDetails?.size[0].split(',')
     
    return (
        <>
        <Container>
            <Row className='m-auto'>
                <Col md='4'>
                    <div className="product_item mt-5 py-2">
                        <div className="product_images">
                            <Carousel style={{styles}}>
                                {
                                     images.map((item, key)  =>  {
                                        return(
                                            <div key={key}>
                                                <img 
                                                    src={item.image}
                                                    alt='...'
                                                />
                                            </div>
                                        )
                                 }) 
                                }
                            </Carousel>
                        </div>
                        <div>
                            <div className="product_rating text-center">
                                <span>
                                    <Box
                                        sx={{
                                        '& > legend': { mt: 2 },
                                        }}
                                        >
                                        <span className='d-flex flex-column justify-content-center align-items-center pb-3'>
                                            <small>
                                                <Rating 
                                                    style={{fontSize: '18px'}}
                                                    name="read-only" 
                                                    precision={0.5} 
                                                    value={parseFloat(parseFloat(value))} 
                                                    readOnly 
                                                     /> 
                                            </small> 
                                            <small style={{fontWeight: 'bold', fontSize: '10px', color: 'red'}}>
                                                Total review {parseFloat(review)}
                                            </small>  
                                        </span>
                                    </Box> 
                                </span> 
                            </div>
                        </div>
                    </div>
                </Col>

                <Col md='8'>
                    <Row className='m-auto mt-5 mb-2'>
                        <Col>
                            <div className='mb-1'>
                                <span style={{color: '#4B4A80', fontSize: '20px', fontWeight: 'bolder'}}>{product.itemName}</span>
                            </div>

                            <div className='mb-1 fw-bold'>
                                <p style={{fontSize: '22px', color: 'red'}}>
                                    &#36; {product.itemPrice.includes('.') ? product.itemPrice : product.itemPrice + '.00'}
                                </p>
                            </div>   
                        </Col>
                    </Row>

                    <Row className='m-auto'>
                        <Col>
                            <div className='mb-1'>
                                <p style={{fontSize: '16px'}} className='pt-1 text-dark'>Shipping</p>
                            </div> 
                        </Col>
                    </Row>

                    <Row className='m-auto mb-3'>
                        <Col>
                            <div className='d-flex justify-content-start align-items-center'>
                                <small style={{fontSize: '16px'}} className='d-flex justify-content-between align-items-center text-dark mt-3'>
                                    <small><LocalShippingIcon /> </small>
                                    <small className='mx-2 py-1 text-danger'>Shipping to </small>
                                </small> 
                                <small style={{marginTop: isCustomer ? '15px' : '',  color: !address ? 'red' : 'black', marginLeft: isCustomer ? '12px' : ''}}>
                                    {!isCustomer ? <DropDownAddress /> : !address ? 'No delivery address on file' : address} 
                                </small>
                            </div>
                            <div className='d-flex justify-content-start align-items-center'>
                                <small style={{fontSize: '14px'}} className='pt-1 text-danger '>Shippingfee:</small>
                                <small className='ps-5 pt-1 text-danger '> &#36;{shippingFee}</small>
                            </div>
                        </Col>  
                    </Row>
                    <Row className='m-auto' style={{display: product?.itemDetails.color[0] === 'null' || product?.itemDetails.color[0] === "Null" || product?.itemDetails.color[0] === "" ? 'none' : 'block'}}>
                        <Col>
                            <FormControl variant="standard" sx={{  m: 1, minWidth: 240 }}>
                            <InputLabel id="color">Color:</InputLabel>
                                <Select
                                    labelId="color"
                                    id="color"
                                    value={isColor === '---Select Color---' ? '' : isColor}
                                    onChange={(e) => setColor(e.target.value)}
                                    label="Color"
                                > 
                                  <FormHelperText><em>---Select Color---</em></FormHelperText>
                                        {
                                        colors.map((item, key) =>  {
                                            return(
                                            <MenuItem key={key} value={item}>
                                                    {item}
                                            </MenuItem>
                                            )
                                        })
                                        }
                                </Select>
                            </FormControl>
                        </Col>
                    </Row>
                    
                    <Row className='m-auto' style={{display: product?.itemDetails.size[0] === 'null' || product?.itemDetails.size[0] === 'Null' || product?.itemDetails.size[0] === "" ? 'none' : 'block'}}>
                        <Col>
                            <FormControl variant="standard" sx={{  m: 1, minWidth: 240 }}>
                            
                            <InputLabel id="size">Size:</InputLabel>
                                <Select
                                    labelId="size"
                                    id="size"
                                    value={isSize === '---Select Size---' ? '' : isSize}
                                    onChange={(e) => setSize(e.target.value)}
                                    label="Size"
                                > 
                                    <FormHelperText><em>---Select Size---</em></FormHelperText>
                                        {
                                        sizes.map((item, key) =>  {
                                            return(
                                            <MenuItem key={key} value={item}>
                                                    {`${item}`}
                                            </MenuItem>
                                            )
                                        })
                                        }
                                </Select>
                            </FormControl>
                        </Col>
                    </Row>


                    <Row className='m-auto my-4'>
                        <Col className='d-flex align-items-start'>
                            <span className='d-flex flex-row align-items-center'>
                                <button className='public-btn btn btn-md' style={{backgroundColor: '#E1E0FF'}} onClick={cartDecrement}>
                                   <small style={{fontSize: '14px'}}>-</small>
                                </button>
                                    <Input 
                                        style={{width: '47px'}}
                                        className='form-control text-center'
                                        id='qty'
                                        type='text'
                                        readOnly={true}
                                        value={!isCustomer ? parseInt(getQuantity) : getTotalQuantity() }
                                    />                
                                <button className='public-btn btn btn-md' style={{backgroundColor: '#E1E0FF'}} onClick={cartIncrement} disabled={parseInt(product.itemQuantity) === getTotalQuantity() ? true : false}>
                                     <small style={{fontSize: '14px'}}>+</small>
                                </button> 

                                <button className='public-btn btn btn-md' onClick={handleRemoveCartItem} style={{display: isCustomer ? 'block' : 'none', backgroundColor: '#E1E0FF'}}>
                                        <small  style={{fontSize: '12px'}}>Delete</small>
                                </button> 
                                    {/* Checked product quantity */}
                                <small style={{fontSize: '10px', color: 'red', fontWeight: 'bold'}} className='ms-2'>
                                    {parseInt(product.itemQuantity) < 1  ? '0' : !isCustomer ? `${parseInt(product.itemQuantity) - parseInt(getQuantity)}` : `${parseInt(product.itemQuantity) - getTotalQuantity()}`} 
                                </small>

                                <small className='ms-1' style={{fontSize: '10px', color: 'red', fontWeight: 'bold'}}>
                                    Available
                                </small>
                            </span>
                        </Col>
                    </Row>           
                                        {/* data dispathed yo add to cart */}
                    <Row className='m-auto'>
                        <Col>
                            

                           
                            <Stack spacing={2} direction="row">
                                <Button 
                                 style={{
                                    background: '#E1E0FF',
                                    color: '#4B4A80'
                                }}
                                title='Add to cart' 
                                
                              
                                variant="contained"
                                onClick={addItemToCart} disabled={parseInt(product.itemQuantity) < 1 ? true : false}>
                                        <i className="ri-shopping-cart-fill pe-2"></i>
                                        Add to Cart
                                </Button>
                            

                                <Button 
                                    style={{
                                        background: '#E1E0FF',
                                        color: '#4B4A80'
                                    }}
                                    title='Buy Item' 
                                    variant="contained"
                                    onClick={buyItem} disabled={parseInt(product.itemQuantity) < 1 ? true : false}>
                                    Buy
                                </Button>
                            </Stack>    
                           

                        </Col>
                    </Row>
                </Col>
            </Row>
  
            <Row className='my-3'>
                <Col>
                     {/* start */}
                    <Container>
                        <Row>
                            <Col>
                                <span style={{fontSize: '12px'}} className='ms-3 text-justify text-capitalize text-wrap'>
                                    <UncontrolledAccordion
                                        defaultOpen={[
                                            '1',
                                            '2',
                                            '3'
                                        ]}
                                        stayOpen
                                        >
                                        <AccordionItem>
                                            <AccordionHeader targetId="1">
                                                Product Specification
                                            </AccordionHeader>
                                            <AccordionBody accordionId="1">
                                                {
                                                    specs.map((item, key) =>  {
                                                        return(
                                                            <p style={{fontSize: '14px'}} className='text-dark' key={key}>{item}</p>
                                                        )
                                                    })
                                                }                                 
                                            </AccordionBody>
                                        </AccordionItem>
                                        <AccordionItem>
                                            <AccordionHeader targetId="2">
                                                Product Desription
                                            </AccordionHeader>
                                            <AccordionBody accordionId="2">
                                                {
                                                    des.map((item, key) =>  {
                                                        return(
                                                            <p style={{fontSize: '14px'}} className='text-dark mb-1' key={key}>{item}</p>
                                                        )
                                                    })
                                                }
                                            </AccordionBody>
                                        </AccordionItem>
                                        <AccordionItem style={{display: product.itemDetails.material[0] === 'null' || product.itemDetails.material[0] === 'NA' || product.itemDetails.material[0] === 'na' || product.itemDetails.material[0] === 'N/A' ||  product.itemDetails.material[0] === 'n/a' ||  product.itemDetails.material[0] === "" ? 'none' : 'block'}}>
                                            <AccordionHeader targetId="3">
                                                Product Material
                                            </AccordionHeader>
                                            <AccordionBody accordionId="3">
                                                <div style={{fontSize: '14px'}} className='ms-3 text-justify text-capitalize text-wrap'>
                                                    {product.itemDetails.material}
                                                </div>
                                            </AccordionBody>
                                        </AccordionItem>
                                    </UncontrolledAccordion>
                                    </span>
                                </Col>
                            </Row>
                        </Container>
                    {/* end */}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Container>
                            <Row>
                                <Col>
                                    <div>
                                        <h5 className='my-3 text-center'>
                                           Product Review
                                        </h5>
                                    </div>
                                    <div style={{display: !comment ? 'none' : 'block'}} className='px-3 mb-5 text-left '>
                                        {
                                            comment?.map((item, key) =>{
                                                return(
                                                    <>
                                                    <div key={key}>
                                                        <div className='d-flex flex-row justify-content-start align-items-center mt-3'>
                                                            <Avatar src={!item?.image || item?.image !== "null" ? logo : item?.image} sx={{ width: 35, height: 35, marginRight: '15px' }}/> 
                                                            <span className='d-flex flex-column'>
                                                               <small style={{fontSize: '12px'}}>
                                                                 {characterHide(item?.username)}
                                                                </small>
                                                                <small>
                                                                    <Rating 
                                                                        style={{fontSize: '13px'}}
                                                                        name="read-only" 
                                                                        precision={0.5} 
                                                                        value={parseFloat(item?.one !== "0" ? item.one : item?.two !== "0" ? item?.two : item?.three !== "0" ? item?.three : item?.four !== "0" ? item?.four : item?.five !== "0" ? item?.five : 0)} 
                                                                        readOnly 
                                                                        /> 
                                                                </small> 
                                                            </span>
                                                        </div>
                                                        <div className='d-flex flex-row justify-content-start align-items-center my-2'>
                                                            <span style={{fontSize: '12px'}}>Date: &nbsp; {moment(item?.dateOrder).format('yyyy-MM-DD HH:MM:SS')}</span>
                                                            <span className='ms-3' style={{display: item?.color === 'null' ? 'none' : 'block', fontSize: '12px'}}>Color: &nbsp; {item.color}</span>
                                                        </div>
                                                        <div className='m-auto px-3 text-left py-3 border'>
                                                            <span style={{fontSize: '13px'}} className='px-3'>
                                                                {item.comment}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </Container>                           
                    </Col>
                </Row>
            </Container>
        </>
        )
    }
}

export default ItemDescription

