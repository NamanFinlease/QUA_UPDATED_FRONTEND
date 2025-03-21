import React from 'react';
import { tokens } from '../theme';
import { useTheme } from '@mui/material';
import Swal from 'sweetalert2';



const UserProfileForm = () => {
  // Simulated user data coming from "Add Employee" form or API response
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '123-456-7890',
    userRole: 'Admin',
    userId: 'E12345',
    password: '', // Placeholder for password
  };


  // Function to handle SweetAlert password update modal
  const handlePasswordUpdate = () => {
    Swal.fire({
      title: 'Reset Password',
      html: `
        <input type="password" id="oldPassword" class="swal2-input" placeholder="Enter Old Password">
        <input type="password" id="newPassword" class="swal2-input" placeholder="Enter New Password">
        <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirm New Password">
      `,
      confirmButtonText: 'Submit',
      focusConfirm: false,
      preConfirm: () => {
        const oldPassword = Swal.getPopup().querySelector('#oldPassword').value;
        const newPassword = Swal.getPopup().querySelector('#newPassword').value;
        const confirmPassword = Swal.getPopup().querySelector('#confirmPassword').value;

        if (!oldPassword || !newPassword || !confirmPassword) {
          Swal.showValidationMessage('Please enter all fields');
        }

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('New Password and Confirm Password do not match');
        }

        return { oldPassword, newPassword, confirmPassword };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Success', 'Your password has been updated', 'success');
      }
    });
  };

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Updated attractive inline CSS styles for the component
  const styles = {
    profileContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '90vh',
      backgroundColor: colors.white[100],
      padding: '20px',
    },
    profileCard: {
      backgroundColor: colors.white[100],
      borderRadius: '0px 20px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      padding: '30px',
      width: '450px',
      textAlign: 'center',
    },
    profileTitle: {
      color: colors.primary[400],
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '20px',
      borderBottom: `3px solid ${colors.primary[400]}`,
      paddingBottom: '10px',
    },
    profileGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: `1px solid ${colors.primary[400]}`,
      marginBottom: '10px',
    },
    label: {
      fontWeight: '500',
      fontSize: '16px',
      color: colors.primary[400],
      flexBasis: '40%',
      textAlign: 'left',
    },
    data: {
      fontWeight: '600',
      fontSize: '16px',
      color: colors.black[100],
      flexBasis: '60%',
      textAlign: 'right',
    },
    resetPasswordButton: {
      padding: '10px 10px',
      backgroundColor: colors.redAccent[500],
      color: colors.white[100],
      border: 'none',
      borderRadius: '0px 10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.profileContainer}>
      <div style={styles.profileCard}>
        <h2 style={styles.profileTitle}>User Profile</h2>

        <div style={styles.profileGroup}>
          <label style={styles.label}>Name:</label>
          <span style={styles.data}>{userData.name}</span>
        </div>

        <div style={styles.profileGroup}>
          <label style={styles.label}>Email:</label>
          <span style={styles.data}>{userData.email}</span>
        </div>

        <div style={styles.profileGroup}>
          <label style={styles.label}>Mobile:</label>
          <span style={styles.data}>{userData.mobile}</span>
        </div>

        <div style={styles.profileGroup}>
          <label style={styles.label}>User Role:</label>
          <span style={styles.data}>{userData.userRole}</span>
        </div>

        <div style={styles.profileGroup}>
          <label style={styles.label}>User ID:</label>
          <span style={styles.data}>{userData.userId}</span>
        </div>

        <div style={styles.profileGroup}>
          <label style={styles.label}>Password:</label>
          <span style={styles.data}>
            {userData.password}
            <button
              style={styles.resetPasswordButton}
              onClick={handlePasswordUpdate}
            >
              Reset Password
            </button>
          </span>
        </div>

      </div>
    </div>
  );
};

export default UserProfileForm;
