import React, { useEffect, useState } from 'react';
import { useGetInternalDedupeQuery } from '../Service/Query';
import { useParams } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const columns = [
    { field: 'sr', headerName: '#', width: 50 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'loanAmount', headerName: 'Loan Amount', width: 150 },
    { field: 'salary', headerName: 'Salary', width: 100 },
    { field: 'isApproved', headerName: 'Approved', width: 100 },
    { field: 'isRejected', headerName: 'Rejected', width: 100 },
];

const InternalDedupe = ({id}) => {
    
    const [leadHistory, setLeadHistory] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const { data, isSuccess, isError,error } = useGetInternalDedupeQuery(id, { skip: id === null });

      
      const mergeLeadsAndApplications = (leads, applications) => {
        // Step 1: Create a merged array by checking for matches
        const mergedLeads = leads.map(lead => {
          const application = applications.find(app => app.leadDetails._id === lead._id);
          
          // If matching application exists, merge data
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

        console.log('merge leads',mergedLeads)
      
        // Step 2: Add applications without corresponding leads
        applications.forEach(application => {
          if (!leads.some(lead => lead._id === application.leadDetails._id)) {
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
      
      
      
      

    useEffect(() => {
        if (isSuccess && data) {
            const {relatedLeads,relatedApplications} = data
            let newAppDedupe = []
            
            if(relatedApplications && relatedApplications.length > 0){
                for(let ele of relatedApplications){
                    newAppDedupe.push(ele.leadDetails)
                }
            }
            let newDedupe = mergeLeadsAndApplications(relatedLeads, relatedApplications);;


            setLeadHistory(newDedupe || []);
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
        <Box sx={{ maxWidth: '700px', margin: '0 auto', mt: 3, borderRadius: '15px' }}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="internal-dedupe-content"
                    id="internal-dedupe-header"
                    sx={{
                        backgroundColor: '#424242',
                        color: '#fff',
                        fontWeight: 'bold',
                        borderRadius: '5px',
                    }}
                >
                    <Typography variant="h6">Internal Dedupe</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            rowCount={data?.relatedLeads.length}
                            pageSizeOptions={[5]}
                            paginationModel={paginationModel}
                            paginationMode="server"
                            onPaginationModelChange={handlePageChange}
                            sx={{
                                color: '#1F2A40',  // Default text color for rows
                                    '& .MuiDataGrid-columnHeaders': {
                                      backgroundColor: '#1F2A40',  // Optional: Header background color
                                      color: 'white'  // White text for the headers
                                    },
                                    '& .MuiDataGrid-footerContainer': {
                                      backgroundColor: '#1F2A40',  // Footer background color
                                      color: 'white',  // White text for the footer
                                    },
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                },
                                '& .MuiDataGrid-row': {
                                    backgroundColor: 'white',
                                    // cursor: 'pointer',
                                },
                            }}
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
            {isError &&
                <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
                    {error?.data?.message}
                </Alert>
            }
        </Box>
    );
};

export default InternalDedupe;
