import React, { useEffect, useState } from 'react';
import { Box, Button, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CancelIcon from '@mui/icons-material/Cancel';
import { tokens } from '../theme';
import useAuthStore from './store/authStore';
import useStore from '../Store';
import Header from "./Header";
import GlobalBox from './GlobalBox';
import Swal from 'sweetalert2';
import { useGetEmployeesQuery, useGetLeadTotalRecordsQuery, useGetTotalRecordsForSupervisorQuery } from '../Service/Query';

const Dashboard = () => {
  const { login, setEmployeeDetails } = useStore();
  const { empInfo, activeRole } = useAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [toastShown, setToastShown] = useState(false);
    

  // Media Queries for responsive design
  const isDesktop = useMediaQuery('(max-width:1024px)');
  const isTablet = useMediaQuery('(max-width:768px)');
  const isMobile = useMediaQuery('(max-width:450px)');

  const { data: employeeDetails, isSuccess: empDetailsSuccess, refetch } = useGetEmployeesQuery();
  const { data } = useGetLeadTotalRecordsQuery();
  const { data: supData } = useGetTotalRecordsForSupervisorQuery();

  console.log(data)

  // Toast configuration
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  // Show toast notification on successful login
  // useEffect(() => {
  //   let login = true
  //   if (login && !toastShown) {
  //     Toast.fire({
  //       icon: "success",
  //       color: colors.primary[500],
  //       title: "Logged in Successfully!!!"

  //     });
  //     setToastShown(true); // Set the state to true after showing the toast
  //   }
  // }, [login, toastShown]);


  console.log("The active log is",activeRole);
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
      sx={{ color: colors.primary[400], width:'100%' }} />,
      path: "/lead-new",
      title: 'New Leads',
      no : data?.leads?.newLeads || 0,
    },
    leadProcess: {
      icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/lead-process",
      title: 'Leads In Process',
      no : data?.leads?.allocatedLeads || 0
    },
    leadHold: {
      icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/lead-hold",
      title: 'Leads Held',
      no : data?.leads?.heldLeads || 0
    },
    leadRejected: {
      icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/rejected-leads",
      title: 'Leads Rejected',
      no : data?.leads?.rejectedLeads || 0
    },
    newApplication: {
      icon: <NewReleasesIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/new-applications",
      title: 'New Applications',
      no : data?.applications?.newApplications || 0
    },
    applicationProcess: {
      icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/application-process",
      title: 'Applications In Process',
      no : data?.applications?.allocatedApplications || 0
    },
    applicationHold: {
      icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/applications-held",
      title: 'Applications Held',
      no : data?.applications?.heldApplications || 0
    },
    applicationRejected: {
      icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/rejected-applications",
      title: 'Applications Rejected',
      no : data?.applications?.rejectedApplications || 0
    },
  },
  screener: {
    leadNew: {
      icon: <NewReleasesIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/lead-new",
      title: 'New Leads',
      no : data?.leads?.newLeads || 0
    },
    leadProcess: {
      icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/lead-process",
      title: 'Leads In Process',
      no : data?.leads?.
      allocatedLeads || 0
    },
    leadHold: {
      icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/lead-hold",
      title: 'Leads Held',
      no : data?.leads?.heldLeads || 0
    },
    leadRejected: {
      icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/rejected-leads",
      title: 'Leads Rejected',
      no : data?.leads?.
      rejectedLeads || 0
    },
  },
  creditManager: {
    newApplication: {
      icon: <NewReleasesIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%',  }} />,
      path: "/new-applications",
      title: 'New Applications',
      no : data?.applications?.newApplications || 0

    },
    applicationProcess: {
      icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/application-process",
      title: 'Applications In Process',
      no : data?.applications?.allocatedApplications || 0
    },
    applicationHold: {
      icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%',  }} />,
      path: "/applications-held",
      title: 'Applications Held',
      no : data?.applications?.
      heldApplications || 0
    },
    applicationRejected: {
      icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%',  }} />,
      path: "/rejected-applications",
      title: 'Applications Rejected',
      no : data?.applications?.rejectedApplications || 0
    },
  },
  sanctionHead: {
    leadNew: {
      icon: <NewReleasesIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%',  }} />,
      path: "/lead-new",
      title: 'New Leads',
      no : data?.leads?.newLeads || 0
    },
    leadProcess: {
      icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/lead-process",
      title: 'Leads In Process',
      no : data?.leads?.
      allocatedLeads || 0
    },
    leadHold: {
      icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%',  }} />,
      path: "/lead-hold",
      title: 'Leads Held',
      no : data?.leads?.heldLeads  || 0
    },
    leadRejected: {
      icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%',  }} />,
      path: "/rejected-leads",
      title: 'Leads Rejected',
      no : data?.leads?.
      rejectedLeads || 0
    },
    newApplication: {
      icon: <NewReleasesIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/new-applications",
      title: 'New Applications',
      no : data?.applications?.newApplications || 0

    },
    applicationProcess: {
      icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/application-process",
      title: 'Applications In Process',
      no : data?.applications?.allocatedApplications || 0
    },
    applicationHold: {
      icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/applications-held",
      title: 'Applications Held',
      no : data?.applications?.
      heldApplications || 0
    },
    applicationRejected: {
      icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/rejected-applications",
      title: 'Applications Rejected',
      no : data?.applications?.rejectedApplications || 0
    },
    sanctionPending: {
      icon: <NewReleasesIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/pending-sanctions",
      title: 'Pending Sanction',
      no : data?.sanction?.newSanctions || 0
    },
    sanctioned: {
      icon: <NewReleasesIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/sanctioned",
      title: 'Sanctioned',
      no : data?.sanction?.sanctioned || 0
    },
  },
  disbursalManager: {
    newDisbursal: {
      icon: <NewReleasesIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/disbursal-new",
      title: 'New ',
      no : data?.disbursal?.newDisbursals || 0
    },
    disbursalProcess: {
      icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/disbursal-process",
      title: 'Disbursal In Process',
      no : data?.disbursal?.allocatedDisbursals || 0
    },
    disbursalHold: {
      icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/disbursal-hold",
      title: 'Hold Disbursals',
      no : data?.disbursal?.HoldDisbursals || 0
    },
    disbursalRejected: {
      icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/rejected-disbursals",
      title: 'Rejected Disbursals',
      no : data?.disbursal?.rejectedDisbursals || 0
    },
  
    
  },
  disbursalHead: {
    newDisbursal: {
      icon: <NewReleasesIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/disbursal-new",
      title: 'New Disburse ',
      no : data?.disbursal?.newDisbursals || 0
    },
    disbursalProcess: {
      icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/disbursal-process",
      title: 'Disburse Processing',
      no : data?.disbursal?.allocatedDisbursals || 0
    },
    disbursePending: {
      icon: <NewReleasesIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/disbursal-pending",
      title: 'Disbursal Pending',
      no : data?.disbursal?.pendingDisbursals || 0
    },
    disbursed: {
      icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/disbursed",
      title: 'Disbursed',
      no : data?.disbursal?.disbursed || 0
    },
  
    
  },
  collectionExecutive: {
    activeLeads: {
      icon: <NewReleasesIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/activeLeads",
      title: 'Active Leads ',
      no : data?.collection?.activeLeads || 0
    },
    allocatedLeads: {
      icon: <CheckCircleIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/allocatedCollectionLeads",
      title: 'Allocated Leads',
      no : data?.collection?.allocatedLeads || 0
    },
    activePreCollectionLeads: {
      icon: <NewReleasesIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/preCollectionActiveLeads",
      title: 'Active Precollection Leads ',
      no : data?.collection?.activePreCollectionLeads || 0
    },
    allocatedPreCollectionLeads: {
      icon: <CheckCircleIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/allocatedPreCollectionLeads",
      title: 'Allocated Precollection Leads',
      no : data?.collection?.allocatedPreCollectionLeads || 0
    },
    pendingVerification: {
      icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/pending-verification",
      title: 'Verification Pending',
      no : 0
    },
    closedLeads: {
      icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/closed-leads",
      title: 'Closed Leads',
      no : 0
    },
  },
  collectionHead: {
    activeLeads: {
      icon: <NewReleasesIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/activeLeads",
      title: 'Active Leads ',
      no : data?.collection?.activeLeads || 0
    },
    allocatedLeads: {
      icon: <CheckCircleIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/allocatedCollectionLeads",
      title: 'Allocated Leads',
      no : data?.collection?.allocatedLeads || 0
    },
    activePreCollectionLeads: {
      icon: <NewReleasesIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/preCollectionActiveLeads",
      title: 'Active Precollection Leads ',
      no : data?.collection?.activePreCollectionLeads || 0
    },
    allocatedPreCollectionLeads: {
      icon: <CheckCircleIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/allocatedPreCollectionLeads",
      title: 'Allocated Precollection Leads',
      no : data?.collection?.allocatedPreCollectionLeads || 0
    },
    pendingVerification: {
      icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/pending-verification",
      title: 'Verification Pending',
      no : 0
    },
    closedLeads: {
      icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/closed-leads",
      title: 'Closed Leads',
      no : 0
    },
  },
  
  supervisor :{
    
      leadNew: {
        icon: <NewReleasesIcon className='mt-3'
        sx={{ color: colors.primary[400], width:'100%',}} />,
        path: "/lead-new",
        title: 'Todays Leads',
        no : supData?.leadsGeneratedToday
      },
      leadProcess: {
        icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
        path: "/lead-process",
        title: 'Leads Process',
        no : supData?.inProcessTodayCount
      },
      leadHold: {
        icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
        path: "/lead-hold",
        title: 'Leads Sanctioned',
        no : supData?.sanctionedTodayCount
      },
      leadRejected: {
        icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
        path: "/rejected-leads",
        title: 'Leads Rejected',
        no : data?.leads?.rejectedleads || 0
      },
    },

    accountExecutive : {
    
      leadNew: {
        icon: <NewReleasesIcon className='mt-3'
        sx={{ color: colors.primary[400], width:'100%', }} />,
        path: "/pending-verification",
        title: 'Pending verification',
        no : supData?.leadsGeneratedToday
      },
      leadProcess: {
        icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
        path: "/closed-leads",
        title: 'Closed Leads ',
        no : supData?.inProcessTodayCount
      },
      leadRejected: {
        
        icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
        path: "/rejected-leads",
        title: 'Leads Rejected',
        no : data?.leads?.rejectedleads || 0
      },
    }
  
};

  useEffect(() => {
    if (empDetailsSuccess) {
      setEmployeeDetails(employeeDetails);
    }
  }, [employeeDetails]);

  useEffect(() => {
    refetch();
  }, [login]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const renderRoleBoxes = () => {
    const role = activeRole; // Get role from auth store
    if (!role || !Employee[role]) return null;

    return Object.entries(Employee[role]).map(([key, value], index) => (
      <Box
        key={index}
        gridColumn={isMobile ? "span 12" : isTablet ? "span 6" : "span 3"}
        backgroundColor={colors.white[100]}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={() => handleNavigation(value.path)}
        sx={{
          cursor: 'pointer',
          borderRadius: '0px 25px',
          boxShadow: `0px 0px 5px ${colors.primary[400]}`,
          minWidth: '200px',
        }}
      >
        <GlobalBox
          title={value.title}
          subtitle={key}
          icon={value.icon}
          increase={value.no}
        />
      </Box>
    ));
  };

  return (
    <div>
      <Box m={isMobile ? "20px" : "10px 20px"}>
        <Box display="flex" flexDirection={isMobile ? "column" : "row"} justifyContent="space-between" alignItems="center">
          <Header width="60%" sx={{margin:"0px 20px"}} title="DASHBOARD" subtitle="Welcome to your dashboard" />
          <Box mt={isMobile ? "20px" : "0"} mb={isMobile ? "20px" : "0"}>
            <Button
              sx={{
                background: colors.primary[400],
                color: colors.white[100],
                borderRadius: "0px 15px",
                boxShadow: `0px 0px 10px ${colors.primary[400]}`,
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: "bold",
                padding: isMobile ? "8px 16px" : "10px 20px",
                margin: isMobile ? "8px 20px" : "10px 20px",
                border: `1px solid ${colors.primary[400]}`,
                "&:hover": {
                  background: colors.white[100],
                  color: colors.primary[400],
                  transform: "scale(1.01)",
                },
              }}
            >
              <DownloadOutlinedIcon sx={{ mr: "10px" }} />
              Download Reports
            </Button>
          </Box>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={isMobile ? "repeat(auto-fill, 17px)" : isTablet ? "repeat(auto-fill, 30px)" : "repeat(auto-fill, 80px)"}
          gridAutoRows="140px"
          gap="20px"
        >
          {renderRoleBoxes()}
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
