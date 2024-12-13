import React from 'react'

import {Button, Box } from '@mui/material';


const BarButtons = ({barButtonOptions,currentPage,setCurrentPage}) => {

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
                    margin: "5px",
                    backgroundColor: status.toLowerCase() === currentPage.toLowerCase() ? '#3f51b5' : '#4caf50', // Active: Indigo, Inactive: Green
                    color: 'white',
                    borderRadius: '8px',
                    boxShadow: status.toLowerCase() === currentPage.toLowerCase() ? '0px 4px 20px rgba(63, 81, 181, 0.4)' : 'none', // Subtle shadow for active
                    transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transition
                    '&:hover': {
                      backgroundColor: status.toLowerCase() === currentPage.toLowerCase() ? '#303f9f' : '#388e3c', // Darker shade on hover
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
