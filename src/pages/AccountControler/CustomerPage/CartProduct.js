import React, { useEffect } from 'react'
import { 
    selectCurrentCart,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    updateFee,
                } from '../../../features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input } from 'reactstrap'
import { useGetProductQuery, useGetSellerQuery } from '../../AccountControler/productApiSlice'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import './cartImage.css'

export const CartProduct = ({id, image, itemName, price, fee, color, size, quantity=0, total = 0}) => {

    let shippingFee = 0.75

    const cart = useSelector(selectCurrentCart)

    const dispatch = useDispatch()

    const navigate = useNavigate()


    let itemId = id
    // const cart = useSelector(selectCurrentCart)

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

     const cartDecrement = () => {
        dispatch(decrementQuantity(id))

    }

    const cartIncrement = () => {
        dispatch(incrementQuantity(id))
    }


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
            <tr className='cart_tr d-flex justify-content-center'>
                <td className='cart_td_img'>
                    <img 
                        src={image} 
                        alt={itemName}
                        />
                </td>
                <td className='cart_td ms-3 '>
                    <Button className='text-primary btn-light cart_item' onClick={()=> navigate(`/fatandcap/shop/item/details?item=${itemId}`)}>
                        Edit
                    </Button>
                    <div className='ms-2'>
                        <p className='name text-dark mb-1'> 
                            {itemName}
                        </p>

                        <p style={{display: !size ? 'none' : 'block'}} className='size text-dark text-truncate'>
                            Size: {size}
                        </p>

                        <p style={{display: !color ? 'none' : 'block'}} className='color text-dark text-truncate'>
                            Color: {color}
                        </p>

                        <p className='price text-dark mb-1'>Item Price: 
                            <strong className='text-danger ms-2'>&#36;{price.includes('.') ? price : price + '.00'}</strong>
                        </p>
                    </div>            
                    <div className='d-flex mb-1 ms-1'>
                        <Button className='public-btn' onClick={cartDecrement}>
                            <RemoveRoundedIcon style={{fontSize: '14px'}}  />
                        </Button>  

                        <Input
                            className='text-center'
                            style={{width: '50px'}}
                            type='text'
                            readOnly={true}
                            id='quantity'
                            value={quantity}
                            />  

                        <Button className='public-btn' onClick={cartIncrement} disabled={parseInt(product.itemQuantity) === parseInt(quantity) ? true : false}>
                            <AddIcon style={{fontSize: '14px'}}  />
                        </Button>


                        <Button className='public-btn w-100' onClick={() => dispatch(removeItem(id))}>
                           <small style={{fontSize: '11px', fontWeight: 'bold'}}>Delete</small>
                          <span className='del'><DeleteForeverOutlinedIcon /></span> 
                        </Button> 
                    </div>
                </td>
            </tr>
          )
      }   
}

export default CartProduct

