import React, { useEffect, useState } from 'react';
import { tokens } from '../theme';
import { useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const CommonTable = ({
  columns,
  rows,
  totalRows,
  paginationModel,
  onPageChange,
  onRowClick,
  title,
  actionButton,
  onAllocateButtonClick,
  onExportButtonClick,
}) => {
  const { activeRole } = useAuthStore();
  const navigate = useNavigate();

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handlePageChange = (newPage) => {
    onPageChange(newPage);
  };

  const handleRowClick = (params) => {
    if (onRowClick) {
      onRowClick(params);
    }
  };


  const handleActionButtonClick = (param) => {
    if (param === "allocate") {
      onAllocateButtonClick();
      console.log(onAllocateButtonClick())
    }else{
      onExportButtonClick();
      console.log(onExportButtonClick())
    }
  };
  
  return (  
    <div 
      sx={{
        display:"inline-block", 
        height:"100%",
      }}
    >
      {title && (
        <div
          style={{
            padding: '10px 20px',
            margin:"20px 10px 10px 60px",
            fontWeight: 'bold',
            background: colors.white[100],
            color: colors.primary[400],
            border: `1px solid ${colors.primary[400]}`,
            borderTopRightRadius: '15px',
            borderBottomLeftRadius: '15px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            display:"inline-block",
          }}
        >
          {title} : {totalRows || 0}
        </div>
      )}
    
      {actionButton && (
      <>
        <div
          style={{
            display: 'inline-block',
          }}
        >
          {(activeRole === "disbursalManager" || activeRole === "disbursalHead" || activeRole === "admin") && <button
            onClick={() => handleActionButtonClick('exportCSV')}
            style={{
                fontWeight: 'bold',
                padding: '10px 20px',
                background: colors.white[100],
                color: colors.greenAccent[400],
                border: `1px solid ${colors.greenAccent[400]}`,
                borderRadius:"0px 10px 0px 10px",  
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                display:"inline-block",
                margin:'10px',
                height:47,
                width:160,
                ':hover':{
                  background: colors.greenAccent[400],
                  color: colors.white[100],
                }
            }}
          >
            <FileDownloadIcon style={{ marginRight: '5px' }}/>
            Export CSV
          </button>}
        </div>
        <div
          style={{
            display: 'inline-block',
          }}
        >
          {(activeRole === "screener" || activeRole === "creditManager" || activeRole === "disbursalManager") && <button
            onClick={() => handleActionButtonClick('allocate')}
            style={{
                fontWeight: 'bold',
                padding: '10px 20px',
                background: colors.white[100],
                color: colors.greenAccent[400],
                border: `1px solid ${colors.greenAccent[400]}`,
                borderRadius:"0px 10px 0px 10px",
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                display:"inline-block",
                margin:'10px',
            }}
          >
            Allocate
          </button>}
        </div>
      </>
      )}

      <div style={{ height: 500, width: '100%', padding: '20px', }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={totalRows}
          pageSizeOptions={[10]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={handlePageChange}
          onRowClick={handleRowClick}
          sx={{
            border:"none",
            borderTopRightRadius:"30px",
            borderBottomLeftRadius:"30px",
            boxShadow:"0px 0px 20px rgb(0,0,0,0.3)",
            color: colors.primary[400], // Default text color for rows
            '& .MuiDataGrid-columnHeaders .css-yseucu-MuiDataGrid-columnHeaderRow': {
              background: colors.primary[100], // Optional: Header background color
              color: colors.white[100], // White text for the headers
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: colors.primary[100], // Footer background color
              color: colors.white[100], // White text for the footer
            },
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer',
            },
          }}
        />
      </div>
    </div>
  );
};

export default CommonTable;
