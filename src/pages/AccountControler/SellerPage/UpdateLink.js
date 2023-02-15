import { Box, Fab } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useNavigate } from 'react-router-dom';

const UsersActions = ({ params }) => {
    const navigate = useNavigate()
  const handleSubmit = async () => {
     
    const { _id } = params.row;
    let itemId = _id
    navigate(`/fatandcap/auth/seller/updateproduct/${itemId}`)
  }
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
            onClick={handleSubmit}
          >
            <BorderColorIcon />
          </Fab>
        

      </Box>
    );
  };
  
  export default UsersActions;
  