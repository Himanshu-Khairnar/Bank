import { Router } from "express";
import {registerUser,loginUser,logoutUser,AccountInfo,depoistAmount,withdrawalAmount} from '../controllers/User.Controller.js'
import { verifyJWT } from "../Middlewares/Auth.middleware.js";
const router = Router();
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

//secure routes
router.route('/:userId').get(verifyJWT,AccountInfo)
router.route('/logout').get(verifyJWT,logoutUser)
router.route("/deposit/:userId").post(verifyJWT,depoistAmount)
router.route("/withdrawal/:userId").post(verifyJWT,withdrawalAmount)

export default router   