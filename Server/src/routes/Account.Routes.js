import { Router } from "express";
import { AllAccounts, SingleAccount } from "../controllers/Account.Controller.js";
import { verifyJWT } from "../Middlewares/Auth.middleware.js";
const router = Router();        


router.route('/').get(verifyJWT,AllAccounts)

router.route('/:userId').get(verifyJWT,SingleAccount)

export default router