import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Box, Paper, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PreviewIcon from '@mui/icons-material/Preview';
import Swal from 'sweetalert2';
import { useLazyFetchCibilScoreQuery, useLazyGetLeadDocsQuery } from '../../Service/Query';
import { useParams } from 'react-router-dom';

const accordionStyles = {
  borderRadius: '12px',
  background: 'linear-gradient(145deg, #36cfc9, #ffffff)',
  boxShadow: '5px 5px 10px #d1d5db, -5px -5px 10px #ffffff',
  marginBottom: '20px',
};

const paperStyles = {
  padding: '20px',
  borderRadius: '15px',
  backgroundColor: '#c8c9c7',
  boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.1)',
};

const CibilScore = ({ id }) => {

  const [cibilScore, setCibilScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [fetchCibilScore, cibilRes] = useLazyFetchCibilScoreQuery()
  const [getLeadDocs, { data: docsData, isSuccess: docsSuccess, isError: isDocsError, error: docsError }] = useLazyGetLeadDocsQuery();


  // Placeholder function for fetching CIBIL score
  const submitCibil = async () => {
    // setLoading(true);
    fetchCibilScore(id)
    // setError('');

  };

  const viewFile = (docType) => {
    // setSelectedFileType(docType);
    console.log('cibil report', docType)
    getLeadDocs({ id, docType });
  };

  useEffect(() => {
    if (docsSuccess) {
      const fileUrl = docsData?.url;
      const mimeType = docsData?.mimeType?.split('/').pop().toLowerCase();

      if (['jpg', 'jpeg', 'png'].includes(mimeType)) {
        Swal.fire({
          title: 'Document retrieved successfully!',
          html: `<img src="${fileUrl}" alt="${docsData?.type}" width="400" />`,
          showCloseButton: true,
        });
      } else if (['pdf'].includes(mimeType)) {
        Swal.fire({
          html: `<iframe src="${fileUrl}" width="100%"  style="border: none; padding:15px; overflow-y:hidden; height: 100vh;"></iframe>`,  // Set iframe to 100vh
          showCloseButton: true,
          showConfirmButton: false,
          width: '100vw',  // Full width (viewport width)
          heightAuto: false,  // Manually handle height to avoid auto height adjustment
          willOpen: () => {
            // Adding inline styles using JS
            const swalContainer = Swal.getPopup();
            swalContainer.style.setProperty('overflow', 'hidden', 'important');
          },
          allowOutsideClick: false,  // Prevent closing by clicking outside the popup
        });


      } else if (['mp4', 'avi', 'mov'].includes(mimeType)) {
        Swal.fire({
          title: 'Document retrieved successfully!',
          html: `<video width="800" controls><source src="${fileUrl}" type="video/${mimeType}">Your browser does not support the video tag.</video>`,
          showCloseButton: true,
        });
      }
    }
  }, [docsData]);

  useEffect(() => {
    if(cibilRes?.isSuccess&& cibilRes?.data && !cibilRes?.isFetching){
      console.log('cibil score',cibilRes)
      setCibilScore(cibilRes?.data)

    }

  },[cibilRes?.isSuccess, cibilRes?.data, cibilRes?.isFetching])



  return (
    <Box sx={{ maxWidth: '700px', margin: '0 auto', mt: 3 }}>
      <Accordion style={accordionStyles}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#007bb2' }} />}>
          <Typography variant="h6" style={{ fontWeight: '600', color: "#ffffff" }}>Fetch CIC Report</Typography>
        </AccordionSummary>
        <AccordionDetails >
          <Paper elevation={3} style={paperStyles}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Button
                variant="contained"
                onClick={submitCibil}
                disabled={loading}
                sx={{
                  borderRadius: '8px',
                  padding: '10px 20px',
                  background: 'linear-gradient(45deg, #42a5f5, #007bb2)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #007bb2, #42a5f5)',
                  },
                }}
              >
                {(cibilRes?.isLoading || cibilRes?.isFetching) ? 'Fetching...' : 'Fetch CIC Report'}
              </Button>

              <Box textAlign="right" display="flex" alignItems="center">
                {cibilRes?.isError && (
                  <Typography color="error" variant="body1" mt={1}>
                    {cibilRes?.error?.data?.message}
                  </Typography>
                )}
                {cibilRes?.data?.value && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      borderRadius: 2,
                      boxShadow: 3,
                      bgcolor: '#f9f9f9',
                      border: '1px solid #ddd',
                      p: 1
                    }}
                  >
                    {/* CIBIL Score Section */}
                    <Box
                      sx={{
                        bgcolor: '#e0f7e0', // Light green background for CIBIL score
                        borderRadius: 1,
                        px: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 500,
                          fontSize: '18px',
                          color: '#0a8001',
                        }}
                      >
                        Credit Score: {cibilRes?.data?.value}
                      </Typography>
                    </Box>

                    {/* Preview Icon Section */}
                    <Box
                      component="button"
                      onClick={() => viewFile("cibilReport")}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#0a8001', // Dark green background for the button
                        color: '#fff', // Icon color
                        border: 'none',
                        borderRadius: 1,
                        ml: 2,
                        width: 30,
                        height: 30,
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease', // Smooth background transition
                        '&:hover': {
                          bgcolor: '#086c01', // Darker green on hover
                        },
                      }}
                    >
                      <Tooltip title="Cibil Report">

                        <PreviewIcon
                          sx={{
                            fontSize: '22px', // Icon size
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

          </Paper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CibilScore;
