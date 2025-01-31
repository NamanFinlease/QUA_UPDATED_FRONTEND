import React, { useState, useEffect } from 'react';
import { tokens } from '../../theme';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useUpdateCamDetailsMutation } from '../../Service/applicationQueries';

const RequestFieldVisit = () => {
  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    visitId: '', // visit ID
    visitType: '', // visit Type
    visitRequestedBy: '', // visit requested by
    visitRequestedOn: '', // vist requested on
    visitRequestedRemarks: '', // visit requested remarks
    visitStatus: '', // visit status
    visitAction: '', // visit action
  });

  return (
    <Accordion 
        sx={{
            background:colors.white[100], 
            borderRadius:"0px 20px", 
            boxShadow:"0px 0px 10px rgb(0,0,0,0.3)",
            '&.Mui-expanded': {
              margin: '20px auto',
            },
            '&.MuiAccordion-root:last-of-type':{
                borderBottomLeftRadius:"20px",
            }
        }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{color:colors.primary[400]}}/>}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography variant="h6" sx={{ flexShrink: 0, color:colors.primary[400], textAlign:"center" }}>
          Request Field Visit
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          component="form"
          // onSubmit={handleSave}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: "0px 0px 20px rgb(0,0,0,0.2)",
            padding: '30px',
            borderRadius: '0px 20px',
            color: colors.black[100],
            '& .MuiTextField-root': {
              color: colors.black[100],
              '& .MuiInputBase-input': {
                color: colors.black[100],
              },
              '& .MuiSelect-select': {
                color: colors.black[100],
              },
              '& .MuiInputLabel-root': {
                color: colors.black[100],
              },
              '& .MuiFormHelperText-root': {
                color: colors.black[100],
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary[100],
              },
              '& .Mui-disabled': {
                color: `${colors.black[100]} !important`,
                borderColor: colors.black[100],
                opacity: "1 !important",
              },
              '& .MuiInputBase-input .Mui-disabled': {
                color: colors.black[100], // Add this line to make the disabled input text visible
                opacity: 1,
              },
            }
          }}
        >
          <Grid container spacing={2}>
            {/* First Row (4 items) */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Visit ID"
                name="visitId"
                type="string"
                fullWidth
                value={formData.visitId}
                // onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Visit Type"
                name="visitType"
                fullWidth
                value={formData.visitType}
                // onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Visit Requested By"
                name="visitRquestedBy"
                inputProps={{
                  type: 'text',
                  pattern: '[0-9]*',
                  inputMode: 'numeric',
                }}
                fullWidth
                value={formData.visitRequestedBy}
                // onChange={handleChange}
              />
            </Grid>

            {/* Second Row (4 items) */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Visit Requested On"
                name="VisitRequestedOn"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={formData.visitRequestedOn}
                // onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Visit Requested Remarks"
                name="visitRequestedRemarks"
                inputProps={{
                  type: 'text',
                  pattern: '[0-9]*',
                  inputMode: 'numeric',
                }}
                fullWidth
                value={formData.visitRequestedRemarks}
                // onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Visit Status"
                name="visitStatus"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={formData.visitStatus}
                // onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                label="Action"
                name="visitAction"
                inputProps={{
                  type: 'text',
                  pattern: '[0-9]*',
                  inputMode: 'numeric',
                }}
                fullWidth
                value={formData.visitAction}
                // onChange={handleChange}
              />
            </Grid>

            {/* Save and Cancel Buttons */}
            <Grid item xs={12} sm={6} md={3}>
              <Button
                type="submit"
                sx={{
                  backgroundColor: colors.white[100],
                  color: colors.primary[400],
                  border: `2px solid ${colors.primary[400]}`,
                  borderRadius: '0px 10px',
                  cursor:'pointer',
                  '&:hover': {
                    backgroundColor:colors.primary[400],
                    color:colors.white[100],
                  },
                }}
              >
                Request
              </Button>
              <Button
                variant="outlined"
                // onClick={handleCancel}
                style={{ marginLeft: '10px' }}
                sx={{
                  background: colors.white[100],
                  color: colors.redAccent[500],
                  border: `2px solid ${colors.redAccent[500]}`,
                  borderRadius: '0px 10px',
                  ':hover': {
                    color: colors.white[100],
                    backgroundColor: colors.redAccent[500],
                  },
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default RequestFieldVisit;