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


import { pdfjs } from 'react-pdf';
import PdfViewer from '../PdfViewer';
import { closedCurvePropKeys } from '@nivo/core';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const TenderDocuments = () => {

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

    const cancelShowPdf = () => {
      
    }

    const [ docsList, setDocsList ] = useState([]);
    const [ docsSubmitted, setDocsSubmitted ] = useState([]);
    const [ docsSection, setDocsSection ] = useState(false);
    const [ uploadDocs, setUploadDocs ] = useState(false);
    const [ uploadDocsMore, setUploadDocsMore ] = useState(false);
    const [ rowData, setRowData ] = useState([]);

    const inputFileRef = useRef();
    const [file, setFile ] = useState('');
    const navigate = useNavigate();
    const [ successMessage, successMessageVisible ] = useState(false);

    const [ redirectCountdown, setRedirectCountdown] = useState(5); 
    const [ showRedirectSpinner, setShowRedirectSpinner] = useState(false);
    const [ loading, setLoading] = useState(false);

    const [ showPdfModal, setPdfModal ] = useState(false);

    const closePdfModal = () => {
      setPdfModal(false);
      setPdfFile("");
    }

    const [ projectDocs, setProjectDocs ] = useState([]);

    const projectId = "FindProjectDocs?projectId=";

    var ProjId = "";

    const AllDocs = (row) => {
      setDocsSection(true);
      setRowData(row);
      console.log("Current row data is:" + JSON.stringify(rowData.projectId));

      axios.get(API_URL + projectId + rowData.projectId , {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                    })
                .then(response =>  setProjectDocs(response.data)) // Assume data is an array of { id, name }
                .catch(error => console.error('Error fetching data:', error)); 

                ProjId = "'" + JSON.stringify(projectDocs[0].projectId) + "'" ;      
    }


    const CloseDocsSection = () => { setDocsSection(false)}

    
    useEffect(() => {
        // Function to fetch vouchers
        const fetchProjectFeedbacks = () => {
          axios.get(API_URL + "GetAllDocs", {  
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          })
            .then((response) => {
              setDocsList(response.data);
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
      }, []);

                // Group by parentFeedbackId
    const grouped = docsList.reduce((acc, item) => {
        const key = item.projectId;
        if (!acc[key]) {
        acc[key] = {
            projectId: item.projectId,
            clientName: item.clientName,
            docFilePath: [],
        };
        }
        acc[key].docFilePath.push(item);
        return acc;
    }, {});

    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {  projectId: "", clientName: "",   docName:"", docFilePath: "" },
    });

    
    const onSubmit2 = async () => {

    }

    const onSubmit = async (data) => {

      data.projectId = ProjId;

      console.log("Current length 2 : " + JSON.stringify(projectDocs) );

      try{
          await axios.post(API_URL + "NewDocEntry", data);
          //successResponse();
          alert("Form submitted successfully!");   
          

          const uploadData = new FormData();
          uploadData.append('file', file, data.docFilePath );

          await axios.post(API_URL + 'UploadProjectDoc', uploadData, {
              headers: {
              'Content-Type': 'multipart/form-data',
              },
          });

      }
      catch(error){

      }finally{

      }
    }

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

    return (
       
            <Box m="20px">
                <Header title="Tender Project Documents Feedback" subtitle="Managing All Project Feedbacks" />
                <div className='row'>
                        <div className="gallery">                            
                              <div className="gallery-item">
                                <h4></h4>
                                <button
                                  className="upload-btn btn btn-primary"
                                  onClick={() => showPdf()}
                                >
                                  Show PDF
                                </button>
                              </div>

                                 {/*pdfFile && (
                                      <div className="server-preview">
                                        
                                        <button className='pdfBtnClose btn btn-danger' onClick={() => cancelShowPdf()}> Close</button>
                                      
                                      </div>
                                  )*/}

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


                            
                          </div>
                    <div className='col-5 col-lg-5 projectsList'> 
                        <table className="table table-striped table-hover table-bordered">
                            <thead className="thead-dark">
                                <tr className="">
                                    <th className="colHide">ProjectID</th>
                                    <th className=""> Client Name </th>
                                    <th className=""> Number of Documents Submitted</th>
                                    <th className=""> Last Modified Date</th>
                                    <th className="">Action</th>
                                </tr>
                            </thead>
                            <tbody className="table-group-divider table-divider-color">
                            {docsList.map((row, index) => (
                                <tr key={index} className="">
                                    <td className="colHide">{row.projectId}</td>
                                    <td className=""> {row.clientName} </td>
                                    <td className=""> {row.clientName} </td>
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
                                        <button className="btn btn-info" onClick={() => AllDocs(row)}>View All Documents </button> 
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                    </table>
                    </div>
                    
                        { 
                          docsSection && 
                          <div className='col-7 col-lg-7'> 

                              <div className='docsList'>
                                <button className='btn btn-danger' onClick={() => CloseDocsSection() }> Close </button>
                                  <h5> Documents Submitted </h5>
                                  <div>
                                    
                                  </div>
                                  <div> 
                                    {
                                      projectDocs.map(( projs, index ) =>{
                                        <div className='row' key={index}>
                                          <p>{projs.projectId}</p>
                                        </div>

                                      })
                                    }
                                    
                                  </div>

                                { projectDocs.length === 1 ? 
                                  <button className='btn btn-primary' onClick={() => setUploadDocs(true) }> Upload Documents  </button>
                                  : 
                                  <button className='btn btn-primary' onClick={() => setUploadDocsMore(true) }> Upload More Documents  </button>
                                  
                                }
                                { 
                                  uploadDocs &&
                                  <div>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                      <div className='form-group'>
                                        
                                      </div>

                                          

                                    
                                          <div className="form-group">                        
                                              <label className="form-label"> Document Name </label>     
                                              <Controller
                                                  name="docName"
                                                  control={control}
                                                  render={({ field }) => <input {...field} type="text" className="form-control" placeholder="Document Name" required />}
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

                                            <hr/>
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

                                   { 
                                  uploadDocsMore &&
                                  <div>
                                    <form onSubmit={handleSubmit(onSubmit2)} >
                                      <div className='form-group'>
                                        <button></button>
                                      </div>

                                    
                                          <div className="form-group">                        
                                              <label className="form-label"> Document Name </label>     
                                              <Controller
                                                  name="docName"
                                                  control={control}
                                                  render={({ field }) => <input {...field} type="text" className="form-control" placeholder="Document Name" required />}
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

                                            <hr/>
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

                                
                              </div>

                           </div>
                        }
                   

                </div>
            
            </Box> 
    )
}

export default TenderDocuments;