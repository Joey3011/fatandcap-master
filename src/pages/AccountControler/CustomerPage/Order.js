import React, {  useEffect, useState } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { selectCurrentToken } from '../../../features/auth/authSlice'
import { useSelector } from 'react-redux';
import { Box, Avatar } from '@mui/material'
import useAuth from '../../../hooks/useAuth'
import moment from 'moment/moment'
import { grey } from '@mui/material/colors'
import { Col, Container } from 'reactstrap';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip'
import { useGetCustomerQuery } from '../customerApiSlice';
import UsersActions from './Review';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export const Order = () => {

    const { _id } = useAuth()
    
    let customer_id = _id
    const token = useSelector(selectCurrentToken)
    const [pageSize, setPageSize] = useState(5);
    const [rowId, setRowId] = useState(null);
    const [cellId, setCellId] = useState(null);
    const [getOrder, setOrder] = useState([])
    const [user, setUser] = useState('')
    const [userimage, setUserImage] = useState('')
    const navigate = useNavigate()

    const { customer } = useGetCustomerQuery('customerList', {
        selectFromResult: ({ data }) => ({
            customer: data?.entities[_id]
          }),
    })

    useEffect(()=>{
        setUser(customer?.username)
        setUserImage(customer?.image)
    },[customer?.username, customer?.image])

    //get  seller order
    useEffect(()=>{
       async function orders(){
        await axios.get(`https://projectapi-54nm.onrender.com/api/auth/getorderbycustomer/${_id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-type": "multipart/form-data",
                },                    
            }).then(res => {
                setOrder(res.data)
            })
       } 
       orders()
    },[_id, token])    

    const columns = useMemo(() => [
        {
            field: "image",
            headerName: "Order Image",
            width: 130,
            height: 130,
            renderCell: (params) => {
                let {itemid} = params.row
                return(
                   <>
                    <Tooltip title={`${params.row.image}`} placement="bottom">
                        <Avatar src={params.row.image} sx={{ width: 150, height: 130, cursor: 'pointer' }} variant="square" onClick={()=> navigate(`/fatandcap/shop/item/details?item=${itemid}`)} />
                    </Tooltip>
                   </>
                )
            },
            sortable: false,
        },
        { 
            field: 'name', 
            headerName: 'Order Name', 
            width: 220, 
            renderCell: (params) => {
                return(
                    <Tooltip title={`${params?.value}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer'}}>{params?.value}</small>
                    </Tooltip>
                )
            },
            editable: false 
        },
        { 
            field: 'dateOrdered', 
            headerName: 'Order Date', 
            width: 120, 
            renderCell: (params) => {
                return(
                    <Tooltip title={`Order Date: ${moment(params?.value).format('yyyy-MM-DD HH:MM:SS')}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer'}}>{moment(params?.value).format('yyyy-MM-DD HH:MM:SS')}</small>
                    </Tooltip>
                )
            },
            editable: false 
        },
        {
          field: 'size',
          headerName: 'Size',
          type: 'string', 
          width: 90,
          renderCell: (params) => {
            return(
                <Tooltip title={`${params?.value}`} placement="bottom">
                   <small style={{fontSize: '14px', cursor: 'pointer'}}>{params?.value}</small>
                </Tooltip>
            )
        },
          editable: false,
      },
      {
        field: 'color',
        headerName: 'Color',
        type: 'string', 
        width: 90,
        renderCell: (params) => {
          return(
              <Tooltip title={`${params?.value}`} placement="bottom">
                 <small style={{fontSize: '14px', cursor: 'pointer'}}>{params?.value}</small>
              </Tooltip>
          )
      },
        editable: false,
    },
        {
            field: 'qty',
            headerName: 'Qty',
            type: 'number', 
            width: 50,
            renderCell: (params) => {
                return(
                    <Tooltip title={`${params?.value}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer'}}>{params?.value}</small>
                    </Tooltip>
                )
            },
            editable: false,
        },
        {
            field: 'shippingFee',
            headerName: 'Shipping Fee',
            type: 'string',
            width: 100,
            renderCell: (params) => {
                return(
                    <Tooltip title={`Shipping Fee: ${params?.value}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer'}}>&#36;{params?.value}</small>
                    </Tooltip>
                )
            },
            editable: false,
        },
        {
            field: 'price',
            headerName: 'Price',
            type: 'string',
            width: 100,
            renderCell: (params) => {
                return(
                    <Tooltip title={`Product Price: ${params?.value}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer'}}>&#36;{params?.value}</small>
                    </Tooltip>
                )
            },
            editable: false,
        },
        {
            field: 'totalItemPrice',
            headerName: 'Total',
            type: 'string',
            width: 100,
            renderCell: (params) => {
                return(
                    <Tooltip title={`Total: ${params?.value}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer'}}>&#36;{params?.value}</small>
                    </Tooltip>
                )
            },
            editable: false,
        },
        {
            field: 'status',
            headerName: 'Status',
            type: 'string',
            width: 220,
            renderCell: (params) => {
                return(
                    <Tooltip title={`${params?.value}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer'}}>{params?.value}</small>
                    </Tooltip>
                )
            },
            editable: false,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 100,
            renderCell: (params) => (
              <UsersActions {...{ params, rowId, setRowId, customer_id, user, userimage}}  />
            ),
        },
      ],
    [rowId, userimage, customer_id, user]
  )

  return (
        <Container className='my-3'>
                <Col>
                <h4 className='form-title text-center mb-3 mt-5'>Order Record</h4>
                    <Box
                        sx={{
                        height: 450,
                        width: '100%',
                        }}
                    >
                        <DataGrid
                        columns={columns}
                        rows= {getOrder}
                        getRowId={(row) => row._id}
                        rowsPerPageOptions={[5, 10, 20]}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        getRowSpacing={(params) => ({
                            top: params.isFirstVisible ? 0 : 5,
                            bottom: params.isLastVisible ? 0 : 5,
                        })}
                        sx={{
                            [`& .${gridClasses.row}`]: {
                            bgcolor: (theme) =>
                                theme.palette.mode === 'light' ? grey[200] : grey[900],
                            },
                        }}
                            onCellClick={(params) => setRowId(params.id)}
                        >
                    </DataGrid>
                </Box>
            </Col>
        </Container>
    )
}

export default Order




