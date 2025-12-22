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

const Notifications = () => {

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Email');
    const [sortOrder, setSortOrder] = useState('asc');
    const [totalPages, setTotalPages] = useState(0);

    const [ notes, setNotes ] = useState([]);

    useEffect(() => {
    // Function to fetch vouchers
        const fetchNotes = () => {
            axios.get(API_URL + "AllNotifications", {  
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
            })
            .then((response) => {
                setNotes(response.data);
                //console.log("Fetched Vouchers:", response.data);
            })
            .catch((error) => {
                console.error("API error:", error);
            });
        };

    // Call immediately on mount
    fetchNotes();

    // Set interval to run every 60 seconds
    const intervalId = setInterval(fetchNotes, 60000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
    }, []); // Empty dependency array: only runs once

    return(
        <Box m="20px">
            <Header title="Tender Projects" subtitle="Managing All Tender Projects" /> 

               
    
            <div className="allNotes">

                    
                  
                        {
                            notes.map((note, index) => {
                                return <div className='row noteRow' key={index}>
                                    <div className='col-12 col-lg-12'>
                                        <span className='rowSpan rowTitle'> Title : {note.title}</span>
                                        <span className='rowSpan'> Source Type : {note.sourceType} </span>                                        
                                        <span className='rowSpan'> Message : {note.message} </span>
                                        <span className='rowSpan'> Date Created : {new Date(note.dateCreated).toLocaleString('en-GB', {
                                                                                  day: '2-digit',
                                                                                  month: '2-digit',
                                                                                  year: 'numeric',
                                                                                  hour: '2-digit',
                                                                                  minute: '2-digit',
                                                                                  second: '2-digit',
                                                                                  hour12: true
                                                                                })} </span>

                                    </div>
                                    
                                   
                                </div>
                            })
                        }
                    
                
                
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

                    {/* Modal to View Tender Projects 
                    <Modal
                      show={showProjectModal}
                      handle={closeProjectModal}
                      backdrop="static"
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                      keyboard={false}
                      dialogClassName="custom-modal-width-show">
                        <ModalHeader>
                          <button className="btn btn-primary" onClick={closeProjectModal}> Close </button>
                          <Modal.Title> Project Name: { modalDataProject.clientName }</Modal.Title>
                          <buttton className="btn btn-info" onClick={() => EditTenderModal(modalDataProject)}> Edit Project Details</buttton>

                        </ModalHeader>
                        <Modal.Body>
                          <p> Client Name : {modalDataProject.clientName } </p>
                          <p> Tender Number : {modalDataProject.tenderNumber } </p>
                          <p> Tender Description : {modalDataProject.tenderDescription } </p>
                          <p> Debriefing Notes : {modalDataProject.debriefingNotes } </p>
                          <p> Contact Value : R {modalDataProject.contractValue } </p>
                          <p> Status : {modalDataProject.status } </p>
                          <p> Reasons For Not Submitting : {modalDataProject.reasonSubmission } </p>
                          <p> Date of Submission : {modalDataProject.tenderClosingDate } </p>
                          <p> Briefing Attendance : {modalDataProject.attendedStatus } </p>
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
                          <p> Feedback Status : {modalDataProject.feedbackCheck } </p>
                          <p className='invisible'> Project Id : {modalDataProject.id } </p>


                        </Modal.Body>
                        <Modal.Footer>
                          <Link to={`/tenderFeedback/${modalDataProject.id}`}> <button className="btn btn-success" > Write Feedback on Client Name: {modalDataProject.clientName} </button> </Link>
                          <button className="btn btn-primary" onClick={closeProjectModal}> Close </button>
                          

                        </Modal.Footer>
                    </Modal>*/}

                    {/* Modal To Edit The Tender Content
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
                          <Modal.Title> Project Name: { editModalData.clientName }</Modal.Title>
                          

                        </ModalHeader>
                        <Modal.Body>

                          <form onSubmit={handleSubmit(onSubmit2)}>
                            <div className='row'>
                              <div className='col-6 col-lg-6'> 
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
                              <div className='col-6 col-lg-6'> 

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

                    </Modal> */}

                    


                    {/* Modal For Feedback Per Project
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
                            <Modal.Title> Feedback For Project Name: { modalDataProject.clientName }</Modal.Title>

                          </ModalHeader>
                          <Modal.Body>

                          </Modal.Body>
                          <Modal.Footer>
                            <button className="btn btn-primary" onClick={closeFeedbackModal}> Close </button>
                          </Modal.Footer>
                      </Modal>*/}

            </div>
        
        </Box>
    )

}

export default Notifications;