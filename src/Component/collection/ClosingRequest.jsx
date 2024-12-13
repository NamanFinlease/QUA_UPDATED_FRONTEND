import React, { useEffect, useState } from 'react';
import { Button, Box, FormControl, InputLabel, Select, MenuItem, TextField, Typography } from '@mui/material';
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
    <Box
      sx={{
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
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
              backgroundColor: '#3f51b5', // Background color for header
              borderRadius: '8px',
              padding: '10px',
              textAlign: 'center',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#ffffff', // Text color
              marginTop: '20px',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
              Closing Request
            </Typography>
            <ExpandMoreIcon
              sx={{
                marginLeft: '8px',
                color: '#ffffff',
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
  );
};

export default ClosingRequest;
