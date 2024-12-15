import React, { useState } from "react";
import {
    Button,
    Dialog,
    Card,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Alert,
} from "@material-tailwind/react";
import { deposit, withdraw } from "@/Actions/user.action";

export default function TranscationDialogBox({
    detail,
    type,
    userId,
    color
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
        // Validate amount
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setAlert("Please enter a valid amount");
            return;
        }

        // Reset alert if valid amount
        setAlert('');

        // Handle deposit
        if (type === "Deposit") {
            try {
                const res = await deposit({ amount, userId });
                console.log("Deposit Response:", res);
                setOpen(false); // Close dialog after submit
            } catch (error) {
                console.error("Deposit Error:", error);
                setAlert("Error processing deposit");
            }
            return;
        }

        // Handle withdrawal
        if (type === "Withdrawal") {
            if (Number(amount) > detail) {
                setAlert("You can't withdraw more than your balance");
                return;
            }

            try {
                const res = await withdraw({ amount, userId });
                console.log("Withdrawal Response:", res);
                setOpen(false); // Close dialog after submit
            } catch (error) {
                console.error("Withdrawal Error:", error);
                setAlert("Error processing withdrawal");
            }
            return;
        }
    };

    return (
        <>
            <Button size="lg" className="w-[10rem] h-[3rem]" onClick={handleOpen} color={color}>
                {type}
            </Button>
            <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                {alert && (
                    <Alert open={open} onClose={() => setAlert('')} color="red" className="mb-4">
                        {alert}
                    </Alert>
                )}
                <Card className="mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="blue-gray">
                            {type}
                        </Typography>
                        <Typography className="mb-3 font-normal" variant="paragraph" color="gray">
                            Enter the Amount you want to {type}
                        </Typography>
                        <Input
                            label="Amount"
                            size="lg"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            type="number"
                        />
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button variant="gradient" onClick={handleSubmit} fullWidth>
                            {type}
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}
