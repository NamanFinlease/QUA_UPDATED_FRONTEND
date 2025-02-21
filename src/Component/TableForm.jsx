// TableForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TableForm = () => {
  const [headers, setHeaders] = useState('');
  const [rows, setRows] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Convert headers and rows to arrays
    const headerArray = headers.split(',').map(item => item.trim());
    const rowArray = rows.split(';').map(row => row.split(',').map(item => item.trim()));

    // Pass the data as state when navigating to DynamicTable
    navigate('/table', { state: { headers: headerArray, rows: rowArray } });
  };

  return (
    <div>
      <h1>Dynamic Table Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Headers (comma-separated):</label>
          <input
            type="text"
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Rows (semicolon-separated, each row comma-separated):</label>
          <textarea
            value={rows}
            onChange={(e) => setRows(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TableForm;
