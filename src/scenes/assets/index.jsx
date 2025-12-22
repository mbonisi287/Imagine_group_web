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

import { useParams } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const Assets = () => {

  const [ allAssets, setAllAssets ] = useState([]);

  const [ pageNumber, setPageNumber] = useState(1);
  const [ pageSize] = useState(10);
  const [ searchTerm, setSearchTerm] = useState('');
  const [ sortBy, setSortBy] = useState('Email');
  const [ sortOrder, setSortOrder] = useState('asc');
  const [ totalPages, setTotalPages] = useState(0);

  const [ loadingSubmit, setLoadingSubmit] = useState(false);

  const [ showAssets, setShowAssets ] = useState(true);
  const [ bookingArea, setBookingArea ] = useState(false);
  const [ availableCars, setAvailableCars ] = useState(false);
  const [ allCars, setAllCars ] = useState([]);

  const [ modalBook, setModalBook] = useState([]);
  const [ showModalBook, setShowModalBook ] = useState(false);

  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [ showAssetsArea, setShowAssetsArea ] = useState(false);

  const [ showBookings, setShowBookings ] = useState(false);
  const [ allBookings, setAllBookings ] = useState([]);

  const [ newAsset, setNewAsset ] = useState(false);
  const [ assetType, setAssetType ] = useState('');

  const formRef = useRef(null);


  const viewAllAssets = () => {
    setShowAssets(true);

    setNewAsset(false); 
    setBookingArea(false);
    setShowBookings(false);
    //setAllAssets(false);
  }
  
  const BookVehicle = () => {
    setBookingArea(true);

    setShowAssets(false);
    setShowBookings(false); 
    setNewAsset(false);   
  }

  const registerAsset = () => {
    setNewAsset(true);

    setBookingArea(false);
    setShowAssets(false);
    setShowBookings(false);  

  }

  const viewBookings = () => {
    setShowBookings(true);

    setShowAssets(false);
    setBookingArea(false);
    setNewAsset(false);
    
        
   // Empty dependency array: only runs once
  }

  

  //const [ showAvailableCars, setShowAvailableCars ] = useState(false);
  const { control, handleSubmit, watch } = useForm({
        defaultValues: {   },
  });

    const onSubmit = async (data) => {
    setLoadingSubmit(true);

    data.assetType = assetType;
    data.isActive = true;


    try {
      const response = await axios.post(API_URL + "newAsset", data);
      setMessage("Booking successful!");
      setLoadingSubmit(false);
      formRef.current.reset();
    } catch (err) {
      setLoadingSubmit(false);
      if (err.response) {
        setError(err.response.data);
      } else {
        setError("Something went wrong.");
      }
    }
        
  };


  const onSubmit2 = async (data) => {
    setLoadingSubmit(true);

    data.startDateTime  = startDateTime;
    data.endDateTime = endDateTime;
    data.assetName = modalBook.assetName;
    data.bookedByUserId = "mbonisitshuma287@gmail.com";
    data.assetID = modalBook.assetID;
    data.assetRegID = modalBook.assetRegID;

    try {
      const response = await axios.post(API_URL + "AssetBooking/bookAsset", data);
      setMessage("Booking successful!");
      setLoadingSubmit(false);
    } catch (err) {
      setLoadingSubmit(false);
      if (err.response) {
        setError(err.response.data);
      } else {
        setError("Something went wrong.");
      }
    }
        
  };



  const AvailableCars = () => {
    setAvailableCars(true);

  
    axios.get(API_URL + "AssetBooking/available?start=2025-12-16&end=2026-04-16", {  
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => {
        setAllCars(response.data);
        //console.log("Fetched Vouchers:", response.data);
      })
      .catch((error) => {
        console.error("API error:", error);
      });
  }

  const startBooking = (cars) => {
    setShowModalBook(true);
    setModalBook(cars);
  }

  const closeBooking = () => setShowModalBook(false);

    
  useEffect(() => {
      // Function to fetch vouchers
      const fetchAssets = () => {
        axios.get(API_URL + "allAssets", {  
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
          .then((response) => {
            setAllAssets(response.data);
            //console.log("Fetched Vouchers:", response.data);
          })
          .catch((error) => {
            console.error("API error:", error);
          });
      };
  
      // Call immediately on mount
      fetchAssets();
  
      // Set interval to run every 60 seconds
      const intervalId = setInterval(fetchAssets, 60000);
  
      // Cleanup on unmount
      return () => clearInterval(intervalId);
    }, []); // Empty dependency array: only runs once

  useEffect(() => {
    // Function to fetch vouchers
    const fetchBookings = () => {
      axios.get(API_URL + "AssetBooking/allBookings", {  
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
        .then((response) => {
          setAllBookings(response.data);
          //console.log("Fetched Vouchers:", response.data);
        })
        .catch((error) => {
          console.error("API error:", error);
        });
    };

    // Call immediately on mount
    fetchBookings();

    // Set interval to run every 60 seconds
    const intervalId = setInterval(fetchBookings, 60000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);
    
    
    
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

return(
        
    <Box m="20px">
        <Header title="Assets" subtitle="Managing All Assets" /> 
        <div className='btnRow'>
          <button className='btn btn-success btnNew' onClick={() => registerAsset()}> Register New Asset </button> --
          <button className='btn btn-primary btnBook' onClick={() => viewAllAssets()}> View All Assets </button> --
          <button className='btn btn-secondary btnBook' onClick={() => BookVehicle()}> Book Vehicle </button> --
           <button className='btn btn-warning btnBook' onClick={() => viewBookings()}> View All Bookings </button>
        </div>
        <br />

        {
          newAsset && 
          <div className='newAssetArea'>
            <h2> Register New Asset</h2>
              <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                <div className='row'>
                    <div className='col-4 col-lg-4'> 
                      <div className="form-group">                        
                          <label className="form-label"> Asset Type </label>     
                          <Controller
                                name="assetType"
                                control={control}
                                render={({ field }) => 
                                <select  value={assetType} 
                                    onChange={(e) => setAssetType(e.target.value)}                                 
                                    className="form-select" required > 
                                  <option value=""> Choose the asset type </option> 
                                  <option value="Vehicle"> Vehicle </option>                                                
                                  <option value="Laptop"> Laptop </option> 
                                  <option value="Printer"> Printer </option>                                
                                </select> 
                              } />                                      
                    </div>
                  </div>

                  <div className='col-4 col-lg-4'> 
                    <div className="form-group">                        
                          <label className="form-label"> Asset Name </label>     
                          <Controller
                              name="assetName"
                              control={control}
                              render={({ field }) => <input {...field} type="text" className="form-control" 
                              placeholder="Asset Name.... e.g,. vehicle name, laptop printer name, "
                              name="assetName" required />}
                          />                                        
                    </div>
                  </div>

                  <div className='col-4 col-lg-4'> 
                    <div className="form-group">                        
                          <label className="form-label"> Asset Registration ID </label>     
                          <Controller
                              name="assetRegID"
                              control={control}
                              render={({ field }) => <input {...field} type="text" className="form-control" placeholder="Asset Registration ID ....vehicle reg ID, laptop serial number" required />}
                          />                                        
                    </div>
                  </div>
                </div>
                <hr />

              

                <div className='row'>
                      <div className="form-group ">
                    <hr />
                    <label className="form-label cust_form_label"> Asset Description </label>
                    <Controller
                          name="assetDescription"
                          control={control}
                          render={({ field }) => 
                          <textarea {...field} type="textarea" rows="5" className="form-control"  placeholder="Asset Description.........................." name="assetDescription" required>
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
          </div>

        }

        {
          bookingArea &&
          <div className='bookingDiv'>
            <h3> Booking Area - Start the process of booking a vehicle </h3>
            <button className='btn btn-warning' onClick={() => AvailableCars()}> Show Available Vehicles </button>
            {
              availableCars && 
              <table className="table table-striped table-hover table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <td> Vehicle Name </td>
                    <td> Vehicle Reg. </td>
                    <td> Vehicle Status </td>
                    <td> Action </td>
                  </tr>
                </thead>
                <tbody>
                  {
                    allCars.map((cars, index) => {
                      return <tr key={index}>
                        <td>{cars.assetName}</td>
                        <td>{cars.assetRegID}</td>
                        <td>{cars.isActive == true ? 'Active' : 'Vehicle Not Active'}</td>
                        <td> <button className='btn btn-primary' onClick={() => startBooking(cars)}> Book Vehicle </button></td>                     

                      </tr>

                    })
                  }
                </tbody>
              </table>
            }
          </div>          
        }

        { 
          showBookings &&
          
            <div className="allBookings">
              <table className="table table-striped table-hover table-bordered">
                  <thead className="thead-dark">
                      <tr>                       
                        
                          <th> Asset Name </th>
                          <th> Registration Number </th>
                          <th> Booked By </th>
                          <th> Start Date  </th>
                          <th> End Date  </th>
                          <th> Booking Purpose </th>
                      
                          <th> Action </th>                        
                      </tr> 
                  </thead> 
                  <tbody className="table-group-divider table-divider-color">
                      {
                          allBookings.map((projects, index) => {
                              return <tr key={index}>
                     
                                  <td>{projects.assetName}</td>
                                  <td>{projects.assetRegID}</td>
                                  <td>{projects.bookedByUserId}</td>
                                  <td> {new Date(projects.startDateTime).toLocaleString('en-GB', {                                                                               day: '2-digit',
                                                                                month: '2-digit', year: 'numeric', hour: '2-digit',  minute: '2-digit',
                                                                                second: '2-digit',                                       hour12: true
                                                                              })}</td>      
                                  <td> {new Date(projects.endDateTime).toLocaleString('en-GB', {                                                                               day: '2-digit',
                                    month: '2-digit', year: 'numeric', hour: '2-digit',  minute: '2-digit',
                                    second: '2-digit',                                       hour12: true
                                  })}</td> 
                                  <td> {projects.purpose}</td>
                                  
                                  
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
            </div>
        }

        { 
          showAssets && 
          <div className="allAssets">
              <table className="table table-striped table-hover table-bordered">
                  <thead className="thead-dark">
                      <tr>                       
                          <th> Asset Type </th>
                          <th> Asset Name </th>
                          <th> Registration Number </th>
                          <th> Registration Date  </th>
                      
                          <th> Action </th>                        
                      </tr> 
                  </thead> 
                  <tbody className="table-group-divider table-divider-color">
                      {
                          allAssets.map((projects, index) => {
                              return <tr key={index}>
                                  <td>{projects.assetType}</td>
                                  <td>{projects.assetName}</td>
                                  <td>{projects.assetRegID}</td>
                                  <td> {new Date(projects.assetRegDate).toLocaleString('en-GB', {                                                                               day: '2-digit',
                                                                                month: '2-digit', year: 'numeric', hour: '2-digit',  minute: '2-digit',
                                                                                second: '2-digit',                                       hour12: true
                                                                              })}</td>      
                                  
                                  
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

              
          </div>
        }

        {/* Booking Modal */ }
        <Modal
          show={showModalBook}
          handle={closeBooking}
          backdrop="static"
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          keyboard={false}
          dialogClassName="custom-modal-width-show">
            <ModalHeader>
              <button className="btn btn-primary" onClick={closeBooking}> Close </button>
              <Modal.Title> Vehicle Booking - <span> {modalBook.assetName} - { modalBook.assetRegID} </span></Modal.Title>
            </ModalHeader>
            <Modal.Body>
              <form onSubmit={handleSubmit(onSubmit2)}>
                 <div className="form-group">                        
                      <label className="form-label"> Purpose </label>     
                      <Controller
                          name="purpose"
                          control={control}
                          render={({ field }) => <input {...field} type="text" className="form-control" placeholder="Purpose for Booking vehicle" required />}
                      />                                        
                </div>


                 <div className="form-group ">
                    {/* Start DateTime */}
                    <label>Start Date & Time</label>
                    <DatePicker
                      selected={startDateTime}
                      onChange={(date) => setStartDateTime(date)}
                      showTimeSelect
                      dateFormat="yyyy-MM-dd HH:mm"
                      className="form-control input"
                      //style={styles.input}
                    />
                 </div>

                 <div className='form-group'>
                  <label>End Date & Time</label>
                  <DatePicker
                    selected={endDateTime}
                    onChange={(date) => setEndDateTime(date)}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm"
                    className="form-control"
                    //style={styles.input}
                  />
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
    
    </Box>
                
)
    
}

export default Assets;