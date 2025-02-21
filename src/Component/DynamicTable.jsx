import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Container } from '@mui/material';

const DataTable = () => {
  // Define the headers (columns)
  const headers = [
    "Lead Id", "Action", "Applied On", "Source", "Name", "State", "City", "Branch", "Mobile", "Pan", "UserType", "Status", "Sanction Manager", "Sanction-On", "Sanction-Amount"
  ];

  // Define the rows of data
  const rows = [
    ["701", "Approved", "2024-09-09", "Online", "Mia Robinson", "California", "San Francisco", "Branch Q", "555-7777", "UVW123456X", "Individual", "Active", "Manager 1", "2024-09-10", "$5000"],
    ["702", "Approved", "2024-09-08", "Offline", "Ethan Clark", "New York", "Staten Island", "Branch R", "555-8888", "XYZ789012Y", "Business", "Pending", "Manager 2", "2024-09-12", "$7500"],
    ["703", "Approved", "2024-09-07", "Referral", "Olivia Martinez", "Texas", "Fort Worth", "Branch S", "555-9999", "ABC345678Z", "Individual", "Completed", "Manager 3", "2024-09-11", "$6000"],
    ["704", "Approved", "2024-09-06", "Online", "Noah Lee", "Florida", "Tampa", "Branch T", "555-0000", "DEF901234A", "Business", "Active", "Manager 4", "2024-09-14", "$5500"]
  ];

  // Convert header array to column objects
  const columns = headers.map((header, index) => ({
    field: `col${index}`, // Unique field names
    headerName: header,   // Header text
    flex: 1               // Auto flex width for better layout
  }));

  // Convert rows array to an array of objects with keys matching the column field names
  const rowData = rows.map((row, index) => {
    const rowObject = { id: index + 1 }; // Assign a unique ID for each row
    row.forEach((value, idx) => {
      rowObject[`col${idx}`] = value; // Assign value to the corresponding column
    });
    return rowObject;
  });

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px' }}>
      <div style={{ height: 400, width: '100%' }}>  {/* Explicit height and full width */}
        <DataGrid
          rows={rowData}         // Pass the row data
          columns={columns}      // Pass the column definitions
          pageSize={5}           // Number of rows per page
          rowsPerPageOptions={[5]}
          disableSelectionOnClick // Disable row selection behavior on click
          sx={{
            '& .MuiDataGrid-root': {
              border: '1px solid #ddd',
            },
          }}
        />
      </div>
    </Container>
  );
};

export default DataTable;
