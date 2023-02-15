import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Container, Row, Col, Form } from 'reactstrap';
import { useGetCustomerQuery } from '../customerApiSlice'
import { NotificationManager } from 'react-notifications'
import { selectCurrentToken } from '../../../features/auth/authSlice'
import useAuth from '../../../hooks/useAuth'
import useTitle from '../../../hooks/useTitle'
import axios from 'axios';
import '../../form.css'

export const AddProduct  = () => {
    useTitle('Add Product')

    let notif 
    const { _id } = useAuth()
    const nodeRef = React.createRef(null);
    const token = useSelector(selectCurrentToken)
    const [productName, setProductName] = useState('')
    const [productCategory, setProductCategory] = useState('')
    const [productBrand, setProductBrand] = useState('')
    const [productCountryOrigin, setProductCountryOrigin] = useState('')
    const [productMaterial, setProductMaterial] = useState('')
    const [productSize, setProductSize] = useState('')
    const [productShipFrom, setProductShipFrom] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const [productQuatity, setProductQuatity] = useState('')
    const [file, setProductImage] = useState('')

    const { customer } = useGetCustomerQuery("customerList", {
      selectFromResult: ({ data }) => ({
          customer: data?.entities[_id]
        }),
    })  

      const handleProductName = (e) => setProductName(e.target.value)
      const handleProductCategory = (e) => setProductCategory(e.target.value)
      const handleProductBrand = (e) => setProductBrand(e.target.value)
      const handleProductCountryOrigin = (e) => setProductCountryOrigin(e.target.value)
      const handleProductMaterial = (e) => setProductMaterial(e.target.value)
      const handleProductSize = (e) => setProductSize(e.target.value)
      const handleProductShipFrom = (e) => setProductShipFrom(e.target.value)
      const handleProductPrice = (e) => setProductPrice(e.target.value)
      const handleProductQuatity = (e) => setProductQuatity(e.target.value)
      const handleProductImage = (e) => setProductImage(e.target.files[0])

    const handleProductSubmit = async (e) => {
        e.preventDefault()
          const data = new FormData()
          data.append("_id",customer?._id)
          data.append("productName", productName)
          data.append("productCategory", productCategory)
          data.append("productBrand", productBrand)
          data.append("productCountryOrigin", productCountryOrigin)
          data.append("productMaterial", productMaterial)
          data.append("productSize", productSize)
          data.append("productShipFrom", productShipFrom)
          data.append("productPrice", productPrice)
          data.append("productQuatity", productQuatity)
          data.append("file",file)
          
        await axios.post("https://projectapi-x41f.onrender.com/api/auth/addproduct", data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-type": "multipart/form-data",
                },                    
            }).then(res => {
            notif = NotificationManager.success('You have successfully added a product!', 'Successful!', 3000);
            setProductName('')
            setProductCategory('')
            setProductBrand('')
            setProductCountryOrigin('')
            setProductMaterial('')
            setProductSize('')
            setProductShipFrom('')
            setProductPrice('')
            setProductQuatity('')
            setProductImage('')
          }).catch((err)=>{
            notif = NotificationManager.error('Error occured while adding new product!', 'Error!');
        })
    } 
    console.log(customer)
if (customer) {
    return (
        <>
        <Container className='mb-5 d-flex justify-content-center'>
            <Row>
                <Col>
                    <div ref={nodeRef}>
                        {notif}
                    </div>
                </Col>
                <Col> 
                    <Form className='formAddItem mt-5 mb-5' onSubmit={handleProductSubmit}>
                        <h3 className='text-center mb-4'>
                            Add Product
                        </h3>
                        <Col className='mb-1'>
                            <label style={{fontSize: "12px"}} className='form-label' htmlFor="productName">Product Name:</label>
                            <input 
                                className='form-control' 
                                type="text" 
                                id="productName" 
                                value={ productName }  
                                onChange={handleProductName} 
                                placeholder='Product Name'
                                />
                        </Col>
                        <Col className='mb-1'>
                            <label style={{fontSize: "12px"}} className='form-label' htmlFor="productCategory">Product Category:</label>
                            <input  
                                className='form-control' 
                                id="productCategory" 
                                value={productCategory}  
                                onChange={handleProductCategory} 
                                type="text" 
                                placeholder='Product Category'
                                />
                        </Col>
                        <Col className='mb-1'>
                            <label style={{fontSize: "12px"}} className='form-label' htmlFor="productBrand">Product Details:</label>
                            <input 
                                className='form-control' 
                                type='text'                                
                                id="productBrand" 
                                value={productBrand}  
                                onChange={handleProductBrand} 
                                placeholder='Product Brand' />
                        </Col>
                        <Col className='mb-1'>
                            <label style={{fontSize: "12px"}} className='form-label' htmlFor="productCountryOrigin">Product Country of origin:</label>
                            <input 
                                className='form-control' 
                                type='text'   
                                id="productCountryOrigin" 
                                value={productCountryOrigin}  
                                onChange={handleProductCountryOrigin} 
                                placeholder='Product Country of origin' />
                        </Col>
                        <Col className='mb-1'>
                            <label style={{fontSize: "12px"}} className='form-label' htmlFor="productMaterial">Product Material:</label>
                            <input 
                                className='form-control' 
                                type='text'   
                                id="productMaterial" 
                                value={productMaterial}  
                                onChange={handleProductMaterial} 
                                placeholder='Product Material' />
                        </Col>
                        <Col className='mb-1'>
                            <label style={{fontSize: "12px"}} className='form-label' htmlFor="productSize">Product Size/s:</label>
                            <input 
                                className='form-control' 
                                type='text'   
                                id="productSize" 
                                value={productSize}  
                                onChange={handleProductSize} 
                                placeholder='Product Size/s N/A if not applicable' />
                        </Col>
                        <Col className='mb-1'>
                            <label style={{fontSize: "12px"}} className='form-label' htmlFor="productShipFrom">Ship From (Location):</label>
                            <input 
                                type='text'   
                                className='form-control' 
                                id="productShipFrom" 
                                value={productShipFrom}   
                                onChange={handleProductShipFrom} 
                                placeholder='Ship From (Location)' />
                        </Col>
                        <Col className='mb-1'>
                            <label style={{fontSize: "12px"}} className='form-label' htmlFor="productPrice">Product Price:</label>
                            <input 
                                className='form-control' 
                                id="productPrice" 
                                value={productPrice} 
                                onChange={handleProductPrice} 
                                type="number" 
                                placeholder='Product Price'/>
                        </Col>
                        <Col className='mb-4'>
                            <label style={{fontSize: "12px"}} className='form-label' htmlFor="productQuatity">Product Quantity:</label>
                            <input 
                                className='form-control' 
                                id="productQuatity" 
                                value={productQuatity} 
                                onChange={handleProductQuatity} 
                                type="text" 
                                placeholder='Product Quantity'/>
                        </Col>
                        <Col className='mb-2'>
                            <input 
                                id="file"
                                className='custom-file-input' 
                                type="file" 
                                accept="image/*" 
                                onChange={handleProductImage} />
                        </Col>
                        <Col className='d-flex justify-content-end mb-3'>
                            <button className='btn btn-success'>
                                Submit
                            </button>
                        </Col>
                    </Form>
                </Col>
            </Row>
      </Container>
        </>
      )
    }
}


export default AddProduct