import { Router } from "express";
import { AllAccounts, SingleAccount } from "../controllers/Account.Controller.js";

const router = Router();        


router.route('/').get(AllAccounts)

router.route('/:userId').get(SingleAccount)

export default router