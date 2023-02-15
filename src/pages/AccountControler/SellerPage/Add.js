import { Box, Fab } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';

const UsersActions = () => {
    const navigate = useNavigate()
  const handleSubmit = async () => {
     
    navigate(`/fatandcap/auth/seller/addproduct`)
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
            <AddCircleIcon />
          </Fab>
        

      </Box>
    );
  };
  
  export default UsersActions;