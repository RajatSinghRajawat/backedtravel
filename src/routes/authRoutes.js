const express = require('express');
const { register, login, updateUser, getUser, sendEmail, ChekEmail, verifyOtp, logout } = require('../controllers/authController');
const upload = require('../../multer');
const { createBlog, getAllBlogs, getBlogById, deleteBlog, updateBlog } = require('../controllers/blogController');

const router = express.Router();

router.post('/register', upload.single('img'), register);
router.post('/login', login);
router.get('/user/:id', getUser);
router.put('/update/:id', upload.single('img'), updateUser);
router.post('/sendemail',sendEmail)
router.post('/checkemail',ChekEmail)
router.post("/verifyotp", verifyOtp);
router.post("/logout", logout);



router.post("/addblogs", upload.single("img"), createBlog);
router.get("/getblogs", getAllBlogs);
router.get("/getblog/:id", getBlogById);
router.delete("/deleteblog/:id", deleteBlog);
router.put("/updateblog/:id", upload.single("img"), updateBlog);


module.exports = router;
