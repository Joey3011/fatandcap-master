import React from 'react'
import ReCAPTCHA from "react-google-recaptcha"


export const Captcha = () => {

    const onChange = (value) => {
        console.log("Captcha value:", value);
    }
  return (
    <ReCAPTCHA
        sitekey="Your client site key"
        onChange={onChange}
    />
  )
}

export default Captcha