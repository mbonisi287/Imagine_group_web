import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

import PasswordChange from './changePassword';


import { API_URL } from '/src/global';

function Login({ }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const navigate = useNavigate();
   
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch (e) {
      return null;
    }
  }

    const IpAddress = "https://flymango.azurewebsites.net/api/login";
    //const IpAddress = "https://localhost:44388/api/login";


  const login = async ({onLoginSuccess}) => {
    try {
      const res = await axios.post(API_URL + "login", {
        username,
        password
      });

      if (res.data.requiresPasswordChange) {
        setNeedsPasswordChange(true);
        alert("You must change your password.");
      } else {
        //localStorage.setItem('token', res.data.token);
        //localStorage.setItem('username', res.data.username);
        //localStorage.setItem('adminLevel', res.data.adminLevel);
        const token = res.data.token;
        if (onLoginSuccess) {
          onLoginSuccess(token); // Only if defined
        }

       
        localStorage.setItem('token', res.data.token);
        const payload = JSON.parse(atob(token.split('.')[1])); 
        localStorage.setItem('username', payload.name); // store username
        localStorage.setItem('role', payload.role);
        console.log("Login Successful."+ JSON.stringify(payload.username));
        //alert("Login Successful."+ JSON.stringify(payload.nam));
        navigate('/'); 
        

        
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  if (needsPasswordChange) {
    return <PasswordChange username={username} />;
  }

  return (
    <div className='loginContainer'>
          <div className="passDiv">

          <h3 className='h3Heading'> Welcome to the  FlyMango - Call Center Portal</h3>
          <hr />
          <h4 className='h4Heading'> Log In</h4>
          <div className="form-group">
            <label className='form-label'> Username </label>
            <input className="form-control "  onChange={e => setUsername(e.target.value)} type="email" placeholder=" Please enter your email address as your Username" />
          </div>
          <div className="form-group">
            <label className='form-label'> Password </label>
            <input className="form-control"  onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
          </div>
          <hr />
        
          
          <button className="btn btn-primary" onClick={login}>Login</button>
        </div>
    </div>

  );
}

export default Login;
