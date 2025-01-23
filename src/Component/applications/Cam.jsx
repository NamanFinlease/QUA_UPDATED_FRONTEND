import React, { useEffect, useState } from 'react';
import { tokens } from '../../theme';
import { Button, TextField, Table, TableBody, TableCell, TableRow, TableContainer, Paper, Grid2, useTheme } from '@mui/material';
import { useGetCamDetailsQuery, useUpdateCamDetailsMutation } from '../../Service/applicationQueries';
import { useParams } from 'react-router-dom';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import EditCam from './EditCam';
import useAuthStore from '../store/authStore';
import { formatDate } from '../../utils/helper';


const Cam = ({id}) => {
  const { data, isLoading: camGetloading, isError: camGetError, isSuccess: getCamSuccess } = useGetCamDetailsQuery(id, { skip: id === null });
  const {activeRole} = useAuthStore()

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // const updatData = useUpdateCamDetailsMutation();
  const [isEditing, setIsEditing] = useState(false);
  // const response = useGetCamDetailsQuery(id, { skip: id === null });  // Fetch data
  const [formData, setFormData] = useState({
    leadId: '',                // Lead ID
    salaryDate1: '',           // Salary Date 1
    salaryAmount1: '',         // Salary Amount 1
    salaryDate2: '',           // Salary Date 2
    salaryAmount2: '',         // Salary Amount 2
    salaryDate3: '',           // Salary Date 3
    salaryAmount3: '',         // Salary Amount 3
    nextPayDate: '',           // Next Salary Date
    averageSalary: '',         // Median Salary Amount
    customerType: '',          // Customer Type
    dedupeCheck: '',           // Dedupe Check
    actualNetSalary: '',       // Net Salary
    creditBureauScore: '',     // Credit Bureau Score
    obligations: '',           // Obligations (Rs)
    salaryToIncomeRatio: '',   // Salary To Income Ratio
    eligibleLoan: '',          // Loan Amount
    loanRecommended: '',       // Loan Recommended
    disbursalDate: '',         // Disbursal Date
    repaymentDate: '',         // Repayment Date
    adminFeePercentage: '',    // Admin Fee Inc. GST (%)
    roi: '',                   // ROI (Rate of Interest)
    netAdminFeeAmount: '',     // Net Admin Fee Amount
    eligibleTenure: '',        // Eligible Tenure
    repaymentAmount: '',       // Repayment Amount
    camRemarks: '',            // Cam Remarks
  });

  useEffect(() => {
    if (getCamSuccess && data?.details) {
      const details = data.details.details;  // Access the deeply nested object
      setFormData({
        leadId: data.details?.leadId || 0,                // Lead ID
        salaryDate1: details?.salaryDate1 || '',          // Salary Date 1
        salaryAmount1: details?.salaryAmount1 || 0,       // Salary Amount 1
        salaryDate2: details?.salaryDate2 || '',          // Salary Date 2
        salaryAmount2: details?.salaryAmount2 || 0,       // Salary Amount 2
        salaryDate3: details?.salaryDate3 || '',          // Salary Date 3
        salaryAmount3: details?.salaryAmount3 || 0,       // Salary Amount 3
        nextPayDate: details?.nextPayDate || '',          // Next Salary Date
        averageSalary: details?.averageSalary || 0,       // Avergae Salary
        actualNetSalary: details?.actualNetSalary || 0,   // Net Salary
        creditBureauScore: details?.cibilScore || '-',    // Credit Bureau Score
        customerType: details?.customerType || 'NEW',     // Customer Type
        dedupeCheck: details?.dedupeCheck || 'NO',        // Dedupe Check
        customerCategory: details?.customerCategory || '-',  // Dedupe Check
        obligations: details?.obligations || 0,         // Obligations (Rs)
        salaryToIncomeRatio: details?.salaryToIncomeRatio || '',  // Salary to Income Ratio
        eligibleLoan: details?.eligibleLoan || 0,         // Loan Amount
        netDisbursalAmount: details?.netDisbursalAmount || 0,         // Loan Amount
        loanRecommended: details?.loanRecommended || 0,   // Loan Recommended
        disbursalDate: details?.disbursalDate && formatDate(details?.disbursalDate) || '-',     // Disbursal Date
        finalsalaryToIncomeRatioPercentage: details?.finalsalaryToIncomeRatioPercentage || '-',     // Disbursal Date
        repaymentDate: details?.repaymentDate && formatDate(details?.repaymentDate) || '-',     // Repayment Date
        adminFeePercentage: details?.adminFeePercentage || '',  // Admin Fee Inc. GST (%)
        totalAdminFeeAmount: details?.totalAdminFeeAmount || '0',  // Admin Fee Inc. GST (%)
        roi: details?.roi || '',                        // ROI (Rate of Interest)
        netAdminFeeAmount: details?.netAdminFeeAmount || 0,   // Net Admin Fee Amount
        eligibleTenure: details?.eligibleTenure || '-',   // Eligible Tenure
        repaymentAmount: details?.repaymentAmount || 0,   // Repayment Amount
        camRemarks: details?.camRemarks || "-",   // Repayment Amount
      });
    }
  }, [getCamSuccess, data]);

  // Re-run the effect when `isSuccess` or `data` changes

  //  Initialize the mutation hook


  return (
    <>
      {
        camGetloading ? (<h1> Loading </h1>) : (<div>
          {!isEditing ? (
            <div style={{flex:1,}}>
              {/* Display the table with data */}
              <TableContainer 
                component={Paper} 
                sx={{
                  color:colors.black[100], 
                  background:colors.white[100],
                  borderRadius:"0px 20px", 
                  boxShadow:`0px 0px 20px ${colors.primary[400]}`,
                  '& .MuiTableCell-root':{
                    color:colors.black[100],
                    borderBottom:`2px solid ${colors.primary[400]}`,
                  }
                }}>
                <Table>
                  <TableBody >
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Lead ID: {formData?.leadId}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Salary Date 1</TableCell>
                      <TableCell>{formData?.salaryDate1 || '-'}</TableCell>
                      <TableCell>Salary Amount 1</TableCell>
                      <TableCell>{formData?.salaryAmount1}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Salary Date 2</TableCell>
                      <TableCell>{formData?.salaryDate2 || '-'}</TableCell>
                      <TableCell>Salary Amount 2</TableCell>
                      <TableCell>{formData?.salaryAmount2}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Salary Date 3</TableCell>
                      <TableCell>{formData?.salaryDate3 || '-'}</TableCell>
                      <TableCell>Salary Amount 3</TableCell>
                      <TableCell>{formData?.salaryAmount3}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Next Salary Date</TableCell>
                      <TableCell>{formData?.nextPayDate || '-'}</TableCell>
                      <TableCell>Average Salary</TableCell>
                      <TableCell>{formData?.averageSalary}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Net Salary</TableCell>
                      <TableCell>{formData?.actualNetSalary}</TableCell>
                      <TableCell>Credit Bureau Score</TableCell>
                      <TableCell>{formData?.creditBureauScore}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Customer Type</TableCell>
                      <TableCell>{formData?.customerType}</TableCell>
                      <TableCell>Dedupe Check</TableCell>
                      <TableCell>{formData?.dedupeCheck}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Customer Category</TableCell>
                      <TableCell>{formData?.customerCategory}</TableCell>
                      <TableCell>Obligations (Rs)</TableCell>
                      <TableCell>{formData?.obligations}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Initial Salary To Income Ratio</TableCell>
                      <TableCell>  {formData?.salaryToIncomeRatio}%</TableCell>
                      <TableCell>ROI</TableCell>
                      <TableCell>{formData?.roi}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Processing Fee Inc. Gst(%)</TableCell> 
                      <TableCell>{formData?.adminFeePercentage}%</TableCell>
                      <TableCell>Eligible Loan</TableCell>
                      <TableCell>{formData?.eligibleLoan}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Loan Recommended</TableCell>
                      <TableCell>{formData?.loanRecommended}</TableCell>
                      <TableCell>Final Salary To Income Ratio</TableCell>
                      <TableCell>{formData?.finalsalaryToIncomeRatioPercentage}%</TableCell>
                      
                    </TableRow>
                    <TableRow>
                      <TableCell>Net Disbursal Amount</TableCell>
                      <TableCell>{formData?.netDisbursalAmount}</TableCell>
                      <TableCell>Disbursal Date</TableCell>
                      <TableCell>{formData?.disbursalDate}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Repayment Date</TableCell>
                      <TableCell>{formData?.repaymentDate}</TableCell>
                      <TableCell>Eligible Tenure</TableCell>
                      <TableCell>{formData?.eligibleTenure}</TableCell>
                    </TableRow>
                    {/* Additional missing fields based on your formData? object */}
                    <TableRow>
                      <TableCell>Processing Fee Amount</TableCell>
                      <TableCell>{formData?.netAdminFeeAmount}</TableCell>
                      <TableCell>Repayment Amount</TableCell>
                      <TableCell>{formData?.repaymentAmount}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={1} align="center"  >Remarks</TableCell>
                      <TableCell colSpan={3} align="center"  >{formData?.camRemarks}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

              </TableContainer>


              {/* Edit CAM Button */}
              {activeRole === "creditManager" && 
              <Button 
                variant="contained" 
                onClick={() => setIsEditing(true)} 
                style={{ 
                  margin: '20px', 
                  background:colors.white[100],
                  color:colors.primary[400],
                  border:`2px solid ${colors.primary[400]}`,
                  borderRadius:"0px 10px 0px 10px",
                  float:"right",
                  ':hover':{
                    background:colors.primary[400],
                    color:colors.white[100],
                  },
                }}
              >
                Edit CAM
              </Button>}
            </div>
          ) : (
            // <form>
            <EditCam camData={formData} setIsEditing={setIsEditing} />

          )}
        </div>)
      }
    </>
  );
};

export default Cam;
