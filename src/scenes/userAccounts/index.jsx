import { Box } from "@mui/material";
import { useState, useRef , useEffect} from 'react'
import { Header, BarChart } from "../../components";
import './index.css';
import axios from "axios";

//import Button from 'react-bootstrap/Button';

//import Modal from 'react-bootstrap/Modal';
//import Form from 'react-bootstrap/Form';
//import { ModalHeader } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Controller, useForm } from "react-hook-form";

import { API_URL } from '/src/global';

const UserAccounts = () => {
    const [ users, setUsers] = useState([]);

    const [ userCreate, setUserCreate ] = useState(false);

    const [ userLevel, setUserLevel] = useState('');

    const [ userDepartment, setUserDepartment] = useState('');

    const [ newUserMessage, setNewUserMessage] = useState(false );

    // Categorized users
    const [adminUsers, setAdminUsers] = useState([]);
    const [callCenterAgents, setCallCenterAgents] = useState([]);

    // Loading For Submitting New User
    const [loading, setLoading] = useState(false);

    
    // Fetch options from API
    useEffect(() => {
        axios.get(API_URL + "GetAllUsers", {
        headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(response => {
            setUsers(response.data); // Assume data is an array of { id, name }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    const CreateUser = () => {
        setUserCreate(true);
    }

    const CloseUserCreation = () => {
        setUserCreate(false);
    }

  const { control, handleSubmit } = useForm({
    defaultValues: {  username: "",   passwordHash: "", adminLevel:"" },
  });

  const onSubmit = async ( data ) =>{
     data.adminLevel = userLevel;
     data.department = userDepartment;
     setLoading(true);

        try {
          await axios.post(API_URL + "register", data);
          //successResponse();
          //alert("Form submitted successfully!");       

          //alert("File Upload Successfully");


        } catch (error) {
          alert("User Already Exists");
        } finally{
            newUserNotification();
            setLoading(false);
        }

  }

  const newUserNotification = () => {
    setUserCreate(false);
  }


// Update adminUsers and callCenterAgents whenever 'users' changes
useEffect(() => {
    const admins = [];
    const agents = [];
    
    users.forEach(user => {
        if (user.adminLevel === 'superadmin') {
            admins.push(user);
        } else if (user.adminLevel === 'user') {
            agents.push(user);
        }
    });

    setAdminUsers(admins);
    setCallCenterAgents(agents);
}, [users]);

       return(
        <>

          <Box m="20px">
                    <Header title="User Account Management" subtitle="Managing All System User Accounts" /> 
            {/* Create New User */}
            <div className="newUser">
                <button className="btn btn-primary" onClick={() => CreateUser()} >Create User</button>
                { 
                    userCreate && 
                    <div className="userForm">
                        <form  onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label className="form-label"> Username </label>
                                    <Controller
                                        name="username"
                                        control={control}
                                        render={({ field }) => 
                                        <input {...field} type="email" className="form-control" placeholder="Please enter the username..an email address...."  name="username" required/>
                                        
                                        }
                                    />   <div className="invalid-feedback">Please fill out this field.</div> 

                            </div>

                            <div className="form-group">
                                <label className="form-label"> Password </label>
                                    <Controller
                                            name="passwordHash"
                                            control={control}
                                            render={({ field }) => 
                                            <input {...field} type="text" className="form-control" placeholder="Please enter a default password for the user ...."  name="passwordHash" required/>
                                        
                                        }
                                    />   
                            </div>

                            <div className="form-group">
                                <label className="form-label"> Admin Level </label>
                                    
                                        <select  value={userLevel} 
                                        onChange={(e) => setUserLevel(e.target.value)} 
                                        
                                        className="form-select" required > 
                                            <option value=""> Choose the admin level</option> 
                                            <option value="superAdmin"> Super Administrator </option>                                                
                                            <option value="admin"> Administrator </option> 
                                            <option value="user"> Staff Member </option>                                
                                            </select>                               
                                            
                                        
                                
                            </div>

                            <div className="form-group">
                                <label className="form-label"> Department </label>
                                    
                                <select  value={userDepartment} 
                                    onChange={(e) => setUserDepartment(e.target.value)} 
                                
                                className="form-select" required > 
                                    <option value=""> Choose the Department </option> 
                                    <option value="1"> Imagine Eco Build Solutions </option>                                                
                                    <option value="2"> Imagine Real Estate </option> 
                                    <option value="3"> Qwabe Mahlase Construction(QMC)</option>  
                                    <option value="4"> Finance Department</option>                                 
                                    </select> 
                                
                            </div>

                        <div className="">
                            
                            <button className="btn btn-primary" type="submit">
                                { loading ? 
                                    (
                                    <>
                                        Creating New User...
                                        <span
                                        className="spinner-border spinner-border-sm ms-2"
                                        role="status"
                                        aria-hidden="true"
                                        ></span>
                                    </>
                                    ) 

                                    : 'Submit'
                                }
                            </button>
                            <button className="stepsBtn btn btn-danger"
                            onClick={() => CloseUserCreation()}
                            > Close </button>
                        </div>
                        </form> 
                    </div>
                }

                {
                    newUserMessage &&
                    <div> New User has been created </div>
                }

            </div>
            <hr/>

            {/* All Users */}
            <div className="allUsers">
                <div className="userBlock">  
                    <h1> All Users </h1>
                    <div className="row">
                        <div className="col-12 col-lg-12">
                            <table className="table table-striped table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th> Username </th>
                                        <th> Department </th>
                                        <th> Administration Level </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map( admins =>
                                            <tr key={admins.id}>
                                                <td>{admins.username}</td>
                                                <td>{ admins.department === '1' ? 'Imagine Eco Build Solutions' :
                                                    admins.department == 2 ? 'Imagine Real Estate': 'Qwabe Mahlase Construction(QMC)'}</td>
                                                <td>{ admins.adminLevel ==='user' ? 'Call Center Agent': 'Imagine Group Admin'}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>

                            </table>
                        </div>

                        <div className="col-12 col-lg-12">
                           
                        </div>
                    </div>                 
                </div>

            </div>
            </Box>

        </>
    )

}

export default UserAccounts;