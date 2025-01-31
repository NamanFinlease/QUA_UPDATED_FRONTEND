// import React, { useEffect } from 'react';
// import { Box, Button, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
// import { useNavigate } from 'react-router-dom';
// // import useAuthStore from './store/authStore';
// import Sidebar from '../Navbar/Sidebar';
// import Navbar from '../Navbar/Navbar';
// import GlobalBox from './GlobalBox';
// import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
// import NewReleasesIcon from '@mui/icons-material/NewReleases';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import PauseIcon from '@mui/icons-material/Pause';
// import CancelIcon from '@mui/icons-material/Cancel';
// import { tokens } from '../theme';
// import useAuthStore from './store/authStore';
// import useStore from '../Store';
// import Header from "./Header";
// import {useGetEmployeesQuery, useGetLeadTotalRecordsQuery , useGetTotalRecordsForSupervisorQuery} from '../Service/Query';
// const Dashboard = ({ isSidebarOpen }) => {
//   const { login, setEmployeeDetails } = useStore();
//   const { empInfo,activeRole } = useAuthStore();
//   const navigate = useNavigate(); // React Router hook for navigation
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const { data: employeeDetails, isSuccess: empDetailsSuccess, refetch } = useGetEmployeesQuery();
//   const { data}  = useGetLeadTotalRecordsQuery();
//   const { data: supData, isSuccess: supSuccess } = useGetTotalRecordsForSupervisorQuery();
//   // const isDesktopScreen = useMediaQuery('(max-width:1440px)');
//   // const isLaptopScreen = useMediaQuery('(max-width:1024px)');
//   // const isTabletScreen = useMediaQuery('(max-width:768px)');
//   // const isMobileScreen = useMediaQuery('(max-width:480px)');

  // console.log("The active log is ",activeRole);
  // if( activeRole === 'supervisor'){
  //   const  data = useGetTotalRecordsForSupervisorQuery();
  //   console.log("The data is ",data)
  //   if( data.isSuccess){

  //   }
  // }
  //  // Define Employee roles with icons and paths
  //  const Employee = {
  //   admin: {
  //     leadNew: {
  //       icon: <NewReleasesIcon className='mt-3'
  //       sx={{ color: colors.primary[400], width:'100%' }} />, // Green color
  //       path: "/lead-new",
  //       title: 'New Leads',
  //       no : data?.leads?.newLeads || 0,
  //     },
  //     leadProcess: {
  //       icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/lead-process",
  //       title: 'Leads In Process',
  //       no : 10
  //     },
  //     leadHold: {
  //       icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/lead-hold",
  //       title: 'Leads Held',
  //       no : 10
  //     },
  //     leadRejected: {
  //       icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/rejected-leads",
  //       title: 'Leads Rejected',
  //       no : 10
  //     },
  //     newApplication: {
  //       icon: <NewReleasesIcon className='mt-3'
  //       sx={{ color: colors.primary[400], width:'100%', }} />, // Green color
  //       path: "/new-applications",
  //       title: 'New Applications',
  //       no : 10
  //     },
  //     applicationProcess: {
  //       icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/application-process",
  //       title: 'Applications In Process',
  //       no : 10
  //     },
  //     applicationHold: {
  //       icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/applications-held",
  //       title: 'Applications Held',
  //       no : 10
  //     },
  //     applicationRejected: {
  //       icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/rejected-applications",
  //       title: 'Applications Rejected',
  //       no : 10
  //     },
  //   },
  //   screener: {
  //     leadNew: {
  //       icon: <NewReleasesIcon className='mt-3'
  //       sx={{ color: colors.primary[400], width:'100%', }} />, // Green color
  //       path: "/lead-new",
  //       title: 'New Leads',
  //       no : data?.leads?.newLeads || 0
  //     },
  //     leadProcess: {
  //       icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/lead-process",
  //       title: 'Leads In Process',
  //       no : data?.leads?.
  //       allocatedLeads || 0
  //     },
  //     leadHold: {
  //       icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/lead-hold",
  //       title: 'Leads Held',
  //       no : data?.leads?.heldLeads || 0
  //     },
  //     leadRejected: {
  //       icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/rejected-leads",
  //       title: 'Leads Rejected',
  //       no : data?.leads?.
  //       rejectedLeads || 0
  //     },
  //   },
  //   creditManager: {
  //     newApplication: {
  //       icon: <NewReleasesIcon className='mt-3'
  //       sx={{ color: colors.primary[400], width:'100%',  }} />, // Green color
  //       path: "/new-applications",
  //       title: 'New Applications',
  //       no : data?.applications?.newApplications || 0

  //     },
  //     applicationProcess: {
  //       icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/application-process",
  //       title: 'Applications In Process',
  //       no : data?.applications?.allocatedApplications || 0
  //     },
  //     applicationHold: {
  //       icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%',  }} />,
  //       path: "/applications-held",
  //       title: 'Applications Held',
  //       no : data?.applications?.
  //       heldApplications || 0
  //     },
  //     applicationRejected: {
  //       icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%',  }} />,
  //       path: "/rejected-applications",
  //       title: 'Applications Rejected',
  //       no : data?.applications?.rejectedApplications || 0
  //     },
  //   },
  //   sanctionHead: {
  //     leadNew: {
  //       icon: <NewReleasesIcon className='mt-3'
  //       sx={{ color: colors.primary[400], width:'100%',  }} />, // Green color
  //       path: "/lead-new",
  //       title: 'New Leads',
  //       no : data?.leads?.newLeads || 0
  //     },
  //     leadProcess: {
  //       icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/lead-process",
  //       title: 'Leads In Process',
  //       no : data?.leads?.
  //       allocatedLeads || 0
  //     },
  //     leadHold: {
  //       icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%',  }} />,
  //       path: "/lead-hold",
  //       title: 'Leads Held',
  //       no : data?.leads?.heldLeads  || 0
  //     },
  //     leadRejected: {
  //       icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%',  }} />,
  //       path: "/rejected-leads",
  //       title: 'Leads Rejected',
  //       no : data?.leads?.
  //       rejectedLeads || 0
  //     },
  //     newApplication: {
  //       icon: <NewReleasesIcon className='mt-3'
  //       sx={{ color: colors.primary[400], width:'100%', }} />, // Green color
  //       path: "/new-applications",
  //       title: 'New Applications',
  //       no : data?.applications?.newApplications || 0

  //     },
  //     applicationProcess: {
  //       icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/application-process",
  //       title: 'Applications In Process',
  //       no : data?.applications?.allocatedApplications || 0
  //     },
  //     applicationHold: {
  //       icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/applications-held",
  //       title: 'Applications Held',
  //       no : data?.applications?.
  //       heldApplications || 0
  //     },
  //     applicationRejected: {
  //       icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/rejected-applications",
  //       title: 'Applications Rejected',
  //       no : data?.applications?.rejectedApplications || 0
  //     },
  //     sanctionPending: {
  //       icon: <NewReleasesIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/pending-sanctions",
  //       title: 'Pending Sanction',
  //       no : data?.sanction?.newSanctions || 0
  //     },
  //     sanctioned: {
  //       icon: <NewReleasesIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/sanctioned",
  //       title: 'Sanctioned',
  //       no : data?.sanction?.sanctioned || 0
  //     },
  //   },
  //   disbursalManager: {
  //     leadNew: {
  //       icon: <NewReleasesIcon className='mt-3'
  //       sx={{ color: colors.primary[400], width:'100%', }} />, // Green color
  //       path: "/disbursal-new",
  //       title: 'New ',
  //       no : data?.disbursal?.newDisbursals || 0
  //     },
  //     leadProcess: {
  //       icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/disbursal-process",
  //       title: 'Processing',
  //       no : data?.disbursal?.allocatedDisbursals || 0
  //     },
    
     
  //   },
  //   disbursalHead: {
  //     newDisbursal: {
  //       icon: <NewReleasesIcon className='mt-3'
  //       sx={{ color: colors.primary[400], width:'100%', }} />, // Green color
  //       path: "/disbursal-new",
  //       title: 'New Disburse ',
  //       no : data?.disbursal?.newDisbursals || 0
  //     },
  //     disbursalProcess: {
  //       icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/disbursal-process",
  //       title: 'Disburse Processing',
  //       no : data?.disbursal?.allocatedDisbursals || 0
  //     },
  //     disbursePending: {
  //       icon: <NewReleasesIcon className='mt-3'
  //       sx={{ color: colors.primary[400], width:'100%', }} />, // Green color
  //       path: "/disbursal-pending",
  //       title: 'Disbursal Pending',
  //       no : data?.disbursal?.pendingDisbursals || 0
  //     },
  //     disbursed: {
  //       icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //       path: "/disbursed",
  //       title: 'Disbursed',
  //       no : data?.disbursal?.disbursed || 0
  //     },
    
     
  //   },
   
  //   supervisor :{
      
  //       leadNew: {
  //         icon: <NewReleasesIcon className='mt-3'
  //         sx={{ color: colors.primary[400], width:'100%',}} />, // Green color
  //         path: "/lead-new",
  //         title: 'Todays Leads',
  //         no : supData?.leadsGeneratedToday
  //       },
  //       leadProcess: {
  //         icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //         path: "/lead-process",
  //         title: 'Leads Process',
  //         no : supData?.inProcessTodayCount
  //       },
  //       leadHold: {
  //         icon: <PauseIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //         path: "/lead-hold",
  //         title: 'Leads Sanctioned',
  //         no : supData?.sanctionedTodayCount
  //       },
  //       leadRejected: {
  //         icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //         path: "/rejected-leads",
  //         title: 'Leads Rejected',
  //         no : 10
  //       },
  //     },

  //     accountExecutive : {
      
  //       leadNew: {
  //         icon: <NewReleasesIcon className='mt-3'
  //         sx={{ color: colors.primary[400], width:'100%', }} />, // Green color
  //         path: "/pending-verification",
  //         title: 'Pending verification',
  //         no : supData?.leadsGeneratedToday
  //       },
  //       leadProcess: {
  //         icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //         path: "/close-leads",
  //         title: 'Closed Leads ',
  //         no : supData?.inProcessTodayCount
  //       },
  //       leadRejected: {
          
  //         icon: <CancelIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
  //         path: "/rejected-leads",
  //         title: 'Leads Rejected',
  //         no : 10
  //       },
  //     }
    
  // };

