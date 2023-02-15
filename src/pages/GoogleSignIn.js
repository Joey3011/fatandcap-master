import React, { useEffect, useState } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';

export const GoogleSignIn = () => {
    const [ profile, setProfile ] = useState([]);
    const clientId = '575425146197-v08i9lidc4ta8vbu2llboafbglba5b25.apps.googleusercontent.com'
    useEffect(() => {
    const initClient = () => {
            gapi.auth2.init({
            clientId: clientId,
            scope: ''
        });
        };
        gapi.load('client:auth2', initClient);
    });
    const onSuccess = (res) => {
        setProfile(res.profileObj);
    };
    const onFailure = (err) => {
        console.log('failed:', err);
    };
    const logOut = () => {
        setProfile(null);
    };


    return (
        <>
         <div>
     
            {profile ? (
                <div>
                    <img src={profile.imageUrl} alt="user" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <GoogleLogout clientId={clientId} buttonText="Log out" onLogoutSuccess={logOut} />
                </div>
            ) : (
                <GoogleLogin
                    clientId={clientId}
                    buttonText="Sign in with Google"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                />
            )}
        </div>
    );
    </>
    );
}

export default GoogleSignIn
