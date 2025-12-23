import { useState, useRef , useEffect, useCallback} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal';
import { ModalHeader, ModalBody } from 'react-bootstrap';
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

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Mancom = () => {

    const [ allTenders, setAllTenders] = useState([]);
    const [ leads, setLeads] = useState([]);

    const [ filteredLeads, setFilteredLeads ] = useState([]);

    const [ selectedStatus, setSelectedValue]  = useState('');

    const [ searchDiv, setSearchDiv] = useState(false);
    const [ showNoRecordsModal, setShowNoRecordsModal] = useState(false);
    const [ successMessage, successMessageVisible ] = useState(false);
    const [ loadingSubmit, setLoadingSubmit] = useState(false);

    const [ vouchers, setVouchers] = useState([]);
    const [ pageNumber, setPageNumber] = useState(1);
    const [ pageSize] = useState(10);
    const [ searchTerm, setSearchTerm] = useState('');
    const [ sortBy, setSortBy] = useState('Email');
    const [ sortOrder, setSortOrder] = useState('asc');
    const [ totalPages, setTotalPages] = useState(0);

    
    const [ showProjectModal, setProjectModal] = useState(false);
    const [ editModal, setEditModal ] = useState(false);
    const [ modalDataProject, setModalDataProject ] = useState([]); 
    const [ editModalData, setEditModalData] = useState([]);

    const [ showFeedbackModal, setShowFeedbackModal ] = useState(false);
    const [ modalFeedbackData, setModalFeedbackData ] = useState([]);
    const [ modalFeedback, setModalFeedback ] = useState([]);

    const [ newLeadModal, setNewLeadModal ] = useState(false);

    
    const [ sourceLead, setSourceLead ] = useState('');

    const closeProjectModal = () => setProjectModal(false);

    const closeFeedbackModal = () => setShowFeedbackModal(false);

    const closeEditModal = () => setEditModal(false);

    const closeLeadModal = () => setNewLeadModal(false);

    useEffect(() => {
    // Function to fetch vouchers
    const fetchLeads = () => {
        axios.get(API_URL + "allMeetings", {  
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
        })
        .then((response) => {
            setLeads(response.data);
            //console.log("Fetched Vouchers:", response.data);
        })
        .catch((error) => {
            console.error("API error:", error);
        });
    };

    // Call immediately on mount
    fetchLeads();

    // Set interval to run every 60 seconds
    const intervalId = setInterval(fetchLeads, 60000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
    }, []); // Empty dependency array: only runs once

    
    const fetchSingleLead = useCallback( async (leadID) => {

      const feedbackUrl = "findLead?leadID=";    

      if (!leadID) return null;

      try {
        const res = await  axios.get(API_URL + feedbackUrl + leadID , {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                            } });
          return res.data;
        } catch (err) {
        console.error('Error fetching single lead:', err);
        return null;
      }
    },[]);
  
    const ProjectDetails = async( projects ) => {
      setProjectModal(true);
      setModalDataProject(projects); 

      const fresh = await fetchSingleLead(projects.leadID);
      //alert(fresh);


      }

    const EditTenderModal = (modalDataProject) => {
      setEditModalData(modalDataProject);
        reset({
          meetingAgenda: modalDataProject.meetingAgenda,
          meetingOutcome: modalDataProject.meetingOutcome,
          meetingNotes: modalDataProject.meetingNotes,
          attendees: modalDataProject.attendees,
        });
      //setSelectedValue(Number(modalDataProject.clientReqMeeting));
      setEditModal(true);

    }

    const { control, handleSubmit, watch, reset } = useForm({
          defaultValues: { attendees:"", meetingAgenda: "", meetingName:"", meetingNote: "" },
    });

    const onSubmit = async (data) => {
      setLoadingSubmit(true);
    //data.pnrNo = !bookingNo ===''? bookingNo: "none";
  

  
      

      const url = API_URL + "SearchProject?tenderNumber=" + data.tenderNumber ;
    //const url2 = IpAddress + "GetSingleVoucher?";
        try {
         
          //Show the hidden section as a response to successfully submitted form
          const response = await axios.get(url, {
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',        // Helps prevent CSRF attacks
                'X-Frame-Options': 'DENY',                    // Protects against clickjacking
                'X-Content-Type-Options': 'nosniff',          // Prevents MIME type sniffing
                'Referrer-Policy': 'no-referrer',             // Limits referrer data sent
                'Cache-Control': 'no-store',                  // Prevents caching of sensitive data
               
               
              },
          });

          // Extract and handle the response data
          const result = response.data;
          const resLength = result.length;
      
         
      
          // Update state with fetched vouchers
          setVouchersDiv(result);
      
          // Check if data exists
          if (!result || resLength === 0) {

            setShowNoRecordsModal(true);
            setLoadingSubmit(false);
            //showModal();
          
            
            return;
          }
          successResponse();
          // window.location.href = "";
        } catch (error) {
          setErrorFormModal(true);
          setLoadingSubmit(false);
        }        
    };

    const onSubmit2 = async() => {

      editModalData.username = "mbonisitshuma287@gmail.com";
      editModalData.department = "2";

    

      const projectUpdated = {
        ...editModalData,
        clientReqMeeting: Number(selectedStatus)
      };

      if(projectUpdated.status == 1){
        projectUpdated.checkList = 1;
        alert("checkList Completed");
      }
    
      try
      {
        const response = await axios.put(API_URL + "updateLead?leadID=" + projectUpdated.leadID, projectUpdated, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

      
        // Clear the URL (removes query params, hash, etc.)
        //window.history.pushState({}, document.title, window.location.pathname);
          setModalDataProject([]);
          setProjectModal(false);

          if(response.status === 200)
          {

            const fresh = await fetchSingleLead(projectUpdated.leadID);
            setProjectModal(true);
            setModalDataProject(fresh);
            
            /*if (fresh){
              setModalDataProject(fresh);
              setEditModal(false); 
            } */
            //setProjectModal(false);
            //setModalDataProject(fresh);
            //alert("Successfully updated Project Details");
            // Then reload the page
            //window.location.reload();
            //setShowAssignModal(false); 
            //openedQuery()

           /*axios.get(
              API_URL + "findLead?leadID=" + projectUpdated.leadID,
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            ).then(response => setModalDataProject(response.data))
             .catch(error => console.error('Error fetching data:', error)); */

           

            //setEditModal(false); 
            //ProjectDetails(refreshed.data);
            //setProjectModal(true);
            //setModalDataProject(refreshed); 
            alert(response.data);
            
            //setEditModalData(refreshed.data);
          


           
            //alert("Closing the Edit Modal and Opening the View More Details Modal");
                      

          }

      }catch(error){
        if (error.response) {
          console.error("Server responded with an error:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      }

    };

    const UpdateMeeting = async(formData) => {

      const meetingID = editModalData.meetingID;

      const payload = {
        ...editModalData,
        ...formData
      };
        

      try
      {
        const response = await axios.put(API_URL + `updateMeeting?meetingID=${meetingID}`, payload, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if(response.status === 200)
        {
          // Clear the URL (removes query params, hash, etc.)
          window.history.pushState({}, document.title, window.location.pathname);
          window.location.reload();
        }

      
       
         

      }catch(error){
        if (error.response) {
          console.error("Server responded with an error:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      }
    }

    const MancomModal = () => {
      setNewLeadModal(true);

    }

    const newLead = async (data ) => {
      data.meetingType = sourceLead;

        //setShowRedirectSpinner(true);
      try{
          const response = await axios.post(API_URL + "createMeeting", data);

          if(response.status === 200) closeLeadModal();
          //successResponse();
          alert("Form submitted successfully!");   

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
          navigate('/leads'); 
          
      }

    }

    const handleStatusChange = (event) => {
      setSelectedValue(Number(event.target.value));
    }


       return(
    
            <Box m="20px">
                <Header title="Mancom" subtitle="Managing All Mancom Meetings" /> 
    
                     <div className="searchDiv">
                        <button className='btn btn-success newLead' onClick={() => MancomModal()}> Add New Meeting </button> | 
                        {/*<button className="btn btn-primary btnSearch"
                        onClick={() => setSearchDiv(true)}> Search </button>*/}
                        {
                          searchDiv && 
                          <div className="searchArea">
                            <h2> Search Form For A Tender Project </h2>
                
                                <form className="" onSubmit={handleSubmit(onSubmit)} >
                
                                         <div className="form-group invisible">
                                              
                                              <label className="form-label invisible"> Email Address </label>
                                              <Controller
                                                      name="email"
                                                      control={control}
                                                      render={({ field }) => 
                                                      <input {...field} type="email" className="form-control invisible" disabled value={userId} placeholder="Enter your Email Address...."  name="email" required/>
                                                    
                                                    }
                                                      />   <div className="invalid-feedback">Please fill out this field.</div>         
                                                                     
                                          </div>
    
                                                      
                                         <div className="form-group">
                                              <hr />
                                              <label className="form-label "> Tender Number </label>
                                              <Controller
                                                      name="tenderNumber"
                                                      control={control}
                                                      render={({ field }) => 
                                                      <input {...field} type="email" className="form-control " placeholder="Enter the Tender number to search for the project...."  name="email" required/>
                                                    
                                                    }
                                                      />   <div className="invalid-feedback">Please fill out this field.</div>         
                                                                     
                                          </div>
                
                                        
                                          
                                          
                
                
                                          
                                          <div className="form-group">  
                                                                     
                                              <button className="stepsBtn btn-sm btn btn-primary" type="submit"> 
                                              { loadingSubmit ? (
                                                          <>
                                                          Searching for your records...
                                                          <span
                                                            className="spinner-border spinner-border-sm ms-2"
                                                            role="status"
                                                            aria-hidden="true"
                                                          ></span>
                                                        </>
                                                    ) : 'Submit' }
                                                </button>  
                                          </div>                     
                                </form>   
                            <button className="btn btn-danger block" onClick={() => setSearchDiv(false)}> Close Search Area</button>
                          </div>
                        }
                
                        
                        {showNoRecordsModal && (
                          <div className="modal-overlay">
                            <div className="modal-content">
                              <h2>No Records Found</h2>
                              <p>We could not find any records for the details you provided </p>
                              <hr />
                              <p> Please verify that your <br/><span className="spanErrorModal">Voucher Number and Booking Number </span><br/>are correct.</p>
                              
                              <button className="btn btn-dark" onClick={() => setShowNoRecordsModal(false)}>Close</button>
                            </div>
                          </div>
                        )} 
                
                
                        { 
                            successMessage && 
                            <div className="verifySuccess ">
                            
                            <div className="verifySuccessRows">  
                            <h3 className="verifyH3"> Customer Records Found using the follow details:</h3>
                                  { vouchersDiv.map((tickets, index) => {
                                      return <div key={index} className="row verifyRows">
                                          <div className="col-12 col-lg-4 col-sm-12 voucherDets">
                                            
                                              <div className='voucherItem'> Booking No - Pnr No : <span className='spanData'> {tickets.pnrNo}</span>   |  Voucher No:  <span className='spanData'> {tickets.voucherNo}  </span></div>
                                              
                                              <div className='voucherItem'> Departing Airport : <span className='spanData'> {tickets.depAirport}</span>  | Arrival Airport : <span className='spanData'>{tickets.arrAirport}  </span> </div>
                                                {/*<div className='voucherItem'> Email : <span className='spanData'> {tickets.email}</span> </div>
                                              Email Confirmation */}
            
                                            <div className="voucherItem">
                                              <hr/>
                                              <p className='pEmail'> </p>
                                              Email :<span className="spanData"> {tickets.email}</span>
        
                                              </div>
        
                                              {/* Email Confirmation  End */}
                          
                                          </div>
                                          <div className='col-12 col-lg-4 col-sm-12 voucherDets'>
                                            <div className='voucherItem'> Voucher Amount : <span className='spanData'> R{tickets.voucherAmt}</span> </div>
                                            <div className='voucherItem'> Payment Amount: <span className='spanData'>R{tickets.paymentAmt} </span> </div>
                                          </div>
                                          <div className='col-12 col-lg-4 col-sm-12 voucherDets'>
                                            <div className='voucherItem'> Booking Date : <span className='spanData'> {tickets.bookingDate}</span> </div>
                                            <div className='voucherItem'> Passenger Name(Main Person Booking): <span className='spanData'>{tickets.passengerName} </span> </div>
                                              <div className='voucherItem'> All Passenger Names: <span className='spanData'>R{tickets.allPassengerNames} </span> </div>
                                          </div>
                                      
                                      </div>
                                  })}
        
                                    <button className="btn btn-danger block" onClick={() => closeSuccessMessage()}> Close Search Area</button>
        
                              </div>
                                                    
                          
                            
                            </div> 
                        }
                      </div>
        
                <div className="allVouchers">
                    <table className="table table-striped table-hover table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th> Meeting Name </th>                       
                                <th> Agenda </th>
                                <th> Meeting Date </th>
                                <th> Attendees </th>
                                <th> Outcome </th> 
                                <th> Meeting Type </th>
                                                  
                                <th> Action </th>

                                {/* <th> Date Received </th> 
                                    <th> Feedback </th>
                                */}
                            
                              
                            </tr> 
                        </thead> 
                        <tbody className="table-group-divider table-divider-color">
                            {
                                leads.map((projects, index) => {
                                    return <tr key={index}>
                                        <td>{projects.meetingName}</td>
                                        <td>{projects.meetingAgenda}</td>
                                        <td> {new Date(projects.meetingTime).toLocaleString('en-GB', {                                                                               day: '2-digit',
                                                                                      month: '2-digit', year: 'numeric', hour: '2-digit',  minute: '2-digit',
                                                                                      second: '2-digit',                                       hour12: true
                                                                                    })}</td>
                                        <td>{projects.attendees}</td>      
                                        <td>{projects.meetingOutcome}</td>
                                        <td>{projects.meetingType == 1 ? 'Mancom': 'Fincom  '}</td>
                                        

                                        <td> <button className='btn btn-info' onClick={() => ProjectDetails(projects)}> View More Details</button> </td>     
                                        {/*<td> <button className='btn btn-warning' onClick={() => SingleFeedback(projects)}> View Feedback </button> </td>   
                                        <td> <button className='btn btn-danger' onClick={() => setShowFeedbackModal(true)}> Download RFQ </button> </td> */}                                     
                                    </tr>
                                })
                            }
                        </tbody>  
                    </table> 
    
                  
                    
                        {/* Pagination controls */}
                        <div>
                            <button className="btn btn-primary"
                            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                            disabled={pageNumber === 1}
                            >
                            Previous
                            </button>
                            <span> Page {pageNumber} of {totalPages} </span>
                            <button className="btn btn-primary"
                            onClick={() => setPageNumber(prev => Math.min(prev + 1, totalPages))}
                            disabled={pageNumber === totalPages}
                            >
                            Next
                            </button>
                        </div>


                      
    
                        {/* Modal to View Tender Projects */}
                        <Modal
                          show={showProjectModal}
                          handle={closeProjectModal}
                          backdrop="static"
                          size="xl"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                          keyboard={false}
                          dialogClassName="custom-modal-width-show">
                            <ModalHeader>
                              <button className="btn btn-primary" onClick={closeProjectModal}> Close </button>
                              <Modal.Title> Meeting Summary for : { modalDataProject.meetingName } - </Modal.Title>
                              <buttton className="btn btn-info" onClick={() => EditTenderModal(modalDataProject)}>Click To Complete  Editing the Meeting </buttton>
    
                            </ModalHeader>
                            <Modal.Body>

                            
                              <div className='row'>
                                <div className='col-8'>
                                  <table className='table singleLeadTable'>
                                    <thead className='table-light'> 
                                      <tr>
                                        <th> Meeting Agenda </th><th> {modalDataProject.meetingAgenda}</th> 
                                      </tr>  
                                                                        
                                    </thead>
                                    <tbody>
                                      <tr>
                                        
                                      </tr>
                                      <tr>
                                          <td> Meeting Date </td><td>  {new Date(modalDataProject.meetingTime).toLocaleString('en-GB', {                                                                               day: '2-digit',
                                                                                      month: '2-digit', year: 'numeric', hour: '2-digit',  minute: '2-digit',
                                                                                      second: '2-digit',                                       hour12: true
                                                                                    })}</td>
                                      </tr>
                                      <tr>
                                          <td> Meeting Attendees </td><td>  {modalDataProject.attendees } </td>
                                      </tr>
                                      <tr>
                                          <td>  Meeting Notes </td>
                                          <td> {modalDataProject.meetingNotes}</td>
                                      </tr>
                                      
                                 
                                                                 
                                    </tbody>
                                  </table>
                                 
   
                                  <p className='invisible'> Project Id : {modalDataProject.id } </p>
                                  
                                </div>
                                <div className='col-4 progressArea'> 
                                  <span> Meeting OutCome: 
                                                                                                          
                                  </span>

                                  
                                  <p> Date Last Modified : <CalendarMonthIcon /> {new Date(modalDataProject.meetingTime).toLocaleString('en-GB', {
                                                                                          day: '2-digit',
                                                                                          month: '2-digit',
                                                                                          year: 'numeric',
                                                                                          hour: '2-digit',
                                                                                          minute: '2-digit',
                                                                                          second: '2-digit',
                                                                                          hour12: true
                                                                                        })} </p>
                                </div>
                              </div>                              
                            
                            </Modal.Body>
                            <Modal.Footer>
                              {/*<Link to={`/tenderFeedback/${modalDataProject.id}`}> <button className="btn btn-success" > Write Feedback on Client Name: {modalDataProject.clientName} </button> </Link> */}
                             
    
                              <button className="btn btn-primary" onClick={closeProjectModal}> Close </button>
                              
    
                            </Modal.Footer>
                        </Modal>
    
                        {/* Modal To Edit The Leads Content */}
                        <Modal
                          show={editModal}
                          handle={closeEditModal}
                          backdrop="static"
                          size="xl"
                          aria-labelledby="contained-modal-edit-vcenter"
                          centered
                          keyboard={false}
                          dialogClassName="custom-modal-width">
                            <ModalHeader>
                              <button className="btn btn-primary" onClick={closeEditModal}> Close </button>
                              <Modal.Title> Edit Meeting Details for -  { editModalData.meetingName }</Modal.Title>
                              
    
                            </ModalHeader>
                            <Modal.Body>
    
                              <form onSubmit={handleSubmit(UpdateMeeting)}>
                                <div className='row'>
                                  <div className='col-6 col-lg-6'> 
                                     <div className="form-group ">
                                        <hr />
                                        <label className="form-label cust_form_label"> Meeting Agenda </label>
                                        <Controller
                                                name="meetingAgenda"
                                                control={control}
                                                render={({ field }) => 
                                                <input {...field} type="text" className="form-control" 
                                                //value={editModalData.meetingAgenda || '' } 
                                                //onChange={(e) => setEditModalData({...editModalData, meetingAgenda: e.target.value})} 
                                                placeholder="Please enter the Tender Description...." 
                                                name="meetingAgenda" required/>
                                              
                                              }
                                                />   
                                        <div className="invalid-feedback">Please fill out this field.</div>
                                      </div>
                                  </div>

                                  <div className='col-6 col-lg-6'>     
                                      <div className="form-group ">
                                        <hr />
                                        <label className="form-label cust_form_label"> Meeting Outcome </label>
                                        <Controller
                                                name="meetingOutcome"
                                                control={control}
                                                render={({ field }) => 
                                                <input {...field} type="text" className="form-control" 
                                                //value={editModalData.meetingOutcome || '' } 
                                                //onChange={(e) => setEditModalData({...editModalData, meetingOutcome: e.target.value})} 
                                                placeholder="Please enter the Contract Value...." 
                                                name="meetingOutcome" required/>
                                              
                                              }
                                                />   
                                            <div className="invalid-feedback">Please fill out this field.</div>
                                      </div>
                                </div>

                                    
                                  </div>
    
                                  <div className="form-group ">
                                    <hr />
                                    <label className="form-label cust_form_label"> Meeting Notes </label>
                                    <Controller
                                          name="meetingNotes"
                                          control={control}
                                          render={({ field }) => 
                                          <textarea {...field} type="textarea" rows="5"
                                            className="form-control " 
                                            
                                          //value={editModalData.meetingNotes || ''}
                                          //onChange={(e) => setEditModalData({...editModalData, meetingNotes: e.target.value})} 
                                          placeholder="Edit Debriefing Notes..." 
                                          name="meetingNotes" required></textarea>
                                        
                                        }
                                        />   
                                    <div className="invalid-feedback">Please fill out this field.</div>         
                                                          
                                  </div>

                                  <div className="form-group ">
                                    <hr />
                                    <label className="form-label cust_form_label"> Attendees </label>
                                    <Controller
                                          name="attendees"
                                          control={control}
                                          render={({ field }) => 
                                          <textarea {...field} type="textarea" rows="5"
                                            className="form-control " 
                                            
                                          //value={editModalData.attendees || ''}
                                          //onChange={(e) => setEditModalData({...editModalData, attendees: e.target.value})} 
                                          placeholder="Edit Debriefing Notes..." 
                                          name="attendees" required></textarea>
                                        
                                        }
                                        />   
                                    <div className="invalid-feedback">Please fill out this field.</div>         
                                                          
                                  </div>
    
                                 
    
                                  <div className="form-group">  
                                  <hr />                          
                                  <button className="stepsBtn btn-sm btn btn-primary" type="submit"> 
                                      { loadingSubmit ? (
                                                            <>
                                                            Submitting...
                                                            <span
                                                              className="spinner-border spinner-border-sm ms-2"
                                                              role="status"
                                                              aria-hidden="true"
                                                            ></span>
                                                          </>
                                                      ) : 'Submit' }
                                    </button>  
    
                                          
                                </div>  
    
                              </form>
    
                            </Modal.Body>
    
                        </Modal>
    
                        
    
    
                        {/* Modal - Add New Meeting */}
                        <Modal
                          show={newLeadModal}
                          handle={closeLeadModal}
                          backdrop="static"
                          size="xl"
                          aria-labelledby="contained-modal-edit-vcenter"
                          centered
                          keyboard={false}
                          dialogClassName="custom-modal-width" >
                            <ModalHeader>
                              <button className="btn btn-primary" onClick={closeLeadModal}> Close </button>
                              <Modal.Title>  Add New Meeting </Modal.Title>
                            
                            </ModalHeader>
                            <ModalBody>
                              <form onSubmit={handleSubmit(newLead)}>
                                <div className='row'>

                                  <div className='col-4 col-lg-4'> 
                                    <div className="form-group">                        
                                          <label className="form-label"> Meeting Name</label>     
                                          <Controller
                                              name="meetingName"
                                              control={control}
                                              render={({ field }) => <input {...field} type="text" className="form-control" placeholder="Meeting Name" required />}
                                          />                                        
                                    </div>
                                  </div>

                                  <div className='col-4 col-lg-4'> 
                                    <div className="form-group">                        
                                          <label className="form-label"> Meeting Type </label>     
                                          <Controller
                                                name="MeetingType"
                                                control={control}
                                                render={({ field }) => 
                                                <select  value={sourceLead} 
                                                    onChange={(e) => setSourceLead(e.target.value)}                                 
                                                    className="form-select" required > 
                                                  <option value=""> Choose the Meeting Type </option> 
                                                  <option value="1"> Mancom </option>                                                
                                                  <option value="2"> Fincom </option> 
                                                 <option value="3"> Excom </option>                                
                                                </select> 
                                              } />                                      
                                    </div>
                                  </div>

                                  <div className='col-4 col-lg-4'> 
                                    <div className="form-group">                        
                                          <label className="form-label"> Meeting Agenda </label>     
                                          <Controller
                                              name="meetingAgenda"
                                              control={control}
                                              render={({ field }) => <input {...field} type="text" className="form-control" placeholder="Meeting Agenda" required />}
                                          />                                        
                                    </div>
                                  </div>
                                </div>
                               

                              

                                <div className='row'>
                                      <div className="form-group ">
                                    <hr />
                                    <label className="form-label cust_form_label"> Attendees </label>
                                    <Controller
                                          name="attendees"
                                          control={control}
                                          render={({ field }) => 
                                          <textarea {...field} type="textarea" rows="5" className="form-control"  placeholder="List All the Attendees..." name="attendees" required>
                                          </textarea>                                        
                                        }
                                        />   
                                    <div className="invalid-feedback">Please fill out this field.</div>         
                                                          
                                  </div>
                                </div>

                                <div className='row'>
                                  <div className="form-group">  
                                  <hr />                          
                                  <button className="stepsBtn btn-sm btn btn-primary" type="submit"> 
                                      { loadingSubmit ? (
                                                            <>
                                                            Submitting...
                                                            <span
                                                              className="spinner-border spinner-border-sm ms-2"
                                                              role="status"
                                                              aria-hidden="true"
                                                            ></span>
                                                          </>
                                                      ) : 'Submit' }
                                    </button>  
                                  </div>  
                                </div>
                              </form>    
                            </ModalBody>
                        

                        </Modal>
    
                </div>
            
            </Box>
            
         )

}

export default Mancom;