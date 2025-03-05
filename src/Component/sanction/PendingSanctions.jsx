import { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import CommonTable from '../CommonTable';
import { usePendingSanctionsQuery } from '../../Service/applicationQueries';
import CustomToolbar from '../CustomToolbar';

const PendingSanctions = () => {
  const [applications, setApplications] = useState([]); 
  const [totalApplications, setTotalApplications] = useState(0); 
  const [page, setPage] = useState(1); 
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const navigate = useNavigate()


  const { data: allApplication, isLoading, isSuccess:applicationSuccess, refetch } = usePendingSanctionsQuery({page:paginationModel.page+1,limit:paginationModel.pageSize})

  useEffect(() => {
    if(applicationSuccess){

        setApplications(allApplication?.sanctions);
        setTotalApplications(allApplication?.totalSanctions)
    }

  }, [page,allApplication,applicationSuccess]);





  

  const handlePageChange = (newPaginationModel) => {
    // Fetch new data based on the new page
    setPaginationModel(newPaginationModel)
  };

const handleLeadClick = (lead) => {
  navigate(`/sanction-profile/${lead.id}`)
}
  const columns = [
    { field: 'leadNo', headerName: 'Lead Number', width: 200 },
    { field: 'name', headerName: 'Full Name', width: 200 },
    { field: 'mobile', headerName: 'Mobile', width: 150 },
    { field: 'aadhaar', headerName: 'Aadhaar No.', width: 150 },
    { field: 'pan', headerName: 'PAN No.', width: 150 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'state', headerName: 'State', width: 150 },
    { field: 'loanAmount', headerName: 'Loan Amount', width: 150 },
    { field: 'salary', headerName: 'Salary', width: 150 },
    { field: 'recommendedBy', headerName: 'Recommended By', width: 150 },
    { field: 'source', headerName: 'Source', width: 150 },
  ];

  const rows = applications?.map(sanction => {
    return ({
    id: sanction?._id, // Unique ID for each lead
    leadNo: sanction?.application?.lead?.leadNo,
    name: `${sanction?.application?.lead?.fName} ${sanction?.application?.lead?.mName} ${sanction?.application?.lead?.lName}`,
    mobile: sanction?.application?.lead?.mobile,
    aadhaar: sanction?.application?.lead?.aadhaar,
    pan: sanction?.application?.lead?.pan,
    city: sanction?.application?.lead?.city,
    state: sanction?.application?.lead?.state,
    loanAmount: sanction?.application?.lead?.loanAmount,
    salary: sanction?.application?.lead?.salary,
    recommendedBy: `${sanction?.application?.recommendedBy?.fName}${sanction?.application?.recommendedBy?.mName ? ` ${sanction?.application?.recommendedBy?.mName}` : ``} ${sanction?.application?.recommendedBy?.lName}`,
    source: sanction?.application?.lead?.source,
  })});


  return (
    <>
      <CommonTable
          columns={columns}
          rows={rows}
          totalRows={totalApplications}
          paginationModel={paginationModel}
          onPageChange={handlePageChange}
          onRowClick={handleLeadClick}
          title="Pending Sanctions"
          loading={isLoading}
      />
    </>
  );
};

export default PendingSanctions;
