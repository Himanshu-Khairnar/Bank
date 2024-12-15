import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
    Input,
} from "@material-tailwind/react";

const TABLE_HEAD = ["Transaction Type", "Amount", "Total Balance", "Transaction Time"];

export function TransactionsTable({ detail }: { detail: any }) {
    // Extracting user account data from props
    const userAccount = detail;

    return (
        <Card>
            <CardHeader floated={false} shadow={false} className="border-b border-blue-gray-50 p-6">
                <Typography variant="h6" color="blue-gray">
                    Transaction History
                </Typography>
            </CardHeader>
            <CardBody>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th key={head} className="px-6 py-3 text-left text-xs font-semibold text-blue-gray-500 uppercase">
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {userAccount.map((transaction: any, index: number) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 text-sm text-blue-gray-600">{transaction.transaction_type}</td>
                                    <td className="px-6 py-4 text-sm text-blue-gray-600">{transaction.amount}</td>
                                    <td className="px-6 py-4 text-sm text-blue-gray-600">{transaction.total_balance}</td>
                                    <td className="px-6 py-4 text-sm text-blue-gray-600">{new Date(transaction.transaction_time).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardBody>
            <CardFooter className="p-6">
                <Button variant="outlined" color="blue">
                    View More Transactions
                </Button>
            </CardFooter>
        </Card>
    );
}
