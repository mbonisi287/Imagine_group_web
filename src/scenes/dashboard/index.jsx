import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Header,
  StatBox,
  LineChart,
  ProgressCircle,
  BarChart,
  GeographyChart,
  TableChart,
} from "../../components";
import {
  DownloadOutlined,
  Email,
  PersonAdd,
  PointOfSale,
  Traffic,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";

import { useContext, useState, useEffect, useNavigate } from "react";
import axios from "axios";
import './index.css';

import { API_URL } from '/src/global';


function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");

  const [allTenders, setAllTenders] = useState([]);
  const [ tenders, setTenders] = useState([]);

  const [ allProspects, setAllProspects ] = useState([]);

  const [ allPipelines, setAllPipelines ] = useState([]);

  const [allProjects, setAllProjects ] = useState([]);

  {/* Leads */}
   useEffect(() => {
    // Function to fetch vouchers
    const fetchLeads = () => {
      axios.get(API_URL + "getLeads" ,
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((response) => {
          setAllTenders(response.data);
          

          //console.log("Fetched Vouchers:", response.data);
        })
        .catch((error) => {
          //console.error("API error:", error);
        });
    };

    // Call immediately on mount
    fetchLeads();

    // Set interval to run every 60 seconds
    const intervalId = setInterval(fetchLeads, 60000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);

  }, []); // Empty dependency array: only runs once

  let activeLeads = new Array();
    for(let i = 0; i < allTenders.length; i++)
    {
      var submittedStatus = JSON.stringify(allTenders[i].convStatus);
      if(submittedStatus === '1')
      {
        activeLeads.push(allTenders[i]);
      }
    }

  const activeLeadsNo = activeLeads.length;


  {/* Prospects */}
    useEffect(() => {
    // Function to fetch vouchers
    const fetchProspects = () => {
      axios.get(API_URL + "allProspects" ,
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((response) => {
          setAllProspects(response.data);
        })
        .catch((error) => {
          //console.error("API error:", error);
        });
    };
    // Call immediately on mount
    fetchProspects();
    // Set interval to run every 60 seconds
    const intervalId = setInterval(fetchProspects, 60000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);

  }, []); 

  let activeProspectsNo = allProspects.length;

  {/* Pipeline */}

      useEffect(() => {
    // Function to fetch vouchers
    const fetchPipelines = () => {
      axios.get(API_URL + "allProspects" ,
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((response) => {
          setAllPipelines(response.data);
        })
        .catch((error) => {
          //console.error("API error:", error);
        });
    };
    // Call immediately on mount
    fetchPipelines();
    // Set interval to run every 60 seconds
    const intervalId = setInterval(fetchPipelines, 60000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);

  }, []);

  let activePipelinesNo = allPipelines.length;

  {/* Projects */}

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

  const activeTenders = allProjects.length;

 const totalValue = allProjects.reduce((sum, project) => {
  return sum + (project.contractValue || 0);
}, 0);

  const recentTendersArray = allProjects.slice(0, 10);

  let activeTendersNo = activeTenders + " - R" + totalValue;

  {/* Top 5 */}


  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        {!isXsDevices && (
          <Box>
            <Button
              variant="contained"
              sx={{
                bgcolor: colors.blueAccent[700],
                color: "#fcfcfc",
                fontSize: isMdDevices ? "14px" : "10px",
                fontWeight: "bold",
                p: "10px 20px",
                mt: "18px",
                transition: ".3s ease",
                ":hover": {
                  bgcolor: colors.blueAccent[800],
                },
              }}
              startIcon={<DownloadOutlined />}
            >
              DOWNLOAD REPORTS
            </Button>
          </Box>
        )}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={
          isXlDevices
            ? "repeat(12, 1fr)"
            : isMdDevices
            ? "repeat(6, 1fr)"
            : "repeat(3, 1fr)"
        }
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Statistic Items */}
        <Box
          gridColumn="span 3"
          bgcolor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="25px"
          overflow="hidden"
        >
          <StatBox
            title={activeLeadsNo}
            subtitle="Total Leads"
            progress="0.75"
            increase="+14%"
            icon={
              <Email
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="25px"
          overflow="hidden"
        >
          <StatBox
            title={activeProspectsNo}
            subtitle="Total Prospects"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSale
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="25px"
          overflow="hidden"
        >
          <StatBox
            title={activePipelinesNo}
            subtitle="Total Pipeline No:"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAdd
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="25px"
          overflow="hidden"
        >
          <StatBox
            title={activeTendersNo}
            subtitle="Active Projects & Value"
            progress="0.80"
            increase="+43%"
            icon={
              <Traffic
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ---------------- Row 2 ---------------- */}

        {/* Line Chart */}
        <Box
          gridColumn={
            isXlDevices ? "span 8" : isMdDevices ? "span 6" : "span 3"
          }
          gridRow="span 2"
          bgcolor={colors.primary[400]}
        >
          <Box
            mt="25px"
            px="30px"
            display="flex"
            justifyContent="space-between"
            borderRadius="25px"
            overflow="hidden"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.gray[100]}
              >
                Contract Value of Tender Submissions
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                R {totalValue}
              </Typography>
            </Box>
            <IconButton>
              <DownloadOutlined
                sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
              />
            </IconButton>
          </Box>
          <Box 
            height="250px" 
            mt="-20px"   
            borderRadius="25px"
            overflow="hidden" >
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        {/* Transaction Data */}
        <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          bgcolor={colors.primary[400]}
          overflow="hidden"
          borderRadius="25px"
          
        >
          <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
            <Typography color={colors.gray[100]} variant="h5" fontWeight="600">
              Upcoming Deadlines
            </Typography>
          </Box>

          {recentTendersArray.map((recent, index) => (
            <Box
              key={`${recent.id}-${index}`}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              overflow="hidden"
              borderRadius="25px"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {recent.tenderNumber}
                </Typography>
                <Typography color={colors.gray[100]}>
                  {recent.clientName} - {recent.tenderDescription}
                </Typography>
              </Box>
              <Box>

                <Typography color={colors.gray[100]}>
                Date Created: {recent.closingDate}
              </Typography>
              <Typography color={colors.gray[100]}>
                Closing Date:<span className="closeDate"> 25 December 2025 {recent.closingDate} </span>  {/* Esnure that the date is in Red Bold */}
              </Typography>
              </Box>
         
              <Box
                bgcolor={colors.greenAccent[500]}
                p="5px 10px"
                
                     overflow="hidden"
          borderRadius="25px"
              >
                R {recent.contractValue}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Revenue Details 
        <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              textAlign="center"
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography textAlign="center">
              Includes extra misc expenditures and costs
            </Typography>
          </Box>
        </Box>*/}

        {/* Bar Chart */}
        <Box
          gridColumn={isXlDevices ? "span 6" : "span 3"}
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ p: "30px 30px 0 30px" }}
          >
            Perfromance Per Department
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="350px"
            mt="-20px"
          >
            <BarChart isDashboard={true} />
          </Box>
        </Box>

        {/* Geography Chart */}
        <Box
          gridColumn={isXlDevices ? "span 6" : "span 3"}
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography variant="h5" fontWeight="600" mb="15px">
            Active Projects and Value
          </Typography>
          <Box
            display="flex"
            alignItems="bottom"
            justifyContent="center"
            height="200px"
          >
            <TableChart isDashboard={true} />
          </Box>
        </Box> 
      </Box>
    </Box>
  );
}

export default Dashboard;
