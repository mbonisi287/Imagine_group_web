import React from "react";
import { useState, useRef , useEffect} from 'react'
import { Stepper, Step, StepLabel, Button, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import { Header, BarChart } from "../../components";

import { API_URL } from '/src/global';
import './index.css';

import { useParams } from "react-router-dom";

import Modal from 'react-bootstrap/Modal';
import { ModalHeader } from 'react-bootstrap';

import { pdfjs } from 'react-pdf';
import PdfViewer from '../PdfViewer';
import { closedCurvePropKeys } from '@nivo/core';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const SingleProject = () => {    
    const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
        if (selectedFile) {
        console.log(selectedFile);
        setFile(selectedFile);

        }
    }

    const [title, setTitle] = useState("");
    
    const [allPdf, setAllPdf] = useState([]);
    const [pdfFile, setPdfFile] = useState("");

    const showPdf = () => {
    //const url = `http://localhost:5001/uploads/${filename}`;

    const url = 'https://tpms-imagine-group.mdotcreatives.co.za/ReportPdf.pdf';
        // window.open(url,"_blank");
        setPdfFile(url);
    }

    const [ showPdfModal, setPdfModal ] = useState(false);

    const closePdfModal = () => {
        setPdfModal(false);
        setPdfFile("");
    }

    const { id } = useParams();
    const tenderId = id;

    const [ showCommentsModal, setCommentsModal ] = useState(false);

    const openComments = () => {
        setCommentsModal(true);
        singleProjectComments();
    }

    const closeCommentsModal = () => {
        setCommentsModal(false);
    }

    const [redirectCountdown, setRedirectCountdown] = useState(5); 
    const [showRedirectSpinner, setShowRedirectSpinner] = useState(false);
    
    const findProjectUrl = "FindProject?id=" + id;
    const [ singleProject, setSingleProject ] = useState([]);
     const [ feedbackArray, setFeedbackArray ] = useState([]);

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

        }
            
                // Call immediately on mount
        fetchProjects();
    
    
        // Set interval to run every 60 seconds
        const intervalId = setInterval(fetchProjects, 60000);
    
        // Cleanup on unmount
        return () => clearInterval(intervalId);

    }, []); 

    const feedbackUrl = "FindFeedback?tenderProjectId=";

    const singleProjectComments = () => {

           axios.get(API_URL + feedbackUrl + id  , {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                      }
              })
          .then(response =>  setFeedbackArray(response.data)) // Assume data is an array of { id, name }
          .catch(error => console.error('Error fetching data:', error)); 

    }

        return(
            <Box m="20px">
                <Header title="Write Feedback On Tender Projects" subtitle="Manage Current Feedback for this Tender Projects" />
                    <button className="btn btn-primary"> Back To All Projects </button>
                    <hr />
                    <div>
                        {
                            singleProject.map((tenders, index) =>{
                                return<div key={index} className='row projectRow'>
                                    <h3> Current Project </h3>
                                    <div className="projBtns">
                                        <button className="btn btn-primary"> View Documents Attached For Submission </button> |  
                                        <button className="btn btn-success" onClick={() => openComments()}> View Feedback Comments </button> | 
                                        <button className="btn btn-danger" onClick={() => showPdf()}> View Current RFQ Document  </button>
                                        <hr />
                                    </div>
                                    
                                    <div className='col-5 col-lg-5'>
                                        <p> <span className="projSp"> Client Name </span> : {tenders.clientName } </p>
                                        <p> <span className="projSp"> Tender Number </span>  : {tenders.tenderNumber } </p>
                                        <p> <span className="projSp"> Tender Description </span> : {tenders.tenderDescription } </p>
                                        <p> <span className="projSp"> Date of Submission </span> : {tenders.tenderClosingDate } </p>
                                        <p> <span className="projSp"> Contact Details </span>   : {tenders.contactDetails } </p>
                                        
                                        <p> <span className="projSp"> Contact Value </span>  : R {tenders.contactValue } </p>
                                        <p> <span className="projSp"> Status </span> : {tenders.status == 0 ? 
                                       <span className='statusProgress'> In Progress </span> :
                                        <span className='statusReview'> In Review  </span> } </p>
                                      
                                    </div>
                                    <div className='col-5 col-lg-5'>
                                        <p> <span className="projSp"> Debriefing Notes </span> : {tenders.debriefingNotes } </p>
                                        <p> <span className="projSp"> Reasons For Not Submitting </span>  : {tenders.reasonSubmission } </p>                                    
                                        <p> <span className="projSp"> Briefing Attendance </span>  : {tenders.attendedStatus } </p>                                  
                                        <p> <span className="projSp"> Rank Outcome </span>  : {tenders.rankOutcome } </p>
                                        <p> <span className="projSp"> Date Created </span> : {tenders.dateCreated } </p>
    
                                    </div>
                                    <div className="col-2 col-lg-2 projTime">
                                        <h5 className="projTimeHeading"> Project Timeline </h5>
                                        <div>
                                            <span className="spanMod"> Created on 05/09/25 at 10:45 by Username</span>
                                            <span className="spanMod"> Modified on 05/09/25 at 10:45 by Username</span>
                                            <span className="spanMod"> Modified on 05/09/25 at 10:45 by Username </span>
                                            <span className="spanMod"> Modified on 05/09/25 at 10:45 by Username </span>
                                            <span className="spanMod"> Modified on 05/09/25 at 10:45 by Username </span>
                                            <span className="spanMod"> Feedback submitted on 05/09/25 at 10:45 by Username </span>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                       
                    </div>

                    {/* Feedback Comments Modal */}

                     <Modal
                        show={showCommentsModal}
                        handle={closeCommentsModal}
                        backdrop="static"
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        keyboard={false}
                        dialogClassName="custom-modal-width-show">
                            <ModalHeader>
                            <button className="btn btn-primary" onClick={closeCommentsModal}> Close </button>
                            <Modal.Title> Feedback Section : </Modal.Title>                                       

                            </ModalHeader>
                            <Modal.Body>
                            <h3 style={{ textAlign: "center" }}> Feedback Comments </h3>
                                                  {feedbackArray.map((feedbacks, index) => {
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
                                                          


                            </Modal.Body>
                            <Modal.Footer>                                        
                            <button className="btn btn"> Close </button>                                 

                            </Modal.Footer>
                    </Modal>

                    {/* Pdf Modal */}
                    <Modal
                    show={pdfFile}
                    handle={closePdfModal}
                    backdrop="static"
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    keyboard={false}
                    dialogClassName="custom-modal-width-show">
                        <ModalHeader>
                        <button className="btn btn-primary" onClick={closePdfModal}> Close </button>
                        <Modal.Title> PDF Viewer : </Modal.Title>                                       

                        </ModalHeader>
                        <Modal.Body>
                        <h3 style={{ textAlign: "center" }}>PDF Viewer</h3>
                            <PdfViewer pdf={pdfFile} />                                


                        </Modal.Body>
                        <Modal.Footer>                                        
                        <button className="btn btn"> Close </button>                                 

                        </Modal.Footer>
                    </Modal>



             
                    {/* Write Additional */}
                    
        
            
            </Box>
            )
    

}
export default SingleProject;