import { Box, CircularProgress, Fab } from '@mui/material';
import { useEffect, useState } from 'react';
import { Check, Save } from '@mui/icons-material';
import { green } from '@mui/material/colors';
import {  useUpdateOrderStatusMutation } from '../CustomerPage/customerOrderApiSlice'
import swal from 'sweetalert';

const UsersActions = ({ params, rowId, setRowId }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

  const [updateProductStatus, { isSuccess }] =  useUpdateOrderStatusMutation()

  const handleSubmit = async () => {
     
    const { _id, status } = params.row;
    
    const result = await updateProductStatus({ _id, status }).unwrap()
    if (result) {
        setSuccess(true);
        setRowId(null);
        swal({
          title: "Confirmation!",
          text: `Status updated to ""${status}"`,
          icon: "success",
          button: "Ok",
        });
      }
      setLoading(false);
    };
  
    useEffect(() => {
      if (rowId === params.id && success) setSuccess(false);
    }, [rowId, success, params.id]);
  

    return (
      <Box
        sx={{
          m: 1,
          position: 'relative',
        }}
      >
        {success ? (
          <Fab
            color="primary"
            sx={{
              width: 40,
              height: 40,
              bgcolor: green[500],
              '&:hover': { bgcolor: green[700] },
            }}
          >
            <Check />
          </Fab>
        ) : (
          <Fab
            color="primary"
            sx={{
              width: 40,
              height: 40,
            }}
            disabled={params.id !== rowId || loading}
            onClick={handleSubmit}
          >
            <Save />
          </Fab>
        )}
        {loading && (
          <CircularProgress
            size={52}
            sx={{
              color: green[500],
              position: 'absolute',
              top: -6,
              left: -6,
              zIndex: 1,
            }}
          />
        )}
      </Box>
    );
  };
  
  export default UsersActions;
  