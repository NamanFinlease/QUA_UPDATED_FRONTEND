
import React, { useEffect } from 'react';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { useNavigate } from 'react-router-dom';
// import useAuthStore from './store/authStore';
import Sidebar from '../Navbar/Sidebar';
import Navbar from '../Navbar/Navbar';
import GlobalBox from './GlobalBox';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CancelIcon from '@mui/icons-material/Cancel';
import { tokens } from '../theme';
import useAuthStore from './store/authStore';
import useStore from '../Store';
import Header from "./Header";
import {useGetEmployeesQuery, useGetLeadTotalRecordsQuery , useGetTotalRecordsForSupervisorQuery} from '../Service/Query';
const Dashboard = ({ isSidebarOpen }) => {
  const { login, setEmployeeDetails } = useStore();
  const { empInfo,activeRole } = useAuthStore();
  const navigate = useNavigate(); // React Router hook for navigation
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { data: employeeDetails, isSuccess: empDetailsSuccess, refetch } = useGetEmployeesQuery();
  const { data}  = useGetLeadTotalRecordsQuery();
  const { data: supData, isSuccess: supSuccess } = useGetTotalRecordsForSupervisorQuery();

  console.log("The active log is ",activeRole);
  if( activeRole === 'supervisor'){
    const  data = useGetTotalRecordsForSupervisorQuery();
    console.log("The data is ",data)
    if( data.isSuccess){

    }
  }
   // Define Employee roles with icons and paths
   const Employee = {
    admin: {
      leadNew: {
        icon: <NewReleasesIcon className='mt-3'
        sx={{ color: '#4caf50', width:'100%', height:'30%' }} />, // Green color
        path: "/lead-new",
        title: 'New Leads',
        no : 10
      },
      leadProcess: {
        icon: <PlayArrowIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/lead-process",
        title: 'Leads In Process',
        no : 10
      },
      leadHold: {
        icon: <PauseIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/lead-hold",
        title: 'Leads Held',
        no : 10
      },
      leadRejected: {
        icon: <CancelIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/rejected-leads",
        title: 'Leads Rejected',
        no : 10
      },
      newApplication: {
        icon: <NewReleasesIcon className='mt-3'
        sx={{ color: '#4caf50', width:'100%', height:'30%' }} />, // Green color
        path: "/new-applications",
        title: 'New Applications',
        no : 10
      },
      applicationProcess: {
        icon: <PlayArrowIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/application-process",
        title: 'Applications In Process',
        no : 10
      },
      applicationHold: {
        icon: <PauseIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/applications-held",
        title: 'Applications Held',
        no : 10
      },
      applicationRejected: {
        icon: <CancelIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/rejected-applications",
        title: 'Applications Rejected',
        no : 10
      },
    },
    screener: {
      leadNew: {
        icon: <NewReleasesIcon className='mt-3'
        sx={{ color: '#4caf50', width:'100%', height:'30%' }} />, // Green color
        path: "/lead-new",
        title: 'New Leads',
        no : data?.leads?.newLeads || 0
      },
      leadProcess: {
        icon: <PlayArrowIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/lead-process",
        title: 'Leads In Process',
        no : data?.leads?.
        allocatedLeads || 0
      },
      leadHold: {
        icon: <PauseIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/lead-hold",
        title: 'Leads Held',
        no : data?.leads?.heldLeads || 0
      },
      leadRejected: {
        icon: <CancelIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/rejected-leads",
        title: 'Leads Rejected',
        no : data?.leads?.
        rejectedLeads || 0
      },
    },
    creditManager: {
      newApplication: {
        icon: <NewReleasesIcon className='mt-3'
        sx={{ color: '#4caf50', width:'100%', height:'30%' }} />, // Green color
        path: "/new-applications",
        title: 'New Applications',
        no : data?.applications?.newApplications || 0

      },
      applicationProcess: {
        icon: <PlayArrowIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/application-process",
        title: 'Applications In Process',
        no : data?.applications?.allocatedApplications || 0
      },
      applicationHold: {
        icon: <PauseIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/applications-held",
        title: 'Applications Held',
        no : data?.applications?.
        heldApplications || 0
      },
      applicationRejected: {
        icon: <CancelIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/rejected-applications",
        title: 'Applications Rejected',
        no : data?.applications?.rejectedApplications || 0
      },
    },
    sanctionHead: {
      leadNew: {
        icon: <NewReleasesIcon className='mt-3'
        sx={{ color: '#4caf50', width:'100%', height:'30%' }} />, // Green color
        path: "/lead-new",
        title: 'New Leads',
        no : data?.leads?.newLeads || 0
      },
      leadProcess: {
        icon: <PlayArrowIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/lead-process",
        title: 'Leads In Process',
        no : data?.leads?.
        allocatedLeads || 0
      },
      leadHold: {
        icon: <PauseIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/lead-hold",
        title: 'Leads Held',
        no : data?.leads?.heldLeads  || 0
      },
      leadRejected: {
        icon: <CancelIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/rejected-leads",
        title: 'Leads Rejected',
        no : data?.leads?.
        rejectedLeads || 0
      },
      newApplication: {
        icon: <NewReleasesIcon className='mt-3'
        sx={{ color: '#4caf50', width:'100%', height:'30%' }} />, // Green color
        path: "/new-applications",
        title: 'New Applications',
        no : data?.applications?.newApplications || 0

      },
      applicationProcess: {
        icon: <PlayArrowIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/application-process",
        title: 'Applications In Process',
        no : data?.applications?.allocatedApplications || 0
      },
      applicationHold: {
        icon: <PauseIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/applications-held",
        title: 'Applications Held',
        no : data?.applications?.
        heldApplications || 0
      },
      applicationRejected: {
        icon: <CancelIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/rejected-applications",
        title: 'Applications Rejected',
        no : data?.applications?.rejectedApplications || 0
      },
      sanctionPending: {
        icon: <NewReleasesIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/pending-sanctions",
        title: 'Pending Sanction',
        no : data?.sanction?.newSanctions || 0
      },
      sanctioned: {
        icon: <NewReleasesIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/sanctioned",
        title: 'Sanctioned',
        no : data?.sanction?.sanctioned || 0
      },
    },
    disbursalManager: {
      leadNew: {
        icon: <NewReleasesIcon className='mt-3'
        sx={{ color: '#4caf50', width:'100%', height:'30%' }} />, // Green color
        path: "/disbursal-new",
        title: 'New ',
        no : data?.disbursal?.newDisbursals || 0
      },
      leadProcess: {
        icon: <PlayArrowIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/disbursal-process",
        title: 'Processing',
        no : data?.disbursal?.allocatedDisbursals || 0
      },
    
     
    },
    disbursalHead: {
      newDisbursal: {
        icon: <NewReleasesIcon className='mt-3'
        sx={{ color: '#4caf50', width:'100%', height:'30%' }} />, // Green color
        path: "/disbursal-new",
        title: 'New Disburse ',
        no : data?.disbursal?.newDisbursals || 0
      },
      disbursalProcess: {
        icon: <PlayArrowIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/disbursal-process",
        title: 'Disburse Processing',
        no : data?.disbursal?.allocatedDisbursals || 0
      },
      disbursePending: {
        icon: <NewReleasesIcon className='mt-3'
        sx={{ color: '#4caf50', width:'100%', height:'30%' }} />, // Green color
        path: "/disbursal-pending",
        title: 'Disbursal Pending',
        no : data?.disbursal?.pendingDisbursals || 0
      },
      disbursed: {
        icon: <PlayArrowIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
        path: "/disbursed",
        title: 'Disbursed',
        no : data?.disbursal?.disbursed || 0
      },
    
     
    },
   
    supervisor :{
      
        leadNew: {
          icon: <NewReleasesIcon className='mt-3'
          sx={{ color: '#4caf50', width:'100%', height:'30%' }} />, // Green color
          path: "/lead-new",
          title: 'Todays Leads',
          no : supData?.leadsGeneratedToday
        },
        leadProcess: {
          icon: <PlayArrowIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
          path: "/lead-process",
          title: 'Leads Process',
          no : supData?.inProcessTodayCount
        },
        leadHold: {
          icon: <PauseIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
          path: "/lead-hold",
          title: 'Leads Sanctioned',
          no : supData?.sanctionedTodayCount
        },
        leadRejected: {
          icon: <CancelIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
          path: "/rejected-leads",
          title: 'Leads Rejected',
          no : 10
        },
      },

      accountExecutive : {
      
        leadNew: {
          icon: <NewReleasesIcon className='mt-3'
          sx={{ color: '#4caf50', width:'100%', height:'30%' }} />, // Green color
          path: "/pending-verification",
          title: 'Pending verification',
          no : supData?.leadsGeneratedToday
        },
        leadProcess: {
          icon: <PlayArrowIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
          path: "/close-leads",
          title: 'Closed Leads ',
          no : supData?.inProcessTodayCount
        },
        leadRejected: {
          
          icon: <CancelIcon className='mt-3' sx={{ color: '#4caf50', width:'100%', height:'30%' }} />,
          path: "/rejected-leads",
          title: 'Leads Rejected',
          no : 10
        },
      }
    
  };

  // Fetch and set employee details on component load
  useEffect(() => {
    if (empDetailsSuccess) {
      setEmployeeDetails(employeeDetails);
    }
  }, [employeeDetails]);

  // Refetch employee data when login state changes
  useEffect(() => {
    refetch();
  }, [login]);

  // Function to handle GlobalBox click and navigate
  const handleNavigation = (path) => {
    navigate(path); // Navigate to the desired path
  };

  // Dynamically generate GlobalBox components for the employee's role
  const renderRoleBoxes = () => {
    const role = activeRole; // Get role from auth store
    if (!role || !Employee[role]) return null;

    return Object.entries(Employee[role]).map(([key, value], index) => (
      <Box
        key={index}
        gridColumn="span 3"
        backgroundColor={colors.primary[400]}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={() => handleNavigation(value.path)} // Navigate on click
        sx={{ cursor: 'pointer', borderRadius: '5px' }} // Add pointer cursor on hover
      >
        <GlobalBox
        
          title={value.title} // Display key as title
          subtitle={key} // Or a more appropriate subtitle
          icon={value.icon} // Set dynamic icon
          increase={value
            .no
          }
        />
      </Box>
    ));
  };

  return (
    <div>
      {/* <Navbar />
      <Sidebar /> */}
      <Box m="70px">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
          <Box>
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <DownloadOutlinedIcon sx={{ mr: "10px" }} />
              Download Reports
            </Button>
          </Box>
        </Box>

        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          {renderRoleBoxes()} {/* Render boxes based on role */}
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
