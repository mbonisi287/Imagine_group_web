import { Box, Typography, useTheme, Stepper, Step, StepLabel, Button } from "@mui/material";
import { tokens } from "../theme";
import { useState, useRef , useEffect, useCallback} from 'react';
import React from "react";

import 'bootstrap/dist/js/bootstrap.bundle.min';

import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import { API_URL } from '/src/global';


const TableChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [allProjects, setAllProjects] = useState([]);

     useEffect(() => {
        // Function to fetch vouchers
        const fetchTenders = () => {
          axios.get(API_URL + "AllTenderProjects" ,
            {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then((response) => {
              setAllProjects(response.data);
            })
            .catch((error) => {
              //console.error("API error:", error);
            });
        };
        // Call immediately on mount
        fetchTenders();
        // Set interval to run every 60 seconds
        const intervalId = setInterval(fetchTenders, 60000);
    
        // Cleanup on unmount
        return () => clearInterval(intervalId);
    
      }, []);

      let dashboardProjects = allProjects.slice(0,8);

     


    return (
        <Box mb="30px">
            <div className="">
                <div className="">
                    <table className="table table-dark table-striped table-borderless">
                        <thead>
                            <tr>
                                <th className="text-uppercase text-secondary text-xxs font-weight-bolder"> Project </th>
                                <th className="text-uppercase text-secondary text-xxs font-weight-bolder"> Bidding Entity/Department </th>
                                <th className="text-uppercase text-secondary text-xxs font-weight-bolder"> Value </th>
                                <th className="text-uppercase text-secondary text-xxs font-weight-bolder"> Start Date </th>
                                <th className="text-uppercase text-secondary text-xxs font-weight-bolder"> End Date </th>
                            </tr>

                        </thead>
                        <tbody>
                            {
                                dashboardProjects.map((projects, index) =>{
                                    return <tr key={index}>
                                        <td>{projects.clientName}</td>
                                        <td>{projects.department  == 1 ? 'Imagine Eco Build Solutions' :
                                            projects.department == 2 ? 'Imagine Real Estate' : 'Qwabe Mahlase Construction' }</td>
                                        <td> R {projects.contractValue}</td>
                                        <td> {new Date(projects.dateCreated).toLocaleString('en-GB', { day: '2-digit',  month: '2-digit', year: 'numeric' })}</td>
                                        <td> {new Date(projects.tenderClosingDate).toLocaleString('en-GB', { day: '2-digit',  month: '2-digit', year: 'numeric' })}</td>
                                    </tr>
                                })
                            }

                        </tbody>
                    </table>
                </div>
               
            </div>
          
        </Box>
    );
};

export default TableChart;