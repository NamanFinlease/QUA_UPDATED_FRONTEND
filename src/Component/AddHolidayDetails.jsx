import React, { useState } from 'react';

const AddHolidayDetails = () => {
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayName, setHolidayName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Holiday Date:', holidayDate);
    console.log('Holiday Name:', holidayName);
  };

  return (
    <div className="container mt-5">
      
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="text-center mb-4" style={{color:'black'}}>Add Holiday Details</h2>
        <div className="form-group mb-3">
          <label htmlFor="holidayDate">Holiday Date</label>
          <input
            type="date"
            className="form-control"
            id="holidayDate"
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
            value={holidayName}
            onChange={(e) => setHolidayName(e.target.value)}
            placeholder="Enter Holiday Name"
            required
          />
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-success w-50">Add Holiday Details</button>
        </div>
      </form>
    </div>
  );
};

export default AddHolidayDetails;
