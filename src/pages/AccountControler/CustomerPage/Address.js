import {regions, provinces, cities, barangays} from 'select-philippines-address'
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { useAddAddressMutation } from '../customerApiSlice'
import swal from 'sweetalert';
import Spinner from '../../../components/Spinner/Spinner'
import useAuth from '../../../hooks/useAuth'
import {useEffect, useState, useRef} from "react"

const Address = () => {

    let notif 
    const { _id } = useAuth()
    const nodeRef = useRef(null);
    const [regionData, setRegion] = useState([]);
    const [provinceData, setProvince] = useState([]);
    const [cityData, setCity] = useState([]);
    const [barangayData, setBarangay] = useState([]);

    const [regionAddr, setRegionAddr] = useState("");
    const [provinceAddr, setProvinceAddr] = useState("");
    const [cityAddr, setCityAddr] = useState("");
    const [barangayAddr, setBarangayAddr] = useState("");
    const [street, setStreet] = useState('')

    const handleStreet = (e) => setStreet(e.target.value)
  

    const region = () => {
        regions().then(response => {
            setRegion(response);
        });
    }

    const province = (e) => {
        setRegionAddr(e.target.selectedOptions[0].text);
        provinces(e.target.value).then(response => {
            setProvince(response);
            setCity([]);
            setBarangay([]);
        });
    }

    const city = (e) => {
        setProvinceAddr(e.target.selectedOptions[0].text);
        cities(e.target.value).then(response => {
            setCity(response);
        });
    }

    const barangay = (e) => {
        setCityAddr(e.target.selectedOptions[0].text);
        barangays(e.target.value).then(response => {
            setBarangay(response);
        });
    }

    const brgy = (e) => {
        setBarangayAddr(e.target.selectedOptions[0].text);
    }

    useEffect(() => {
        region()
    }, [])


    const [addAddress, { isLoading }] =  useAddAddressMutation()


    const handleSubmitAddress = async (e) => {
        e.preventDefault()
        try {
        await addAddress({ _id, regionAddr, street, barangayAddr, cityAddr, provinceAddr}).unwrap()
            swal({
                title: 'Confirmation!',
                text: 'You have successfully added delevery address!',
                icon: 'success',
                button: 'Ok',
              });
            window.location.reload(false)
        } catch (err) {
            if (!err.status) {
              swal({
                title: 'Server error!',
                text: 'No Server Response',
                icon: 'error',
                button: 'Ok',
              });
            } else {
              swal({
                title: 'Notification',
                text: `${err.data?.message}`,
                icon: 'error',
                button: 'Ok',
              });
            }
          }
    }
    if (isLoading) return <div><Spinner /></div>


    return (
        <>
            <Container>
            <span ref={nodeRef}>{notif}</span>
                <Row>
                    <Col>
                        <Form className='addAddress mt-3 m-auto' onSubmit={handleSubmitAddress}>
                            <h4 className='form-title text-center mb-3 mt-5'>Manage Delivery Address</h4>
                            <FormGroup>
                                 <Label for='region'>Region:</Label>
                                <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select" onChange={province} onSelect={region}>
                                    <option>---Select Region---</option>
                                        {
                                            regionData && regionData.length > 0 && regionData.map((item) => <option
                                                key={item.region_code} value={item.region_code}>{item.region_name}</option>)
                                        }
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <Label for='region'>Province:</Label>
                                <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select"  onChange={city}>
                                    <option>---Select Province---</option>
                                        {
                                            provinceData && provinceData.length > 0 && provinceData.map((item) => <option
                                                key={item.province_code} value={item.province_code}>{item.province_name}</option>)
                                        }
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <Label for='region'>City:</Label>
                                <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select"  onChange={barangay}>
                                    <option>---Select City---</option>
                                        {
                                            cityData && cityData.length > 0 && cityData.map((item) => <option
                                                key={item.city_code} value={item.city_code}>{item.city_name}</option>)
                                        }
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <Label for='region'>Street #/ Home #:</Label>
                                <Input 
                                    className='form-control'
                                    id="street"
                                    type='text' 
                                    value={street}
                                    onChange={handleStreet}
                                    placeholder='Home #/ Street #'
                                    required
                                    />
                            </FormGroup>
                            <FormGroup>
                                <Label for='region'>Barangay:</Label>
                                <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select"  onChange={brgy}>
                                    <option>---Select Barangay---</option>
                                        {
                                            barangayData && barangayData.length > 0 && barangayData.map((item) => <option
                                                key={item.brgy_code} value={item.brgy_code}>{item.brgy_name}</option>)
                                        }
                                </select>
                            </FormGroup>
                            <FormGroup className='d-flex justify-content-end mb-5'>
                                    <Button className='public-btn px-5 mt-3'>
                                        Save
                                    </Button>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Address