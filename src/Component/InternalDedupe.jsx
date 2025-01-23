// import React, { useEffect, useState } from 'react';
// import { useGetInternalDedupeQuery } from '../Service/Query';
// import { tokens } from '../theme';
// import { useParams } from 'react-router-dom';
// import { DataGrid } from '@mui/x-data-grid';
// import {
//     Accordion,
//     AccordionSummary,
//     AccordionDetails,
//     Typography,
//     Box,
//     Alert,
//     useTheme,
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import CommonTable from './CommonTable';

// const columns = [
//     { field: 'sr', headerName: '#', width: 50 },
//     { field: 'name', headerName: 'Name', width: 200 },
//     { field: 'loanAmount', headerName: 'Loan Amount', width: 150 },
//     { field: 'salary', headerName: 'Salary', width: 100 },
//     { field: 'isApproved', headerName: 'Approved', width: 100 },
//     { field: 'isRejected', headerName: 'Rejected', width: 100 },
// ];

// const InternalDedupe = ({id}) => {
    
//     const [leadHistory, setLeadHistory] = useState([]);
//     const [paginationModel, setPaginationModel] = useState({
//         page: 0,
//         pageSize: 5,
//     });

//     const { data, isSuccess, isError,error } = useGetInternalDedupeQuery(id, { skip: id === null });

//     // Color theme
//     const theme = useTheme();
//     const colors = tokens(theme.palette.mode);

//       const mergeLeadsAndApplications = (leads, applications) => {
//         // Step 1: Create a merged array by checking for matches
//         const mergedLeads = leads.map(lead => {
//           const application = applications.find(app => app.leadDetails._id === lead._id);
          
//           // If matching application exists, merge data
//           if (application) {
//             return {
//               ...application.leadDetails,
//               isApproved: application.isApproved,
//               isRecommended: application.isRecommended,
//               isRejected: application.isRejected,
//               onHold: application.onHold,
//             };
//           }
      
//           return lead;
//         });

//         console.log('merge leads',mergedLeads)
      
//         // Step 2: Add applications without corresponding leads
//         applications.forEach(application => {
//           if (!leads.some(lead => lead._id === application.leadDetails._id)) {
//             mergedLeads.push({
//               ...application.leadDetails,
//               isApproved: application.isApproved,
//               isRecommended: application.isRecommended,
//               isRejected: application.isRejected,
//               onHold: application.onHold,
//             });
//           }
//         });
      
//         return mergedLeads;
//       };
      
      
      
      

//     useEffect(() => {
//         if (isSuccess && data) {
//             const {relatedLeads,relatedApplications} = data
//             let newAppDedupe = []
            
//             if(relatedApplications && relatedApplications.length > 0){
//                 for(let ele of relatedApplications){
//                     newAppDedupe.push(ele.leadDetails)
//                 }
//             }
//             let newDedupe = mergeLeadsAndApplications(relatedLeads, relatedApplications);;


//             setLeadHistory(newDedupe || []);
//         }
//     }, [isSuccess, data]);

//     const handlePageChange = (newPaginationModel) => {
//         setPaginationModel(newPaginationModel);
//     };

//     const rows = leadHistory.map((lead, index) => ({
//         id: lead._id,
//         sr: index + 1,
//         name: `${lead.fName} ${lead.mName || ''} ${lead.lName || ''}`,
//         loanAmount: lead?.loanAmount,
//         salary: lead?.salary,
//         isRejected: !lead?.isRejected ? '' : 'Rejected',
//         isApproved: !lead?.isApproved ? '' : 'Approved',
//     }));

//     return (
//         // <Box>
//             <Accordion
//                 sx={{
//                     maxWidth:'700px', 
//                     background:colors.white[100], 
//                     borderRadius:"25px", 
//                     border:"0px",
//                     margin:"0px auto",
//                     marginTop:"20px"
//                 }}>
//                 <AccordionSummary
//                     expandIcon={<ExpandMoreIcon sx={{color:colors.primary[400]}} />}
//                     aria-controls="internal-dedupe-content"
//                     id="internal-dedupe-header"
//                     sx={{
//                         display:'flex',
//                         justifyContent:'center',
//                         background: colors.white[100],
//                         color: colors.primary[400],
//                         fontWeight: 'bold',
//                         borderTopRightRadius: '15px',
//                         borderBottomLeftRadius: '15px',
//                         boxShadow:`0px 0px 20px rgb(0,0,0,0.2)`,
//                         margin:'0px auto',
//                     }}
//                 >
//                     <Typography variant="h6">Internal Dedupe</Typography>
//                 </AccordionSummary>
//                 <AccordionDetails 
//                     sx={{
//                         borderRadius:"20px 0px 20px 20px",
//                         boxShadow:`0px 0px 10px rgb(0,0,0,0.1)`,
//                     }}
//                 >
//                     <Box>
//                         <CommonTable    
//                             columns={columns}
//                             rows={rows}
//                             rowCount={data?.relatedLeads.length}
//                             paginationModel={paginationModel}
//                             onPageChange={handlePageChange}
//                         />
//                     </Box>

                    
//                     {/* </Box> */}
//                 </AccordionDetails>
//             </Accordion>
//             // {isError &&
//             //     <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
//             //         {error?.data?.message}
//             //     </Alert>
//             // }
//         // {/* </Box> */}
        
