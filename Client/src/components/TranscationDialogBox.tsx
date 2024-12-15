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
    Alert,
} from "@material-tailwind/react";
import { deposit, withdraw } from "@/Actions/user.action";

export default function TranscationDialogBox({ detail, type ,userId}:{detail:any,type:string,userId:string}) {
    const [open, setOpen] = React.useState(false);
    const [amount ,setAmount] = React.useState('');
    const [alert ,setalert] = React.useState(false);
    const handleOpen = () => setOpen((cur) => !cur);
    const handlesubmit = async () => {
        if (type ==="Deposit")
        {
            console.log(detail  )
            console.log(amount)
           const res= await deposit({amount:amount,userId:userId})
            console.log(res)
           return res
        }
        else if (type ==="Withdrawal"){
            detail<amount && setalert(true)
          const res =   await withdraw({amount:amount,userId:userId})
          return res
        }
        setOpen((cur) => !cur)
    }

    return (
        <>
      
            <Button size="lg" className="w-[10rem] h-[3rem]" onClick={handleOpen}>{type}</Button>
            <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                {
                    alert && <Alert color="red">You can't withdraw more than your balance</Alert>

                }   
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
                        <Input label="Number" size="lg" value={amount} onChange={(e) => setAmount(e.target.value)}/>

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