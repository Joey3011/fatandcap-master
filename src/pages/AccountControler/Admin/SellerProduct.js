
import React from 'react'
import { Col } from 'reactstrap'
import { useGetSellerProductQuery, useDeleteProductMutation } from '../../../pages/productApiSlice'
import { useNavigate } from 'react-router-dom'
import {motion} from 'framer-motion'
import useAuth from '../../../hooks/useAuth'
import { confirmAlert } from 'react-confirm-alert'
import Spinner from '../../../components/Spinner/Spinner'
import 'react-confirm-alert/src/react-confirm-alert.css'
import '../../../styles/product-card.css'

const ProductCard = ({itemId}) => {

    const navigate = useNavigate()
    const { _id } = useAuth()
    
    const [deleteProduct, { isLoading }] = useDeleteProductMutation()

    const { product } = useGetSellerProductQuery(_id, {
        selectFromResult: ({ data }) => ({
            product: data?.entities[itemId]
        }),
    })
    
    if (isLoading) return <div><Spinner /></div>

    // Delete product
   const onDeleteSubmit = () => {
        confirmAlert({
          title: '',
          message: 'Confirm to delete product.',
          buttons: [
            {
              label: 'Yes',
              onClick: async () => {
                if(product !== null){
                    let id = product._id
                    await deleteProduct({ id: id }).then(res => {
                    return alert('Product deleted') 
                      }).catch(err => {
                        return alert(err) 
                      })
                }
              }
            },
            {
              label: 'No',
              onClick: () =>  alert('Action cancelled')
            }
          ]
        });
      };

    if (product) { 
        const handleViewDetails = () => navigate(`/details/${itemId}/`)
        return (
            <>
            <Col lg='2' md='6' className="mb-1">
                <div className="product_item p-2" >
                    <div className="product_img mb-2">
                    <img
                        src={`${product.itemImage.path}`}
                        alt={product.itemImage.name}   
                        height='280px' 
                        onClick={handleViewDetails}                           
                        />
                    </div>
                    <div className="product_info">
                        <p className=' text-truncate' style={{fontSize: '14px', color: '#000', fontWeight: 'bold'}}>{product.itemName}</p>
                    </div>
                    <div className="product_card-bottom d-flex align-items-center justify-content-between">
                        <span style={{fontSize: '10px', color: '#000', fontWeight: 'bold'}}>Sold: {product.itemSold}</span>
                        <span style={{fontSize: '8px', color: '#000', fontWeight: 'bold'}}>Sold: {product.itemLike.rating || 'No rating yet'}</span>
                    </div>
                        <div className="product_card-bottom d-flex align-items-center justify-content-between">
                        <span className="price">&#x20B1;{product.itemPrice}</span>
                        <motion.button className='btn btn-danger btn-sm' whileTap={{scale: 1.2}} title='Delete Product'>
                            <i className="ri-delete-bin-7-line" onClick={onDeleteSubmit}></i>
                        </motion.button>
                    </div>
                </div>
            </Col>
            </>
        )
     }else return null
 }

export default ProductCard
