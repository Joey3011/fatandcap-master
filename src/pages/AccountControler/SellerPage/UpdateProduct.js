import React, { useEffect, useState, createRef } from 'react'
import { useSelector } from 'react-redux'
import { CountryDropdown } from 'react-country-region-selector';
import { Row, Col, Form, FormGroup, Label, Input, Container, Button } from 'reactstrap'
import { useGetCustomerQuery } from '../customerApiSlice'
import { NotificationManager } from 'react-notifications'
import { selectCurrentToken } from '../../../features/auth/authSlice'
import { useGetProductQuery } from '../productApiSlice';
import useAuth from '../../../hooks/useAuth'
import useTitle from '../../../hooks/useTitle'
import axios from 'axios';
import '../../form.css'
import { useParams } from 'react-router-dom';

export const UpdateProduct  = () => {
    useTitle('Add Product')

    let notif 
    const { itemId } = useParams()
    const { _id } = useAuth()
    const nodeRef = createRef(null)
    const token = useSelector(selectCurrentToken)


    const { product } = useGetProductQuery("productList", {
        selectFromResult: ({ data }) => ({
            product: data?.entities[itemId]
        }),
    }) 

    const [productName, setProductName] = useState(product?.itemName)
    const [productCategory, setProductCategory] = useState('')
    const [category, setCategory] = useState(product?.itemCategory)

    const [productColor, setProductColor] = useState(product.itemDetails?.color || product.itemDetails[0]?.color)
    const [productSize, setProductSize] = useState(product.itemDetails?.size || product.itemDetails[0]?.size)

    const [specification, setSpecification] = useState(product.itemDetails?.specification || product.itemDetails[0]?.specification)

    const [dsecription, setDescription] = useState(product.itemDetails?.dsecription || product.itemDetails[0]?.dsecription)


    const [productBrand, setProductBrand] = useState(product.itemDetails?.brand || product.itemDetails[0]?.brand)
    const [productCountryOrigin, setProductCountryOrigin] = useState({country: ''})

    const [productMaterial, setProductMaterial] = useState(product.itemDetails?.material || product.itemDetails[0]?.material)
    const [productDimension, setProductDimension] = useState(product.itemDetails?.dimension || product.itemDetails[0]?.dimension) 

    const [productShipFrom, setProductShipFrom] = useState(product.itemDetails?.shipFrom || product.itemDetails[0]?.shipFrom)

    const [productPrice, setProductPrice] = useState(product?.itemPrice)

    const [productQuatity, setProductQuatity] = useState(product?.itemQuantity)
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

      const handleProductSpecification = (e) => setSpecification(e.target.value)
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
        
          const data = new FormData()

          data.append("_id", itemId)
          data.append("sellerId",customer?._id)
          data.append("productName", productName)
          data.append("productCategory", productCategory)

          data.append("specification", specification)
          data.append("dsecription",dsecription)

          data.append("productMaterial", productMaterial)
          data.append("productSize", productSize)

          data.append("productColor", productColor)
          data.append("productDimension", productDimension)

          data.append("productBrand", productBrand)
          data.append("productCountryOrigin", productCountryOrigin)
 
          data.append("productShipFrom", productShipFrom)

          data.append("productPrice", productPrice)
          data.append("productQuatity", productQuatity)
          
          for (let i = 0; i < file.length; i++) {
            data.append('file[]', file[i])
            console.log(file[i])
         }

            
          
        await axios.patch("https://projectapi-54nm.onrender.com/api/auth/editproduct", data,
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
            setProductCategory('')
          }).catch((err)=>{
            notif = NotificationManager.error('All field required!', 'Error!');
        })
    } 
    
if (customer) {
    return (
        <>
        <Container className='container-fluid'>
            <Row>
                <Col>
                <span ref={nodeRef}> {notif} </span>
                <Form className='addItem' onSubmit={handleProductSubmit} style={{minHeight: '100vh', padding: '2rem', marginLeft: 'auto', marginRight: 'auto'}}>
                    <h1 className='form-title text-center mb-3'>Update Product</h1>
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
                                                Mobile And Gadget
                                            </option>
                                            <option>
                                                Accessories
                                            </option>
                                            <option>
                                                 Unisex Apparel
                                            </option>
                                            <option>
                                                Men's Apparel
                                            </option>
                                            <option>
                                                Women's Apparel
                                            </option>
                                            <option>
                                                Men's Shoes
                                            </option>
                                            <option>
                                                Women's Shoes
                                            </option>
                                            <option>
                                                Tools
                                            </option>
                                            <option>
                                                Electronis Parts
                                            </option>
                                            <option>
                                                Phone Parts
                                            </option>
                                            <option>
                                                Electrical parts
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
                                    onChange={handleProductSpecification} 
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
                                Update
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


export default UpdateProduct