import React, { useEffect, useState, createRef } from 'react'
import { useSelector } from 'react-redux'
import { CountryDropdown } from 'react-country-region-selector';
import { Row, Col, Form, FormGroup, Label, Input, Container, Button } from 'reactstrap'
import { useGetCustomerQuery } from '../customerApiSlice'
import { NotificationManager } from 'react-notifications'
import { selectCurrentToken } from '../../../features/auth/authSlice'
import useAuth from '../../../hooks/useAuth'
import useTitle from '../../../hooks/useTitle'
import swal from 'sweetalert';
import axios from 'axios';
import '../../form.css'

export const AddProduct  = () => {
    useTitle('Add Product')

    let notif 
    const { _id } = useAuth()
    const nodeRef = createRef(null)
    const token = useSelector(selectCurrentToken)

    const [productName, setProductName] = useState('')
    const [productCategory, setProductCategory] = useState('')
    const [category, setCategory] = useState('')

    const [productColor, setProductColor] = useState('')
    const [productSize, setProductSize] = useState('')

    const [specification, setSpecification] = useState('')
    const [dsecription, setDescription] = useState('')


    const [productBrand, setProductBrand] = useState('')
    const [productCountryOrigin, setProductCountryOrigin] = useState({country: ''})

    const [productMaterial, setProductMaterial] = useState('')
    const [productDimension, setProductDimension] = useState('') 

    const [productShipFrom, setProductShipFrom] = useState('')
    const [productPrice, setProductPrice] = useState('')

    const [productQuatity, setProductQuatity] = useState('')
    const [file, setProductImage] = useState([])

    const { customer } = useGetCustomerQuery("customerList", {
      selectFromResult: ({ data }) => ({
          customer: data?.entities[_id]
        }),
    })  

    useEffect(()=>{
        setProductCategory(category)
        console.log(category)
    },[category])

      const handleProductName = (e) => setProductName(e.target.value)
      const handleCategory = (e) => setCategory(e.target.value)

      const handleProductDescription = (e) => setSpecification(e.target.value)
      const handleFeature = (e) => setDescription(e.target.value)

      const handleProductBrand = (e) => setProductBrand(e.target.value)
      const handleCountryOfOrigin = (val) => {
        setProductCountryOrigin(val)
      }

     const handleProductSize = (e) => setProductSize(e.target.value)
     const handleProductColor = (e) => setProductColor(e.target.value)

      const handleProductMaterial = (e) => setProductMaterial(e.target.value)
      const handleProductDimension = (e) => setProductDimension(e.target.value)

      const handleProductShipFrom = (e) => setProductShipFrom(e.target.value)
      const handleProductPrice = (e) => setProductPrice(e.target.value)
      
      const handleProductQuatity = (e) => setProductQuatity(e.target.value)
      const handleProductImage = (e) => setProductImage([...e.target.files])

    const handleProductSubmit = async (e) => {
        e.preventDefault()
        try{
            const data = new FormData()
            data.append("_id",customer?._id)
            data.append("productName", productName)
            data.append("productCategory", productCategory)

            data.append("specification", specification.split(','))
            data.append("dsecription",dsecription.split(','))

            data.append("productMaterial", productMaterial.split(','))
            data.append("productSize", productSize.split(','))

            data.append("productColor", productColor.split(','))
            data.append("productDimension", productDimension.split(','))

            data.append("productBrand", productBrand)
            data.append("productCountryOrigin", productCountryOrigin)
    
            data.append("productShipFrom", productShipFrom)

            data.append("productPrice", productPrice)
            data.append("productQuatity", productQuatity)
            
            for (let i = 0; i < file.length; i++) {
                data.append('file[]', file[i])
                console.log(file[i])
            }

                
            
            await axios.post("https://projectapi-54nm.onrender.com/api/auth/addproduct", data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-type": "multipart/form-data",
                    },                    
                }).then(res => {
                notif = NotificationManager.success('You have successfully added a product!', 'Successful!', 3000);
                setProductName('')
                setProductCategory('')
                setDescription('')
                setSpecification('')
                setProductMaterial('')
                setProductSize('')
                setProductBrand('')
                setProductCountryOrigin('')
                setProductShipFrom('')
                setProductPrice('')
                setProductQuatity('')
                setProductImage('')
                setCategory('')
                swal({
                    title: "Confirmation!",
                    text: "Product successfully added to fatandcap online shop!",
                    icon: "success",
                    button: "Ok",
                });
            })
        }catch(err){
            if (!err.status) {
                swal({
                    title: "Server error!",
                    text: "No Server Response",
                    icon: "error",
                    button: "Ok",
                  });
            } else {
                swal({
                    title: "Notification",
                    text: `${err.data?.message}`,
                    icon: "error",
                    button: "Ok",
                  });
            }
        }
    } 
    
