import * as Yup from 'yup';
import { regexPatterns } from './regex';
import moment from 'moment';

const today = moment().format('DD/MM/YYYY');


export const residenceSchema = Yup.object().shape({
    address: Yup.string().required("Address is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    pincode: Yup.string()
        .matches(/^[0-9]{6}$/, "Invalid pincode (must be 6 digits)")
        .required("Pincode is required"),
    residingSince: Yup.string().required("Residence Since is required"),
});

export const employmentSchema = Yup.object().shape({
    companyName: Yup.string()
        .required("Company name is required")
        .min(2, "Company name must be at least 2 characters long")
        .max(100, "Company name cannot exceed 100 characters"),

    companyAddress: Yup.string()
        .required("Company address is required")
        .min(5, "Company address must be at least 5 characters long")
        .max(255, "Company address cannot exceed 255 characters"),

    state: Yup.string()
        .required("State is required")
        .min(2, "State must be at least 2 characters long"),

    city: Yup.string()
        .required("City is required")
        .min(2, "City must be at least 2 characters long"),

    pincode: Yup.string()
        .required("Pincode is required")
        .matches(/^\d{6}$/, "Pincode must be exactly 6 digits"),

    department: Yup.string()
        .required("Department is required")
        .min(2, "Department must be at least 2 characters long")
        .max(100, "Department cannot exceed 100 characters"),

    designation: Yup.string()
        .required("Designation is required")
        .min(2, "Designation must be at least 2 characters long")
        .max(100, "Designation cannot exceed 100 characters"),

    employedSince: Yup.date()
        .required("Employment start date is required")
        .max(new Date(), "Employment start date cannot be in the future"),
});

export const referenceSchema = Yup.object().shape({
    reference1: Yup.object().shape({
        name: Yup.string()
            .required("Reference 1 Name is required")
            .min(2, "Name must be at least 2 characters long"),
        mobile: Yup.string()
            .required("Reference 1 Mobile is required")
            .matches(/^[0-9]{10}$/, "Mobile must be a valid 10-digit number"),
        relation: Yup.string().required("Reference 1 Relation is required"),
    }),
    reference2: Yup.object().shape({
        name: Yup.string()
            .required("Reference 2 Name is required")
            .min(2, "Name must be at least 2 characters long"),
        mobile: Yup.string()
            .required("Reference 2 Mobile is required")
            .matches(/^[0-9]{10}$/, "Mobile must be a valid 10-digit number")
            .test(
                "mobile-not-same",
                "Reference 2 Mobile must be different from Reference 1 Mobile",
                function (value) {
                    const { reference1 } = this.from[1].value;
                    console.log("mobile value", value, reference1, this);
                    return reference1?.mobile !== value; // Compare mobile numbers
                }
            ),
        relation: Yup.string().required("Reference 2 Relation is required"),
    }),
});

export const leadUpdateSchema = Yup.object().shape({
    fName: Yup.string()
        .required("First Name is required")
        .min(2, "First Name must be at least 2 characters"),
    mName: Yup.string(),
    lName: Yup.string(),
    gender: Yup.string().required("Gender is required"),
    dob: Yup.date().required("Date of Birth is required"),
    aadhaar: Yup.string()
        .required("Aadhaar is required")
        .matches(/^\d{12}$/, "Aadhaar must be 12 digits"),
    pan: Yup.string()
        .required("PAN is required")
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
    mobile: Yup.string()
        .required("Mobile is required")
        .matches(/^\d{10}$/, "Mobile must be exactly 10 digits") // Exact 10 digits validation
        .test(
            "len",
            "Mobile must be exactly 10 digits",
            (val) => val && val.length <= 10 // Custom test to ensure it's exactly 10 digits
        ),
    alternateMobile: Yup.string().nullable(),
    personalEmail: Yup.string()
        .required("Personal Email is required")
        .email("Invalid email format"),
    officeEmail: Yup.string().email("Invalid email format"),
    loanAmount: Yup.number()
        .required("Loan Amount is required")
        .positive("Loan Amount must be positive")
        .integer(),
    salary: Yup.number()
        .required("Salary is required")
        .positive("Salary must be positive")
        .integer(),
    pinCode: Yup.string()
        .required("Pin Code is required")
        .matches(/^\d{6}$/, "Pin Code must be 6 digits"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
});

export const disburseSchema = Yup.object().shape({
  payableAccount: Yup.string().required('Payable Account is required'),
  amount: Yup
    .string()
    .matches(/^\d+(\.\d{1,2})?$/, 'Amount must be a valid number (up to 2 decimal places)')
    .required('Amount is required'),
  paymentMode: Yup.string().required('Payment Mode is required'),
  channel: Yup.string().required('Channel is required'),
  disbursalDate: Yup.date()
    .typeError('Disbursal Date is required')
    .required('Disbursal Date is required'),
  utr: Yup.string().required('UTR is required'),
  remarks: Yup.string().required('Remarks are required'),
});

// Add and update bank details....
export const bankDetailsSchema = Yup.object().shape({
    bankName: Yup.string()
        .required("Bank Name is required")
        .min(2, "Bank Name must be at least 2 characters long")
        .max(50, "Bank Name cannot exceed 50 characters"),
    branchName: Yup.string()
        .required("Branch Name is required")
        .min(2, "Branch Name must be at least 2 characters long")
        .max(50, "Branch Name cannot exceed 50 characters"),
    bankAccNo: Yup.string()
        .required("Bank Account Number is required")
        // .matches(/^\d+$/, 'Bank Account Number must contain only digits')
        .min(8, "Bank Account Number must be at least 8 digits long")
        .max(20, "Bank Account Number cannot exceed 20 digits"),
    ifscCode: Yup.string()
        .required("IFSC Code is required")
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid IFSC Code"),
    beneficiaryName: Yup.string()
        .required("Beneficiary Name is required")
        .min(2, "Beneficiary Name must be at least 2 characters long")
        .max(50, "Beneficiary Name cannot exceed 50 characters"),
    accountType: Yup.string()
        .required("Account Type is required")
        .oneOf(["savings", "current"], "Invalid Account Type"),
});

 
export const camSchema = Yup.object().shape({
  salaryAmount1: Yup.string()
  .matches(regexPatterns.onlyNumbers, 'Invalid salary amount'),
  salaryAmount2: Yup.string()
  .matches(regexPatterns.onlyNumbers, 'Invalid salary amount'),
  salaryAmount3: Yup.string()
  .matches(regexPatterns.onlyNumbers, 'Invalid salary amount'),
  averageSalary: Yup.string()
  .matches(regexPatterns.onlyNumbers, 'Invalid salary amount'),
  actualNetSalary: Yup.string()
  .required('Net Salary is required')
  .matches(regexPatterns.onlyNumbers, 'Invalid salary amount'),
  salaryToIncomeRatio: Yup.string()
  .required('Salary to Income Ratio is required')
  .matches(regexPatterns.onlyNumbers, 'Invalid Ratio'),
  loanRecommended: Yup.string()
  .required('Loan Recommended is required')
  .matches(regexPatterns.onlyNumbers, 'Invalid Recommended Loan'),
  roi: Yup.string()
  .required('ROI is required')
  .matches(regexPatterns.onlyNumbers, 'Invalid ROI'),
  adminFeePercentage: Yup.string()
  .required('Processing Fee is required')
  .matches(regexPatterns.onlyNumbers, 'Invalid Processing Fee'),
  finalsalaryToIncomeRatioPercentage: Yup.string()
  .required('Ratio is required')
  .matches(regexPatterns.onlyNumbers, 'Invalid Ratio'),
});


export const paymentReceivedSchema = Yup.object().shape({
  receivedAmount : Yup.string()
  .required('Payment amount is required'),
  paymentReceivedDate : Yup.string()
  .matches(
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    'Date must be in DD/MM/YYYY format'
  )
  .test(
    'is-valid-date',
    'Invalid date',
    (value) => moment(value, 'DD/MM/YYYY', true).isValid()
  )
  .test(
    'is-before-today',
    `Date must be before ${today}`,
    (value) => moment(value, 'DD/MM/YYYY').isBefore(moment().add(1, 'day'))
  ),
  closingType : Yup.string()
  .required('Choose Payment Type'),
  bankName: Yup.string()
  .required('Choose Bank Name'),
  paymentMode : Yup.string()
  .required('Choose Payment Mode'),
  transactionId : Yup.string()
  .required('Reference Number is required'),
  accountRemarks : Yup.string()
  .required('Remarks is required')
  .trim()
  .min(30, "Remarks must be at least 30 characters long"),
});

  