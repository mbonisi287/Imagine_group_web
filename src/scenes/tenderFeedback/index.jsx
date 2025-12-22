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


const TenderFeedback = () => {

    const { id } = useParams();
    const tenderId = id;

    const [redirectCountdown, setRedirectCountdown] = useState(5); 
    const [showRedirectSpinner, setShowRedirectSpinner] = useState(false);

    const findProjectUrl = "FindProject?id=" + id;
    const [ singleProject, setSingleProject ] = useState([]);

    // Write Feedback.
    const [ fbSection, setFbSection ] = useState(false);
    const [ writeFb, setWriteFb ] = useState(false);

    // Feedback Section 
    const feedbackUrl = "FindFeedback?tenderProjectId=" + id;
    const [ feedbackArray, setFeedbackArray ] = useState([]);
    const [ previousFbArea, setPreviousFbArea ] = useState(false);

    const [ additionalFbForm, setAdditionalFbForm ] = useState(false);

    const [loading, setLoading] = useState(false);
    const firstFeedback = [];

    //const ParentFeedbackId = '';


    //Find single Project
    useEffect(() => {

        const fetchProjects = () => {
             axios.get(API_URL + findProjectUrl , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                })
            .then(response =>  setSingleProject(response.data)) // Assume data is an array of { id, name }
            .catch(error => console.error('Error fetching data:', error)); 

            axios.get(API_URL + feedbackUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                })
            .then(response => {
                 setFeedbackArray(response.data);

                
            }) // Assume data is an array of { id, name }
            .catch(error => console.error('Error fetching data:', error)); 

        }
           
              // Call immediately on mount
      fetchProjects();
    
  
      // Set interval to run every 60 seconds
      const intervalId = setInterval(fetchProjects, 60000);
  
      // Cleanup on unmount
      return () => clearInterval(intervalId);

    }, []); 

    useEffect(() => {
        if (feedbackArray.length === 0) {
            console.log("Feedback Array is empty");
            setFbSection(true);
            setPreviousFbArea(false);
        } else {
            console.log("Feedback Array:", feedbackArray);
            setFbSection(false);
            setPreviousFbArea(true);
        }
    }, [feedbackArray]); 

    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {  username: "",   roleType:"", feedbackNotes: "", feedbackType: "", attachmentUrl:"" },
    });

    const onSubmit = async (data) => {

        data.username = "mbonisitshuma287@gmail.com";
        data.roleType = "superadmin";
        data.attachmentUrl = "No File Submitted";
        data.tenderProjectId = tenderId;

         
        //setLoading(true);
        //setShowRedirectSpinner(true);
        try{
            await axios.post(API_URL + "createFeedback", data);
            //successResponse();
            alert("Form submitted successfully!");   
            setFbSection(false);   
            fetchProjects(); 

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
            navigate('/'); 
            
        }

        
        

    };

     const onSubmit2 = async (data) => {

        data.username = "mbonisitshuma287@gmail.com";
        data.roleType = "superadmin";
        data.attachmentUrl = "No File Submitted";
        data.tenderProjectId = tenderId;
        
        if (feedbackArray.length > 0) {
            // Use feedbackId of the first feedback as the parent
            const parentId = feedbackArray[0].parentFeedbackId;
            console.log("Parent ID being sent:", parentId);
            data.parentFeedbackId = parentId;
        } else {
            console.error("No feedback found. Cannot set parentFeedbackId.");
            return; // stop submission
        }
        
  
         
        //setLoading(true);
        //setShowRedirectSpinner(true);
        try{
            await axios.post(API_URL + "additionalFeedback", data);
            //successResponse();
            setAdditionalFbForm(false);  
            alert("Form submitted successfully!");     
            fetchProjects();     

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
            navigate('/'); 
            
        }
    };


    //Admin Show Feedback for All Projects


    return(
        <Box m="20px">
            <Header title="Write Feedback On Tender Projects" subtitle="Manage Current Feedback for this Tender Projects" />
                <div>
                    {
                        singleProject.map((tenders, index) =>{
                            return<div key={index} className='row projectRow'>
                                <h3> Current Project </h3>
                                <div className='col-6 col-lg-6'>
                                    <p> Client Name : {tenders.clientName } </p>
                                    <p> Tender Number : {tenders.tenderNumber } </p>
                                    <p> Tender Description : {tenders.tenderDescription } </p>
                                    <p> Date of Submission : {tenders.tenderClosingDate } </p>
                                    <p> Contact Details : {tenders.contactDetails } </p>
                                    
                                    <p> Contact Value : R {tenders.contactValue } </p>
                                    <p> Status : {tenders.status } </p>
                                  
                                </div>
                                <div className='col-6 col-lg-6'>
                                    <p> Debriefing Notes : {tenders.debriefingNotes } </p>
                                    <p> Reasons For Not Submitting : {tenders.reasonSubmission } </p>                                    
                                    <p> Briefing Attendance : {tenders.attendedStatus } </p>                                  
                                    <p> Rank Outcome : {tenders.rankOutcome } </p>
                                    <p> Date Created : {tenders.dateCreated } </p>

                                </div>
                            </div>
                        })
                    }
                   
                </div>

                {/* Show Previous Feedback */}
                { 
                    previousFbArea &&
                    <div className='previousFbSection'>
                        <h3> Previous Feedback </h3>
                        <div className=''>
                            <hr />
                            {
                                    feedbackArray.map((feedbacks, index) => {
                                        return <div className='row' key={index}>
                                            
                                            <span> Feedback Notes : <span className='innerSpan'> { feedbacks.feedbackNotes } </span>   | 
                                                   Feedback Date : <span className='innerSpan'> { feedbacks.feedbackDate } </span> |
                                                   Feedback Username :  <span className='innerSpan'> { feedbacks.username } </span> |                                                    
                                                   Feedback Type :  <span className='innerSpan'> { feedbacks.feedbackType }</span>                                               
                                                 </span>
                                                 <span> | </span>                                                 
                                        </div>
                                    })
                                }
                        </div>
                        <div>
                            <button className='btn btn-success' onClick={() => setAdditionalFbForm(true)}> Add Feedback </button>
                            <div>
                                { additionalFbForm && 
                                <>
                                    <h4> Reply To Feedback </h4>
                                     <button className='btn btn-danger' onClick={() => setAdditionalFbForm(false)}> Close The Reply Section </button>
                                    <form onSubmit={handleSubmit(onSubmit2)}>
                             
                                        <Box>
                                            <div className="form-group">
                                                <label className="form-label"> Feedback Type  </label>     
                                                <Controller
                                                    name="feedbackType"
                                                    control={control}
                                                    render={({ field }) => <input {...field} type="text" className="form-control" placeholder="Feedback Type" required />}
                                                /> 
                                                
                                            </div>
                            
                                            

                                            {/* Feedback Note  */}
                                            <div className="form-group">
                                                <hr />
                                                <label className="form-label">
                                                    Feedback Notes –  (maximum 500 characters)
                                                </label>
                                                <Controller
                                                    name="feedbackNotes"
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
                                                            placeholder="Maximum 500 characters, alternatively send us an email...."
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
                                </>

                               }

                            </div>
                        </div>
                                
                        
                    </div> 
                }

                {/* Create New Feedback */}
                { 
                    fbSection && 
                    <div className="feedbackSection">
                        <button className='btn btn-primary' onClick={() => setWriteFb(true)}> Write Feedback </button>

                        { 
                            writeFb && 
                            <div>
                                <form onSubmit={handleSubmit(onSubmit)}>                             
                                   <Box>
                      
                                    <div className="form-group">                        
                                        <label className="form-label"> Feedback Type  </label>     
                                        <Controller
                                            name="feedBackType"
                                            control={control}
                                            render={({ field }) => <input {...field} type="text" className="form-control" placeholder="Feedback Type" required />}
                                        />                                        
                                    </div>
                    
                                     

                                    {/* Feedback Note  */}
                                    <div className="form-group">
                                    <hr />
                                        <label className="form-label">
                                            Feedback Notes –  (maximum 500 characters)
                                        </label>
                                        <Controller
                                            name="feedbackNotes"
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
                                                    placeholder="Maximum 500 characters, alternatively send us an email...."
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
                            Write Feeback Here  
                            <button className='btn btn-danger' onClick={() => setWriteFb(false)}> Close Feedback Area </button>
                        </div>       }             
                    </div>
                }

                {/* Write Additional */}
                
    
        
        </Box>
        )

}

export default TenderFeedback;