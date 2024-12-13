

const accordionStyles = {
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #8cb4f5, #474e59)',
    boxShadow: '5px 5px 10px #d1d5db, -5px -5px 10px #ffffff',
    marginBottom: '20px'
};

const paperStyles = {
    padding: '30px',
    borderRadius: '15px',
    backgroundColor: '#fafafa',
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.1)',
};

const buttonStyles = {
    borderRadius: '8px',
    padding: '10px 20px',
    background: 'linear-gradient(45deg, #42a5f5, #007bb2)',
    color: '#fff',
    '&:hover': {
        background: 'linear-gradient(45deg, #007bb2, #42a5f5)',
    },
};

const ApplicantDetails = ({ residence, reference, employmentData }) => {


  




    return (
        <>
            <Residence residence={residence} />



           
        </>
    );
};

export default ApplicantDetails;
