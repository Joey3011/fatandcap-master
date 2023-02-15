import axios from 'axios'
import React from 'react'
import { useEffect, useState } from 'react'
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { NotificationManager } from 'react-notifications'
import useAuth from '../../../hooks/useAuth'
import { useGetCustomerQuery } from '../customerApiSlice'
import { selectCurrentToken } from '../../../features/auth/authSlice'
import { useGetEmailOtpMutation, useVerifyEmailOtpMutation } from '../../../features/auth/authApiSlice'
import { useUserUpdatePasswordMutation } from '../customerApiSlice'
import { useSelector } from 'react-redux';
import Spinner from '../../../components/Spinner/Spinner'
import TextField from '@mui/material/TextField';
import swal from 'sweetalert';
import './toggle.css'
const PWD_REGEX = /^[A-z0-9!@#$%]{6,12}$/

export const Profile = () => {

    const { _id } = useAuth()
   
    const token = useSelector(selectCurrentToken)

    const nodeRef = React.createRef(null)

    // update
    const[isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen)

    const [isCodeEmail, isSetCodeEmail] = useState(false)
    const toggleCodeToFalse = () => isSetCodeEmail(!isCodeEmail)

    const [isTextReadOnly, isSetTextReadOnly] = useState(false)
    const toggleReadOnly = () => isSetTextReadOnly(!isTextReadOnly)

    const [notif, setNotif] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')

    const [codeEmail, setCodeEmail] = useState('')
    const [codeSMS, setCodeSMS] = useState('')
    const [submitCode, setSubmitCode] = useState('')

    const [username, setUsername] = useState('')
    const [getOldPassword, setOldPassword] = useState('')
    const [getNewPassword, setNewPassword] = useState('')
    const [getReTypePassword, setReTypePassword] = useState('')
    const [fileProfile, setProfileImage] = useState([])
    const [fileBackgroundImage, setBackgroundImage] = useState([])


    const [newUsername, setNewUsername] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newPhone, setNewPhone] = useState('')
   

    const [validPassword, setValidPassword] = useState(false)

    const handleSubmitCode = (e) => setSubmitCode(e.target.value)
    const handleGetEmailCode = (e) => setCodeEmail(e.target.value)
    const handleGetCodeSMS = (e) => setCodeSMS(e.target.value)

    const handleSetNewUsername = (e) => setNewUsername(e.target.value)
    const handleSetNewEmail = (e) => setNewEmail(e.target.value)
    const handleSetNewPhone = (e) => setNewPhone(e.target.value)

    const handleOldPassword = (e) => setOldPassword(e.target.value)
    const handleNewPassword = (e) => setNewPassword(e.target.value)
    const handleReTypePassword = (e) => setReTypePassword(e.target.value)
    const handleProfileImage = (e) => setProfileImage(e.target.files[0])
    const handleBackgroundImage = (e) => setBackgroundImage(e.target.files[0])

    //update password
    const [updatePassword, { isLoading }] =  useUserUpdatePasswordMutation()

    const [verifyCode, { isSuccess }] = useVerifyEmailOtpMutation()

    const [getCode, { isError, }] = useGetEmailOtpMutation()

    const { customer } = useGetCustomerQuery("customerList", {
        selectFromResult: ({ data }) => ({
            customer: data?.entities[_id]
        }),
    })

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(getReTypePassword))
    }, [getReTypePassword])

    useEffect(()=>{
        function phoneNumberHide(number) {
            let hideNum = [];
              for(let i = 0; i < number.length; i++){
              if(i < number.length-4){
                hideNum.push("*");
              }else{
                hideNum.push(number[i]);
              }
            }
            return hideNum.join("");
          }
        if(customer){
            setName(`${customer?.firstName} ${customer?.lastName}`)
            setEmail(`${!customer?.email ?  'No Email on file' : customer?.email.replace(/(\w{2})[\w.-]+@([\w.]+\w)/, "$1****@$2")}`)
            setPhone(`${!customer?.phone ?  'No Phone number on file' : phoneNumberHide(customer?.phone)}`)
            setUsername(`${phoneNumberHide(customer?.username)}`)
        }else{
            setName('')
        }
    },[customer])
    

    // update info
    const onHandleSubmitUpdate = async(e) => {
        e.preventDefault()
        const data = { '_id': _id,
        'username': newUsername,
        'email': newEmail,
        'phone': newPhone}
        await axios.patch("https://projectapi-54nm.onrender.com/api/auth/userupdateinfo", data,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-type": "application/json",
            },                    
        }).then(res => {
            setNotif(NotificationManager.success('Success!', 'Successful!', 2000))
            setNewUsername('')
            setNewEmail('')
            setNewPhone('')
            toggleReadOnly()
            window.location.reload(false)
        }).catch((err)=>{
            setNotif(NotificationManager.error(`${err}`, 'Error!'))
        })
    }

    //Get Email OTP
    const onSubmitGetCodeEmail = async (e) => {
            e.preventDefault()
            let email = codeEmail
        await getCode({ email }).unwrap().then(payload => {
            swal({
                title: "Confirmation!",
                text: "OTP Sent!",
                icon: "success",
                button: "Ok",
              });
                setIsOpen(!isOpen)
                toggleCodeToFalse()
                setCodeEmail('')
        }).catch(err => {
            if (!err.status) {
                swal({
                    title: "Server error!",
                    text: "No Server Response",
                    icon: "error",
                    button: "Ok",
                  });
            } else {
                swal({
                    title: "Notification",
                    text: `${err.data?.message}`,
                    icon: "error",
                    button: "Ok",
                  });
            }
        })  
    }
    //Verify Email OTP
    const onSubmitVerifyCode = async (e) => {
        e.preventDefault()
        let code = submitCode
        await verifyCode({code, email }).unwrap().then(payload => {
            setNotif(NotificationManager.success('Success!', 'Successful!', 3000))
            swal({
                title: "Confirmation!",
                text: "Success!",
                icon: "success",
                button: "Ok",
              });
            if(payload){
                setSubmitCode('')
                isSetTextReadOnly('')
                isSetCodeEmail(!isCodeEmail)
                toggleReadOnly()
            }
        }).catch(err => {
            if (!err.status) {
                swal({
                    title: "Server error!",
                    text: "No Server Response",
                    icon: "error",
                    button: "Ok",
                  });
            } else {
                swal({
                    title: "Notification",
                    text: `${err.data?.message}`,
                    icon: "error",
                    button: "Ok",
                  });
            }
        })
       
    }
    // email update end
    //========================= 

    // upload profile image
    const onHandleProfile = async(e) => {
        e.preventDefault()
        const data = new FormData()
        data.append("file",fileProfile)
        data.append("_id",_id)
        await axios.patch("https://projectapi-54nm.onrender.com/api/auth/uploadprofileimage", data,
        {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-type": "multipart/form-data",
                },                    
            }).then(res => {
                swal({
                    title: "Confirmation!",
                    text: "Profile uploaded successfully!",
                    icon: "success",
                    button: "Ok",
                });
                window.location.reload(false);
            }).catch((err)=>{
                swal({
                    title: "Error!",
                    text: "Error occured while uploading image!",
                    icon: "error",
                    button: "Ok",
                  });
            })
    }
    // upload cover image
    const onHandleBackgroundImage = async(e) => {
        e.preventDefault()
        const data = new FormData()
        data.append("file",fileBackgroundImage)
        data.append("_id",_id)

        await axios.patch("https://projectapi-54nm.onrender.com/api/auth/uploadcoverimage", data,
        {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-type": "multipart/form-data",
                },                    
            }).then(res => {
                swal({
                    title: "Confirmation!",
                    text: "Background Image uploaded successfully!",
                    icon: "success",
                    button: "Ok",
                });
                window.location.reload(false);
            }).catch((err)=>{
                swal({
                    title: "Error!",
                    text: "Error occured while uploading image!",
                    icon: "error",
                    button: "Ok",
                  });
            })
    }

    // Update password
    const handleSubmitPassword = async (e) => {
        e.preventDefault()
        await updatePassword({_id, getOldPassword, getNewPassword, getReTypePassword}).unwrap().then(payload => {
            setNotif(NotificationManager.success('You have successfully update your password!', 'Successful!', 3000))
            setOldPassword('')
            setNewPassword('')
            setReTypePassword('')
            swal({
                title: "Confirmation!",
                text: "Password successfully updated!",
                icon: "success",
                button: "Ok",
            });
        }).catch(err => {
            if (!err.status) {
                swal({
                    title: "Server error!",
                    text: "No Server Response",
                    icon: "error",
                    button: "Ok",
                  });
            } else {
                swal({
                    title: "Error",
                    text: `${err.data?.message}`,
                    icon: "error",
                    button: "Ok",
                  });
            }
        })
    }
