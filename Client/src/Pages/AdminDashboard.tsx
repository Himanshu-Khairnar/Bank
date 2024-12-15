import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AllAccounts } from '@/Actions/user.action';
import {
  UserIcon,
  MailIcon,
  CalendarIcon,
  DollarSignIcon,
  SearchIcon
} from 'lucide-react';

// Define TypeScript interface for account details
interface AccountDetails {
  id: string;
  username: string;
  email: string;
  created_at: string;
  current_balance: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [accountDetails, setAccountDetails] = useState<AccountDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const res = await AllAccounts();
        if (res && res.data.accounts) {
          setAccountDetails(res.data.accounts);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching account details:", err);
        setError("Failed to fetch account details");
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, []);

  const handleRowClick = (userId: string) => {
    navigate(`/admin/user/${userId}`);
  };

  // Filter accounts based on search term
  const filteredAccounts = accountDetails.filter(account =>
    account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Dashboard Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <UserIcon className="w-10 h-10 text-blue-600" />
          Admin Dashboard
        </h1>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white ">
              <tr className=''>
                <th className="px-6 py-4 text-left text-sm font-medium  gap-2">
                  <UserIcon className="w-5 h-5" />
                  Username
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium  gap-2">
                  <MailIcon className="w-5 h-5" />
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium  gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Created At
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium  gap-2">
                  <DollarSignIcon className="w-5 h-5" />
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <tr
                    key={account.id}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(account.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <UserIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{account.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{account.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(account.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex leading-5 font-semibold rounded-full ${account.current_balance > 1000
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        ₹{account.current_balance.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No accounts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
};

export default AdminDashboard;