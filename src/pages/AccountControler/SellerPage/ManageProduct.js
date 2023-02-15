import React, {  useEffect, useMemo, useState } from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { selectCurrentToken } from '../../../features/auth/authSlice'
import { useSelector } from 'react-redux';
import { Box, Avatar } from '@mui/material'
import UpdateLink from './UpdateLink'
import Delete from './Delete'
import Add from './Add'
import useAuth from '../../../hooks/useAuth'
import { grey } from '@mui/material/colors'
import { Container, Col } from 'reactstrap';
import axios from 'axios'
import Tooltip from '@mui/material/Tooltip'

export const ManageProduct = () =>{
    const { _id } = useAuth()
    const token = useSelector(selectCurrentToken)
    const [pageSize, setPageSize] = useState(5);
    const [rowId, setRowId] = useState(null);
    const [getOrder, setOrder] = useState([])
    
    //get  seller order
    useEffect(()=>{
       async function orders(){
        await axios.get(`https://projectapi-54nm.onrender.com/api/auth/getsellerproduct/${_id}`,
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
            width: 80,
            editable: false,
        },
        {
            field: "itemImage",
            headerName: "Product Image",
            width: 130,
            height: 120,
            renderCell: (params) => {
                return(
                   <>
                    <Tooltip title={`Product Image: ${params.row.itemImage[0].image}`} placement="bottom">
                        <Avatar src={params.row.itemImage[0].image} sx={{ width: 130, height: 120, cursor: 'pointer' }} variant="square"/>
                    </Tooltip>
                   </>
                )
            },
            sortable: false,
            filterable: false,
        },
        {
            field: 'itemName',
            headerName: 'Product Name',
            type: 'string', 
            width: 380,
            renderCell: (params) => {
                return(
                    <Tooltip title={`Product Name: ${params?.value}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer', textAlign: 'left'}}>{params?.value}</small>
                    </Tooltip>
                )
            },
            editable: false,
        },
        {
            field: 'itemCategory',
            headerName: 'Category',
            type: 'string', 
            width: 220,
            renderCell: (params) => {
                return(
                    <Tooltip title={`${params?.value}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer', textAlign: 'left'}}>{params?.value}</small>
                    </Tooltip>
                )
            },
            editable: false,
        },
        {
            field: 'itemPrice',
            headerName: 'Price',
            type: 'string', 
            width: 80,
            renderCell: (params) => {
                return(
                    <Tooltip title={params?.value} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer', textAlign: 'left'}}>&#36;{params?.value}</small>
                    </Tooltip>
                )
            },
            editable: false,
        },
        {
            field: 'itemQuantity',
            headerName: 'Quantity',
            type: 'string',
            width: 120,
            renderCell: (params) => {
                return(
                    <Tooltip title={`Product Quantity: ${params?.value}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer', textAlign: 'left'}}>{params?.value}</small>
                    </Tooltip>
                )
            },
            editable: false,
        },
        {
            field: 'itemSold',
            headerName: 'Sold',
            type: 'string',
            width: 120,
            renderCell: (params) => {
                return(
                    <Tooltip title={`Product Sold: ${params?.value}`} placement="bottom">
                       <small style={{fontSize: '14px', cursor: 'pointer', textAlign: 'left'}}>{params?.value} &nbsp; Sold</small>
                    </Tooltip>
                )
            },
            editable: false,
        },
        {
            field: 'update',
            headerName: 'Update',
            type: 'update',
            width: 60,
            renderCell: (params) => (
              <UpdateLink {...{ params, rowId, setRowId }}  />
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            type: 'delete',
            width: 60,
            renderCell: (params) => (
              <Delete {...{ params, rowId, setRowId }}  />
            ),
        },
        {
            field: 'add',
            headerName: 'Add',
            type: 'add',
            width: 60,
            renderCell: () => (
              <Add />
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
                        
                        onCellClick={(params) => setRowId(params.id)}
                        >
                    </DataGrid>
                    </Box>
                </Col>
        </Container>
    )
}

export default ManageProduct

