/* eslint-disable react/prop-types */
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  AllInclusive,
  AssessmentTwoTone,
  BarChartOutlined,
  CalendarTodayOutlined,
  ContactsOutlined,
  DashboardOutlined,
  DonutLargeOutlined,
  FunctionsRounded,
  HelpCenter,
  HelpOutlineOutlined,
  MapOutlined,
  MenuOutlined,
  MoneyOffRounded,
  NewReleases,
  NewReleasesOutlined,
  PeopleAltOutlined,
  Person2Outlined,
  PersonOutlined,
  ReceiptOutlined,
  ReportOffOutlined,
  ReportProblemOutlined,
  TimelineOutlined,
  TungstenOutlined,
  WavesOutlined,

} from "@mui/icons-material";
import avatar from "../../../assets/images/avatar.png";
import logo from "../../../assets/images/Imagine.jpg";
import Item from "./Item";
import { ToggledContext } from "../../../App";
import NewTender from "../../newTender";
import Pipeline from "../../pipeline";


const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        fontSize: "18px", fontWeight: 500,
        border: 0,
        height: "100%",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { ":hover": { background: "transparent" }, },
        }}
      >
        <MenuItem
          rootStyles={{
            fontSize: "48px", fontWeight: 500,
            margin: "10px 0 20px 0",
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              fontSize: "48px", fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: ".3s ease" }}
              >
                <img
                  style={{ width: "30px", height: "30px", borderRadius: "8px" }}
                  src={logo}
                  alt="Argon"
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color={colors.greenAccent[500]}
                >
                  Imagine Group SA

                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>
      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            mb: "25px",
          }}
        >
          <Avatar
            alt="avatar"
            src={logo}
            sx={{ width: "100px", height: "100px" }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>
              Imagine Group SA
            </Typography>
            <Typography
              variant="h6"
              fontWeight="500"
              color={colors.greenAccent[500]}
            >
              Admin
            </Typography>
          </Box>
        </Box>
      )}

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Dashboard"
            path="/"
            colors={colors}
            icon={<DashboardOutlined />}
          />
        </Menu>
       
       
       
        <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "" : " "}
        </Typography>
         {/*<Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Tender Projects"
            path="/tenderProjects"
            colors={colors}
            icon={<HelpOutlineOutlined  />}
          />
         
        </Menu>
      
       <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          
          <Item
            title="Tender Project Documents"
            path="/tenderDocuments"
            colors={colors}
            icon={<ReportProblemOutlined  />}
          />
        </Menu> 

        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          
          <Item
            title="Project Feedback"
            path="/allTenderFeedbacks"
            colors={colors}
            icon={<ReportProblemOutlined  />}
          />
        </Menu>*/}

       {/* <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          
          <Item
            title="New Project"
            path="/newTender"
            colors={colors}
            icon={<NewReleasesOutlined  />}
          />
        </Menu> */}

        {/* Leads Tab */}
        <Typography
          variant="h4"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Database" : " "}
        </Typography>
         <Menu
            menuItemStyles={{
              button: {
                ":hover": {
                  color: "#868dfb",
                  background: "transparent",
                  transition: ".4s ease",
                },
              },
            }}  
          >
            <Item
              title="Leads"
              path="/leads"
              colors={colors}
              icon={<AllInclusive />}
            />
            {/* 
              <Item
              title="Create New Lead"
              path="/newTender"
              colors={colors}
              icon={<NewReleases />}
            />*/}
        </Menu>
     
          <Menu
            menuItemStyles={{
              button: {
                ":hover": {
                  color: "#868dfb",
                  background: "#ffffff",
                  transition: ".4s ease",
                },
              },
            }}  
          >
            <Item
              title="Prospects"
              path="/prospects"
              colors={colors}
              icon={<FunctionsRounded />}
            />
        </Menu>
          <Menu
            menuItemStyles={{
              button: {
                ":hover": {
                  color: "#868dfb",
                  background: "transparent",
                  transition: ".4s ease",
                },
              },
            }}  
          >
            <Item
              title="Pipelines"
              path="/pipeline"
              colors={colors}
              icon={<TungstenOutlined  />}
            />
        </Menu>
           <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Projects"
            path="/tenderProjects"
            colors={colors}
            icon={<HelpOutlineOutlined  />}
          />
         
        </Menu>


      
       
        <Typography
          variant="h4"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Management Activities" : " "}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="ManCo"
            path="/mancom"
            colors={colors}
            icon={<PeopleAltOutlined  />}
          />
        </Menu>

           <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="FinCom"
            path="/fincom"
            colors={colors}
            icon={<MoneyOffRounded />}
          />
        </Menu>

        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="ExCo"
            path="/excom"
            colors={colors}
            icon={<Person2Outlined  />}
          />
        </Menu>
        

        

        <Typography
          variant="h4"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Asset Management" : " "}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Assets"
            path="/assets"
            colors={colors}
            icon={<AssessmentTwoTone  />}
          />
          
        </Menu>

         

        <Typography
          variant="h4"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Notifications" : " "}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Notification Wall"
            path="/notifications"
            colors={colors}
            icon={<PeopleAltOutlined  />}
          />
        </Menu>

        <hr />
        <Typography
          variant="h4"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Team Management" : " "}
        </Typography>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="User Accounts"
            path="/userAccounts"
            colors={colors}
            icon={<PeopleAltOutlined  />}
          />
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
