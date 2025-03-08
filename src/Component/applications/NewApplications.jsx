import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
// import { useAllocateLeadMutation, useFetchAllLeadsQuery } from '../Service/Query';
import { useNavigate } from 'react-router-dom';
import { useAllocateApplicationMutation, useFetchAllApplicationQuery } from '../../Service/applicationQueries';
import Header from '../Header';
import useAuthStore from '../store/authStore';
import CommonTable from '../CommonTable';
import { set } from "react-hook-form";

const NewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { empInfo,activeRole } = useAuthStore()
  //   const apiUrl = import.meta.env.VITE_API_URL;
  const [isAllocating, setIsAllocating] = useState(false);
  const [allocateApplication, { data: updateApplication, isSuccess }] = useAllocateApplicationMutation();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const navigate = useNavigate()


  const { data: allApplication, isSuccess: applicationSuccess,isLoading, refetch } = useFetchAllApplicationQuery({ page: paginationModel.page + 1, limit: paginationModel.pageSize })

    const handleAllocate = async () => {
      setIsAllocating(true);
      await allocateApplication(selectedApplication);
      setIsAllocating(false);
    };

    const handleCheckboxChange = (id) => {
        setSelectedApplication(selectedApplication === id ? null : id);
    };

    const handlePageChange = (newPaginationModel) => {
        // Fetch new data based on the new page
        setPaginationModel(newPaginationModel);
        refetch(newPaginationModel); // Adjust this according to your data fetching logic
    };

    useEffect(() => {
        if (isSuccess) {
            navigate("/application-process");
        }
    }, [isSuccess, allApplication]);

    useEffect(() => {
        refetch();
    }, [page, allApplication]);

  useEffect(() => {
    if (applicationSuccess) {

      setApplications(allApplication);
      setTotalApplications(allApplication?.totalApplications)
    }

  }, [allApplication]);
  const columns = [
    {
      field: 'select',
      headerName: '',
      width: 50,
      renderCell: (params) => (
        activeRole === "creditManager" &&
        <input
          type="checkbox"
          checked={selectedApplication === params.row.id}

          onChange={() => handleCheckboxChange(params.row.id)}
        />
      ),
    },
    { field: 'leadNo', headerName: 'Lead Number', width: 200 },
    { field: 'name', headerName: 'Full Name', width: 200 },
    { field: 'mobile', headerName: 'Mobile', width: 150 },
    { field: 'aadhaar', headerName: 'Aadhaar No.', width: 150 },
    { field: 'pan', headerName: 'PAN No.', width: 150 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'state', headerName: 'State', width: 150 },
    { field: 'loanAmount', headerName: 'Loan Amount', width: 150 },
    { field: 'salary', headerName: 'Salary', width: 150 },
    { field: 'source', headerName: 'Source', width: 150 },
    ...(activeRole === "sanctionHead" || activeRole === "admin"
      ? [{ field: 'recommendedBy', headerName: 'Recommended By', width: 150 }]
      : []),  
    { field: "breDecision", headerName: "BRE Decision", width: 200 },
    {
        field: "maxLoanByBRE",
        headerName: "Max Loan Recommended by BRE",
        width: 200,
    },
  ];

  const rows = applications?.applications?.map(application => ({
    id: application?._id, // Unique ID for each lead
    leadNo: application?.lead?.leadNo,
    name: `${application?.lead?.fName} ${application?.lead?.mName} ${application?.lead?.lName}`,
    mobile: application?.lead?.mobile,
    aadhaar: application?.lead?.aadhaar,
    pan: application?.lead?.pan,
    city: application?.lead?.city,
    state: application?.lead?.state,
    loanAmount: application?.lead?.loanAmount,
    salary: application?.lead?.salary,
    source: application?.lead?.source,
    ...((activeRole === "sanctionHead" || activeRole === "admin") &&
      { recommendedBy: `${application?.lead?.recommendedBy?.fName}${application?.lead?.recommendedBy?.mName ? ` ${application?.lead?.recommendedBy?.mName}` : ``} ${application?.lead?.recommendedBy?.lName}`, }),
    breDecision: application?.bre?.finalDecision || "-",
    maxLoanByBRE: application?.bre?.maxLoanAmount || 0,
  }));

  return (
    <>
      <CommonTable
          columns={columns}
          rows={rows}
          totalRows={totalApplications}
          paginationModel={{ paginationModel }}
          onPageChange={handlePageChange}
          title="New Applications"
          actionButton={true}
          actionButtonText="Allocate Leads"
          onAllocateButtonClick={handleAllocate}
          loading={isLoading}
          isAllocating={isAllocating}
      />
    </>
  );
};

export default NewApplications;
