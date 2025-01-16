import React from 'react'
import { tokens } from '../theme';
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, useTheme } from '@mui/material';
import { formatDate } from '../utils/helper';


const ApplicantProfileData = ({leadData}) => {

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        { label: "First Name", value: leadData?.fName, label2: "Middle Name", value2: leadData?.mName },
        { label: "Last Name", value: leadData?.lName, label2: "Gender", value2: leadData?.gender },
        { label: "Date of Birth", value: leadData?.dob && formatDate(leadData?.dob), label2: "Aadhaar Number", value2: leadData?.aadhaar },
        { label: "PAN Number", value: leadData?.pan, label2: "Mobile Number", value2: leadData?.mobile },
        { label: "Alternate Mobile", value: leadData?.alternateMobile, label2: "Personal Email", value2: leadData?.personalEmail },
        { label: "Office Email", value: leadData?.officeEmail, label2: "Loan Amount", value2: leadData?.loanAmount },
        { label: "Salary", value: leadData?.salary, label2: "State", value2: leadData?.state },
        { label: "City", value: leadData?.city, label2: "Pin Code", value2: leadData?.pinCode },
    ];
    return (
        <>
            <TableContainer component={Paper} sx={{ 
                borderTopRightRadius: '20px',
                borderBottomLeftRadius: '20px',
                background: colors.white[100],
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
                                <TableCell align="left" sx={{ fontWeight: 500 }}>{row.label}</TableCell>
                                <TableCell align="left">{row.value || ''}</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 500 }}>{row.label2}</TableCell>
                                <TableCell align="left">{row.value2 || ''}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </>
    )
}

export default ApplicantProfileData
