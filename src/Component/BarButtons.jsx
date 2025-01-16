import React from 'react'
import { tokens } from '../theme';
import {Button, Box, useTheme } from '@mui/material';


const BarButtons = ({barButtonOptions,currentPage,setCurrentPage}) => {

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleBarButtons = status => setCurrentPage(status);
  return (
    <>
    <Box display="flex" flexWrap="wrap" justifyContent="center" mb={3}>
              {barButtonOptions?.map(status => (
                <Button
                  key={status}
                  variant="contained"
                //   color={status.toLowerCase() === currentPage.toLowerCase() ? "primary" : "success"}
                  onClick={() => handleBarButtons(status.toLowerCase())}
                  sx={{
                    margin: "10px 5px",
                    padding:"10px 10px",
                    backgroundColor: status.toLowerCase() === currentPage.toLowerCase() ? colors.primary[400] : colors.white[100],
                    border: status.toLowerCase() === currentPage.toLowerCase() ? `2px solid ${colors.primary[400]}` : `2px solid ${colors.primary[400]}`,
                    color: status.toLowerCase() === currentPage.toLowerCase() ? colors.white[100] : colors.primary[400],
                    borderTopRightRadius: '8px',
                    borderBottomLeftRadius: '8px',
                    boxShadow: status.toLowerCase() === currentPage.toLowerCase() ? `0px 4px 20px ${colors.primary[400]}` : 'none', // Subtle shadow for active
                    transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transition
                    '&:hover': {
                      backgroundColor: status.toLowerCase() === currentPage.toLowerCase() ? colors.primary[400] : colors.primary[400], // Darker shade on hover
                      color : status.toLowerCase() === currentPage.toLowerCase() ? colors.white[100] : colors.white[100],
                      boxShadow: status.toLowerCase() === currentPage.toLowerCase() ? '0px 6px 24px rgba(63, 81, 181, 0.5)' : 'none',
                    },
                  }}
                >
                  {status}
                </Button>
              ))}
            </Box>
      
    </>
  )
}

export default BarButtons
