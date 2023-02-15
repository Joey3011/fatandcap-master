import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import * as Realm from 'realm-web' 
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import './formSearch.css'
import { TextField } from '@mui/material';

export const AutoCompleteSearch = () => {

    const [search, setSearch] = useState('')

    const [getAutoComplete, setAutoComplete] = useState([])

    const navigate = useNavigate()


    const onHandleSubmitSearch = (e) => {
      e.preventDefault()
      navigate(`/fatandcap/shop/product?search=${search === "" ? "store" : search}`)
      setSearch('')
    }

    useEffect(()=>{
        const autoSearchFunction = (async() =>{
           if(search !== ""){
                 try{
                     const APP_ID = process.env.REACT_APP_REALM_APP_ID
                     const app = new Realm.App({ id: APP_ID }) 
                     const credentials = Realm.Credentials.anonymous()
                     const user = await app.logIn(credentials);
                     const searchAutoComplete = await user.functions.autoSearch(search)
                     setAutoComplete(searchAutoComplete)
                 }catch(err){
                   console.log(err)
                 }
           }else{
             setAutoComplete([])
           }
        })
       autoSearchFunction()
     },[search])
     
     const handleGetAutoCompleteSearch = (id) =>{
        setSearch('')
        navigate(`/fatandcap/shop/item/details?item=${id}`)
      }

  return (
    <>
    <Container>
        <Row>
            <Col>
                <Form id='searchbar' className='search mb-5' onSubmit={onHandleSubmitSearch}>
                  <div className='search-box'>
                    <TextField
                        className='w-100' 
                        label="Search"
                        id='search'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start" onClick={onHandleSubmitSearch}>
                              <IconButton>
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        required
                      />
                      { getAutoComplete !== "" && (
                            <ul style={{backgroundColor: '#E1E0FF', display: 'block', marginTop: '-5px'}}>
                                {
                                getAutoComplete.map((item) => {
                                    return(
                                    <li key={item._id} className='hover pe-2 text-primary cursor-pointer text-truncate border' style={{textAlign: 'left', fontSize: '12px', lineHeight: '32px', borderRadius: '5px'}} onClick={ () => handleGetAutoCompleteSearch(`${item._id}`)}>
                                        {item.itemName}
                                    </li>
                                    )
                                })
                                }
                            </ul>
                            )
                        }
                  </div>
                </Form>
            </Col>
        </Row>
    </Container>
    </>
  )
}

export default AutoCompleteSearch