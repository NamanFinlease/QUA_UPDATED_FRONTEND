import React, { useState } from 'react';
import './MISReport.css';  // Custom CSS file

const MISReport = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isReferenceChecked, setIsReferenceChecked] = useState(false);
  const [report, setReport] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setIsReferenceChecked(event.target.checked);
  };

  const generateReport = () => {
    if (!isReferenceChecked) {
      setReport('Please check the box.');
      return;
    }

    setReport(`
      Selected Option: ${selectedOption}
      C4C Reference Checkbox Checked: ${isReferenceChecked}
    `);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>MIS Report Generator</h1>
        
        <div className="form-group">
          <label>Select an Option:</label>
          <select 
            className="form-control" 
            value={selectedOption} 
            onChange={handleOptionChange}
          >
            <option value="" disabled>Select</option>
            <option value="Option 1">ICICI COLLECTION & OUSTANDING</option>
            <option value="Option 2">ICICI LOAN PORTFOLIO</option>
            <option value="Option 3">COLLECTION (AFTER 10 DPD ) -RECOVERY</option>
            <option value="Option 4">COLLECTION (AFTER ON BEFORE DUE DATE )-PRE-RECOVERY</option>
            <option value="Option 5">COLLECTION (AFTER 10 DPD ) -COLLECTION</option>
            <option value="Option 6">COLLECTION: BRANCH WISE BY REPAY DATE</option>
            <option value="Option 7">COLLECTION:COLLECTION EXECUTIVE BY PAYMENT DATE </option>
            <option value="Option 8">COLLECTION: COLLECTION EXECUTIVE BY READY DATE  </option>
            <option value="Option 9">COLLECTION: SANCTION EXECUTIVE BY PAYMENT DATE  </option>
            <option value="Option 10">COLLECTION: SANCTION EXECUTIVE BY READY DATE  </option>
            <option value="Option 11">COLLECTION BUCKET-WISE REPORT (AMOUNT)  </option>
            <option value="Option 12">COLLECTION BUCKET-WISE REPORT (CASES)  </option>
            <option value="Option 13">COLLECTION CALL FOLLOWUP STATUS WISE   </option>
            <option value="Option 14">COLLECTION CALL FOLLOWUP  WITH TIME    </option>
            <option value="Option 15">HOURLY DISBURSAL REPORT  </option>
            <option value="Option 16">HOURLY STATUS WISE REPORT  </option>
            <option value="Option 17">LEAD CONVERSION REPORT (FRESH)  </option>
            <option value="Option 18">LEAD CONVERSION REPORT (REPEAT)  </option>
            <option value="Option 19">LEAD PAN-INDIA STATUS WISE   </option>
            <option value="Option 20">LEAD STATUS SOURCE WISE   </option>
            <option value="Option 21">LEAD SOURCING CITY STATUS WISE   </option>
            <option value="Option 22">LEAD UTM SOURCE STATUS WISE   </option>
            <option value="Option 23">MONTH WISE COLLECTION REPORT   </option>
            <option value="Option 24">MONTH WISE DISBURSAL REPORT </option>
            <option value="Option 25">MONTH WISE DISBURSAL SUMMARY REPORT </option>
            <option value="Option 26">OUTSTANDING SANCTION EXECUTIVE AMOUNT WISE REPORT </option>
            <option value="Option 27">OUTSTANDING SANCTION EXECUTIVE CASE WISE REPORT </option>
            <option value="Option 28">OUTSTANDING SANCTION EXECUTIVE CASE WISE REPORT DATE RANGE </option>
            <option value="Option 29">SANCTION EXECUTIVE WISE T/A DATE REPORT </option>
            <option value="Option 30">SANCTION CASE TYPE REPORT </option>
            <option value="Option 31">SANCTION EXECUTIVE WISE STATUS REPORT(FRESH) </option>
            <option value="Option 32">SANCTION EXECUTIVE WISE STATUS REPORT(REPEAT) </option>
            <option value="Option 33">SANCTION KPI REPORT </option>
            <option value="Option 34">VISIT : BRANCH WISE REPORT </option>
            <option value="Option 35">VISIT : RM WISE VISIT & COLLECTION REPORT </option>
            <option value="Option 36">VISIT : RM(CFF) VISIT CONVEYANCE WISE REPORT </option>
          </select>
        </div>

        <div className="horizontal-group">
          <div className="checkbox-label">
            <input 
              type="checkbox" 
              id="referenceCheck" 
              checked={isReferenceChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="referenceCheck">C4C Reference Checkbox</label>
          </div>
        </div>

        <button className="btn" onClick={generateReport}>
          Create Report
        </button>

        {report && (
          <div className="report">
            <h2>Generated Report</h2>
            <pre>{report}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MISReport;
