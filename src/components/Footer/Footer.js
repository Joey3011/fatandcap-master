import React from 'react';
import swal from 'sweetalert';
import emailjs from '@emailjs/browser';
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from 'mdb-react-ui-kit';
import { FaGithub, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import './footer.css';
import { useState } from 'react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const form = useRef();
    
 const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        'service_x7k8ulo',
        'template_tm21d0w',
        form.current,
        'v5qRLym1phBSpd7e1'
      )
      .then(
        (result) => {
          console.log(result.text);
            swal({
              title: 'Confirmation!',
              text: 'Thanks for Contacting us!',
              icon: 'success',
              button: 'Ok',
            });
            e.target.reset()
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <MDBFooter
      style={{ background: '#E1E0FF' }}
      className="text-center text-lg-start text-muted footer"
    >
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>Get connected with us on social networks:</span>
          <a
            href="#"
            className="mx-4 text-reset fs-4"
            style={{ color: 'darkgoldenrod' }}
          >
            <FaTwitter />
          </a>
          <a
            href="#"
            className="me-4 text-reset fs-4"
            style={{ color: 'darkgoldenrod' }}
          >
            <FaLinkedin />
          </a>
          <a
            href="#"
            className="me-4 text-reset fs-4"
            style={{ color: 'darkgoldenrod' }}
          >
            <FaGithub />
          </a>
          <a
            href="#"
            className="me-4 text-reset fs-4"
            style={{ color: 'darkgoldenrod' }}
          >
            <FaFacebook />
          </a>
        </div>
      </section>

      <section className="">
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <MDBIcon icon="gem" className="me-3" />
                Company name
              </h6>
              <div >
                <small className='fw-bold mb-1' style={{fontSize: '14px'}}>
                  FatAndCap 
                </small>
              </div>
                
                <small style={{fontSize: '13px'}}>
                  Founded by Joey and Manuel  < br />
                  from Tarlac City, Philippines. < br />
                  FAT is for Manuel < br /> 
                  CAP is for Joey
                </small>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Products</h6>
              <small style={{fontSize: '13px'}}>
                <a href="#!" className="text-reset">
                  Mobile/Phone And Gadget < br />
                  Accessories < br />
                  Shorts < br />
                  Jogger < br />
                  Men's Jeans < br />
                  Women's Jeans < br />
                  Shoes < br />
                  Tools < br />
                  Electronis Parts < br />
                  Appliances < br />
                  Furniture < br />
                  Baby Products 
                </a>
              </small>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Site Map</h6>
              <p>
                <Link to='/fatandcap/auth/login'> <small style={{fontSize: '13px'}}>Login</small></Link>
              </p>
              <p>
              <Link to='/fatandcap/auth/register'> <small style={{fontSize: '13px'}}>User Sign Up</small></Link>
              </p>
              <p>
              <Link to='/fatandcap/auth/sellerregister'> <small style={{fontSize: '13px'}}>Seller Sign Up</small></Link>
              </p>
              <p>
              <Link to='/fatandcap/shop/product?search="store"'> <small style={{fontSize: '13px'}}>Store</small></Link>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4 text-center">
              <h6 className="text-uppercase fw-bold mb-4">Contact Us</h6>
              <p>
                <MDBIcon icon="home" className="me-2 mb-1" />
                Tarlac City, Philippines 2300
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                info@example.com
              </p>
              <div className="contact-form" id="contact">
                <div className="c-right">
                  <form ref={form} onSubmit={sendEmail}>
                    <input
                      type="text"
                      name="user_name"
                      className="user"
                      placeholder="Name"
                      required
                    />
                    <input
                      type="email"
                      name="user_email"
                      className="user"
                      placeholder="Email"
                      required
                    />
                    <textarea
                      name="message"
                      className="user"
                      placeholder="Message"
                      required
                    />
                    <input
                      type="submit"
                      value="Send"
                      className="button public-btn"
                    />
                  </form>
                </div>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div
        className="text-center p-3 mt-5"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.07)',
          position: 'fixed',
          bottom: '0',
          left: '0',
          minWidth: '100%',
        }}
      >
        <small className="text-dark">© 2023 Copyright</small>
        <small className="ms-2 text-dark">
          Developed by Joey Hipolito & Manuel Rodriguez
        </small>
      </div>
    </MDBFooter>
  );
};
export default Footer;