if (customer) {
    return (
        <>
        <Container className='container-fluid mb-5'>
            <Row>
                <Col>
                <span ref={nodeRef}> {notif} </span>
                <Form className='addItem' onSubmit={handleProductSubmit} style={{minHeight: '100vh', padding: '2rem', marginLeft: 'auto', marginRight: 'auto'}}>
                    <h1 className='form-title text-center mb-3'>Add Product</h1>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label style={{fontSize: "12px"}} for="productName">Product Name:</Label>
                                    <Input 
                                        className='form-control form-control-sm' 
                                        type="textarea" 
                                        id="productName" 
                                        value={ productName }  
                                        onChange={handleProductName} 
                                        placeholder='Product Name'
                                    />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label style={{fontSize: "12px"}} for="productCategory">Product Category:</Label>
                                    <Input  
                                        className='form-control form-control-sm' 
                                        id="productCategory" 
                                        value={category === '---Select Category---' ? '' : productCategory }  
                                        type="hidden" 
                                        placeholder='Product Category'
                                    />  
                                    <Input
                                            className="mb-3 form-control"
                                            type="select"
                                            onChange={handleCategory}
                                        >
                                            <option>
                                                ---Select Category---
                                            </option>
                                            <option>
                                                Watch
                                            </option>
                                            <option>
                                                Mobile/Phone And Gadget
                                            </option>
                                            <option>
                                                Accessories
                                            </option>
                                            <option>
                                                Shorts
                                            </option>
                                            <option>
                                                Jogger
                                            </option>
                                            <option>
                                               Men's Jeans
                                            </option>
                                            <option>
                                               Women's Jeans
                                            </option>
                                            <option>
                                                Shoes
                                            </option>
                                            <option>
                                                Tools
                                            </option>
                                            <option>
                                                Electronis Parts
                                            </option>
                                            <option>
                                                Appliances
                                            </option>
                                            <option>
                                                Furniture
                                            </option>
                                            <option>
                                                Baby Products
                                            </option>
                                            <option>
                                                Other
                                            </option>
                                        </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    {/* next */}
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                            <Label style={{fontSize: "12px"}} for="productBrand">Product Brand:</Label>
                                <Input
                                    className='form-control'
                                    type="textarea"
                                    id="productBrand" 
                                    value={productBrand}  
                                    onChange={handleProductBrand} 
                                    placeholder='Product Brand)'
                                    />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                            <Label style={{fontSize: "12px"}} for="productColor">Product Color:</Label>
                                    <Input 
                                        className='form-control form-control-sm' 
                                        type='textarea'   
                                        id="productColor" 
                                        value={productColor}  
                                        onChange={handleProductColor} 
                                        placeholder='Product Color' />
                            </FormGroup>
                        </Col>
                    </Row>
                     {/* next */}
                                         {/* next */}
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                            <Label style={{fontSize: "12px"}} for="productSize">Product Size:</Label>
                                <Input
                                    className='form-control form-control-sm'
                                    type="textarea"
                                    id="size" 
                                    value={productSize}  
                                    onChange={handleProductSize} 
                                    placeholder='Product Size)'
                                    />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                            <Label style={{fontSize: "12px"}} for="productCountryOrigin">Product Country of origin:</Label>
                            <CountryDropdown
                                className='p-2 w-100'
                                type='select' 
                                value={String(productCountryOrigin)}
                                onChange={handleCountryOfOrigin} />
                                    {/* <Input 
                                        className='form-control form-control-sm' 
                                        type='text'   
                                        id="productCountryOrigin" 
                                        value={productCountryOrigin}  
                                        placeholder='Product Country of origin' /> */}
                            </FormGroup>
                        </Col>
                    </Row>
                     {/* next */}
                     <Row>
                        <Col md={6}>
                            <FormGroup>
                            <Label style={{fontSize: "12px"}} for="productMaterial">Product Material:</Label>
                                    <Input 
                                        className='form-control' 
                                        type='textarea'   
                                        id="productMaterial" 
                                        value={productMaterial}  
                                        onChange={handleProductMaterial} 
                                        placeholder='Product Material' />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                             <FormGroup>
                                <Label style={{fontSize: "12px"}} htmlFor="dimension">Product Dimension:</Label>
                                <Input 
                                    className='form-control' 
                                    type='textarea'   
                                    id="dimension" 
                                    value={productDimension}
                                    onChange={handleProductDimension}
                                    placeholder='Product Dimension'
                                    />
                            </FormGroup>
                        </Col>
                    </Row>
                        {/* next */}
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                            <Label style={{fontSize: "12px"}} for="specification">Product Specification:</Label>
                                <Input
                                    className='form-control'
                                    name="text"
                                    type="textarea"
                                    id="description" 
                                    value={specification}  
                                    onChange={handleProductDescription} 
                                    placeholder='Product Specification'
                                    />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                            <Label style={{fontSize: "12px"}} for="dsecription">Product Description:</Label>
                                    <Input 
                                        className='form-control' 
                                        type='textarea'   
                                        id="dsecription" 
                                        value={dsecription}  
                                        onChange={handleFeature} 
                                        placeholder='Product Description' />
                            </FormGroup>
                        </Col>
                    </Row>

                      {/* next */}
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                            <Label style={{fontSize: "12px"}}  for="productShipFrom">Ship From (Location):</Label>
                                    <Input 
                                        type='text'   
                                        className='form-control' 
                                        id="productShipFrom" 
                                        value={productShipFrom}   
                                        onChange={handleProductShipFrom} 
                                        placeholder='Ship From (Location)' />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                            <Label style={{fontSize: "12px"}} for="productPrice">Product Price:</Label>
                                    <Input 
                                        className='form-control' 
                                        id="productPrice" 
                                        value={productPrice} 
                                        onChange={handleProductPrice} 
                                        type="number" 
                                        placeholder='Product Price'/>
                            </FormGroup>
                        </Col>
                    </Row>
                     {/* next */}
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                            <Label style={{fontSize: "12px"}} forr="productQuatity">Product Quantity:</Label>
                                    <Input 
                                        className='form-control' 
                                        id="productQuatity" 
                                        value={productQuatity} 
                                        onChange={handleProductQuatity} 
                                        type="number" 
                                        placeholder='Product Quantity'/>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                            <Label style={{fontSize: "12px"}} for="file">Product Image:</Label>
                                    <Input 
                                        type="file"
                                        name="file"
                                        multiple
                                        id="input-files"
                                        className="form-control-file border"
                                        onChange={handleProductImage} 
                                         />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='d-flex justify-content-end'>
                            <Button className='public-btn mt-2 px-4'>
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
                </Col>
            </Row>
        </Container>
        </>
      )
    }
}


export default AddProduct