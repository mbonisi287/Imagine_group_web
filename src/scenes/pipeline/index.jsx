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

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const Pipeline = () => {

    const [allTenders, setAllTenders] = useState([]);
    const [ pipelines, setPipelines] = useState([]);

    const [ filteredPipelines, setFilteredPipelines ] = useState([]);

    const [ convertedPipelines, setConvertedPipelines ] = useState([]);

    const [ selectedStatus, setSelectedValue]  = useState('');

    const [ searchDiv, setSearchDiv] = useState(false);
    const [ showNoRecordsModal, setShowNoRecordsModal] = useState(false);
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
        const fetchPipelines = () => {
          axios.get(API_URL + "allPipelines", {  
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          })
            .then((response) => {
              setPipelines(response.data);
              //console.log("Fetched Vouchers:", response.data);
            })
            .catch((error) => {
              console.error("API error:", error);
            });
        };
    
        // Call immediately on mount
        fetchPipelines();
    
        // Set interval to run every 60 seconds
        const intervalId = setInterval(fetchPipelines, 60000);
    
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
      status: selectedStatus
    };
  
    try
    {
      const response = await axios.put(API_URL + "updatePipeline?pipelineID=" + projectUpdated.pipelineID, projectUpdated, {
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

  const convertProject= async(modalDataProject) => {
    modalDataProject.convStatus = 1;
    //modalDataProject.checkList = 1;

    //Include username and the Department

    try
    {
      const response = await axios.put(API_URL + "updatePipeline?pipelineID=" + modalDataProject.pipelineID, modalDataProject, {
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

  const handleStatusChange = (event) => {
    setSelectedValue(event.target.value);
  }

  {/* Pipelines In Progress */}
  useEffect(() => {
    const newPipelines = [];

    pipelines.forEach(tender => {
        if(tender.convStatus == '1')
            newPipelines.push(tender); 
    });

    setFilteredPipelines(newPipelines);

  }, [pipelines]);

  {/* Converted Pipelines  */}
  useEffect(() => {
    const newPipelines = [];

    pipelines.forEach(tender => {
        if(tender.convStatus == '1')
            newPipelines.push(tender); 
    });

    setConvertedPipelines(newPipelines);


  }, [pipelines]);

     return(
    
            <Box m="20px">
                <Header title="Pipelines" subtitle="Managing Pipelines" /> 
    
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
                                <th> Lead Source </th>
                                <th> Full Opportunity Description </th>
                                <th> Est. Contract Value </th>
                                <th> Est. Start Date </th>
                                <th> State Of Readiness </th>
                                <th> Key Stakeholders </th>
                                
                                <th> Risk Rating </th>
                                <th> Probability of Award </th>
                                <th> Documents Attached </th>
                                <th> Action </th>
                                
                              
                            </tr> 
                        </thead> 
                        <tbody className="table-group-divider table-divider-color">
                            {
                                filteredPipelines.map((projects, index) => {
                                    return <tr key={index}>
                                        <td>{projects.leadSource}</td>
                                        <td>{projects.fullOppDescription}</td>
                                        <td>R {projects.contractValue}</td>      
                                        <td>{projects.estStartDate}</td>
                                        <td>{projects.sor == 1 ? 
                                            'Initial Information Collected' : 
                                            projects.sor == 2 ? 'Site Visit Held' : 'Technical Documents Prepared' }</td>  
                                        <td>{projects.stakeholders}</td>  
                                        <td>{projects.riskRating} %</td> 
                                        <td>{projects.probAward} %</td> 
                                        <td>{projects.documentsAttached == 1 ? <button className='btn btn-primary'> View Documents </button> : 'No Documents'}</td>
                                         <td> <button className='btn btn-info' onClick={() => ProjectDetails(projects)}> View More Details</button> </td> 
                                        {/*<td>{projects.department == 1 ? 'Imagine Eco Build Solutions' :
                                            projects.department == 2 ? 'Imagine Real Estate' : 'Qwabe Mahlase Construction'}
                                        </td>
                                        <td>
                                          { projects.projectType == 1 ? 
                                           <span className='statusProgress'> Lead  </span> :
                                           projects.projectType == 2 ? <span className='statusReview'> Prospect </span> :
                                           projects.projectType == 3 ? <span className='statusReview'> Pipeline </span> :
                                           <span className='statusReview'> Project/State Of Readiness </span> 
                                          }
                                        </td>  
                                        <td>     {new Date(projects.dateCreated).toLocaleString('en-GB', {                                                                               day: '2-digit',
                                                                                      month: '2-digit', year: 'numeric', hour: '2-digit',  minute: '2-digit',
                                                                                      second: '2-digit',                                       hour12: true
                                                                                    })}</td>
                                        <td> <button className='btn btn-info' onClick={() => ProjectDetails(projects)}> View More Details</button> </td>     
                                        <td> <button className='btn btn-warning' onClick={() => SingleFeedback(projects)}> View Feedback </button> </td>   
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

                    <div className='row'>
                      <h3> Converted Pipelines </h3>
                      <table className="table table-striped table-hover table-bordered">
                        <thead className="thead-dark">
                            <tr>                       
                                <th> Lead Source </th>
                                <th> Full Opportunity Description </th>
                                <th> Est. Contract Value </th>
                                <th> Est. Start Date </th>
                                <th> State Of Readiness </th>
                                <th> Key Stakeholders </th>
                                
                                <th> Risk Rating </th>
                                <th> Probability of Award </th>
                                <th> Documents Attached </th>
                                <th> Action </th>
                                
                              
                            </tr> 
                        </thead> 
                        <tbody className="table-group-divider table-divider-color">
                            {
                                convertedPipelines.map((projects, index) => {
                                    return <tr key={index}>
                                        <td>{projects.leadSource}</td>
                                        <td>{projects.fullOppDescription}</td>
                                        <td>R {projects.contractValue}</td>      
                                        <td>{projects.estStartDate}</td>
                                        <td>{projects.sor == 1 ? 
                                            'Initial Information Collected' : 
                                            projects.sor == 2 ? 'Site Visit Held' : 'Technical Documents Prepared' }</td>  
                                        <td>{projects.stakeholders}</td>  
                                        <td>{projects.riskRating} %</td> 
                                        <td>{projects.probAward} %</td> 
                                        <td>{projects.documentsAttached == 1 ? <button className='btn btn-primary'> View Documents </button> : 'No documents'}</td>
                                         <td> <button className='btn btn-info' onClick={() => ProjectDetails(projects)}> View More Details</button> </td> 
                                        {/*<td>{projects.department == 1 ? 'Imagine Eco Build Solutions' :
                                            projects.department == 2 ? 'Imagine Real Estate' : 'Qwabe Mahlase Construction'}
                                        </td>
                                        <td>
                                          { projects.projectType == 1 ? 
                                           <span className='statusProgress'> Lead  </span> :
                                           projects.projectType == 2 ? <span className='statusReview'> Prospect </span> :
                                           projects.projectType == 3 ? <span className='statusReview'> Pipeline </span> :
                                           <span className='statusReview'> Project/State Of Readiness </span> 
                                          }
                                        </td>  
                                        <td>     {new Date(projects.dateCreated).toLocaleString('en-GB', {                                                                               day: '2-digit',
                                                                                      month: '2-digit', year: 'numeric', hour: '2-digit',  minute: '2-digit',
                                                                                      second: '2-digit',                                       hour12: true
                                                                                    })}</td>
                                        <td> <button className='btn btn-info' onClick={() => ProjectDetails(projects)}> View More Details</button> </td>     
                                        <td> <button className='btn btn-warning' onClick={() => SingleFeedback(projects)}> View Feedback </button> </td>   
                                        <td> <button className='btn btn-danger' onClick={() => setShowFeedbackModal(true)}> Download RFQ </button> </td> */}                                     
                                    </tr>
                                })
                            }
                        </tbody>  
                      </table> 
                    </div>
    
                    {/*
                    <div className=''>
                      {
                        filteredTenders.map((projects, index) => {
                          return <div key={index} className='row projRow'>
                                  <div className='col-5 '>
                                      <span className='projSpan'> <span className="projInnerSp"> {projects.clientName}  - {projects.tenderNumber} </span></span>
                                    <span className='projSpan'> Bidding Entity - <span className="projInnerSp"> 
                                        {projects.department == 1 ? 'Imagine Eco Build Solutions' :
                                            projects.department == 2 ? 'Imagine Real Estate' : 'Qwabe Mahlase Construction'}  </span> </span>
                                  
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
                                    <span className='projSpan'> Status </span>
                                     { projects.status == 0 ? 
                                           <span className='statusProgress'> In Progress </span> :
                                            <span className='statusReview'> In Review  </span>
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
                      
                    </div> */}
                    

    
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
                          <Modal.Title> Pipeline Summary for : { modalDataProject.pipelineName }</Modal.Title>
                          <buttton className="btn btn-info" onClick={() => EditTenderModal(modalDataProject)}> Quick Edit for Project</buttton>

                        </ModalHeader>
                        <Modal.Body>
                          <div className='row'>
                                <div className='col-8'>
                                <table  className='table singleProsTable'>
                                  <thead>
                                    <tr>
                                      <th> Pipeline Name </th>
                                      <th> {modalDataProject.pipelineName}</th>
                                    </tr>
                                    
                                  </thead>
                                  <tbody>
                                    <tr>
                                        <td> Full Opportunity Description </td><td> {modalDataProject.fullOppDescription}</td>
                                    </tr>
                                    <tr>
                                        <td> Contract Value </td><td> {modalDataProject.contractValue}</td>
                                    </tr>
                                    <tr>
                                        <td> Est. Start Date </td><td> {modalDataProject.estStartDate}</td>
                                    </tr>
                                    <tr>
                                        <td> Stakeholders  </td><td> {modalDataProject.stakeholders}</td>
                                    </tr>
                                    <tr>
                                        <td> S.O.R </td><td> {modalDataProject.sor}</td>
                                    </tr>
                                    <tr>
                                        <td> Risk Rating </td><td> {modalDataProject.riskRating}</td>
                                    </tr>
                                    <tr>
                                        <td> Probability of Award </td><td> {modalDataProject.probAward}</td>
                                    </tr>
                                      <tr>
                                        <td> Date Conversion To Pipeline </td>
                                        <td> <CalendarMonthIcon /> {new Date(modalDataProject.dateCreated).toLocaleString('en-GB', {
                                                                                                                                  day: '2-digit',
                                                                                                                                  month: '2-digit',
                                                                                                                                  year: 'numeric',
                                                                                                                                  hour: '2-digit',
                                                                                                                                  minute: '2-digit',
                                                                                                                                  second: '2-digit',
                                                                                                                                  hour12: true
                                                                                                                                })}</td>
                                    </tr>

                                  </tbody>
                                </table>

                                </div>
                                <div className='col-4 progressArea'>

                                </div>

                          </div>
                        
                          
                        
                  
                          <p className='invisible'> Project Id : {modalDataProject.id } </p>


                        </Modal.Body>
                        <Modal.Footer>
                          {
                            modalDataProject.riskRating != 0 ? 
                            (<button className="btn btn-success" onClick={() => convertProject(modalDataProject) }> 
                                Click Here To Convert to Project {modalDataProject.clientName} </button> ) 
                                :
                                (<span className='notesDangerSpan'> NB: Complete All The Steps To Convert To Project   </span>  )
                          }                                                                                                                                 

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
                          <Modal.Title> Edit Project Details for  - Project Name: { editModalData.pipelineName }</Modal.Title>
                          

                        </ModalHeader>
                        <Modal.Body>

                          <form onSubmit={handleSubmit(onSubmit2)}>
                            <div className='row'>
                              <div className='col-4 col-lg-4'> 
                                  <div className="form-group ">
                                    <hr />
                                    <label className="form-label cust_form_label"> Probability of Award - %  </label>
                                    <Controller
                                            name="probAward"
                                            control={control}
                                            render={({ field }) => 
                                            <input {...field} type="numbers" className="form-control" 
                                            value={editModalData.probAward || '' } 
                                            onChange={(e) => setEditModaData({...editModalData, probAward: e.target.value})} 
                                            placeholder="Please enter the Probability of Award..." 
                                            name="probAward" required/>
                                          
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
                                    <label className="form-label cust_form_label"> State Of Readiness </label>
                                    <select className="form-select"
                                                      name="queryStatus"
                                                      value={selectedStatus}
                                                      onChange={(e) => {
                                                        handleStatusChange(e);
                                                        handleBlurQueryStatus(e);


                                                      }}
                                                      
                                              >
                                                  <option value="" disabled> Choose Status </option>
                                                  <option value="1"> In Progress </option>
                                                  <option value="2"> Submit For Review </option>
                                                  <option value="3"> Final Submission  </option>   

                                                </select>  
                                    <div className="invalid-feedback">Please fill out this field.</div>
                                  </div>

                              </div>
                            </div>

                            <div className='row'>
                                  <div className='col-4 col-lg-4'> 
                                  <div className="form-group ">
                                    <hr />
                                    <label className="form-label cust_form_label"> Risk Rating - % </label>
                                    <Controller
                                            name="riskRating"
                                            control={control}
                                            render={({ field }) => 
                                            <input {...field} type="numbers" className="form-control" 
                                            value={editModalData.riskRating || '' } 
                                            onChange={(e) => setEditModaData({...editModalData, riskRating: e.target.value})} 
                                            placeholder="Please enter the Risk Rating..." 
                                            name="riskRating" required/>
                                          
                                          }
                                            />   
                                    <div className="invalid-feedback">Please fill out this field.</div>
                                  </div>
                              </div>
                            </div>




                              <div className="form-group ">
                                <hr />
                                <label className="form-label cust_form_label">Full Opportunity Summary </label>
                                <Controller
                                      name="fullOppDescription"
                                      control={control}
                                      render={({ field }) => 
                                      <textarea {...field} type="textarea" rows="5"
                                        className="form-control " 
                                        
                                      value={editModalData.fullOppDescription || ''}
                                      onChange={(e) => setEditModaData({...editModalData, fullOppDescription: e.target.value})} 
                                      placeholder="Edit Debriefing Notes..." 
                                      name="debriefingNotes" required></textarea>
                                    
                                    }
                                    />   
                                <div className="invalid-feedback">Please fill out this field.</div>         
                                                      
                              </div>

                              <div className='row'>
                                <div className='col-6 col-lg-6'>

                                    

                                </div>
                                <div className='col-6 col-lg-6'>

                                  
                                    
                                </div>
                              </div>

                              <div className="form-group ">
                                <hr />
                                <label className="form-label cust_form_label"> Stakeholders </label>
                                <Controller
                                      name="stakeholders"
                                      control={control}
                                      render={({ field }) => 
                                      <textarea {...field} type="textarea" rows="3"
                                        className="form-control " 
                                        
                                      value={editModalData.stakeholders || ''}
                                      onChange={(e) => setEditModaData({...editModalData, stakeholders: e.target.value})} 
                                      placeholder="Edit Stakeholders..." 
                                      name="stakeholders" required></textarea>
                                    
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

export default Pipeline;