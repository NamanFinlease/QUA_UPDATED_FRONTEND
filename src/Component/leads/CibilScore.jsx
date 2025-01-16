import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Box, Paper, Tooltip, useTheme, } from '@mui/material';
import { tokens } from '../../theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PreviewIcon from '@mui/icons-material/Preview';
import Swal from 'sweetalert2';
import { useLazyFetchCibilScoreQuery, useLazyGetLeadDocsQuery } from '../../Service/Query';
import { useParams } from 'react-router-dom';


const CibilScore = ({ id }) => {

  const [score, setScore] = useState(null);
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
    console.log('use fect')
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

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const accordionStyles = {
    borderTopRightRadius: '15px',
    borderBottomLeftRadius: '15px',
    background: colors.white[100],
    color:colors.primary[400],
    boxShadow: '0px 0px 20px #d1d5db',
    marginBottom: '20px',
  };

  const paperStyles = {
    padding: '20px',
    borderTopLeftRadius: '15px',
    borderBottomRightRadius: '15px',
    border:`1px solid ${colors.primary[400]}`,
    backgroundColor: colors.white[100],
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
  };

  return (
    <Box sx={{ maxWidth: '700px', margin: '0 auto', mt: 3 }}>
      <Accordion style={accordionStyles}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: colors.primary[400] }} />}>
          <Typography variant="h6" style={{ fontWeight: '600', }}>Fetch CIC Report</Typography>
        </AccordionSummary>
        <AccordionDetails >
          <Paper elevation={3} style={paperStyles}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Button
                variant="contained"
                onClick={submitCibil}
                disabled={loading}
                sx={{
                  borderTopRightRadius: '10px',
                  borderBottomLeftRadius: '10px',
                  padding: '10px 20px',
                  background: colors.white[100],
                  color: colors.primary[400],
                  '&:hover': {
                    background: colors.primary[400],
                    color:colors.white[100],
                  },
                }}
              >
                {cibilRes?.isLoading ? 'Fetching...' : 'Fetch Credit Score'}
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
                      bgcolor: colors.white[100],
                      border: `1px solid ${colors.primary[400]}`,
                      p: 1
                    }}
                  >
                    {/* CIBIL Score Section */}
                    <Box
                      sx={{
                        background:colors.white[100], // Light green background for CIBIL score
                        borderTopLeftRadius: 2,
                        borderBottomRightRadius: 2,
                        px: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 500,
                          fontSize: '16px',
                          color: colors.primary[400],
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
                        bgcolor: colors.white[100], // Dark green background for the button
                        color: colors.primary[400], // Icon color
                        border: 'none',
                        borderTopLeftRadius: 2,
                        borderBottomRightRadius: 2,
                        ml: 2,
                        width: 30,
                        height: 30,
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease', // Smooth background transition
                        '&:hover': {
                          bgcolor: colors.primary[400],
                          color:colors.white[100],
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
