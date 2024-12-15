import { AllAccounts } from '@/Actions/user.action';
import { Console } from 'console';
import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  // State to hold the user account details
  const [accountDetails, setAccountDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);  // Loading state to show a loading message
  const [error, setError] = useState<string | null>(null);  // Error state to display errors if any

  // Fetch account details when the component mounts
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        // Call the action to get all accounts
        const res = await AllAccounts();
console.log(res.data.accounts)
        // Check if response is valid and set the data to state
        if (res) {
          setAccountDetails(res.data.accounts);
          setLoading(false);  // Set loading to false when data is fetched
        }
      } catch (err) {
        console.error("Error fetching account details:", err);
        setError("Failed to fetch account details");
        setLoading(false);  // Set loading to false in case of an error
      }
    };

    fetchAccountDetails();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div>
      <h1>Admin Dashboard</h1>
{/* 
      {loading && <p>Loading account details...</p>} {/* Show loading message */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}

      {/* If account details are fetched and available, show them */}
      {accountDetails && !loading && !error && (
        <div>
          <h2>Account Details</h2>
          <pre>{JSON.stringify(accountDetails, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
};

export default AdminDashboard;
