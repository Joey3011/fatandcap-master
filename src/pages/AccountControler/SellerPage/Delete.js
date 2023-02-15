import { Box, Fab } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDeleteProductMutation } from '../AuthUserApiSlice'
import { confirmAlert } from 'react-confirm-alert'
import Spinner from '../../../components/Spinner/Spinner'

const UsersActions = ({ params }) => {

    const { _id } = params.row

    const [deleteProduct, { isLoading }] = useDeleteProductMutation()


    // Delete product
    const onDeleteSubmit = () => {
        confirmAlert({
          title: '',
          message: 'Confirm to delete product.',
          buttons: [
            {
              label: 'Yes',
              onClick: async () => {
                await deleteProduct({ id: _id }).then(res => {
                return alert('Product deleted') 
                    }).catch(err => {
                    return alert(err) 
                })
              }
            },
            {
              label: 'No',
              onClick: () =>  alert('Action cancelled')
            }
          ]
        });
      };
  if (isLoading) return <div><Spinner /></div>
    return (
      <Box
        sx={{
          m: 0,
          position: 'relative',
        }}
      >
          <Fab
            color="primary"
            sx={{
              width: 40,
              height: 40,
            }}
            onClick={onDeleteSubmit}
          >
            <DeleteForeverIcon />
          </Fab>
        

      </Box>
    );
  };
  
  export default UsersActions;
  