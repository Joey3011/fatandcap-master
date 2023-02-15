

import React, {useState, useRef, useEffect} from 'react';
import {PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js";
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentCart, removeItem } from './authSlice'
import { useGetCustomerQuery } from '../../pages/AccountControler/customerApiSlice'
import { useAddOrderMutation } from '../../pages/AccountControler/OrderApiSlice'
import useAuth from '../../hooks/useAuth'
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const Paypal = ({amount}) => {
    
    let notif
    let order = []
    const totalInCart = []
    const nodeRef = useRef(null)
    const { _id, email } = useAuth()
    // const dispatch = useDispatch()
    const [itemPrice, setItemPrice] = useState(0)
    // const [getAddress, setAddress] = useState('')
    const dispatch = useDispatch()
    const cart = useSelector(selectCurrentCart)
    const navigate = useNavigate();

    const [paidFor, setPaidFor] = useState(false);
    const [error, setError] = useState(null)

    const { customer } = useGetCustomerQuery("customerList", {
      selectFromResult: ({ data }) => ({
            customer: data?.entities[_id]
          }),
      })

    const handleApprove = () => {
        setPaidFor(true);
    }

    if(paidFor){
        toast("Payment Successfull")
       
    }

    if(error){
        toast(error);
    }

    useEffect(()=>{
        setItemPrice(amount)
    },[amount])

    const [addOrder, { isSuccess }] =  useAddOrderMutation()

    const cartItem = () => {
      cart?.map((item) => {
       let orderCart = {
         customerId: _id,
         customerEmail: email,
         customerName: `${customer?.firstName} ${customer?.lastName}`,
         address: item.addr,
         sellerid: item.sellerid, 
         itemid: item.id, 
         image: item.image,
         name: item.itemName, 
         size: item.size, 
         color: item.color,
         price: item.price,
         shippingFee: item.fee, 
         qty: item.quantity,
         totalItemPrice: item.price * item.quantity + item.fee
        }
      totalInCart.push(orderCart)
      return orderCart
     })
     return totalInCart
    }
    cartItem()

    if(isSuccess){
        swal({
            title: "Notification!",
            text: `Payment successfully process!`,
            icon: "success",
            button: "Ok",
          });
        navigate('/fatandcap/home') 
        window.location.reload(false)
    }
    const onHandleSubmitOrder = async () => {
        try{
            await addOrder({cartItem: totalInCart}).unwrap()
                cart?.map((item) => {
                    return dispatch(removeItem(item.id))
                })
        } catch (err) {
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
  
        return (
            <>
                <span ref={nodeRef}> {notif} </span>
                    <PayPalScriptProvider options={{ "client-id": 'Afxf6LeiYk7ig45kD5-DaQvQJRkkVZEEwE9aOAI5V1ifYyFY5f_cmZMwHhJeI5-pLb8mvyPHUs7y0SKc' }}>
                        <PayPalButtons 

                        style={{ 
                            layout: "vertical",
                            color: "blue",
                            shape: "pill",
                            label: "paypal"
                            }}  


                            onClick={(data, actions) => {
                                    const hasAlreadyBoughtCourse = false;
                                    if(hasAlreadyBoughtCourse){
                                        setError("You Already bought this item");
                                        return actions.reject();
                                    }
                            }}
                            createOrder = {(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            description: "Prouduct description",
                                            amount: {
                                                currency_code: "USD",
                                                value: itemPrice,
                                            },
                                        },
                                    ],
                                });
                            }}
                            onApprove = { async (data, action) => {
                                order = await action.order.capture()
                                handleApprove(data.orderID);
                                if(data){
                                    onHandleSubmitOrder()
                                } 
                            }}
                            onCancel={() => {
                                swal({
                                    title: "Confirmation!",
                                    text: "Payment Cancelled",
                                    icon: "success",
                                    button: "Ok",
                                  });
                            }}
                            onError={(err) => {
                                setError(err);
                                console.log("PayPal Checkout onError", err);
                                swal({
                                    title: "Confirmation!",
                                    text: "PayPal Checkout onError",
                                    icon: "error",
                                    button: "Ok",
                                  });
                                
                            }}
                        />
                    </PayPalScriptProvider>
            </>
        )
   
}

export default Paypal