import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect } from 'react'
import { useFetchAllEmployeeQuery } from '../Service/Query';
import CommonTable from '../Component/CommonTable';

const columns = [
  { field: 'fName', headerName: 'First Name', width: 150 },
  { field: 'lName', headerName: 'Last Name', width: 150 },
  { field: 'gender', headerName: 'Gender', width: 100 },
  { field: 'personalEmail', headerName: 'Personal Email', width: 200 },
  { field: 'mobile', headerName: 'Mobile', width: 150 },
  { field: 'city', headerName: 'City', width: 150 },
  { field: 'state', headerName: 'State', width: 150 },
  { field: 'loanAmount', headerName: 'Loan Amount', width: 150 },
  { field: 'salary', headerName: 'Salary', width: 150 },
];

export default function EmployeeList() {

  const { data } = useFetchAllEmployeeQuery()


  const rows = data?.map(lead => ({
    id: lead._id, // Unique ID for each lead
    fName: lead.fName,
    lName: lead.lName,
    gender: lead.gender,
    personalEmail: lead.email,
    mobile: lead.mobile,
    city: lead.city,
    state: lead.state,
    loanAmount: lead.loanAmount,
    salary: lead.salary,
  }));

  useEffect(() => {
  }, [])
  return (
    <CommonTable
          columns={columns}
          rows={rows}
          paginationModel={{ page: 1, pageSize: 10 }}
          title="Employees List"
      />
  )
}
