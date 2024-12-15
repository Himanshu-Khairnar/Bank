import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SingleAccount } from '@/Actions/user.action';
import {
  UserIcon,
  MailIcon,
  CreditCardIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ClockIcon
} from 'lucide-react';
interface UserDetails {
  username: string;
  email: string;
  total_balance:string
}

const SingleUser = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await SingleAccount(userId || '');
        console.log('API Response:', res);

        const data = Array.isArray(res.data.userAccount) ? res.data.userAccount : [res.data.userAccount];
        setTransactions(data);

        let depositSum = 0;
        let withdrawalSum = 0;

        for (const transaction of data) {
          const amount = parseFloat(transaction.amount);
          if (transaction.transaction_type === 'deposit') {
            depositSum += amount;
          } else if (transaction.transaction_type === 'withdrawal') {
            withdrawalSum += amount;
          }
        }

        setTotalDeposit(depositSum);
        setTotalWithdrawal(withdrawalSum);

        if (data.length > 0) {
          setUserDetails(data[data.length - 1]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to fetch user details');
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      {error}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* User Profile Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* User Details Card */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-all hover:scale-105">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <UserIcon className="w-8 h-8" />
              User Profile
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <UserIcon className="text-blue-500 w-6 h-6" />
              <p className="text-lg font-semibold">{userDetails?.username ?? "N/A"}</p>
            </div>
            <div className="flex items-center gap-4">
              <MailIcon className="text-blue-500 w-6 h-6" />
              <p className="text-lg">{userDetails?.email ?? "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Financial Summary Card */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-all hover:scale-105">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <CreditCardIcon className="w-8 h-8" />
              Financial Summary
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ArrowDownCircleIcon className="text-green-500 w-6 h-6" />
                <span className="font-semibold">Total Deposit</span>
              </div>
              <span className="text-green-600 font-bold">₹{totalDeposit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ArrowUpCircleIcon className="text-red-500 w-6 h-6" />
                <span className="font-semibold">Total Withdrawal</span>
              </div>
              <span className="text-red-600 font-bold">₹{totalWithdrawal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-3 mt-3">
              <div className="flex items-center gap-3">
                <CreditCardIcon className="text-blue-500 w-6 h-6" />
                <span className="font-semibold">Total Balance</span>
              </div>
              <span className="text-blue-600 font-bold">₹{userDetails?.total_balance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <ClockIcon className="w-8 h-8" />
            Transaction History
          </h2>
        </div>

        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className={`
                      ${transaction.transaction_type === 'deposit'
                        ? 'hover:bg-green-50'
                        : 'hover:bg-red-50'
                      } transition-colors
                    `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {transaction.transaction_type === 'deposit' ? (
                          <ArrowDownCircleIcon className="text-green-500 w-5 h-5 mr-2" />
                        ) : (
                          <ArrowUpCircleIcon className="text-red-500 w-5 h-5 mr-2" />
                        )}
                        <span className={`
                          font-medium 
                          ${transaction.transaction_type === 'deposit'
                            ? 'text-green-600'
                            : 'text-red-600'
                          }
                        `}>
                          {transaction.transaction_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        font-bold 
                        ${transaction.transaction_type === 'deposit'
                          ? 'text-green-700'
                          : 'text-red-700'
                        }
                      `}>
                        ₹{transaction.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        {new Date(transaction.transaction_time).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-semibold">
                      ₹{transaction.total_balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleUser;