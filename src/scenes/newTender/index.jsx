import { useState, useRef , useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal';
import { ModalHeader } from 'react-bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { Header, BarChart } from "../../components";

import {
  BrowserRouter as Router,
  Routes,
  Route, Link, useLocation, useNavigate,
} from "react-router-dom";

import React from "react";
import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import { API_URL } from '/src/global';
import './index.css';

import { useParams } from "react-router-dom";

const NewTender = () => {

    const inputFileRef = useRef();
    const [file, setFile ] = useState('');
     const navigate = useNavigate();
    const [ successMessage, successMessageVisible ] = useState(false);

    const [ redirectCountdown, setRedirectCountdown] = useState(5); 
    const [ showRedirectSpinner, setShowRedirectSpinner] = useState(false);
    const [ loading, setLoading] = useState(false);
    const [ newProjectForm, setNewProjectForm ] = useState(false);
    const [ showCheckListModal, setShowCheckListModal ] = useState(false);

    const [ userDepartment, setUserDepartment] = useState('');

    const openCheckListModal = () => {
       
        setShowCheckListModal(true);

    }
    const closeCheckListModal = () => {
        setShowCheckListModal(false);
         setNewProjectForm(true);
    }

    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {  username: "",   roleType:"", feedbackNotes: "", feedbackType: "", attachmentUrl:"" },
    });
  
    const onSubmit = async (data) => {

        data.username = "mbonisitshuma287@gmail.com";
        data.roleType = "superadmin";
        //data.attachmentUrl = "No File Submitted";
        data.beforeCheckList = true;
        data.department = userDepartment;
        data.attachmentUrl = data.clientName + data.tenderNumber + ".pdf";
        //data.tenderProjectId = tenderId;

          
        //setLoading(true);
        //setShowRedirectSpinner(true);
        try{
            await axios.post(API_URL + "createProject", data);
            //successResponse();
            alert("Form submitted successfully!");   
            

            const uploadData = new FormData();
            uploadData.append('file', file, data.attachmentUrl );

            await axios.post(API_URL + 'UploadAttachment', uploadData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            });
            //setFbSection(false);   
            //fetchProjects(); 

            //Api for Document Upload
            // const uploadData = new FormData();
            // uploadData.append('file', file, data.fileName );

            
            //setVerificationEmailModal(true);

            
            //Redirect or Show Spinner
            const interval = setInterval(() => {                
            setRedirectCountdown((prev) => {
                if (prev === 1) {
                clearInterval(interval);
                                    // Adjust path as needed
                }
                return prev - 1;
            });
            }, 1000);

        }catch(error){

        } finally{
            
            setLoading(false); 
            successMessageVisible(false);
            navigate('/tenderProjects'); 
            
        }
    };

        const inputFile = useRef(null);

      // Function to reset the input element
      const handleReset = () => {
          if (inputFile.current) {
              inputFile.current.value = null;
              //inputFile.current.value = "";
              //inputFile.current.type = "text";
              //inputFile.current.type = "file";
              
          }
      };

 return(
        <Box m="20px">
            <Header title="New Leads (Tender) Projects" subtitle="Upload The New Leads Projects" />

            <div>
                <button className='btn btn-primary' onClick={() => openCheckListModal()}> Create New Leads(Project) </button>

            </div>
            
                {   
                    newProjectForm && 
                    <div>
                        <hr />
                         <button className='btn btn-danger' onClick={() => setNewProjectForm(false)}> Close Project Form </button>
                        <hr />
                        <form onSubmit={handleSubmit(onSubmit)}>                             
                        <Box>      
                            <div className='row'>
                                <div className='col-4 col-lg-4'> 
                                    <div className="form-group">                        
                                        <label className="form-label"> Client Name</label>     
                                        <Controller
                                            name="clientName"
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" className="form-control" placeholder="Client Name" required />}
                                        />                                        
                                    </div>
                                </div>
                                <div className='col-4 col-lg-4'> 
                                    <div className="form-group">                        
                                        <label className="form-label"> Tender Number  </label>     
                                        <Controller
                                            name="tenderNumber"
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" className="form-control" placeholder="Tender Number" required />}
                                        />                                        
                                    </div>
                                </div>

                                <div className='col-4 col-lg-4'> 
                                    <div className="form-group">                        
                                        <label className="form-label"> Sector  </label>     
                                        <Controller
                                            name="sector"
                                            control={control}
                                            render={({ field }) => 
                                                <select className='form-select' {...field}
                                                    name="sector">
                                                    <option value="" disable> Select Sector - Private/Public  </option>
                                                    <option value="1"> Private </option>
                                                    <option value="2"> Public </option>

                                                </select>
                                            }
                                        />                                        
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-4 col-lg-4'>                                    
                                    <div className="form-group">                        
                                        <label className="form-label"> Tender Description  </label>     
                                        <Controller
                                            name="tenderDescription"
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" className="form-control" placeholder="Tender Description" required />}
                                        />                                        
                                    </div>
                                </div>
                                <div className='col-4 col-lg-4'>
                                    <div className="form-group">                        
                                        <label className="form-label"> Bid Price / Est. Development Cost / Contract Value  </label>     
                                        <Controller
                                            name="contractValue"
                                            control={control}
                                            render={({ field }) => <input {...field} type="number" className="form-control" placeholder="Enter the Bid Price / Est. Development Cost / Contract Value" required />}
                                        />                                        
                                    </div>
                                </div>

                                <div className='col-4 col-lg-4'>                                    
                                    <div className="form-group">                        
                                        <label className="form-label"> Sponsor  </label>     
                                        <Controller
                                            name="sponsor"
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" className="form-control" placeholder="Name of Sponsor" required />}
                                        />                                        
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                  <div className='col-4 col-lg-4'> 
                                    <div className="form-group">                        
                                        <label className="form-label"> Bidding Entity/ Interval Division  </label>     
                                        <Controller
                                            name="sector"
                                            control={control}
                                            render={({ field }) => 
                                            <select  value={userDepartment} 
                                                onChange={(e) => setUserDepartment(e.target.value)}                                 
                                                className="form-select" required > 
                                            <option value=""> Choose the Department </option> 
                                            <option value="1"> Imagine Eco Build Solutions </option>                                                
                                            <option value="2"> Imagine Real Estate </option> 
                                            <option value="3"> Qwabe Mahlase Construction(QMC)</option>                                
                                    </select> 
                                            }
                                        />                                        
                                    </div>
                                </div>

                                <div className='col-4 col-lg-4'> 
                                    <div className="form-group">                        
                                        <label className="form-label"> Closing Date</label>     
                                        <Controller
                                            name="clientName"
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" className="form-control" placeholder="Select the Closing Date and Time" required />}
                                        />                                        
                                    </div>
                                </div>
                            </div>






            
                            

                            {/* Debriefing Notes  */}
                            <div className="form-group">
                                <hr />
                                <label className="form-label">
                                Debriefing Notes –  (maximum 500 characters)
                                </label>
                                <Controller
                                    name="debriefingNotes"
                                    control={control}
                                    rules={{
                                    required: "This field is required",
                                    maxLength: {
                                        value: 500,
                                        message: "Message cannot exceed 500 characters",
                                    },
                                    }}
                                    render={({ field }) => {
                                        const charCount = field.value ? field.value.length : 0;
                                        return (
                                        <>
                                            <textarea
                                            {...field}
                                            rows="5"
                                            maxLength="500"
                                            className={`form-control ${errors.messageNote ? 'is-invalid' : ''}`}
                                            placeholder="Maximum 500 characters......."
                                            ></textarea>

                                            {/* Live character count display */}
                                            <div className="text-end ">
                                            {charCount}/500 characters used
                                            </div>

                                            {errors.messageNote && (
                                            <div className="invalid-feedback">{errors.messageNote.message}</div>
                                            )}
                                        </>
                                            );
                                        }}
                                />
                            </div>

                            {/* External Contact Person's Details  */}
                            <div className="form-group">
                                <hr />
                                <label className="form-label">
                                External Contact Person's Details - (maximum 500 characters)
                                </label>
                                <Controller
                                    name="contactDetails"
                                    control={control}
                                    rules={{
                                    required: "This field is required",
                                    maxLength: {
                                        value: 500,
                                        message: "Contact Details cannot exceed 500 characters",
                                    },
                                    }}
                                    render={({ field }) => {
                                        const charCount = field.value ? field.value.length : 0;
                                        return (
                                        <>
                                            <textarea
                                            {...field}
                                            rows="5"
                                            maxLength="500"
                                            className={`form-control ${errors.messageNote ? 'is-invalid' : ''}`}
                                            placeholder="Maximum 500 characters....."
                                            ></textarea>

                                            {/* Live character count display */}
                                            <div className="text-end ">
                                            {charCount}/500 characters used
                                            </div>

                                            {errors.messageNote && (
                                            <div className="invalid-feedback">{errors.messageNote.message}</div>
                                            )}
                                        </>
                                            );
                                        }}
                                />
                            </div>

                            <div className="form-group">
                                <hr />
                                {/* Removed the "Required" attribute */}
                                <label className="form-label"> Upload RQF Document  </label>
                                <input required type="file" 
                                        className="form-control" aria-describedby="Upload"
                                        ref={inputFile}
                                        accept=".pdf"
                                        onChange={(event) => {
                                            
                                        if(event.target.files && event.target.files[0] && event.target.files[0].type ==='application/pdf'){
                                            if(event.target.files[0].size < 5 * 1024 * 1024 ){
                                                setFile(event.target.files[0])
                                    
                                            }else{
                                            setFileSizeErrorModal(true);
                                            //alert("Please select a file that is less than 2MegaBytes");
                                            
                                            handleReset();
                                            //alert("Form field will be automitically reset for a new upload");
                                            }
                
                                        }
                                }} />
                            </div>
                        </Box>
                    

            
            
        
                        <button className="stepsBtn btn btn-primary" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                Submitting...
                                <span
                                className="spinner-border spinner-border-sm ms-2"
                                role="status"
                                aria-hidden="true"
                                ></span>
                            </>
                            ) :  'Submit'     
                        }
                        </button>
                    
                        </form> 
                    </div>
                }

                <Modal
                    show={showCheckListModal}
                    handle={closeCheckListModal}
                    backdrop="static"
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    keyboard={false}>
                    <ModalHeader>
                        
                        <Modal.Title> Project CheckList </Modal.Title>
                       

                    </ModalHeader>

                     <Modal.Body>

                            <h3> Before creating a new project, please ensure you have the following information ready:</h3> 

                                <p> Name of Project (note if this is a Panel Submission)</p>

                                <p> Project Value</p> 

                                <p> Briefing Date </p>
                                
                                <p> Submission Date </p>

                                <p> Resources Needed</p>

                                <p>Date of Final Submission </p> 

                                <p>Status Bar / Progress Details </p> 
                                

                            <h4> ⚠️ <strong> NB: </strong> This checklist will help you capture all the required details accurately and avoid missing important project information... </h4>   

                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-primary" onClick={closeCheckListModal}> Close </button>
                        </Modal.Footer>


                    </Modal>
           
        </Box>
        )

}

export default NewTender;