import React, { useState } from 'react';
import { tokens } from '../theme';
import { useTheme, Button } from '@mui/material';

const AddHolidayDetails = () => {
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayName, setHolidayName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Holiday Date:', holidayDate);
    console.log('Holiday Name:', holidayName);
  };

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div className="container mt-5">
      
      <form onSubmit={handleSubmit} className="p-4" style={{ maxWidth: '600px', margin: '0 auto', borderRadius:"0px 20px", boxShadow:"0px 0px 20px rgb(0,0,0,0.1)" }}>
      <h4 className="text-center mb-4" style={{color:colors.primary[400]}}>Add Holiday Details</h4>
        <div className="form-group mb-3">
          <label htmlFor="holidayDate">Holiday Date</label>
          <input
            type="date"
            className="form-control"
            id="holidayDate"
            style={{borderColor:colors.primary[400]}}
            value={holidayDate}
            onChange={(e) => setHolidayDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="holidayName">Holiday Name</label>
          <input
            type="text"
            className="form-control"
            id="holidayName"
            style={{borderColor:colors.primary[400]}}
            value={holidayName}
            onChange={(e) => setHolidayName(e.target.value)}
            placeholder="Enter Holiday Name"
            required
          />
        </div>
        <div className="d-flex justify-content-center">
          <Button 
            type="submit" 
            variant="contained"
            sx={{
              borderRadius:"0px 10px",
              background:colors.primary[400],
            }}
          >
            Add Holiday
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddHolidayDetails;
