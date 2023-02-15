
import React , {useEffect, useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useGetCustomerOrderBySellerIDQuery } from '../OrderApiSlice'
import {  useUpdateOrderStatusMutation } from '../CustomerPage/customerOrderApiSlice'
import { NotificationManager } from 'react-notifications'
import Spinner from '../../../components/Spinner/Spinner'
import { format } from 'date-fns'
import useAuth from '../../../hooks/useAuth'
import '../../../styles/product-card.css'

const CustomerOrderToAdmin = ({orderId}) => {

    let notif 
    const { _id } = useAuth()
    
    const nodeRef = React.createRef(null);
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const [getUpdateStatus, setUpdateStatus] = useState('')
    const [getId, setId] = useState('')

    const [updateProductStatus, { isLoading }] =  useUpdateOrderStatusMutation()

    const { order } = useGetCustomerOrderBySellerIDQuery(_id,{
        selectFromResult: ({ data }) => ({
            order: data?.entities[orderId]
        }),
    })

    useEffect(()=>{
        setId(order?._id)
    },[order?._id])

    const onHandleSubMitUpdate = async (e) => {
        e.preventDefault()
        if(order){
            await updateProductStatus({getId, getUpdateStatus}).unwrap().then(payload => {
                notif = NotificationManager.success('You have successfully update product status!', 'Successful!', 2000);
                setUpdateStatus('')
                handleClose()
            }).catch(err => {
                if(err.status === 400){
                    notif = NotificationManager.error('Bad request..', 'Error!');
                }else{
                    notif = NotificationManager.error('An error occured while submitting request to server...', 'Error!');
                }
            })
        }else{
            notif = NotificationManager.error('Empty data...', 'Error!');
        }
    }
    if (isLoading) return <div><Spinner /></div>
    if (order !== null) {
        return (
            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                            <Modal.Title>Update Order Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body ref={nodeRef}>
                    {notif}
                        <Form>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>Product Status</Form.Label>
                                <Form.Control
                                    className='fprm-control form-control-sm'
                                    type="hidden"
                                    value={getId}
                                    placeholder="Id"
                                    readOnly={true}
                                />
                                <Form.Control
                                    className='fprm-control form-control-sm'
                                    type="text"
                                    value={getUpdateStatus}
                                    onChange={(e) =>setUpdateStatus(e.target.value) }
                                    placeholder="Order Status (e.g Received by seller...)"
                                    autoFocus
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='btn-sm' variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button className='btn-sm' variant="success" onClick={onHandleSubMitUpdate}>
                            Submit Update
                        </Button>
                    </Modal.Footer>
                </Modal>
                    <tr>
                        <td>
                            <img
                                src={`${order.image}`}
                                alt='' 
                                width='250px'  
                                height='100px'                        
                                />
                        </td>
                        <td>
                        {format(new Date(order.dateOrdered), 'MM-dd-yyyy HH:MM:SS')}
                        </td>
                        <td className='fs-6'>
                            {order.qty}
                        </td>
                        <td className='fs-6'>
                            &#x20B1;{order.price}
                        </td>
                        <td className='fs-6'>
                            {order.customerName}
                        </td>
                        <td className='fs-6'>
                            {order.address}
                        </td>
                        <td className='fs-6'>
                            {order.customerEmail}
                        </td>
                        <td className='fs-6'>
                            {order.status}
                        </td>
                        <td>
                        <button
                            className="btn btn-warning btn-sm"
                            onClick={handleShow}
                        >
                            <i className="ri-file-edit-line"></i> 
                        </button>
                        </td>
                    </tr> 
            </>
        )
     }
 }

export default CustomerOrderToAdmin