//     );
// };

// export default InternalDedupe;


// InternalDedupe.jsx
import React, { useEffect, useState } from 'react';
import { useGetInternalDedupeQuery } from '../Service/Query';
import { tokens } from '../theme';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Alert,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CommonTable from './CommonTable';

const columns = [
  { field: 'sr', headerName: '#', width: 50 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'loanAmount', headerName: 'Loan Amount', width: 150 },
  { field: 'salary', headerName: 'Salary', width: 100 },
  { field: 'isApproved', headerName: 'Approved', width: 100 },
  { field: 'isRejected', headerName: 'Rejected', width: 100 },
];

const mergeLeadsAndApplications = (leads, applications) => {
  const mergedLeads = leads.map((lead) => {
    const application = applications.find((app) => app.leadDetails._id === lead._id);

    if (application) {
      return {
        ...application.leadDetails,
        isApproved: application.isApproved,
        isRecommended: application.isRecommended,
        isRejected: application.isRejected,
        onHold: application.onHold,
      };
    }

    return lead;
  });

  applications.forEach((application) => {
    if (!leads.some((lead) => lead._id === application.leadDetails._id)) {
      mergedLeads.push({
        ...application.leadDetails,
        isApproved: application.isApproved,
        isRecommended: application.isRecommended,
        isRejected: application.isRejected,
        onHold: application.onHold,
      });
    }
  });

  return mergedLeads;
};

const InternalDedupe = ({ id }) => {
  const [leadHistory, setLeadHistory] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const { data, isSuccess, isError, error } = useGetInternalDedupeQuery(id, {
    skip: id === null,
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    if (isSuccess && data) {
      const { relatedLeads, relatedApplications } = data;
      const mergedLeads = mergeLeadsAndApplications(relatedLeads, relatedApplications);
      setLeadHistory(mergedLeads);
    }
  }, [isSuccess, data]);

  const handlePageChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
  };

  const rows = leadHistory.map((lead, index) => ({
    id: lead._id,
    sr: index + 1,
    name: `${lead.fName} ${lead.mName || ''} ${lead.lName || ''}`,
    loanAmount: lead?.loanAmount,
    salary: lead?.salary,
    isRejected: !lead?.isRejected ? '' : 'Rejected',
    isApproved: !lead?.isApproved ? '' : 'Approved',
  }));

  return (
    <Accordion
        variant="outlined"
        sx={{
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            background: colors.white[100],
            borderRadius: '25px',
            border: '0px',
            margin: '0px auto',
            marginTop: '20px',
            '&.Mui-expanded': {
                margin: '20px auto',
                display: 'flex',
                justifyContent: 'center',
            },
        }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: colors.primary[400] }} />}
        aria-controls="internal-dedupe-content"
        id="internal-dedupe-header"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          background: colors.white[100],
          color: colors.primary[400],
          fontWeight: 'bold',
          borderTopRightRadius: '20px',
          borderBottomLeftRadius: '20px',
          boxShadow: `0px 0px 20px rgb(0,0,0,0.2)`,
          margin: '0px auto',
        }}
      >
        <Typography variant="h6">Internal Dedupe</Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          borderRadius: '20px 0px 20px 20px',
          boxShadow: `0px 0px 10px rgb(0,0,0,0.1)`,
        }}
      >
        <Box>
          <CommonTable
            columns={columns}
            rows={rows}
            rowCount={data?.relatedLeads.length}
            paginationModel={paginationModel}
            onPageChange={handlePageChange}
          />
        </Box>
        {isError && (
          <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
            {error?.data?.message}
          </Alert>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default InternalDedupe;