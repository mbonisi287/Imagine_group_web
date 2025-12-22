import React, { useState } from 'react';
import axios from 'axios';
import './login.css';

import { API_URL } from '/src/global';

function PasswordChange({ username }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const changePassword = async () => {
    try {
      const res = await axios.post(API_URL + 'change-password', {
        username,
        oldPassword,
        newPassword
      });
      alert(res.data);
      window.location.reload(); 
      // or redirect to login
    } catch (err) {
      alert("Password change failed");
    }
  };

  return (
    <div className="passDiv">
      <h3 className='h3Heading'> Welcome to the  FlyMango - Call Center Portal</h3>
      <hr />
      <h4 className='h4Heading'> Please Change Your Password on your first sign up attempt</h4>
       <div className="form-group">
        <label className='form-label'> Old Password </label>
          <input className="form-control" onChange={e => setOldPassword(e.target.value)} 
          placeholder="Old Password" 
          type="password" />
       </div>

        <div className="form-group">
          <label className='form-label'> New Password </label>
            <input className="form-control" onChange={e => setNewPassword(e.target.value)} placeholder="New Password" type="password" />
        </div>
        <hr />


      <button className="btn btn-primary" onClick={changePassword}>Change Password</button>
    </div>
  );
}

export default PasswordChange;
