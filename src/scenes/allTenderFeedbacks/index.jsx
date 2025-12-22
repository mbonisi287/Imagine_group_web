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

const AllTenderFeedbacks = () => {

    const [vouchers, setVouchers] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Email');
    const [sortOrder, setSortOrder] = useState('asc');
    const [totalPages, setTotalPages] = useState(0);

    const [feedbackData, setFeedbackData] = useState([]);

    const [ feedbackArray, setFeedbackArray ] = useState([]);

    const [ feedbackModal, showFeedbackModal ] = useState(false);

    const closeFeedbackModal = () => showFeedbackModal(false);
    //const [ feedbackModalData,]

       useEffect(() => {
            // Function to fetch vouchers
            const fetchProjectFeedbacks = () => {
              axios.get(API_URL + "AllFeedbacks", {  
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
              })
                .then((response) => {
                  setFeedbackData(response.data);
                  //console.log("Fetched Vouchers:", response.data);
                })
                .catch((error) => {
                  console.error("API error:", error);
                });
            };
        
            // Call immediately on mount
            fetchProjectFeedbacks();
        
            // Set interval to run every 60 seconds
            const intervalId = setInterval(fetchProjectFeedbacks, 60000);
        
            // Cleanup on unmount
            return () => clearInterval(intervalId);
          }, []); // Empty dependency array: only runs once

    
        // Group by parentFeedbackId
        const grouped = feedbackData.reduce((acc, item) => {
            const key = item.parentFeedbackId;
            if (!acc[key]) {
            acc[key] = {
                tenderProjectId: item.tenderProjectId,
                clientName: item.clientName,
                tenderNumber: item.tenderNumber,
                comments: [],
            };
            }
            acc[key].comments.push(item);
            return acc;
        }, {});

        // Prepare rows
        const rows = Object.values(grouped).map((group) => {
            const firstEntry = group.comments.sort(
            (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
            )[0];

            return {
            projectId: group.tenderProjectId,
            clientName: group.clientName,
            tenderNumber: group.tenderNumber,
            numberOfComments: group.comments.length,
            dateCreated: firstEntry.dateCreated,
            };
        });

        const feedbackUrl = "FindFeedback?tenderProjectId=";

        const SingleFeedBack = (row) => {

          showFeedbackModal(true);
           
          axios.get(API_URL + feedbackUrl + row.projectId  , {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                      }
              })
          .then(response =>  setFeedbackArray(response.data)) // Assume data is an array of { id, name }
          .catch(error => console.error('Error fetching data:', error)); 
          
        }

     return(
    
            <Box m="20px">
                <Header title="Tender Project Feedback" subtitle="Managing All Project Feedbacks" /> 
    
        
        
                <div className="allVouchers">
                    <table className="table table-striped table-hover table-bordered">
                        <thead className="thead-dark">
                            <tr className="">
                                <th className="colHide">ProjectID</th>
                                <th className=""> Client Name </th>
                                <th className=""> Tender Number </th>
                                <th className="">Number Of Feedback Comments</th>
                                <th className=""> Last Modified Date </th>
                                <th className="">Action</th>

                            </tr>
                         </thead>
                        <tbody className="table-group-divider table-divider-color">
                        {rows.map((row, index) => (
                            <tr key={index} className="">
                                <td className="colHide">{row.projectId}</td>
                                <td className=""> {row.clientName} </td>
                                <td className=""> {row.tenderNumber} - Tender Number </td>
                                <td className="">{row.numberOfComments}</td>
                                <td className="">
                                     {new Date(row.dateCreated).toLocaleString('en-GB', {
                                                                                  day: '2-digit',
                                                                                  month: '2-digit',
                                                                                  year: 'numeric',
                                                                                  hour: '2-digit',
                                                                                  minute: '2-digit',
                                                                                  second: '2-digit',
                                                                                  hour12: true
                                                                                })}
                                </td>
                                <td>
                                    <button className="btn btn-info" onClick={() => SingleFeedBack(row)}>View Feedback Comments </button> 
                                </td>
                                
                            </tr>
                        ))}
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
    
                        {/* Modal to Feedback Chain from One Project  */}
                        <Modal
                          show={feedbackModal}
                          handle={closeFeedbackModal}
                          backdrop="static"
                          size="xl"
                          aria-labelledby="contained-modal-title-vcenter"
                          centered
                          keyboard={false}
                          dialogClassName="custom-modal-width-show">
                            <ModalHeader>
                              <button className="btn btn-primary" onClick={closeFeedbackModal}> Close </button>
                              <h2> Project Name : </h2>
                            
                              
    
                            </ModalHeader>
                            <Modal.Body>
                               <div className=''>
                            <hr />
                            {
                              feedbackArray.map((feedbacks, index) => {
                                  return <div className='row' key={index}>
                                    <div className='modalRow'>  
                                        <span> Feedback: by</span>  <span className='innerSpan'> { feedbacks.username } </span>
                                        On <span className='innerSpan'> {  new Date(feedbacks.feedbackDate).toLocaleString('en-GB', {                                                                               day: '2-digit',
                                              month: '2-digit', year: 'numeric', hour: '2-digit',  minute: '2-digit',
                                              second: '2-digit',                                       hour12: true
                                            })} </span>  
                                        <span className='innerSpan'> { feedbacks.feedbackType }</span>     <hr /> 
                                        <span><span className='innerSpan'> { feedbacks.feedbackNotes } </span> 
                                              <br />                    
                                            </span>
                                            



                                    </div>
                                      
                                                                                      
                                  </div>
                              })
                                }
                        </div>
    
    
                            </Modal.Body>
                            <Modal.Footer>
                            </Modal.Footer>
                        </Modal>
    
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
    
                        </Modal>*/}
    
                        
    
    
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

export default AllTenderFeedbacks;