import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Box, Fab } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Col, Container, FormGroup, Input, Label, Row } from 'reactstrap';
import { selectCurrentToken } from '../../../features/auth/authSlice'
import { useSelector } from 'react-redux';
import swal from 'sweetalert';
import axios from 'axios';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function ProductReview( {params, customer_id, user, userimage} ) {

  const { itemid, sellerid, status, dateOrdered, color } = params.row;
  const [itemRating, setItemRating] = React.useState('1')
  const [itemComment, setItemComment] = React.useState('')
  const [sellerRating, setSellerRating] = React.useState('1')
  const [sellerComment, setSellerComment] = React.useState('')
  const token = useSelector(selectCurrentToken)
  const [open, setOpen] = React.useState(false);

    // submit review
    const handleSubmitReview = async(e) => {
        e.preventDefault()
        const data = { 
        'itemid': itemid,
        'color': color,
        "userimage": 'null',
        'dateOrdered': dateOrdered,
        'customer_id': customer_id,
        'customerusername': user,
        'comments': itemComment,
        'rating': itemRating,
        }
        
        await axios.post("https://projectapi-54nm.onrender.com/api/auth/review", data,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-type": "application/json",
            },                    
        }).then(res => {
          setItemComment('')
          setItemRating('1')
          swal({
            title: "Confirmation!",
            text: "Product review successfully added",
            icon: "success",
            button: "Ok",
          });
          handleClose()
        }).catch((err)=>{
            console.log(err)
        })

        const datas = { 
          'sellerid': sellerid,
          "userimage": 'null',
          'customer_id': customer_id,
          'customerusername': user,
          'comments': sellerComment,
          'rating': sellerRating,
          }
          

        await axios.post("https://projectapi-54nm.onrender.com/api/auth/sellerreview", datas,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-type": "application/json",
            },                    
        }).then(res => {
          setSellerComment('')
          setSellerRating('1')
          swal({
            title: "Confirmation!",
            text: "Seller review successfully added",
            icon: "success",
            button: "Ok",
          });
          handleClose()
        }).catch((err)=>{
            console.log(err)
        })
    }


  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          m: 1,
          position: 'relative',
        }}
      >
          <Fab
            variant="outlined"
            title='Add review and rating'
            color="primary"
            sx={{
              width: 40,
              height: 40,
            }}
            disabled={status === 'completed' ? false : true}
            onClick={handleClickOpen}
          >
            <RateReviewIcon />
          </Fab>
     
      </Box>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >

        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        <small>Review</small>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label"> 
            <small>How would you like to rate the product?</small>
            </FormLabel>
            <FormLabel>
              <Container>
                    <Row>
                      <Col>
                        <RadioGroup
                            className='m-auto d-flex flex-row justify-content-between align-items-center'
                            aria-labelledby="demo-radio-buttons-group-label "
                            defaultValue="Poor"
                            name="radio-buttons-group"
                        >
                            <FormControlLabel 
                                name='itemrating'
                                value='1' 
                                control={<Radio />} 
                                label="1" 
                                onChange={(e) => setItemRating(e.target.value)}
                                checked = {itemRating === '1'}
                                />
                            <FormControlLabel 
                                name='itemrating'
                                value='2' 
                                control={<Radio />} 
                                label="2" 
                                onChange={(e) => setItemRating(e.target.value)}
                                checked = {itemRating === '2'}
                                />
                            <FormControlLabel 
                                name='itemrating'
                                value='3'
                                control={<Radio />} 
                                label="3"
                                onChange={(e) => setItemRating(e.target.value)}
                                checked = {itemRating === '3'}
                                />
                            <FormControlLabel 
                                name='itemrating'
                                value='4'
                                control={<Radio />} 
                                label="4"
                                onChange={(e) => setItemRating(e.target.value)}
                                checked = {itemRating === '4'}
                                />
                            <FormControlLabel 
                                name='itemrating'
                                value='5'
                                control={<Radio />} 
                                label="5" 
                                onChange={(e) => setItemRating(e.target.value)}
                                checked = {itemRating === '5'}
                                />
                        </RadioGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className='d-flex flex-row justify-content-between align-items-center'>
                        <small style={{fontSize: '10px', color: 'red'}}>Poor</small>
                        <small style={{fontSize: '10px', color: 'green', marginRight: '15px'}}>Staisfied</small>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                          <FormGroup className='mt-3'>
                            <Input
                                className='form-control form-control-sm' 
                                cols={10}
                                rows={3}
                                value={itemComment}
                                type="textarea" 
                                id="comment" 
                                placeholder='Product Review/Comments'
                                required
                                onChange={(e) => setItemComment(e.target.value)}
                            />
                        </FormGroup>
                      </Col>
                    </Row>
                </Container>
            </FormLabel>
            <FormLabel id="demo-radio-buttons-group-label"> 
              <small>How would you like to rate the seller?</small>
            </FormLabel>
            <FormLabel>
                <Container>
                    <Row>
                      <Col>
                        <RadioGroup
                            className='m-auto d-flex flex-row justify-content-between align-items-center'
                            aria-labelledby="demo-radio-buttons-group-label "
                            defaultValue="Poor"
                            name="radio-buttons-group"
                        >
                            <FormControlLabel 
                                name='sellerrating'
                                value='1' 
                                control={<Radio />} 
                                label="1" 
                                onChange={(e) => setSellerRating(e.target.value)}
                                checked = {sellerRating === '1'}
                                />
                            <FormControlLabel 
                                name='rating'
                                value='2' 
                                control={<Radio />} 
                                label="2" 
                                onChange={(e) => setSellerRating(e.target.value)}
                                checked = {sellerRating === '2'}
                                />
                            <FormControlLabel 
                                name='rating'
                                value='3'
                                control={<Radio />} 
                                label="3"
                                onChange={(e) => setSellerRating(e.target.value)}
                                checked = {sellerRating === '3'}
                                />
                            <FormControlLabel 
                                name='rating'
                                value='4'
                                control={<Radio />} 
                                label="4"
                                onChange={(e) => setSellerRating(e.target.value)}
                                checked = {sellerRating === '4'}
                                />
                            <FormControlLabel 
                                name='rating'
                                value='5'
                                control={<Radio />} 
                                label="5" 
                                onChange={(e) => setSellerRating(e.target.value)}
                                checked = {sellerRating === '5'}
                                />
                        </RadioGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className='d-flex flex-row justify-content-between align-items-center'>
                        <small style={{fontSize: '10px', color: 'red'}}>Poor</small>
                        <small style={{fontSize: '10px', color: 'green', marginRight: '15px'}}>Staisfied</small>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                          <FormGroup className='mt-3'>
                            <Input
                                className='form-control form-control-sm' 
                                cols={10}
                                rows={3}
                                value={sellerComment}
                                type="textarea" 
                                id="comment" 
                                placeholder='Seller Review/Comments'
                                required
                                onChange={(e) => setSellerComment(e.target.value)}
                            />
                        </FormGroup>
                      </Col>
                    </Row>
                </Container>
            </FormLabel>
            </FormControl>
          </Typography>
        </DialogContent>
        <DialogActions>
         <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button autoFocus onClick={handleSubmitReview}>
            Submit
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}


