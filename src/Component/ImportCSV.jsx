import React, { useState } from 'react';
import { tokens } from '../theme';
import { useTheme, Button } from '@mui/material';
import { useBulkUploadMutation } from '../Service/Query';

const ImportCSV = () => {

  const [bulkUpload,{data,isSuccess,isError,error}] = useBulkUploadMutation()
  const [file, setFile] = useState(null);
  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData()
    if (file) {
      formData.append("csv",file)
      bulkUpload(formData)
    } else {
      alert('Please select a file to upload');
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-5" style={{ color: colors.primary[400],borderRadius:'0px 20px', boxShadow:'0px 0px 20px rgba(0,0,0,0.2)' }} >
      <h4 className="text-center pb-3" style={{borderBottom:`3px solid ${colors.primary[400]}`, width:'80%'}}>Import CSV File</h4>
      <form 
        onSubmit={handleSubmit} 
        className="p-4" 
        style={{ width: '400px' }}
      >
        <div className="form-group mb-3">
          <label htmlFor="csvInput" className="form-label">
            Choose CSV File
          </label>
          <input 
            type="file"
            style={{borderColor:colors.primary[400]}}
            className="form-control" 
            id="csvInput" 
            accept=".csv" 
            onChange={handleFileChange} 
          />
        </div>
        <Button 
          type="submit"
          variant='contained'
          sx={{ 
            backgroundColor: colors.primary[400], 
            color: colors.white[100],
            borderRadius: '0px 10px',
          }}
        >
          Import CSV
        </Button>
      </form>
    </div>
  );
};

export default ImportCSV;
