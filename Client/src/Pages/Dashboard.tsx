import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBalance } from '@/Actions/user.action.ts';
import { ArrowUpRight, ArrowDownRight, CheckCircle } from 'lucide-react';
import TranscationDialogBox from '@/components/TranscationDialogBox';
import { TransactionsTable } from '@/components/Table';



const Dashboard: React.FC = () => {
  const { userId } = useParams();
  const [userDetail, setUserDetail] = useState<any>([]);
  const [totals, setTotals] = useState<{
    total_deposit: number;
    total_withdrawal: number;
    total_balance: number;
  }>({
    total_deposit: 0,
    total_withdrawal: 0,
    total_balance: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!userId) {
        setError('User ID is missing');
        setLoading(false);
        return;
      }

      try {
        const transaction = await getBalance(userId);

        if (transaction?.data?.userAccount && Array.isArray(transaction.data.userAccount)) {
          const userAccount = transaction.data.userAccount;

          if (userAccount.length === 0) {
            setError('No transaction data found');
            setUserDetail([]);
            return;
          }

          setUserDetail(userAccount);
          console.log(userAccount);
          const calculatedTotals = calculateTotals(userAccount);
          setTotals({
            total_deposit: calculatedTotals.total_deposit,
            total_withdrawal: calculatedTotals.total_withdrawal,
            total_balance: userAccount[userAccount.length - 1]?.total_balance || 0,
          });
        } else {
          throw new Error('Invalid transaction data structure');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setUserDetail([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const calculateTotals = (userDetail: any) => {
    return userDetail.reduce((acc: { total_deposit: number; total_withdrawal: number; }, transaction: { total_deposit: any; total_withdrawal: any; }) => {
      acc.total_deposit += parseFloat(String(transaction.total_deposit)) || 0;
      acc.total_withdrawal += parseFloat(String(transaction.total_withdrawal)) || 0;
      return acc;
    }, { total_deposit: 0, total_withdrawal: 0 });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl text-gray-500">Loading user data...</h2>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="text-center">
          <h2 className="text-2xl text-red-600 mb-4">Error</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!userDetail || userDetail.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl text-gray-500">No transaction data available</h2>
      </div>
    );
  }

  const username = userDetail[0]?.username || 'N/A';
  const totalBalance = userDetail[userDetail.length - 1]?.total_balance || 0;
  const totalDeposit = totals.total_deposit || 0;
  const totalWithdrawal = totals.total_withdrawal || 0;

  return (
    <div className="container mx-auto p-6">
      {/* Unified Card Layout */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {username}</h1>
        </div>

        {/* Financial Info Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {/* Total Deposit */}
          <div className="flex items-center justify-between p-6 bg-yellow-50 border-b border-yellow-200 rounded-lg shadow-md">
            <div className="text-left">
              <h3 className="text-xl font-semibold text-yellow-600">Total Deposit</h3>
              <p className="text-lg text-gray-800">₹{totalDeposit.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <ArrowUpRight className="w-10 h-10 text-yellow-600" />
            </div>
          </div>

          {/* Total Withdrawal */}
          <div className="flex items-center justify-between p-6 bg-red-50 border-b border-red-200 rounded-lg shadow-md">
            <div className="text-left">
              <h3 className="text-xl font-semibold text-red-600">Total Withdrawal</h3>
              <p className="text-lg text-gray-800">₹{totalWithdrawal.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <ArrowDownRight className="w-10 h-10 text-red-600" />
            </div>
          </div>

          {/* Total Balance */}
          <div className="flex items-center justify-between p-6 bg-green-50 border-b border-green-200 rounded-lg shadow-md">
            <div className="text-left">
              <h3 className="text-xl font-semibold text-green-600">Total Balance</h3>
              <p className="text-lg text-gray-800">₹{totalBalance}</p>
            </div>
            <div className="text-right">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-row gap-6 justify-center items-center mt-8'>
        {/* Deposit Transaction Box */}

        <TranscationDialogBox
          detail={totalBalance}
          type="Deposit"
          userId={userId || ''}
          color='green'
        />


        {/* Withdrawal Transaction Box */}
        <TranscationDialogBox
          detail={totalBalance}
          type="Withdrawal"
          userId={userId || ''}
          color='red'
        />

      </div>

      <div className='flex gap-4 justify-center items-center mt-8'>
        <TransactionsTable detail={userDetail} />
      </div>
    </div>
  );
};

export default Dashboard;
