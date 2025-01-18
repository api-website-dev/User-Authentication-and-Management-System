import express from 'express'
import  {changePassword,forgotPassword,getUser, logIn, loginStatus, logOut, registerUser, resetPassword, updateUser}  from '../controllers/userController.js';
import { protect } from '../authMiddlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', logIn);
router.get('/logout', logOut);
router.get('/getuser', protect, getUser);
router.get('/loggedin', loginStatus);
router.patch('/updateuser', protect, updateUser)
router.patch('/changepassword', protect, changePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetPassword/:resetToken',resetPassword)


export default router;

