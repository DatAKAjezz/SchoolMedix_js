// index.js

import express from 'express';
import userRoutes from './users.routes.js'
import sendDrugRequestRoutes from './sendDrugRequest.routes.js';
import checkUpRoutes from './checkUp.routes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/send-drug-requests', sendDrugRequestRoutes);
router.use('/checkups', checkUpRoutes);
//router.use("/", diseaseRoutes);





export default router;

