import React, { useState } from 'react';
import './SearchForm.css'; // Ensure you create this CSS file for styling
import Navbar from '../Navbar/NavBar';
import Sidebar from '../Navbar/Sidebar';

const SearchForm = () => {
    const [formValues, setFormValues] = useState({
        leadId: '',
        applicationNo: '',
        name: '',
        pan: '',
        cif: '',
        leadRefNo: '',
        loanNo: '',
        aadhaar: '',
        mobileNo: '',
        email: ''
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div className='search-form-container'>
            <div className="navbar-sidebar">
                <Navbar className="navbar" />
                <Sidebar className="sidebar" />
            </div>
            <div className="search-form">
                <h2 className="search-form-h2">Search By</h2>
                <form onSubmit={handleSubmit}>
                    <div className="search-form-wrapper">
                        <div className="search-form-part-1"> 
                        <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleChange} placeholder='Name'
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="leadId">Lead ID</label>
                                <input
                                    type="text"
                                    id="leadId"
                                    name="leadId"
                                    value={formValues.leadId}
                                    onChange={handleChange} placeholder='Lead ID'
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="applicationNo">Application No</label>
                                <input
                                    type="text"
                                    id="applicationNo"
                                    name="applicationNo"
                                    value={formValues.applicationNo}
                                    onChange={handleChange} placeholder='Application No'
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="pan">PAN</label>
                                <input
                                    type="text"
                                    id="pan"
                                    name="pan"
                                    value={formValues.pan}
                                    onChange={handleChange} placeholder='PAN'
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cif">CIF</label>
                                <input
                                    type="text"
                                    id="cif"
                                    name="cif"
                                    value={formValues.cif}
                                    onChange={handleChange} placeholder='CIF'
                                />
                            </div>
                        </div>
                        <div className="search-form-part-2">
                            <div className="form-group">
                                <label htmlFor="leadRefNo">Lead Ref No</label>
                                <input
                                    type="text"
                                    id="leadRefNo"
                                    name="leadRefNo"
                                    value={formValues.leadRefNo}
                                    onChange={handleChange} placeholder='Lead Ref No'
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="loanNo">Loan No</label>
                                <input
                                    type="text"
                                    id="loanNo"
                                    name="loanNo"
                                    value={formValues.loanNo}
                                    onChange={handleChange} placeholder='Loan No'
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="aadhaar">Aadhaar</label>
                                <input
                                    type="text"
                                    id="aadhaar"
                                    name="aadhaar"
                                    value={formValues.aadhaar}
                                    onChange={handleChange} placeholder='Aadhaar'
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="mobileNo">Mobile No</label>
                                <input
                                    type="text"
                                    id="mobileNo"
                                    name="mobileNo"
                                    value={formValues.mobileNo}
                                    onChange={handleChange} placeholder='MobileNo'
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formValues.email}
                                    onChange={handleChange} placeholder='Email'
                                />
                            </div>
                            
                        </div>
                        <div className='search-button'>
                            <button  type="submit">Search</button>
                            </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchForm;
