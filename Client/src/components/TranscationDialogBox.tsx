import React from "react";
import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
} from "@material-tailwind/react";
import { deposit } from "@/Actions/user.action";

export default function TranscationDialogBox({ detail, type }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen((cur) => !cur);

    return (
        <>
            <Button onClick={handleOpen}>{type}</Button>
            <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="blue-gray">
                            {type}
                        </Typography>
                        <Typography
                            className="mb-3 font-normal"
                            variant="paragraph"
                            color="gray"
                        >
                            Enter the Amount you want to {type}
                        </Typography>
                        <Typography className="-mb-2" variant="h6">

                        </Typography>
                        <Input label="Number" size="lg" />

                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button variant="gradient" onClick={handlesubmit} fullWidth>
                           {type}
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}