import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaPen, FaLock } from 'react-icons/fa';  // Import icons from react-icons
import { useGetEmployeesQuery } from '../Service/Query';

const ViewUsersForm = () => {
  // Extracting header and rows data from location state
  const location = useLocation();
  const { header, rows } = location.state || { 
    header: ["ID", "Action", "Name", "Email", "Mobile"], // Default headers
    rows: [] // Default empty rows
  };
  const {data}=useGetEmployeesQuery();

  // Internal CSS styles for the table
  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '80px',
  };

  const thStyles = {
    backgroundColor: '#f8f9fa',
    color: '#333',
    padding: '12px',
    border: '1px solid #dee2e6',
    textAlign: 'left',
  };

  const tdStyles = {
    padding: '10px',
    border: '1px solid #dee2e6',
    textAlign: 'left',
  };

  const iconStyles = {
    marginRight: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#007bff',
  };

  const actionButtonContainer = {
    display: 'flex',
    gap: '10px',
  };

  return (
    <div>
      <table style={tableStyles}>
        <thead>
          <tr>
            {header.map((col, index) => (
              <th key={index} style={thStyles}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows && rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} style={tdStyles}>
                    {cellIndex === 1 ? (
                      // If the column is "Action", show action icons
                      <div style={actionButtonContainer}>
                        <FaPen style={iconStyles} title="Edit" onClick={() => handleEdit(row[0])} />
                        <FaLock style={iconStyles} title="Lock" onClick={() => handleLock(row[0])} />
                      </div>
                    ) : (
                      cell // For other columns, just show the cell data
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={header.length} style={{ textAlign: 'center', padding: '10px' }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Sample handlers for Edit and Lock actions
const handleEdit = (id) => {
  console.log(`Edit user with ID: ${id}`);
  // Implement navigation or modal opening to edit the user details
};

const handleLock = (id) => {
  console.log(`Lock user with ID: ${id}`);
  // Implement functionality to lock the user
};

export default ViewUsersForm;