//   // Fetch and set employee details on component load
//   useEffect(() => {
//     if (empDetailsSuccess) {
//       setEmployeeDetails(employeeDetails);
//     }
//   }, [employeeDetails]);

//   // Refetch employee data when login state changes
//   useEffect(() => {
//     refetch();
//   }, [login]);

//   // Function to handle GlobalBox click and navigate
//   const handleNavigation = (path) => {
//     navigate(path); // Navigate to the desired path
//   };

//   // Dynamically generate GlobalBox components for the employee's role
//   const renderRoleBoxes = () => {
//     const role = activeRole; // Get role from auth store
//     if (!role || !Employee[role]) return null;

//     return Object.entries(Employee[role]).map(([key, value], index) => (
//       <Box
//         key={index}
//         gridColumn="span 3"
//         backgroundColor={colors.white[100]}
//         display="flex"
//         minWidth="200px"
//         alignItems="center"
//         justifyContent="center"
//         onClick={() => handleNavigation(value.path)} // Navigate on click
//         sx={{ 
//           cursor: 'pointer', 
//           borderTopRightRadius: '25px',
//           borderBottomLeftRadius: '25px',
//           boxShadow: `0px 0px 5px ${colors.primary[400]}`,
//           border:`0px solid ${colors.white[100]}`,
//           fontSize:"12px",
//         }} // Add pointer cursor on hover
//       >
//         <GlobalBox
        
