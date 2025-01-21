import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../theme';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Alert,
    useTheme,
    Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useApplicationLogsQuery } from '../Service/Query';
import { formatDateTime } from '../utils/helper';
import CommonTable from './CommonTable';

const columns = [
    { field: 'sr', headerName: '#', width: 50 },
    { field: 'borrower', headerName: 'Borrower', width: 150 },
    { field: 'logDate', headerName: 'Log Date', width: 150 },
    { field: 'status', headerName: 'Action', width: 200 },
    { field: 'leadRemark', headerName: 'Lead Remark', width: 300 },
    { field: 'reason', headerName: 'Reason', width: 250 },
];

const ApplicationLogHistory = ({ id }) => {

    const [applicationLog, setApplicationLog] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { data, isSuccess, isError, error } = useApplicationLogsQuery(id);

    useEffect(() => {
        if (isSuccess) {
            setApplicationLog(data || []);
        }
    }, [isSuccess, data]);

    const rows = applicationLog.map((log, index) => ({
        id: log.id,
        sr: index + 1,
        borrower: log?.borrower,
        logDate: formatDateTime(log?.logDate),
        status: log?.status,
        leadRemark: log?.leadRemark,
        reason: log?.reason,
    }));

    const handlePageChange = (newPaginationModel) => {
        setPaginationModel(newPaginationModel);
    };

    return (
        <>
            <Accordion
                variant="outlined"
                sx={{
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    maxWidth: '700px',
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
                    expandIcon={<ExpandMoreIcon sx={{color:colors.primary[400]}} />}
                    aria-controls="application-log-content"
                    id="application-log-header"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',         
                        background: colors.white[100],
                        color: colors.primary[400],
                        fontWeight: 'bold',
                        borderRadius: '0px 20px 0px 20px',
                        boxShadow:"0px 0px 20px rgb(0,0,0,0.2)",
                        margin:'0px auto',
                    }}
                >
                    <Typography variant="h6">Application Log</Typography>
                </AccordionSummary>
                <AccordionDetails 
                    sx={{
                        borderRadius:"20px 0px 20px 20px",
                        boxShadow:`0px 0px 10px rgb(0,0,0,0.1)`
                    }}>
                    <Box sx={{ height: 500, width: '100%' }}>
                        <CommonTable    
                            columns={columns}
                            rows={rows}
                            paginationModel={ paginationModel}
                            onPageChange={handlePageChange}
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Box>
                {isError &&
                    <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
                        {error?.data?.message}
                    </Alert>
                }
            </Box>
        </>
    );
};

export default ApplicationLogHistory;
