import { useState, useRef , useEffect, useCallback} from 'react'
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

const Prospects = () => {

    const [allTenders, setAllTenders] = useState([]);
    const [ prospects, setProspects] = useState([]);

    const [ filteredProspects, setFilteredProspects ] = useState([]);
    const [ convertedProspects, setConvertedProspects ] = useState([]);

    const [ selectedStatus, setSelectedValue]  = useState('');

    const [ firstMeetValue , setFirstMeetValue] = useState('');
    const [ assessmentValue, setAssessmentValue ] = useState('');
    const [ intSupportValue, setIntSupportValue ] = useState('');

    const [ listSupport, setListSupport ] = useState(false);

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
    const fetchProspects = () => {
      axios.get(API_URL + "allProspects", {  
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
        .then((response) => {
          setProspects(response.data);
          //console.log("Fetched Vouchers:", response.data);
        })
        .catch((error) => {
          console.error("API error:", error);
        });
    };

    // Call immediately on mount
    fetchProspects();

    // Set interval to run every 60 seconds
    const intervalId = setInterval(fetchProspects, 60000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array: only runs once

    const fetchSingleProspect = useCallback( async (leadID) => {

      const feedbackUrl = "findProspect?prospectID=";    

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
  
   

    const ProjectDetails = async( projects) => {
      setProjectModal(true);
      setModalDataProject(projects);

      const fresh = await fetchSingleProspect(projects.prospectID);
      //alert(fresh);
    }

    const feedbackUrl = "findProspect?prospectID=";
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
      setFirstMeetValue(Number(modalDataProject.firstMeet));
      setAssessmentValue(Number(modalDataProject.assessmentNeed));
      setIntSupportValue(Number(modalDataProject.reqIntSupport));

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
        status: selectedStatus,
        firstMeet: firstMeetValue,
        reqIntSupport: intSupportValue,
        assessmentNeed: assessmentValue,
      };
    
      try
      {
        const response = await axios.put(API_URL + "updateProspect?prospectID=" + projectUpdated.prospectID, projectUpdated, {
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

  const convertProspect= async(modalDataProject) => {
    modalDataProject.convStatus = 1;
    modalDataProject.checkList = 1;

    try
    {
      const response = await axios.put(API_URL + "updateProspect?prospectID=" + modalDataProject.prospectID, modalDataProject, {
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

  const handleFirstMeetChange = (event) => {
    setFirstMeetValue(event.target.value);
  }

  const handleAssessmentChange = (event) => {
    setAssessmentValue(event.target.value);
  }

  const handleIntSupportChange = (intSupportValue) => {

    if( intSupportValue == 1){
      setListSupport(true);
      console.log("Support - Yes ");
    }else{
      setListSupport(false);
      console.log("Support - Not ");
    }
    
    //setIntSupportValue(event.target.value);
  }

  useEffect(() => {
    const newTenders = [];

    prospects.forEach(tender => {
        if(tender.convStatus == '0')
            newTenders.push(tender); 
    });

    setFilteredProspects(newTenders);
  }, [prospects]);

  {/* Converted Prospects */}
   useEffect(() => {
    const newTenders = [];

    prospects.forEach(tender => {
        if(tender.convStatus == '1')
            newTenders.push(tender); 
    });

    setConvertedProspects(newTenders);
  }, [prospects]);

     return(
    
            <Box m="20px">
                <Header title="Prospects" subtitle="Managing All Prospects" /> 
    
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
                                <th> Prospect/Lead Name </th>
                                <th> Qualification Notes </th>
                                <th> First Meeting Held</th>
                                <th> Assessment Needed  </th>
                                <th> Probabilty of Conversion - %</th>
                                <th> Action </th>
                                
                               
                            
                              
                            </tr> 
                        </thead> 
                        <tbody className="table-group-divider table-divider-color">
                            {
                                filteredProspects.map((projects, index) => {
                                    return <tr key={index}>
                                        <td>{projects.leadName}</td>
                                        <td>{projects.qualifyNotes}</td>
                                        <td>{projects.firstMeet == 1 ? 'Yes' : 'No'}</td>      
                                        <td>{projects.assessmentNeed == 1 ? 'Yes' : 'No'}</td> 
                                        <td>{projects.probConversion }</td> 
                                       {/* <td>{projects.department == 1 ? 'Imagine Eco Build Solutions' :
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
                                                                                    })}</td>*/}
                                        <td> <button className='btn btn-info' onClick={() => ProjectDetails(projects)}> View More Details</button> </td>     
                                       {/* <td> <button className='btn btn-warning' onClick={() => SingleFeedback(projects)}> View Feedback </button> </td>   
                                        <td> <button className='btn btn-danger' onClick={() => setShowFeedbackModal(true)}> Download RFQ </button> </td>   */}                                   
                                    </tr>
                                })
                            }
                        </tbody>  
                    </table> 
    
                    <div className=''>
                      {/*
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
                      */}
                      
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

                        <div>
                          <h3> Converted Prospects </h3>
                            <table className="table table-striped table-hover table-bordered">
                        <thead className="thead-dark">
                            <tr>                       
                                <th> Prospect/Lead Name </th>
                                <th> Qualification Notes </th>
                                <th> First Meeting Held</th>
                                <th> Assessment Needed  </th>
                                <th> Probabilty of Conversion - %</th>
                                <th> Action </th>                              
                            </tr> 
                        </thead> 
                        <tbody className="table-group-divider table-divider-color">
                            {
                                convertedProspects.map((projects, index) => {
                                    return <tr key={index}>
                                        <td>{projects.leadName}</td>
                                        <td>{projects.qualifyNotes}</td>
                                        <td>{projects.firstMeet == 1 ? 'Yes' : 'No'}</td>      
                                        <td>{projects.assessmentNeed == 1 ? 'Yes' : 'No'}</td> 
                                        <td>{projects.probConversion }</td> 
                                       {/* <td>{projects.department == 1 ? 'Imagine Eco Build Solutions' :
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
                                                                                    })}</td>*/}
                                        <td> <button className='btn btn-info' onClick={() => ProjectDetails(projects)}> View More Details</button> </td>     
                                       {/* <td> <button className='btn btn-warning' onClick={() => SingleFeedback(projects)}> View Feedback </button> </td>   
                                        <td> <button className='btn btn-danger' onClick={() => setShowFeedbackModal(true)}> Download RFQ </button> </td>   */}                                   
                                    </tr>
                                })
                            }
                        </tbody>  
                    </table> 
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
                              <Modal.Title> Prospect Summary for : { modalDataProject.clientName }</Modal.Title>
                              <buttton className="btn btn-info" onClick={() => EditTenderModal(modalDataProject)}> Quick Edit for Current Prospect </buttton>
    
                            </ModalHeader>
                            <Modal.Body>
                              <div className='row'>
                                <div className='col-8'>
                                  <table className='table singleProsTable'>
                                    <thead>
                                      <tr>
                                        <th> Prospect/Lead Name  </th><th> {modalDataProject.leadName} </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td> Qualification Notes</td><td> {modalDataProject.qualifyNotes == '' ? <span className='notesDangerSpan'> Notes not available </span>: modalDataProject.qualifyNotes   }</td>
                                      </tr>
                                      <tr>
                                        <td> First Meeting Held </td><td> {modalDataProject.firstMeet == 1 ? 'Yes' : <span className='notesDangerSpan'> No </span> } </td>
                                      </tr>
                                      <tr>
                                        <td> Client Needs Assessment </td><td> {modalDataProject.assessmentNeed  == 1 ? 'Yes' : <span className='notesDangerSpan'> No </span> } </td>
                                      </tr>
                                      <tr>
                                        <td> Probability of Conversion </td><td>  {modalDataProject.probConversion }  % </td>
                                      </tr>
                                      <tr>
                                        <td>  Date of Converted to Prospect :</td><td> <CalendarMonthIcon /> {new Date(modalDataProject.dateCreated).toLocaleString('en-GB', {
                                                                                                                            day: '2-digit',
                                                                                                                            month: '2-digit',
                                                                                                                            year: 'numeric',
                                                                                                                            hour: '2-digit',
                                                                                                                            minute: '2-digit',
                                                                                                                            second: '2-digit',
                                                                                                                            hour12: true
                                                                                                                          })}  </td>
                                      </tr>
                                 
                                       <tr>
                                        <td> Internal Support Required </td><td> {modalDataProject.reqIntSupport == 0 ? <span className='notesDangerSpan'> No </span> : 'Yes' }</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <div className='col-4 progressArea'>
                                   <p> Status : {modalDataProject.CheckList  == 0 ? 
                                          <span className='statusReview'> Incomplete </span> :
                                          <span className='statusProgress'> Completed </span> } 
                                            
                                  </p>
                                  <hr />


                                  <span> { modalDataProject.checkList == 0 && modalDataProject.convStatus == 0 ? 
                                    <>
                                      
                                      
                                      <p> To Convert To A Pipeline - Please Complete the following: </p>  
                                      <p> Qualification Notes </p>   
                                      <p> Client Needs Assessment </p>  
                                      <p> Probability Conversion % </p>    
                                      <hr />                               
                                    </>                                    
                                      :
                                      <>
                                        
                                        
                                        <p> All requirements have been met - Now Convert To Prospect</p>
                                      </>
                                      } 
                                  </span>


                                   <p> Date Last Modified : <CalendarMonthIcon /> {new Date(modalDataProject.dateModified).toLocaleString('en-GB', {
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
                              
                             
                              
                              <p>  </p>
                            
                              {/*<p> Briefing Attendance : {modalDataProject.attendedStatus } </p>
                              <p> Contact Details : {modalDataProject.contactDetails } </p>
                              <p> Rank Outcome : {modalDataProject.rankOutcome } </p>
                              <p> Date Created :  {new Date(modalDataProject.dateCreated).toLocaleString('en-GB', {
                                                                                      day: '2-digit',
                                                                                      month: '2-digit',
                                                                                      year: 'numeric',
                                                                                      hour: '2-digit',
                                                                                      minute: '2-digit',
                                                                                      second: '2-digit',
                                                                                      hour12: true
                                                                                    })} </p>
                              <p> Feedback Status : {modalDataProject.feedbackCheck } </p>*/}
                              <p className='invisible'> Project Id : {modalDataProject.id } </p>
    
    
                            </Modal.Body>
                            <Modal.Footer>
                              {/*<Link to={`/tenderFeedback/${modalDataProject.id}`}> <button className="btn btn-success" > Write Feedback on Client Name: {modalDataProject.clientName} </button> </Link> */}
                                { 
                                    modalDataProject.firstMeet == 1 ?  
                                (   
                                    modalDataProject.convStatus == 1 ?      ''       :
                                    
                                    <button className="btn btn-success" onClick={() => convertProspect(modalDataProject) }> 
                                        Click Here To Convert to Pipeline {modalDataProject.clientName} </button> 
                                )
                                :
                                (
                                  <span className='notesDangerSpan'> NB: Complete All The Steps To Convert To Pipeline  </span>                                
                                )
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
                              <Modal.Title> Edit Project Details for  - Project Name: { editModalData.leadName }</Modal.Title>
                              
    
                            </ModalHeader>
                            <Modal.Body>
    
                              <form onSubmit={handleSubmit(onSubmit2)}>
                                <div className='row'>
                                  <div className='col-4 col-lg-4'> 
                                     <div className="form-group ">
                                        <hr />
                                        <label className="form-label cust_form_label"> First Meeting Arranged </label>
                                        
                                            <select className="form-select"
                                                      name="firstMeet"
                                                      value={firstMeetValue}
                                                      onChange={(e) => {
                                                        handleFirstMeetChange(e);
                                                        
                                                      }} >
                                                  <option value="" disabled> Choose Yes / No </option>
                                                      <option value={1}>Yes</option>
                                                      <option value={0}>No</option>
                                          </select>  
                                        <div className="invalid-feedback">Please fill out this field.</div>
                                      </div>
                                  </div>
                                  <div className='col-4 col-lg-4'> 
    
                                      <div className="form-group ">
                                        <hr />
                                        <label className="form-label cust_form_label"> Assessment Needed </label>
                                          <select className="form-select"
                                                      name="assessmentNeed"
                                                      value={assessmentValue}
                                                      onChange={(e) => {
                                                        handleAssessmentChange(e);
                                                        
                                                      }} >
                                                  <option value="" disabled> Choose Yes / No </option>
                                                      <option value={1}>Yes</option>
                                                      <option value={0}>No</option>
                                          </select> 
                                       
                                        <div className="invalid-feedback">Please fill out this field.</div>
                                      </div>
    
                                  </div>
    
    
                                    <div className='col-4 col-lg-4'> 
    
                                      <div className="form-group ">
                                        <hr />
                                        <label className="form-label cust_form_label"> Probability of Conversion </label>
                                         <Controller
                                                name="probConversion"
                                                control={control}
                                                render={({ field }) => 
                                                <input {...field} type="numbers" className="form-control" 
                                                value={editModalData.probConversion || '' } 
                                                onChange={(e) => setEditModaData({...editModalData, probConversion: e.target.value})} 
                                                placeholder="Please enter the Probability of Conversion...." 
                                                name="probConversion" required/>
                                              
                                              }
                                              /> 
                                        <div className="invalid-feedback">Please fill out this field.</div>
                                      </div>
    
                                  </div>
                                </div>
    
    
    
    
                                  <div className="form-group ">
                                    <hr />
                                    <label className="form-label cust_form_label"> Qualifying Notes </label>
                                    <Controller
                                          name="qualifyNotes"
                                          control={control}
                                          render={({ field }) => 
                                          <textarea {...field} type="textarea" rows="5"
                                            className="form-control " 
                                            
                                          value={editModalData.qualifyNotes || ''}
                                          onChange={(e) => setEditModaData({...editModalData, qualifyNotes: e.target.value})} 
                                          placeholder=" Qualification Notes...Give a summary of the qualification notes" 
                                          name="qualifyNotes" required></textarea>
                                        
                                        }
                                        />   
                                    <div className="invalid-feedback">Please fill out this field.</div>         
                                                          
                                  </div>
    
                                  <div className='row'>
                                    <div className='col-6 col-lg-6'>    
                                        <div className="form-group ">
                                          <hr />
                                          <label className="form-label cust_form_label"> Internal Support Required </label>
                                          <Controller 
                                                name="reqIntSupport"
                                                control={control}                                              
                                                render={({ field }) => 
                                                <select className="form-select"  value={intSupportValue}                                                      
                                                      onClick={handleIntSupportChange(intSupportValue)}
                                                      onChange={(e) => {  setIntSupportValue(e.target.value);
                                                        
                                                      }} >
                                                  <option value="" disabled> Choose Yes / No </option>
                                                      <option value={1}>Yes</option>
                                                      <option value={0}>No</option>
                                            </select> 
                                             } 
                                          />
                                          <div className="invalid-feedback">Please fill out this field.</div>
                                        </div>
    
                                    </div>
                                    <div className='col-6 col-lg-6'>

                                      { 
                                        listSupport &&
    
                                            <div className="form-group ">
                                              <hr />
                                              <label className="form-label cust_form_label"> List Internal Support  </label>
                                              <Controller
                                                    name="listIntSupport"
                                                    control={control}
                                                    render={({ field }) => 
                                                    <textarea {...field} type="textarea" rows="5"
                                                      className="form-control " 
                                                      
                                                    value={editModalData.listIntSupport || ''}
                                                    onChange={(e) => setEditModaData({...editModalData, listIntSupport: e.target.value})} 
                                                    placeholder=" Qualification Notes...Give a summary of the qualification notes" 
                                                    name="listIntSupport" required></textarea>
                                                  
                                                  }
                                                  />   
                                              <div className="invalid-feedback">Please fill out this field.</div>       
                                                              
                                          </div> 
                                      }  
                                       
                                    </div>
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

export default Prospects;