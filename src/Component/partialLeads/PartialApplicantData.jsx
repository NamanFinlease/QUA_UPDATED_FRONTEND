import React from 'react'
import { tokens } from '../../theme';

import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, useTheme } from '@mui/material';
import { formatDate } from '../../utils/helper';


const PartialApplicantData = ({leadData}) => {

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns =  [
        { label: "Full Name", value: leadData?.fullName, label2: "PAN Number", value2: leadData?.pan},
        { label: "Mobile Number", value: leadData?.mobile, label2: "Email", value2: leadData?.email},
        { label: "Salary", value: leadData?.salary, label2: "Loan Applied", value2: leadData?.loanAmount },
        { label: "Pin Code", value: leadData?.pinCode, label2 : (leadData?.remarks === '' ? "" : "Remarks"), value2: (leadData?.remarks === '' ? "" : leadData?.remarks) },
      ]
    return (
        <>
            <TableContainer component={Paper} sx={{ 
                borderRadius: '0px 20px 0px 20px',
                background: colors.white[100],
                boxShadow:'0px 0px 30px rgba(0,0,0,0.1)',
                '& .MuiPaper-root':{
                    background:colors.white[100],
                },
                '& .MuiTableCell-root': {
                    color: colors.black[100], // Text color for table cells
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)', // Optional: Customize cell borders
                },
                '& .MuiTableRow-root':{
                    borderBottom: `2px solid ${colors.primary[400]}`
                }
                }}>
                <Table aria-label="application details table">
                    <TableBody>
                        {columns.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="left" sx={{ fontWeight: 700 }}>{row.label}</TableCell>
                                <TableCell align="left">{row.value || ''}</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 700 }}>{row.label2}</TableCell>
                                <TableCell align="left">{row.value2 || ''}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default PartialApplicantData;
