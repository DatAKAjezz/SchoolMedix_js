import express from 'express';
import { createParent, createStudent, createAdmin, createNurse, getChildrenOfAParent, getParentByID, getStudentByID } from '../controllers/users.controller.js';

const router = express.Router();

router.post('/create/parent', createParent);
router.post('/create/student', createStudent);
router.post('/create/admin', createAdmin);
router.post('/create/nurse', createNurse);




router.get('/get-children/:parent_id', getChildrenOfAParent);



router.get('/profile/student/:student_id', getStudentByID);
router.get('/profile/parent/:parent_id', getParentByID);


export default router;
