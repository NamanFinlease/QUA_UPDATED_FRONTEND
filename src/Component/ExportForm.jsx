import React, { useState } from 'react';
import './ExportForm.css';

const ExportForm = (isSidebarOpen) => {
  console.log('running')
  const [exportData, setExportData]=useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleExport = (event) => {
    event.preventDefault();
    // Handle the export logic here
    console.log('Exporting data from:',exportData, fromDate, 'to:', toDate);
  };

  return (   
    <div className='export' >
    <form className="export-form" onSubmit={handleExport}>
     
    <label htmlFor="select-3">Form Data</label>
<select id="select-3" className="form-select">
  <option value="" disabled selected hidden>Select an option</option>
  <option value="x">A/C REPORT</option>
  <option value="y">BLACK LISTED</option>
  <option value="z">ICICI BANK CMS SHEET</option>
  <option value="y">ICICI DISBURSAL</option>
  <option value="y">ICICI RECOVERY</option>
  <option value="y">CALL LOAN FOLLOW UP</option>
  <option value="y">CIVIL REPORT</option>
  <option value="y">COLLECTION</option>
  <option value="y">LEAD DUPLICATE</option>
  <option value="y">LEAD REJECTED</option>
  <option value="y">LEAD TOTAL</option>
  <option value="y">LEGAL NOTIC DATA</option>
  <option value="y">LOAN CLOSE </option>
  <option value="y">LOAN DISBURSE HOLD </option>
  <option value="y">LOAN DISBURSE SEND BACK </option>
  <option value="y">LOAN DISBURSE </option>
  <option value="y">LOAN DISBURSE DUMP </option>
  <option value="y">LOAN PENDING </option>
  <option value="y">LOAN POOL </option>
  <option value="y">LOAN REFRENCE DETAIL </option>
  <option value="y">LOAN WAIVED </option>
  <option value="y">NEW COLLECTION REPORT </option>
  <option value="y">NEW DISBURSED </option>
  <option value="y">OUT STANDIND DATA </option>

  <option value="y">PENDING COLLECTION  AC  VARIFICATION</option>
  <option value="y">PRE COLLECTION</option>
  <option value="y">REJECTED PAYMENT</option>
  <option value="y">SUSPENCE VARIFIED PAYMENTS</option>
  <option value="y">TOTAL APROVED SANCTION</option>
  <option value="y">TOTAL RECOVERY</option>
  <option value="y">TOTAL  SANCTION</option>
  <option value="y">VISIT COMPLETED</option>
  <option value="y">VISIT PANDING</option>
  <option value="y">VISIT REQUESTED</option>
</select>
     <label htmlFor="from-date">From Date</label>
      <input
        type="date"
        id="from-date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
      
      <label htmlFor="to-date">To Date</label>
      <input
        type="date"
        id="to-date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />
      
      <button type="submit" className="export-button">Export</button>
    </form>
        </div>
  );
};

export default ExportForm;
