import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, IconButton, CircularProgress, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import useAuthStore from './store/authStore';
import { useLoginUserMutation } from '../Service/Query';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError,setFormError] = useState(null)
  const [showPass, setShowPass] = useState(false);
  const [loginUser, { data: loginData, isSuccess: loginSuccess, isLoading, isError, error }] = useLoginUserMutation();
  const navigate = useNavigate();
  const { isLoggedIn, setLogin, empInfo, setEmpInfo, setActiveRole } = useAuthStore();

  if (isLoggedIn && empInfo) {
    return <Navigate to="/" />;
  }

  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null)
    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }

    try {
      await loginUser({ email, password });
    } catch (error) {
      console.error('Error during login:', error);
      setFormError('Something went wrong. Please try again later.');
    }
  };

  useEffect(() => {
    if (loginSuccess) {
      setLogin(true);
      setEmpInfo(loginData);
      setActiveRole(loginData?.empRole[0]);
      navigate('/');
    }
  }, [loginSuccess, loginData]);

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#2c2c2c',
      }}
    >
      <Box
        sx={{
          width: 400,
          padding: 4,
          backgroundColor: '#424242',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom color="white" align="center">
          Login
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputLabelProps={{ style: { color: '#fff' }, shrink: true, }}
              InputProps={{ style: { color: '#fff' } }}
              sx={{
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px #424242 inset',
                  WebkitTextFillColor: '#fff',
                  transition: 'background-color 5000s ease-in-out 0s',
                },
              }}

            />
          </Box>
          <Box sx={{ mb: 2, position: 'relative' }}>
            <TextField
              fullWidth
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputLabelProps={{ style: { color: '#fff' }, shrink: true, }}
              sx={{
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px #424242 inset',
                  WebkitTextFillColor: '#fff',
                  transition: 'background-color 5000s ease-in-out 0s',
                },
              }}
              InputProps={{
                style: { color: '#fff' },
                endAdornment: (
                  <IconButton
                    edge="end"
                    onClick={handleShowPass}
                    sx={{ color: '#fff' }}
                  >
                    {showPass ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                ),
              }}
            />
          </Box>
         
          <Button
            type="submit"
            fullWidth
            color="primary"
            disabled={isLoading}
            sx={{
              backgroundColor: (isLoading) ? "#f2c491" : "#f29d41",
              color: (isLoading) ? "#666" : "white",
              cursor: (isLoading) ? "not-allowed" : "pointer",
              "&:hover": {
                backgroundColor: "#f2c491",
              },
            }}
          >
            {(isLoading) ? <CircularProgress size={20} color="inherit" /> : "Login"}
          </Button>

        </form>
        {isError &&
            <Alert severity="error" sx={{ borderRadius: '8px', mt: 2 }}>
              {error?.data?.message}
            </Alert>
          }
        {formError && <p className="error" style={{color:'#fc4c6f'}}>{formError}</p>}
        <Typography
          onClick={handleForgotPassword}
          sx={{
            color: '#fff',
            cursor: 'pointer',
            textDecoration: 'underline',
            textAlign: 'center',
            mt: 1,
          }}
        >

          Forgot Password?
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
