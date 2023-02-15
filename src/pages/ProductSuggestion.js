

import React from 'react'
import { Container, Row } from 'reactstrap';
import { useGetProductQuery } from '../pages/AccountControler/productApiSlice'
import Product from './AdminProduct'
import Spinner from '../components/Spinner/Spinner'
import '../styles/product-card.css';
import '../styles/home.css';


const ProductSuggestion = () => {

    const {
      data: item,
      isLoading,
      isFetching
    } = useGetProductQuery('productList', {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true
    })
  
    if (isLoading) return <div><Spinner /></div>
    if (item) {
      const { ids } = item
      const itemContent = ids?.length && ids.map(itemId => <Product key={itemId} itemId={itemId} />)
        return (
          <Container fluid className="trending_products">
              <Row lg='12'>
                            {/* record fetched in ProductCard will be placed here*/}
                   {itemContent}{isFetching ? <div><Spinner /></div> : ''}
              </Row>  
          </Container>
      )
    }
}

export default ProductSuggestion
