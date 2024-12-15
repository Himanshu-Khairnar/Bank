import { deposit, withdraw } from "@/Actions/user.action";
import  { useState } from "react";

export default function TranscationDialogBox({
    detail,
    type,
    userId,
    color,
}: {
    detail: number; // Assuming 'detail' is a number (balance)
    type: string;
    userId: string;
    color: string;
}) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [alert, setAlert] = useState('');

    const handleOpen = () => setOpen((cur) => !cur);

    const handleSubmit = async () => {
        const numericAmount = Number(amount);

        // Validate amount
        if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
            setAlert("Please enter a valid amount");
            return;
        }

        // Reset alert if valid amount
        setAlert('');

        // Handle deposit
        if (type === "Deposit") {
            try {
                // Assuming 'deposit' is an async function to handle the deposit logic
                const res = await deposit({ amount, userId });
                console.log("Deposit Response:", res);
   
                setOpen(false); 
                window.location.reload();
            } catch (error) {
                console.error("Deposit Error:", error);
                setAlert("Error processing deposit");
            }
            return;
        }

        // Handle withdrawal
        if (type === "Withdrawal") {
            if (numericAmount > detail) {
                setAlert("You can't withdraw more than your balance");
                return;
            }

            try {
                const res = await withdraw({ amount, userId });
                console.log("Withdrawal Response:", res);
                setOpen(false); 
                window.location.reload();

            } catch (error) {
                console.error("Withdrawal Error:", error);
                setAlert("Error processing withdrawal");
            }
            return;
        }
    };

    return (
        <>
            <button
                className={`bg-${color}-500 text-white py-2 px-6 rounded-lg ${color === 'red' ? 'hover:bg-red-700' : 'hover:bg-green-700'}`}
                onClick={handleOpen}
            >
                {type}
            </button>

            {open && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-sm p-6 rounded-lg shadow-lg">
                        {alert && (
                            <div className="mb-4 p-4 text-white bg-red-500 rounded-lg">
                                {alert}
                            </div>
                        )}
                        <h4 className="text-xl text-center font-semibold mb-4">{type}</h4>
                        <p className="text-center text-gray-700 mb-3">
                            Enter the Amount you want to {type}
                        </p>
                        <input
                            type="number"
                            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
                            >
                                {type}
                            </button>
                            <button
                                onClick={handleOpen}
                                className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
