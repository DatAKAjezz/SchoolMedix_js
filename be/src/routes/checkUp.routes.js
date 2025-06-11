import express from 'express';
import {
        cancelRegister,
        closeRegister,
        createCampaign,
        getCheckupRegister,
        recordCheckUp,
        submitRegister,

}
        from '../controllers/checkUp.controller.js';

const router = express.Router();

router.post('/create', createCampaign); // admin tạo campaigns
router.get('/registers/:id', getCheckupRegister);   //Parent nhận form Register
router.patch('/registers/:id/submit', submitRegister);// Parent nhập form Register
router.patch('/registers/:id/close', closeRegister);// Amdin đóng form Register
router.patch('/registers/:id/cancel', cancelRegister) //Admin cancel form Register
router.patch('/record', recordCheckUp) // Doctor or Nurse record Heatlh Check Up for Student

// Student xem dc Register

export default router;
