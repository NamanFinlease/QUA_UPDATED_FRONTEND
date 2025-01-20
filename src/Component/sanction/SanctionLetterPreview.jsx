import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Link,
} from '@mui/material';

const SanctionLetterPreview = ({ id, preview, previewData, setPreview }) => {
    return (
        <>
            <Box sx={{ fontFamily: 'Arial, Helvetica, sans-serif', padding: "0px 5px", }}>

                <Box>

                    {/* Key Fact Statement */}
                    <Box component={Paper} sx={{ background: "white", color: "black", width: "70%", margin: "0px auto", padding: "10px" }}>
                        <table style={{ textAlign: "left", borderCollapse: "collapse", }} sx={{ border: "1px solid", width: "60%", margin: "2px auto", padding: "10px", textAlign: "left", }}>
                            <tr>
                                <th colspan="3" style={{ fontWeight: "bold", border: "1px solid", textAlign: "center", padding: "10px" }}>Key Fact Statement</th>
                            </tr>
                            <tr>
                                <th style={{ border: "1px solid", padding: "5px" }}>S.No.</th>
                                <th style={{ border: "1px solid", padding: "5px" }}>Parameters</th>
                                <th style={{ border: "1px solid", padding: "5px" }}>Details</th>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(I)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Name</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>{[fullname]}</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(II)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Loan Amount</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>₹ {[loanAmount]}</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(III)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>ROI (in % per day)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>{[roi]}</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(IV)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Total Interest Charge during the entire Tenure of the loan</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>₹ {[totalInterest]}</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(V)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Processing Fee (Incl. 18% GST)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>₹ {[processingFee]}</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(VIII)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Net Disbursed Amount</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>₹ {[disbursalAmount]}</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(IX)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Total Repayment Amount</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>₹ {[repaymentAmount]}</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(X)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Annual Percentage Rate - Effective annualized interest rate (in %)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>{[annualPercentage]}</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(XI)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Tenure of the Loan (days)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>{[tenure]} Days</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(XII)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Repayment Frequency by the borrower</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>One Time Only</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(XV)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Number of installments of repayment</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>1</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(XIV)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Amount of each installment of repayment (in ₹)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>(IX)</td>
                            </tr>
                            <tr>
                                <th colspan="3" sx={{ textAlign: "left" }} style={{ border: "1px solid", padding: "5px" }}>Details about Contingent Charges</th>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(XV)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Rate of annualized penal charges in case of delayed payments (if any)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Double the (III)</td>
                            </tr>
                            <tr>
                                <th colspan="3" sx={{ textAlign: "left" }} style={{ border: "1px solid", padding: "5px" }}>Details about Contingent Charges</th>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(XVI)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Cooling off/look-up period during which borrower shall not be charged any penalty on prepayment of loan</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>3 Days</td>
                            </tr>
                            <tr>
                                <td style={{ border: "1px solid", padding: "5px" }}>(XVII)</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Name, designation, Address and phone number of nodal grievance redressal officer designated specifically to deal with FinTech/ digital lending related complaints/ issues</td>
                                <td style={{ border: "1px solid", padding: "5px" }}>Nitin Vaid Mobile: +91-9355016290, Address: S-370, Panchsheel Park, New Delhi - 110017</td>
                            </tr>
                        </table>
                    </Box>

                </Box>

                {/* Sanction Letter */}
                <Box
                    sx={{
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        lineHeight: '12px',
                        fontSize: '12px',
                        marginTop: '10px !important',
                        width: '100%',
                        margin: 'auto',
                    }}
                >
                    <Box component={Paper} sx={{ background: "white", color: "black", width: "70%", margin: "0px auto", padding: "10px" }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <img
                                src="https://ramleela.s3.ap-south-1.amazonaws.com/QUALOAN+Header+Footer+/Header.webp"
                                alt="Sanctionletter-header"
                                style={{ width: '100%', height: '135px' }}
                            />
                        </Box>

                        <Typography variant="body1" sx={{ color: '#0363a3', fontSize: '15px', textAlign: 'right' }}>
                            Date: {sanctionDate}
                        </Typography>

                        <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: "left" }}>To,</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{title} {fullname}</Typography>
                        <Typography variant="body1">{residenceAddress}</Typography>
                        <Typography variant="body1">{stateCountry}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: "left" }}>Contact No. : +91-{mobile}</Typography>

                        <Typography variant="body1" sx={{ marginTop: '10px', textAlign: "left" }}>
                            Thank you for showing your interest in Qualoan and giving us an opportunity to serve you.
                        </Typography>
                        <Typography variant="body1" sx={{ marginTop: '10px', textAlign: "left" }}>
                            We are pleased to inform you that your loan application has been approved as per the below mentioned terms and conditions.
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop: '10px', textAlign: "left" }}>
                            S-370, Panchsheel Park, Delhi, 110017, India
                        </Typography>

                        <Typography variant="body1" sx={{ marginTop: '10px', textAlign: "left" }}>
                            This sanction will be subject to the following Terms and Conditions:
                        </Typography>

                        <Table sx={{ width: '100%', border: '1px solid #ddd', marginTop: '10px' }}>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#0363a3', fontWeight: 'bold' }}>Loan Number</TableCell>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#333' }}>{loanNo}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#0363a3', fontWeight: 'bold' }}>Customer Name</TableCell>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#333' }}>{fullname}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#0363a3', fontWeight: 'bold' }}>PAN</TableCell>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#333' }}>{pan}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#0363a3', fontWeight: ' bold' }}>Sanctioned Loan Amount (Rs.)</TableCell>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#d9534f' }}>{loanAmount} /-</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#0363a3', fontWeight: 'bold' }}>Rate of Interest (%)</TableCell>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#5bc0de' }}>{roi}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#0363a3', fontWeight: 'bold' }}>Date of Disbursal</TableCell>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#333' }}>{disbursalDate}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#0363a3', fontWeight: 'bold' }}>Total Repayment Amount (Rs.)</TableCell>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#d9534f' }}>{repaymentAmount}/-</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#0363a3', fontWeight: 'bold' }}>Tenure in Days</TableCell>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#333' }}>{tenure}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#0363a3', fontWeight: 'bold' }}>Repayment Date</TableCell>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#333' }}>{repaymentDate}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#0363a3', fontWeight: 'bold' }}>Penal Interest (%)</TableCell>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#333' }}>{penalInterest}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#0363a3', fontWeight: 'bold' }}>Processing Fee (Rs.)</TableCell>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#333' }}>{processingFee} /- (Inclusive of GST)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#0363a3', fontWeight: 'bold' }}>Repayment Cheque(s)</TableCell>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#333' }}>-</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#0363a3', fontWeight: 'bold' }}>Cheque drawn on (name of the Bank)</TableCell>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#333' }}>-</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#0363a3', fontWeight: 'bold' }}>Cheque and NACH Bouncing Charges (Rs.)</TableCell>
                                    <TableCell sx={{ backgroundColor: '#ffffff', padding: '8px', color: '#333' }}>{bouncedCharges} /- per bouncing/dishonour</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <Typography variant="body1" sx={{ marginTop: '10px', textAlign: "left" }}>
                            Henceforth, visiting (physically) your Workplace and Residence has your concurrence on it.
                        </Typography>
                        <Typography variant="body1" sx={{ marginTop: '10px', textAlign: "left" }}>
                            Kindly request you to go through above mentioned terms and conditions and provide your kind acceptance over E-mail so that we can process your loan for final disbursement.
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#0363a3', fontWeight: 'bold', marginTop: '10px', textAlign: "left" }}>
                            Best Regards,
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#0363a3', fontWeight: 'bold', textAlign: "left" }}>
                            Team Qualoan
                        </Typography>
                        <Typography variant="body1" sx={{ marginTop: '10px', textAlign: "left" }}>
                            If you are not able to click on the accept button then please copy and paste this url in browser to proceed or click here.
                            <Link href="https://qualoan.com">Qualoan</Link>
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginTop: '10px', textAlign: "left" }}>
                            Kindly Note:
                        </Typography>
                        <Typography variant="body1" sx={{ marginTop: '10px', textAlign: "left" }}>
                            You can Prepay/Repay the loan amount using our link REPAY LOAN.
                        </Typography>
                        <Typography variant="body1" sx={{ marginTop: '10px', textAlign: "left" }}>
                            Non-payment of loan on time will adversely affect your Credit score, further reducing your chances of getting loan again. Upon approval, the processing fee will be deducted from your Sanction amount and the balance amount will be disbursed to your account.
                        </Typography>
                        <Typography variant="body1" sx={{ marginTop: '10px', textAlign: "left" }}>
                            This Sanction letter is valid for 24 Hours only.
                        </Typography>
                        <Box sx={{ textAlign: 'center', marginTop: '10px' }}>
                            <img
                                src="https://ramleela.s3.ap-south-1.amazonaws.com/QUALOAN+Header+Footer+/letterhead_footer.webp"
                                alt="Sanctionletter-footer"
                                style={{ width: '100%', height: '110px' }}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Terms and Conditions */}
                <Box sx={{ width: "100%", margin: "10px auto", }}>
                    <Box component={Paper}
                        sx={{
                            fontFamily: 'Arial, Helvetica, sans-serif',
                            fontSize: '14px',
                            padding: '20px',
                            width: '70%',
                            margin: '0px auto',
                            background: "white",
                            color: "black",
                        }}
                    >
                        <Typography variant="h1" sx={{ fontSize: '24px', fontWeight: 'bold', mb: 2 }}>
                            Terms and Conditions
                        </Typography>
                        <Typography paragraph sx={{ textAlign: "left" }}>
                            The Borrower confirms to have read and understood these Terms of Agreement before accepting a personal loan (“Loan”) offer with us. By clicking on the "eSign" button, the Borrower shall be deemed to have electronically accepted these Terms of Agreement. To the extent of any inconsistency, these Terms of Agreement shall prevail.
                        </Typography>

                        <List sx={{ listStyleType: 'decimal', pl: 4 }}>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="The Loan shall carry a fixed rate of interest specified at the time of applying for the loan." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="The Loan amount shall be disbursed, after debiting processing fees, in Borrower’s account only with the Bank on accepting the Personal Loan Terms of Agreement." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="The repayment amount shall consist of principal and interest components. The Borrower confirms to repay the repayment amount on the specified repayment date." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="If repayment is not done by the specified date, the Borrower will be liable for penal interest." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="If any repayment cheque is not honored, the Borrower will be liable for dishonor charges and penal interest." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="The Borrower agrees to pay the processing fee, payment dishonor charges, etc." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="Any overdue payment incurs interest at the penal interest rate (which is higher than the usual interest rate). We may change the interest rate if required by the statutory/regulatory authority." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="The Borrower agrees that fees and charges specified may be revised from time to time and binding on the Borrower." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="The Borrower agrees to pay applicable Goods and Service Tax." />
                            </ListItem>
                        </List>

                        <Typography sx={{ fontWeight: 'bold', mt: 2, textAlign: "left" }}>
                            Borrower Representations -
                        </Typography>
                        <Typography sx={{ textAlign: "left" }}>The Borrower represents and covenants that the Borrower:</Typography>
                        <List sx={{ listStyleType: 'disc', pl: 4 }}>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="Will use the Loan amount for legitimate purposes." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="Will not use the Loan for any speculative, antisocial, or prohibited purposes. If the Loan funds have been used for such purposes, we shall be entitled to take necessary actions to comply with its policies. The Borrower agrees to bear all costs and expenses incurred as a result." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="Shall notify, within 7 calendar days, if any information given by the Borrower changes. In the event of a change in address, the Borrower shall intimate the new address as soon as possible but no later than 15 days of such a change." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="Confirms that the information provided is correct, complete, and updated." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="Has read and understood the Privacy Policy available on our website." />
                            </ListItem>
                        </List>

                        <Typography sx={{ fontWeight: 'bold', mt: 2, textAlign: "left" }}>
                            Notice -
                        </Typography>
                        <Typography sx={{ textAlign: "left" }}>
                            We may send Loan-related notices, statements, or communication to the Borrower by in-app messages, SMS, email, ordinary prepaid post, or personal delivery to Borrower’s registered address. Communication sent via electronic means will be considered as delivered on the same day irrespective of carrier delays.
                        </Typography>

                        <Typography sx={{ fontWeight: 'bold', mt: 2, textAlign: "left" }}>
                            Consent to Disclose
                        </Typography>
                        <List sx={{ listStyleType: 'disc', pl: 4 }}>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="The Borrower has no objection in and gives consent for sharing Loan details including Borrower’s personal details to branches, affiliates, services providers, agents, contractors, surveyors, agencies, credit bureaus, etc. in or outside India, to enable us to provide services under the arrangement with the third parties including customized solutions and marketing services. The Borrower confirms that the authorization given above shall be valid till written communication of withdrawal of Borrower’s consent is acknowledged by us." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="The Borrower understands and accepts the risks involved in sharing personal information including sensitive personal information like account details with a third party." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="The Borrower consents to share Borrower’s personal information with third parties for processing, statistical or risks analysis, conducting credit or anti-money laundering checks, designing financial services or related products, marketing financial services or related products, customer recognition on our website/app, offering relevant product and service offers to customers, etc." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="The Borrower agrees that we may disclose Borrower’s information to the Reserve Bank of India, other statutory/regulatory authorities, arbitrator, credit bureaus, local authorities, credit rating agency, information utility, marketing agencies, and service providers if required." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="The Borrower authorizes to provide monthly details of the Loan Account and the credit facilities extended to the Borrower to credit information companies. We may obtain information on credit facilities availed by the Borrower from other financial institutions to determine whether we can extend additional credit facilities. On the regularization of the Borrowers account, we will update the credit information companies accordingly." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="The Borrower authorizes to verify any of the information of the Borrower including Borrower’s credit standing from anyone we may consider appropriate including credit bureaus, local authority, credit rating agencies etc." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="The Borrower authorizes us to inform Borrower’s employer of any default in repayment and agrees to do things necessary to fulfill Borrower’s obligations." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="Our records about the Loan shall be conclusive and binding on the Borrower." />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item' }}>
                                <ListItemText primary="In case of default in repayment of the Loan amount, Borrower authorizes us and our collection assistance specialist engaged, to contact Borrower over phone, office or visit Borrower’s residence or such other place where Borrower is located." />
                            </ListItem>
                        </List>

                        <Typography sx={{ fontWeight: 'bold', mt: 2, textAlign: "left" }}>
                            Effective Date -
                        </Typography>
                        <Typography paragraph sx={{ textAlign: "left" }}>
                            These Terms of Agreement shall be effective from the date of disbursal of the loan amount.
                        </Typography>

                        <Typography sx={{ fontWeight: 'bold', mt: 2, textAlign: "left" }}>
                            Assignment -
                        </Typography>
                        <Typography paragraph sx={{ textAlign: "left" }}>
                            The Borrower agrees that we may sell or assign the Loan and outstanding dues to any third party without prior notice. This will bind the Borrower to the new creditor as directed.
                        </Typography>

                        <Typography sx={{ fontWeight: 'bold', mt: 2, textAlign: "left" }}>
                            Governing Law & Jurisdiction -
                        </Typography>
                        <Typography paragraph sx={{ textAlign: "left" }}>
                            The Loan shall be governed by the laws of India, and disputes shall be settled through arbitration in New Delhi. The arbitration language shall be English or Hindi.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default SanctionLetterPreview;
