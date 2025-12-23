import { useState, useRef , useEffect} from 'react'
//import reactLogo from '../assets/react.svg'
//import logoImg from '../Images/flymango-logo.png';
//import viteLogo from '../vite.svg'
//import './App.css'
//import './customerInfo.css'

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

//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";

/*import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Cookies from 'js-cookie';
*/

const TenderProjects = () => {

    const [allTenders, setAllTenders] = useState([]);
    const [ tenders, setTenders] = useState([]);

    const [ selectedStatus, setSelectedValue]  = useState('');

    const [ searchDiv, setSearchDiv] = useState(false);
    const [showNoRecordsModal, setShowNoRecordsModal] = useState(false);
    const [ successMessage, successMessageVisible ] = useState(false);
    const [ loadingSubmit, setLoadingSubmit] = useState(false);

    //Validation Logic
    
   //PNR Validation
    const [bookingNo, setBookingNo ] = useState('');
    const [bookingNoError, setBookingNoError] = useState('');
  
    const [ voucherNo, setVoucherNo ] = useState('');
    const [ errorVoucherNo, setErrorVoucherNo] = useState('');
    const [userId, setUserId] = useState('');
    const [ vouchersDiv, setVouchersDiv ] = useState([]);

          
    const [vouchers, setVouchers] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Email');
    const [sortOrder, setSortOrder] = useState('asc');
    const [totalPages, setTotalPages] = useState(0);

    const [ showProjectModal, setProjectModal] = useState(false);
    const [ editModal, setEditModal ] = useState(false);
    const [ modalDataProject, setModalDataProject ] = useState([]); 
    const [ editModalData, setEditModaData] = useState([]);

    const [ showFeedbackModal, setShowFeedbackModal ] = useState(false);
    const [ modalFeedbackData, setModalFeedbackData ] = useState([]);
    const [ modalFeedback, setModalFeedback ] = useState([]);

    const closeProjectModal = () => setProjectModal(false);

    const closeFeedbackModal = () => setShowFeedbackModal(false);

    const closeEditModal = () => setEditModal(false);

     



        useEffect(() => {
        // Function to fetch vouchers
        const fetchTenders = () => {
          axios.get(API_URL + "AllTenderProjects", {  
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          })
            .then((response) => {
              setTenders(response.data);
              //console.log("Fetched Vouchers:", response.data);
            })
            .catch((error) => {
              console.error("API error:", error);
            });
        };
    
        // Call immediately on mount
        fetchTenders();
    
        // Set interval to run every 60 seconds
        const intervalId = setInterval(fetchTenders, 60000);
    
        // Cleanup on unmount
        return () => clearInterval(intervalId);
      }, []); // Empty dependency array: only runs once


   

    const ProjectDetails = ( projects) => {
      setProjectModal(true);
      setModalDataProject(projects);
    }

    const feedbackUrl = "FindFeedback?tenderProjectId=";
    const SingleFeedback = ( projects ) => {

      setShowFeedbackModal(true);
      setModalFeedbackData(projects);

      axios.get(API_URL + feedbackUrl + modalFeedbackData.id  , {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                    })
                .then(response =>  setModalFeedback(response.data)) // Assume data is an array of { id, name }
                .catch(error => console.error('Error fetching data:', error)); 

    }

    const EditTenderModal = (modalDataProject) => {
      setEditModaData(modalDataProject);
      setEditModal(true);

    }

    const { control, handleSubmit, watch } = useForm({
          defaultValues: {  email: "",   voucherNo: "", pnrNo:"" },
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
        status: Number(selectedStatus)
      };
    
      try
      {
        const response = await axios.put(API_URL + "UpdateProject?id=" + projectUpdated.id, projectUpdated, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

      
        // Clear the URL (removes query params, hash, etc.)
        window.history.pushState({}, document.title, window.location.pathname);

          if(response.status === 200)
          {
            alert("Successfully updated Project Details");
            setEditModal(false);
                // Then reload the page
            window.location.reload();
            //setShowAssignModal(false); 
            //openedQuery();

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

  const handleStatusChange = (event) => {
    setSelectedValue(event.target.value);
  }


    return(

        <Box m="20px">
            <Header title="Tender Projects" subtitle="Managing All Tender Projects" /> 

                 <div className="searchDiv">
                    <button className="btn btn-primary btnSearch"
                    onClick={() => setSearchDiv(true)}> Search </button>
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
                            <th>Client Name</th>
                            <th>Tender Number</th>
                            <th>Tender Description </th>
                            <th>Contract Value </th>
                            <th> Bidding Entity </th>
                            <th> Status </th>
                            <th>Date Created</th>
                            <th>Action </th>
                            {/*<th> Feedback </th>*/}
                            <th></th>
                          
                        </tr> 
                    </thead> 
                    <tbody className="table-group-divider table-divider-color">
                        {
                            tenders.map((projects, index) => {
                                return <tr key={index}>
                                    <td>{projects.clientName}</td>
                                    <td>{projects.tenderNumber}</td>
                                    <td>{projects.tenderDescription}</td>      
                                    <td>{projects.contractValue}</td> 
                                    <td> { projects.department == 1 ? 'Imagine Eco Build Solutions' :
                                            projects.department == 2 ? 'Imagine Real Estate' : 'Qwabe Mahlase Construction' }</td>
                                    <td>
                                      { projects.status == 1 ? 
                                           <span className='statusProgress'> In Progess </span> :
                                           projects.status == 2 ? <span className='statusReview'> In Review </span> :
                                           projects.status == 3 ? <span className='statusReview'> Awaiting Feedback </span> :
                                           <span className='statusReview'> Ready For Submission </span> 
                                      }
                                    </td>  
                                    <td>     {new Date(projects.dateCreated).toLocaleString('en-GB', {                                                                               day: '2-digit',
                                                                                  month: '2-digit', year: 'numeric', hour: '2-digit',  minute: '2-digit',
                                                                                  second: '2-digit',                                       hour12: true
                                                                                })}</td>
                                    <td> <button className='btn btn-info' onClick={() => ProjectDetails(projects)}> View More Details</button> </td>     
                                    {/*<td> <button className='btn btn-warning' onClick={() => SingleFeedback(projects)}> View Feedback </button> </td>   */}
                                    <td> <button className='btn btn-danger' onClick={() => setShowFeedbackModal(true)}> Download RFQ </button> </td>                                      
                                </tr>
                            })
                        }
                    </tbody>  
                </table> 

                <div className=''>
                  {
                    tenders.map((projects, index) => {
                      return <div key={index} className='row projRow'>
                              <div className='col-5 '>
                                  <span className='projSpan'> <span className="projInnerSp"> {projects.clientName}  - {projects.tenderNumber} </span></span>
                                <span className='projSpan'> Bidding Entity - <span className="projInnerSp"> QMC </span> </span>
                              
                                <span className='projSpan'> Description - <span className="projInnerSp"> {projects.tenderDescription}  </span> </span>
                                <span className='projSpan'>  Contract Value - <span className="projInnerSp"> R {projects.contractValue} </span></span>
                                <span className='projSpan'>  Assigned To - <span className="projInnerSp"> {projects.contractValue}</span>  </span>


                              </div>

                              <div className='col-3'>
                                  <span className='projSpan'>  Date Created - <span className="projInnerSp"> {new Date(projects.dateCreated).toLocaleString('en-GB', {                                                                               day: '2-digit',
                                                    month: '2-digit', year: 'numeric', hour: '2-digit',  minute: '2-digit',
                                                    second: '2-digit',                                       hour12: true
                                                  })} </span>
                                  </span>
                                                  <br />

                                <span className='projSpan closeDate'> Submission Closing Date - <span className="projInnerSp">{new Date(projects.dateCreated).toLocaleString('en-GB', {                                                                               day: '2-digit',
                                                    month: '2-digit', year: 'numeric', hour: '2-digit',  minute: '2-digit',
                                                    second: '2-digit',                                       hour12: true
                                                  })} </span>
                                </span>
                              </div>

                              <div className='col-2'>
                                <span className='projSpan'> Project Type </span>
                                 { projects.status == 1 ? 
                                           <span className='statusProgress'> In Progress </span> :
                                           projects.projectType == 2 ? <span className='statusReview'> Prospect </span> :
                                           projects.projectType == 3 ? <span className='statusReview'> Pipeline </span> :
                                           <span className='statusReview'> Project/S - O - R  </span>
                                      }
                              </div>

                              <div className='col-2'>
                                <button className='btn btn-info' onClick={() => ProjectDetails(projects)}> View More Details</button>
                              </div>
                              <span> </span>
                              <span> </span>
                              <span> </span>
                      </div>
                    })
                  }
                  
                </div>
                
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
                      aria-labelledby="contained-modal-edit-vcenter"
                      centered
                      keyboard={false}
                      dialogClassName="custom-modal-width-show">
                        <ModalHeader>
                          <button className="btn btn-primary" onClick={closeProjectModal}> Close </button>
                          <Modal.Title> Project Summary for : { modalDataProject.clientName }</Modal.Title>
                          <buttton className="btn btn-info" onClick={() => EditTenderModal(modalDataProject)}> Quick Edit for Project</buttton>

                        </ModalHeader>
                        <Modal.Body>
                          <div className='row'>
                            <div className='col-8'>
                              <table className='table'>
                            
                                <thead className='table-light'>
                                  <tr>
                                    <th> Client Name </th>
                                    <th> {modalDataProject.clientName }</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td> Date Created </td><td>  {new Date(modalDataProject.dateCreated).toLocaleString('en-GB', {
                                                                                  day: '2-digit',
                                                                                  month: '2-digit',
                                                                                  year: 'numeric',
                                                                                  hour: '2-digit',
                                                                                  minute: '2-digit',
                                                                                  second: '2-digit',
                                                                                  hour12: true
                                                                                })} </td>
                                  </tr>
                                  <tr>
                                    <td> Tender Number </td><td> {modalDataProject.tenderNumber } </td>
                                  </tr>
                                  <tr>
                                    <td> Tender Description </td><td> {modalDataProject.tenderDescription } </td>
                                  </tr>
                                  <tr>
                                    <td> Debriefing Notes </td><td> {modalDataProject.debriefingNotes } </td>
                                  </tr>
                                  <tr>
                                    <td> Contact Value </td><td> R {modalDataProject.contractValue } </td>
                                  </tr>
                                  <tr>
                                    <td> Status </td><td> {modalDataProject.status  == 0 ? 
                                       <span className='statusProgress'> In Progress </span> :
                                        <span className='statusReview'> In Review  </span> } </td>
                                  </tr>
                                  <tr>
                                    <td> Date of Submission </td><td> {modalDataProject.tenderClosingDate == '0001-01-01' ? 'Date Not Supplied' : modalDataProject.tenderClosingDate }  </td>
                                  </tr>
                                  <tr>
                                    <td> Briefing Attendance </td><td>  {modalDataProject.attendedStatus } </td>
                                  </tr>
                                  <tr>
                                    <td> Rank Outcome </td><td> {modalDataProject.rankOutcome } </td>
                                  </tr>
                                  <tr>
                                    <td> Reasons For Not Submitting  </td><td> {modalDataProject.reasonSubmission }</td>
                                  </tr>
                                  <tr>
                                    <td> Contact Details </td><td> {modalDataProject.contactDetails } </td>
                                  </tr>
                                  <tr>
                                    <td> Feedback Status </td><td> {modalDataProject.feedbackCheck == 0 ? <span className='noSpan'> No feedback available </span> : modalDataProject.feedbackCheck } </td>
                                  </tr>
                                  <tr className='invisible'>
                                    <td>  Project Id </td><td> {modalDataProject.id } </td>
                                  </tr>

                                </tbody>
                              </table>
                            </div>
                            <div className='col-4 progressCol'>

                            </div>
                          </div>
               
                        </Modal.Body>
                        <Modal.Footer>
                          <Link to={`/tenderFeedback/${modalDataProject.id}`}> <button className="btn btn-success" > Write Feedback on Client Name: {modalDataProject.clientName} </button> </Link>
                          <Link to={`/singleProject/${modalDataProject.id}`}> <button className="btn btn-success" > Click To Full View: {modalDataProject.clientName} </button> </Link>

                          <button className="btn btn-primary" onClick={closeProjectModal}> Close </button>
                          

                        </Modal.Footer>
                    </Modal>

                    {/* Modal To Edit The Tender Content */}
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
                          <Modal.Title> Edit Project Details for  - Project Name: { editModalData.clientName }</Modal.Title>
                          

                        </ModalHeader>
                        <Modal.Body>

                          <form onSubmit={handleSubmit(onSubmit2)}>
                            <div className='row'>
                              <div className='col-4 col-lg-4'>
                               
                                 <div className="form-group ">
                                    <hr />
                                    <label className="form-label cust_form_label"> Tender Description </label>
                                    <Controller
                                            name="tenderDescription"
                                            control={control}
                                            render={({ field }) => 
                                            <input {...field} type="text" className="form-control" 
                                            value={editModalData.tenderDescription || '' } 
                                            onChange={(e) => setEditModaData({...editModalData, tenderDescription: e.target.value})} 
                                            placeholder="Please enter the Tender Description...." 
                                            name="tenderDescription" required/>
                                          
                                          }
                                            />   
                                    <div className="invalid-feedback">Please fill out this field.</div>
                                  </div>
                              </div>
                              <div className='col-4 col-lg-4'> 

                                  <div className="form-group ">
                                    <hr />
                                    <label className="form-label cust_form_label"> Contract Value</label>
                                    <Controller
                                            name="contractValue"
                                            control={control}
                                            render={({ field }) => 
                                            <input {...field} type="numbers" className="form-control" 
                                            value={editModalData.contractValue || '' } 
                                            onChange={(e) => setEditModaData({...editModalData, contractValue: e.target.value})} 
                                            placeholder="Please enter the Contract Value...." 
                                            name="contractValue" required/>
                                          
                                          }
                                            />   
                                    <div className="invalid-feedback">Please fill out this field.</div>
                                  </div>

                              </div>


                                <div className='col-4 col-lg-4'> 

                                  <div className="form-group ">
                                    <hr />
                                    <label className="form-label cust_form_label"> Project Status </label>
                                    <select className="form-select"
                                                      name="queryStatus"
                                                      value={selectedStatus}
                                                      onChange={(e) => {
                                                        handleStatusChange(e);
                                                        handleBlurQueryStatus(e);


                                                      }}
                                                      
                                              >
                                                  <option value="" disabled> Choose Query Status </option>
                                                  <option value="1"> In Progress </option>
                                                  <option value="2"> Submit For Review </option>
                                                  <option value="3"> Final Submission  </option>   

                                                </select>  
                                    <div className="invalid-feedback">Please fill out this field.</div>
                                  </div>

                              </div>
                            </div>




                              <div className="form-group ">
                                <hr />
                                <label className="form-label cust_form_label"> Debreifing Notes </label>
                                <Controller
                                      name="debriefingNotes"
                                      control={control}
                                      render={({ field }) => 
                                      <textarea {...field} type="textarea" rows="5"
                                        className="form-control " 
                                        
                                      value={editModalData.debriefingNotes || ''}
                                      onChange={(e) => setEditModaData({...editModalData, debriefingNotes: e.target.value})} 
                                      placeholder="Edit Debriefing Notes..." 
                                      name="debriefingNotes" required></textarea>
                                    
                                    }
                                    />   
                                <div className="invalid-feedback">Please fill out this field.</div>         
                                                      
                              </div>

                              <div className='row'>
                                <div className='col-6 col-lg-6'>

                                    <div className="form-group ">
                                      <hr />
                                      <label className="form-label cust_form_label"> Attended Status</label>
                                      <Controller
                                            name="attendedStatus"
                                            control={control}
                                            render={({ field }) => 
                                            <input {...field} type="text" className="form-control" 
                                            value={editModalData.attendedStatus || '' } 
                                            onChange={(e) => setEditModaData({...editModalData, attendedStatus: e.target.value})} 
                                            placeholder="Please enter the Attendance Status...." 
                                            name="attendedStatus" required/>
                                          
                                          }
                                            />   
                                      <div className="invalid-feedback">Please fill out this field.</div>
                                    </div>

                                </div>
                                <div className='col-6 col-lg-6'>

                                  <div className="form-group ">
                                      <hr />
                                      <label className="form-label cust_form_label"> Rank Outcome</label>
                                      <Controller
                                            name="rankOutcome"
                                            control={control}
                                            render={({ field }) => 
                                            <input {...field} type="text" className="form-control" 
                                            value={editModalData.rankOutcome || '' } 
                                            onChange={(e) => setEditModaData({...editModalData, rankOutcome: e.target.value})} 
                                            placeholder="Please enter the Rank Outcome...." 
                                            name="rankOutcome" required/>
                                          
                                          }
                                            />   
                                      <div className="invalid-feedback">Please fill out this field.</div>
                                    </div>
                                   
                                </div>
                              </div>

                              <div className="form-group ">
                                <hr />
                                <label className="form-label cust_form_label"> Contact Details </label>
                                <Controller
                                      name="contactDetails"
                                      control={control}
                                      render={({ field }) => 
                                      <textarea {...field} type="textarea" rows="3"
                                        className="form-control " 
                                        
                                      value={editModalData.contactDetails || ''}
                                      onChange={(e) => setEditModaData({...editModalData, contactDetails: e.target.value})} 
                                      placeholder="Edit Debriefing Notes..." 
                                      name="contactDetails" required></textarea>
                                    
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

                    


                    {/* Modal For Feedback Per Project*/}
                      <Modal
                          show={showFeedbackModal}
                          handle={closeFeedbackModal}
                          backdrop="static"
                          size="lg"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                          keyboard={false}>
                          <ModalHeader>
                            <button className="btn btn-primary" onClick={closeFeedbackModal}> Close </button>
                            <Modal.Title> Feedback For Project Name: { modalFeedbackData.clientName }</Modal.Title>

                          </ModalHeader>
                          <Modal.Body>

                            <div className=''>
                            <hr />
                            {
                                    modalFeedback.map((feedbacks, index) => {
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

                          </Modal.Body>
                          <Modal.Footer>
                            <button className="btn btn-primary" onClick={closeFeedbackModal}> Close </button>
                          </Modal.Footer>
                      </Modal>

            </div>
        
        </Box>
        
     )

}

export default TenderProjects;