if (isLoading) return <div><Spinner /></div>

if(customer){
    return(
        <Container className='public my-3'>
              <span ref={nodeRef}>{notif}</span>
            
                {/* Profile info */}
                <Row>
                    <Col>
                        <div className='toggleUpdateInfo' style={{right: !isTextReadOnly ? '-100%' : '0'}}>
                            <Form className='form-profile-update px-5' onSubmit={onHandleSubmitUpdate}>
                                <h5 className='form-title text-center mb-3 mt-5'>Update Profile Information</h5>
                                    <FormGroup>
                                        <TextField 
                                            className='form-control'
                                            variant='standard'
                                            id="newEmail"
                                            value={newEmail}
                                            type='email' 
                                            onChange={handleSetNewEmail}
                                            label='Enter Email'
                                            required
                                            />
                                    </FormGroup>
                                    <FormGroup>
                                            <TextField 
                                                className='form-control'
                                                variant='standard'
                                                id="newUsername"
                                                value={newUsername}
                                                type='text' 
                                                onChange={handleSetNewUsername}
                                                label='Enter username'
                                                required
                                            />
                                    </FormGroup>
                                    <FormGroup>
                                            <TextField 
                                                className='form-control'
                                                variant='standard'
                                                id="newPhone"
                                                value={newPhone}
                                                type='text' 
                                                onChange={handleSetNewPhone}
                                                label='Enter mobile number'
                                                required
                                            />
                                    </FormGroup>
                                    <FormGroup className='d-flex justify-content-end'>
                                        <Button className='public-btn btn mt-3 me-2'>
                                            Update
                                        </Button>
                                        <Button className='public-btn mt-3' onClick={toggleReadOnly}>
                                                Cancel
                                        </Button>
                                    </FormGroup>
                                </Form>
                                  {/* Cacel */}
    
                        </div>
                    </Col>
                </Row>
                {/* submit code */}
                <Row >
                    <Col>
                        <div className='togglesubmitEmailCode' style={{right: !isCodeEmail ? '-100%' : '0'}}>
                            <h5 className='form-title text-center mb-3 mt-5 pt-5'>Enter OTP Code</h5>
                            <Form className='form-verif-phone' onSubmit={onSubmitVerifyCode}>
                                <Col className='d-flex justify-content-between'>
                                    <FormGroup>
                                        <TextField 
                                            className='form-control'
                                            variant='standard'
                                            id="submitcode"
                                            value={submitCode}
                                            type='text' 
                                            onChange={handleSubmitCode}
                                            label='Enter OTP Code'
                                            autoComplete='off'
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Button className='public-btn btn-sm mt-4'>
                                         Submit Code
                                        </Button>
                                    </FormGroup>
                                </Col>
                            </Form>
                            {/* Cacel */}
                            <Col className='form-verif-cancel'>
                                <FormGroup className='d-flex justify-content-end'>
                                    <Button className='public-btn btn-sm mt-3 px-4' onClick={toggleCodeToFalse}>
                                         Cancel
                                    </Button>
                                </FormGroup>
                            </Col>
                        </div>
                    </Col>
                </Row>
            {/* get email code otp */}
                <Row >
                    <Col>
                        <div className='toggleGetCodeEmail' style={{right: !isOpen ? '-100%' : '0'}}>
                            <h5 className='form-title text-center mb-3 mt-5 pt-5'>Choose how you want to receive verification code.</h5>
                            <Form className='form-get-code'>
                                <Col className='d-flex justify-content-between'>
                                    <FormGroup>
                                        <TextField 
                                            className='form-control'
                                            variant='standard'
                                            id="otpPhone"
                                            value={codeSMS}
                                            type='text' 
                                            onChange={handleGetCodeSMS}
                                            label='Enter Phone Number'
                                            autoComplete='off'
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Button className='public-btn btn-sm mt-4' disabled={true}>
                                           {/* Get Code */} SMS not availble
                                        </Button>
                                    </FormGroup>
                                </Col>
                            </Form>
                            {/* request otp email */}
                            <Form className='form-verif-email' onSubmit={onSubmitGetCodeEmail}>
                                <Col className='d-flex justify-content-between'>
                                    <FormGroup>
                                        <TextField 
                                            className='form-control'
                                            variant='standard'
                                            id="otpEmail"
                                            value={codeEmail}
                                            type='email' 
                                            onChange={handleGetEmailCode}
                                            label='Enter Email'
                                            autoComplete='on'
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Button className='public-btn btn-sm mt-4'>
                                           Get Code
                                        </Button>
                                    </FormGroup>
                                </Col>
                            </Form>
                            <Col className='form-verif-cancel'>
                                <FormGroup className='d-flex justify-content-end'>
                                    <Button className='public-btn btn-sm px-3' onClick={toggle}>
                                     Cancel
                                    </Button>
                                </FormGroup>
                            </Col>
                        </div>
                    </Col>
                </Row>

  {/* Profile info */}
                <Row>
                    <Col>
                        <Form className='form-profile px-5'>
                        <h5 className='form-title text-center mb-3 mt-5'>Profile Information</h5>
                            <FormGroup>
                                <Label className='form-label' for='name'>Profile Name</Label>
                                <Input 
                                    className='form-control'
                                    id="name"
                                    value={name}
                                    type='text' 
                                    readOnly={true}
                                    required/>
                            </FormGroup>
                            <FormGroup>
                                <Label className='form-label' for='email'>Profile Email</Label>
                                <Input 
                                    className='form-control'
                                    id="email"
                                    value={email}
                                    type='email' 
                                    readOnly={true}
                                        required
                                    />
                            </FormGroup>
                            <FormGroup>
                                <Label className='form-label' for='email'>Profile Username</Label>
                                    <Input 
                                        className='form-control'
                                        id="username"
                                        value={username}
                                        type='text' 
                                        readOnly={true}
                                        required
                                    />
                            </FormGroup>
                            <FormGroup>
                                <Label className='form-label' for='phone'>Profile Mobile Number</Label>
                                    <Input 
                                        className='form-control'
                                        id="phone"
                                        value={phone}
                                        type='text' 
                                        readOnly={true}
                                        required
                                    />
                            </FormGroup>
                            <FormGroup className='d-flex justify-content-end'>
                                <Button className='public-btn mt-3' onClick={toggle}>
                                   Update
                                </Button>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>

                <Row>
                     <Col>
                         <Form className='form-update-password px-5' onSubmit={handleSubmitPassword}>
                         <h5 className='form-title text-center mb-3 mt-5'>Security Setting</h5>
                             <Row>
                                 <Col>
                                    <FormGroup>
                                     <Label style={{fontSize: "12px"}} for="oldpassword">Old Password:</Label>
                                         <Input
                                             className='form-control'
                                             type='password'
                                             id='oldPassword' 
                                             value={getOldPassword}
                                             onChange={handleOldPassword}
                                             placeholder='Old Password'
                                             required
                                             />
                                     </FormGroup>
                                     <FormGroup>
                                     <Label style={{fontSize: "12px"}} for="newPassword">New Password:</Label>
                                         <Input
                                             className='form-control'
                                             type='password'
                                             id='newPassword' 
                                             value={getNewPassword}
                                             onChange={handleNewPassword}
                                             placeholder='New Password'
                                             required
                                                     />
                                     </FormGroup>
                                     <FormGroup>
                                     <Label style={{fontSize: "12px"}} for="repassword">Re-Type Password:</Label>
                                         <Input
                                             className='form-control'
                                             type='password'
                                             id='rePassword' 
                                             value={getReTypePassword}
                                             onChange={handleReTypePassword}
                                             placeholder='Re-Type Password'
                                             required
                                                     />
                                     </FormGroup>
                                     <FormGroup className='d-flex justify-content-end'>
                                        <Button className='public-btn btn-md'>
                                            Update
                                        </Button>
                                     </FormGroup>
                                 </Col>
                             </Row>
                         </Form>
                     </Col>
                 </Row>
                {/* image upload */}
                <Row >
                    <Col>
                        <Form className='form-profile-image px-5' onSubmit={onHandleProfile}>
                        <h5 className='form-title text-center my-3'>Profile Image</h5>
                            <FormGroup>
                                <Input 
                                    id="file"
                                    className='custom-file-input' 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleProfileImage} 
                                />
                            </FormGroup>
                            <FormGroup className='d-flex justify-content-end'>
                                <Button className='public-btn'>
                                    Upload
                                </Button>
                            </FormGroup>
                         
                         </Form>
             
                        <Form className='form-cover-image px-5' onSubmit={onHandleBackgroundImage}>
                            <FormGroup>      
                            <h5 className='form-title text-center my-3'>Profile Cover Photo</h5>         
                                <Input 
                                    id="file"
                                    className='custom-file-input' 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleBackgroundImage} 
                                    />
                            </FormGroup>
                            <FormGroup className='d-flex justify-content-end'>
                                <Button className='public-btn'>
                                        Upload
                                </Button>
                            </FormGroup>
                         </Form>
                     </Col>
                 </Row>
                 {/* update password */}

                 {/* Update Profile */}
             </Container>
        )
    }

}

export default Profile




