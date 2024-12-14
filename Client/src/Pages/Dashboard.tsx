import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBalance } from '@/Actions/user.action.ts';
import { TransactionsTable } from '@/components/Table';
import { Typography } from "@material-tailwind/react";

const Dashboard = () => {
  const { userId } = useParams();
  const [userDetail, setUserDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transaction = await getBalance(userId);
        setUserDetail(transaction);
        console.log(transaction);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError("Failed to fetch user details.");
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h1">Welcome Himanshu</Typography>
      <div>
        <Typography variant="h3">Total Deposit: {userDetail.totalDeposit || 0}</Typography>
        <Typography variant="h3">Total Withdraw: {userDetail.totalWithdraw || 0}</Typography>
        <Typography variant="h3">Balance: {userDetail.balance || 0}</Typography>
      </div>
      <div>
        <TransactionsTable detail={userDetail} />
      </div>
    </div>
  );
};

export default Dashboard;
