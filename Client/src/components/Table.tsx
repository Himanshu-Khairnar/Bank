import {  Clock, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const TABLE_HEAD = ["Transaction Type", "Amount", "Total Balance", "Transaction Time"];

export function TransactionsTable({ detail }: { detail: any }) {
    const userAccount = detail;

    return (
        <div className="shadow-lg rounded-lg bg-white">
            <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
            </div>
            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {userAccount.map((transaction: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-50 transition-all">
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div className="flex items-center space-x-2">
                                            {transaction.transaction_type === "deposit" ? (
                                                <ArrowDownCircle className="text-green-500" />
                                            ) : (
                                                <ArrowUpCircle className="text-red-500" />
                                            )}
                                            <span>{transaction.transaction_type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{transaction.amount}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{transaction.total_balance}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div className="flex items-center space-x-1">
                                            <Clock className="text-gray-400" />
                                            <span>{new Date(transaction.transaction_time).toLocaleString()}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="p-6 flex justify-center">
                <button className="px-6 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors">
                    View More Transactions
                </button>
            </div>
        </div>
    );
}
