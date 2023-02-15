import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Routers from '../../routers/Routers'

//{/* layout of the page fixing header and footer, import path from router*/}
const Layout = () => {
  return (
  <>
     <Header />
     
        <div style={{overflow: 'hidden', background: '#FFFDFA', minHeight: '50vh'}}>
            <Routers />
        </div>
      <Footer />
  </>
  );
};

export default Layout; //{/* export layout to app js*/}
