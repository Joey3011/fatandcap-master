import React, {  useEffect, useMemo, useState } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { selectCurrentToken } from '../../../features/auth/authSlice'
import { useSelector } from 'react-redux';
import { Box, Avatar } from '@mui/material'
import UsersActions from './UserActions'
import useAuth from '../../../hooks/useAuth'
import moment from 'moment/moment'
import { grey } from '@mui/material/colors'
import { Container, Col } from 'reactstrap';
import axios from 'axios'
import Tooltip from '@mui/material/Tooltip'

export const OrderToSeller = () =>{
    const { _id } = useAuth()

    const token = useSelector(selectCurrentToken)
    const [pageSize, setPageSize] = useState(5);
    const [rowId, setRowId] = useState(null);
    const [getOrder, setOrder] = useState([])
    
    //get  seller order
    useEffect(()=>{
       async function orders(){
        await axios.get(`https://projectapi-54nm.onrender.com/api/auth/getorderbyseller/${_id}`,
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
            field: "_id",
            headerName: "ID",
            width: 0,
            editable: false,
        },
        {
            field: "image",
            headerName: "Order Image",
            width: 130,
            height: 120,
            renderCell: (params) => {
                return(
                   <>
                    <Tooltip title={`${params.row.image}`} placement="bottom">
                        <Avatar src={params.row.image} sx={{ width: 130, height: 120, cursor: 'pointer' }} variant="square"/>
                    </Tooltip>
                   </>
                )
            },
            sortable: false,
            filterable: false,
        },
        {
            field: 'size',
            headerName: 'Size',
            type: 'string', 
            width: 180,
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
            width: 180,
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
            field: 'dateOrdered', 
            headerName: 'OrderDate', 
            width: 160,
            renderCell: (params) => {
                return(
                    <Tooltip title={`${params?.value}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer'}}>{moment(params?.value).format('yyyy-MM-DD HH:MM:SS')}</small>
                    </Tooltip>
                )
            },
            editable: false 
        },
        {
            field: 'qty',
            headerName: 'Qty',
            type: 'number', 
            width: 5,
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
            field: 'price',
            headerName: 'Price',
            type: 'string',
            width: 100,
            renderCell: (params) => {
                return(
                    <Tooltip title={`${params?.value}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer'}}>&#36;{params?.value}.00</small>
                    </Tooltip>
                )
            },
            editable: false,
        },
        {
            field: 'shippingFee',
            headerName: 'Shipping Fee',
            type: 'string',
            width: 120,
            renderCell: (params) => {
                return(
                    <Tooltip title={`${params?.value}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer'}}>&#36;{params?.value}.00</small>
                    </Tooltip>
                )
            },
            editable: false,
        },
        {
            field: 'customerName',
            headerName: 'Customer Name',
            type: 'string',
            width: 150,
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
            field: 'address',
            headerName: 'Address',
            type: 'string',
            width: 180,
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
            field: 'status',
            headerName: 'Status',
            width: 250,
            type: 'singleSelect',
            valueOptions: ['Waiting for seller response...', 'Seller received order request', 'Order is in progress', 'completed'],
            renderCell: (params) => {
                return(
                    <Tooltip title={`${params?.value}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer'}}>{params?.value}</small>
                    </Tooltip>
                )
            },
            editable: true,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 100,
            renderCell: (params) => (
              <UsersActions {...{ params, rowId, setRowId }}  />
            ),
        },
      ],
    [rowId]
  )
  

  return (
        <Container>
                <Col>
                    <Box
                        sx={{
                            marginTop: 1.5,
                            height: 700,
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
                        
                        onCellEditCommit={(params) => setRowId(params.id)}
                        >
                    </DataGrid>
                    </Box>
                </Col>
        </Container>
    )
}

export default OrderToSeller

