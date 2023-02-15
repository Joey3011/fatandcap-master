import React, { useState, useEffect } from 'react'
import { Col, Container, FormGroup, Row } from 'reactstrap'
import {regions, provinces, cities, barangays} from 'select-philippines-address'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormHelperText, InputLabel } from '@mui/material'
import './address.css'

export const DropDownAddress = () => {

    const [regionData, setRegion] = useState([]);
    const [provinceData, setProvince] = useState([]);
    const [cityData, setCity] = useState([]);
    const [barangayData, setBarangay] = useState([]);
    const [address, setAddress] = useState('')

    const [regionAddr, setRegionAddr] = useState('');
    const [provinceAddr, setProvinceAddr] = useState('');
    const [cityAddr, setCityAddr] = useState('');
    const [barangayAddr, setBarangayAddr] = useState('');

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

    useEffect(()=>{
        setAddress( regionAddr === "" ? 'Select Address' : `${regionAddr} ${barangayAddr} ${cityAddr} ${provinceAddr}` )
    },[regionAddr, barangayAddr, cityAddr, provinceAddr])

  return (
  <Container>
    <Row>
        <Col>
            <FormControl className='shipAdress' variant="standard">
            <InputLabel id="size"><em style={{fontSize: '14px'}} className='fw-bold text-center px-1'>{address}</em></InputLabel>
            <Select
                >
                    <FormHelperText style={{fontSize: '14px', color: '#000'}} className='text-center'><em>---Select Address---</em></FormHelperText>
                <MenuItem >
                        <Container>
                            <Row className='d-flex flex-column justify-content-center align-items-center'>
                                <Col>
                                    <FormGroup>
                                        <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select" onChange={province} onSelect={region}>
                                            <option>---Select Region---</option>
                                                {
                                                    regionData && regionData.length > 0 && regionData.map((item) => <option
                                                    key={item.region_code} value={item.region_code}>{item.region_name}</option>)
                                                }
                                        </select>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select"  onChange={city}>
                                        <option>---Select Province---</option>
                                        {provinceData && provinceData.length > 0 && provinceData.map((item) => <option
                                        key={item.province_code} value={item.province_code}>{item.province_name}</option>)
                                        }
                                        </select>
                                    </FormGroup>
                                </Col>
                                <Col>                               
                                    <FormGroup>
                                        <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select"  onChange={barangay}>
                                        <option>---Select City---</option>
                                        {
                                        cityData && cityData.length > 0 && cityData.map((item) => <option
                                        key={item.city_code} value={item.city_code}>{item.city_name}</option>)
                                        }
                                        </select>
                                    </FormGroup>
                                </Col>
                                <Col >   
                                    <FormGroup>
                                        <select style={{cursor: 'pointer'}} className='p-2 w-100' type="select"  onChange={brgy}>
                                        <option>---Select Barangay---</option>
                                        {
                                        barangayData && barangayData.length > 0 && barangayData.map((item) => <option
                                        key={item.brgy_code} value={item.brgy_code}>{item.brgy_name}</option>)
                                        }
                                        </select>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Container>
                    </MenuItem>
                </Select>
            </FormControl>    
        </Col>    
    </Row>
  </Container>
  )
}

export default DropDownAddress