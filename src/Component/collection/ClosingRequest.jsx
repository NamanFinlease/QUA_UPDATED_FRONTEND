import React, { useEffect, useState } from 'react';
import { Button, Box, FormControl,Table, TableBody,TableContainer,TableCell,TableHead,TableRow, InputLabel, Select, MenuItem, TextField, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { yupResolver } from '@hookform/resolvers/yup';
import LoanInfo from './loanInfo';
import useAuthStore from '../store/authStore';
import { useDisburseLoanMutation } from '../../Service/applicationQueries';
import { disburseSchema } from '../../utils/validations';
import useStore from '../../Store';
import { useUpdateCollectionMutation } from '../../Service/LMSQueries';
import RepaymentForm from './RepaymentForm';

const ClosingRequest = ({ disburse }) => {
  const { id } = useParams()
  const [showForm, setShowForm] = useState(false);
  const { activeRole } = useAuthStore()
  const { applicationProfile } = useStore()
  const navigate = useNavigate()

  const { disbursalDate, netDisbursalAmount } = disburse?.sanction?.application?.cam?.details
  const [disburseLoan, { data, isSuccess, isError, error }] = useUpdateCollectionMutation()

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const defaultValues = {
    amount: "",
    // paymentMode: "",
    // channel: "",
    paymentDate: disbursalDate && dayjs(disbursalDate),
    remarks: "",
  }

  const { handleSubmit, control, setValue } = useForm({
    // resolver: yupResolver(disburseSchema),
    defaultValues: defaultValues
  })

  const onSubmit = (data) => {
    console.log('data', data)
    // disburseLoan({ id, data })
  }

  const handleToggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm); // Toggle form visibility
  };
  useEffect(() => {
    if (isSuccess && data) {
      Swal.fire({
        text: "Loan Disbursed!",
        icon: "success"
      });
      navigate("/disbursal-pending")
    }

  }, [isSuccess, data])

  return (
    <>
    
      <Box
        sx={{
          padding: '20px',
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: colors.white[100],
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '0px 20px',
        }}
      >
        {/* Render DisbursalProfile component before the dropdown header */}
        <LoanInfo disburse={disburse?.sanction?.application} />

        {/* Clickable Header for Disbursal Bank with Background */}

        {(activeRole === "collectionExecutive") &&
          <>
            <Box
              onClick={handleToggleForm}
              sx={{
                backgroundColor: colors.white[100], // Background color for header
                borderRadius: '0px 15px',
                padding: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: colors.primary[400], // Text color
                marginTop: '20px',
                border:`2px solid ${colors.primary[400]}`,
                transition:"all 0.3s",
                ':hover':{
                  backgroundColor: colors.primary[400],
                  color:colors.white[100],
                }
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Closing Request
              </Typography>
              <ExpandMoreIcon
                sx={{
                  marginLeft: '8px',
                  transform: showForm ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              />
            </Box>

            {/* Form that appears when the header is clicked */}
            {showForm &&
              (
                <RepaymentForm disburse={disburse} />
              )}
            {/* Submit button */}


          </>
        }

      </Box>
      <Box sx={{width:"100%",margin:"20px 0px"}}>
        {(activeRole === "collectionExecutive" && 
          <>
            <Box 
              sx={{
                display:'flex', 
                justifyContent:'center', 
                background:colors.white[100],
                color:colors.primary[400],
                width:"70%", 
                margin:"0 auto",
                borderRadius: "0px 20px",
                boxShadow:"0px 0px 10px rgb(0,0,0,0.2)",
                }}
              >
              <TableContainer 
                sx={{
                  borderRadius:"0px 20px",
                  '& .MuiTableCell-root':{
                    borderBottom:`2px solid ${colors.primary[400]}`,
                    color:colors.black[100],
                  }
                }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Payable Amount</TableCell>
                        <TableCell>Recieved Amount</TableCell>
                        <TableCell>Discount Amount</TableCell>
                        <TableCell>Outstanding Amount</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TableHead>Interest Amount</TableHead>
                      </TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TableHead>Principle Amount</TableHead>
                      </TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TableHead>Penalty Amount</TableHead>
                      </TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <TableHead>Grand Total</TableHead>
                      </TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default ClosingRequest;
