import { Router } from "express";
import { AllAccounts, SingleAccount } from "../controllers/Account.Controller.js";
import { verifyJWT } from "../Middlewares/Auth.middleware.js";
import { verifyJWTManager } from "../Middlewares/ManagerAuth.middleware.js";
const router = Router();        


router.route('/').get(verifyJWTManager,AllAccounts)

router.route('/:userId').get(verifyJWTManager,SingleAccount)

export default router