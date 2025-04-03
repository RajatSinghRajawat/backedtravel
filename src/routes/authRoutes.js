const express = require('express');
const { register, login, updateUser, getUser, sendEmail, ChekEmail, verifyOtp, logout } = require('../controllers/authController');
const upload = require('../../multer');
const { createBlog, getAllBlogs, getBlogById, deleteBlog, updateBlog } = require('../controllers/blogController');
const { createTravelPlan, getAllTravelPlans, getTravelPlanById, updateTravelPlan, deleteTravelPlan } = require('../controllers/travelPlanController');

const router = express.Router();

router.post('/register', upload.single('img'), register);
router.post('/login', login);
router.get('/user/:id', getUser);
router.put('/update/:id', upload.single('img'), updateUser);
router.post('/sendemail',sendEmail)
router.post('/checkemail',ChekEmail)
router.post("/verifyotp", verifyOtp);
router.post("/logout", logout);



router.post("/addblogs", upload.array("img"), createBlog);
router.get("/getblogs", getAllBlogs);
router.get("/getblog/:id", getBlogById);
router.delete("/deleteblog/:id", deleteBlog);
router.put("/updateblog/:id", upload.array("img"), updateBlog);



router.post("/addEvents",upload.array("img") ,  createTravelPlan);
router.get("/getEvents", getAllTravelPlans);
// router.get("/:id", getTravelPlanById);
// router.put("/:id", updateTravelPlan);
// router.delete("/:id", deleteTravelPlan);


module.exports = router;