//           title={value.title} // Display key as title
//           subtitle={key} // Or a more appropriate subtitle
//           icon={value.icon} // Set dynamic icon
//           increase={value
//             .no
//           }
//         />
//       </Box>
//     ));
//   };

//   return (
//     <div>
//       {/* <Navbar />
//       <Sidebar /> */}
//       <Box m="50px">
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Header width="60%" title="DASHBOARD" subtitle="Welcome to your dashboard" />
//           <Box>
//             <Button
//               sx={{
//                 background: colors.primary[400],
//                 color: colors.white[100],
//                 borderRadius:"0px 15px",
//                 boxShadow:`0px 0px 10px ${colors.primary[400]}`,
//                 fontSize: "14px",
//                 fontWeight: "bold",
//                 padding: "10px 20px",
//                 margin:"0px 20px",
//                 border:`1px solid ${colors.primary[400]}`,
//                 "&:hover":{
//                   background:colors.white[100],
//                   color:colors.primary[400],
//                   transform:"scale(1.01)",
//                 }
//               }}
//             >
//               <DownloadOutlinedIcon sx={{ mr: "10px" }} />
//               Download Reports
//             </Button>
//           </Box>
//         </Box>

//         {/* GRID & CHARTS */}
//         <Box
//           display="grid"
//           gridTemplateColumns="repeat(12, 1fr)"
//           gridAutoRows="140px"
//           gap="20px"
//         >
//           {renderRoleBoxes()} {/* Render boxes based on role */}
//         </Box>
//       </Box>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState } from 'react';
import { Box, Button, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CancelIcon from '@mui/icons-material/Cancel';
import { tokens } from '../theme';
import useAuthStore from './store/authStore';
import useStore from '../Store';
import Header from "./Header";
import GlobalBox from './GlobalBox';
// import Responsive from '../utils/Responsive';
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
  useEffect(() => {
    let login = true
    if (login && !toastShown) {
      Toast.fire({
        icon: "success",
        color: colors.primary[500],
        title: "Logged in Successfully!!!"

      });
      setToastShown(true); // Set the state to true after showing the toast
    }
  }, [login, toastShown]);


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
    leadNew: {
      icon: <NewReleasesIcon className='mt-3'
      sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/disbursal-new",
      title: 'New ',
      no : data?.disbursal?.newDisbursals || 0
    },
    leadProcess: {
      icon: <PlayArrowIcon className='mt-3' sx={{ color: colors.primary[400], width:'100%', }} />,
      path: "/disbursal-process",
      title: 'Processing',
      no : data?.disbursal?.allocatedDisbursals || 0
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
        path: "/close-leads",
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
