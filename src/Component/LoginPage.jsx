import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, IconButton, CircularProgress, Alert, useTheme } from '@mui/material';
import { tokens } from '../theme';
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

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
      localStorage.setItem("token", loginData.token);
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
        // backgroundColor: colors.white[100],
        backgroundImage: 'url("../../src/assets/image/loginbackground.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Box
        sx={{
          width: 400,
          padding: 4,
          backgroundColor: colors.white[100],
          color:colors.black[100],
          borderRadius: "0px 20px",
          boxShadow: 3,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.black[100], // Black border color
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.black[100], // Black border color on hover
          },
        }}
      >
        <img src="https://globals3diigitaloceanbucket.blr1.cdn.digitaloceanspaces.com/QUAASSESTS/Qua_logo.png" alt="background" width="100px" />
        {/* <img src="../../src/assets/image/Qua_logo.png" alt="background" width="100px" /> */}
        <Typography variant="h4" gutterBottom color={colors.black[100]} margin="20px 0px" align="center">
          CRM Login
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
              InputLabelProps={{ style: { color: colors.black[100] }, shrink: true, }}
              InputProps={{ style: { color: colors.primary[400] } }}
              sx={{
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px rgb(255, 255, 255) inset',
                  WebkitTextFillColor: colors.primary[400],
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
              InputLabelProps={{ style: { color: colors.black[100] }, shrink: true, }}
              sx={{
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px #424242 inset',
                  WebkitTextFillColor: '#fff',
                  transition: 'background-color 5000s ease-in-out 0s',
                },
              }}
              InputProps={{
                style: { color: colors.primary[100] },
                endAdornment: (
                  <IconButton
                    edge="end"
                    onClick={handleShowPass}
                    sx={{ color: colors.black[100] }}
                  >
                    {showPass ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                ),
              }}
            />
          </Box>
         
          <Button
            type="submit"
            variant='contained'
            fullWidth
            disabled={isLoading}
            sx={{
              backgroundColor: (isLoading) ? colors.grey[100] : colors.primary[400],
              color: (isLoading) ? colors.black[100] : colors.white[100],
              cursor: (isLoading) ? "not-allowed" : "pointer",
              "&:hover": {
                backgroundColor: colors.primary[100],
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
            color: colors.black[100],
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
