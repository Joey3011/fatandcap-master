import { Box, Fab } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';

const UsersActions = ({ params }) => {
   
    const { _id } = params.row;
    

    return (
      <Box
      sx={{
        m: 1,
        position: 'relative',
      }}
      >
          <Fab
            title='Add review and rating'
            color="primary"
            sx={{
              width: 40,
              height: 40,
            }}
            
          >
            <RateReviewIcon />
          </Fab>
     
      </Box>
    );
  };
  
  export default UsersActions;
  