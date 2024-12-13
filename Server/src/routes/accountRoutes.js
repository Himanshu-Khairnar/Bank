import { Router } from "express";


const router = Router();        


router.route('/').get(AllAccounts)

router.route('/:id').get(SingleAccount)

export default router