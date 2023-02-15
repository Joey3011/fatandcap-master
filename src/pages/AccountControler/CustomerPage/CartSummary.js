import React from 'react'
import { useGetProductQuery, useGetSellerQuery } from '../../AccountControler/productApiSlice'
import { selectCurrentCart, updateFee, updateAddress } from '../../../features/auth/authSlice'
import './cartImage.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

export const CartSummary = ({id, image, itemName, price, fee, color, size, quantity=0, total = 0}) => {

    let itemId = id

    let shippingFee = 0.75

    const navigate = useNavigate()
    
    const dispatch = useDispatch()

    const cart = useSelector(selectCurrentCart)

    const { product } = useGetProductQuery("productList", {
        selectFromResult: ({ data }) => ({
            product: data?.entities[id]
        }), 
    })
    const { seller } = useGetSellerQuery('customerList', {
        selectFromResult: ({ data }) => ({
            seller: data?.entities[product?.sellerId]
          }),
    })
  
 
    useEffect(()=>{
        const getShippingFee = () => {
            let fee = 0
            let sellers = 0
            cart?.forEach(item => {
                if(item.sellerid === seller?._id){ 
                    sellers += 1
                }
            })
            fee = shippingFee / sellers
            return fee
        }
        dispatch(updateFee({id: id, fees: getShippingFee()}))
    },[cart, dispatch, id, seller?._id, shippingFee])

    if(product){
        return (
            <tr className='cart_tr d-flex justify-content-center my-3'>
                <td className='cart_td_img'>
                    <img 
                        width={50}
                        height={150}
                        src={image} 
                        alt={itemName}
                    />
                </td>
                <td className='cart_td ms-3 border-bottom'>
                    <div style={{cursor: 'pointer'}} className='text-primary btn-light cart_item' onClick={()=> navigate(`/fatandcap/shop/item/details?item=${itemId}`)}>
                        Edit
                    </div>
                    <div>
                        <p className='name text-dark mb-1'>
                             {itemName}
                        </p>

                        <p style={{display: !size ? 'none' : 'block'}} className='size text-dark text-truncate'>
                            Size: {size}
                        </p>

                        <p style={{display: !color ? 'none' : 'block'}} className='color text-dark text-truncate'>
                            Color: {color}
                        </p>

                        <p className='price text-dark'>Item Price: 
                            <small className='text-dark ms-2'>&#36;{price.includes('.') ? price : price + '.00'}</small>
                        </p>

                        <p className='fee text-dark'>
                            Shipping Fee: {fee}
                        </p>

                        <p className='qty text-truncate text-dark'>
                            Quantity: &nbsp; {quantity}
                        </p>

                    </div>            
                    <div>
                        <p className="totamount text-danger fw-bold">
                            <span>
                                Total: &#x20B1;{total.toFixed(3)}
                            </span>
                        </p>
                    </div>
                </td>
            </tr>
          )
      }   
}

export default CartSummary

