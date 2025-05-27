const express = require('express');
const { register, login, updateUser, getUser, sendEmail, ChekEmail, verifyOtp, logout, forgotPassword, sendUserDetailsToEventCreator, adminregister, getAdmin } = require('../controllers/authController');
const upload = require('../../multer');
const { createBlog, getAllBlogs, getBlogById, deleteBlog, updateBlog, likeBlog, addComment, getComments, editComment, deleteComment } = require('../controllers/blogController');
const { createTravelPlan, getAllTravelPlans, getTravelPlanById, updateTravelPlan, deleteTravelPlan, likeTravelPlan, commentOnTravelPlan, geteventsComments, editevntsComment, deleteeventsComment } = require('../controllers/travelPlanController');

const router = express.Router();

router.post('/register', upload.single('img'), register);
router.post('/login', login);
router.get('/user/:id', getUser);
router.put('/update/:id', upload.single('img'), updateUser);
router.post('/sendemail',sendEmail)
router.post('/checkemail',ChekEmail)
router.post("/verifyotp", verifyOtp);
router.post("/logout", logout);
router.post("/forgotpassword", forgotPassword)


router.post("/addblogs", upload.array("img"), createBlog);
router.get("/getblogs", getAllBlogs);
router.get("/getblog/:id", getBlogById);
router.delete("/deleteblog/:id", deleteBlog);
router.put("/updateblog/:id", upload.array("img"), updateBlog);
router.post("/like/:id", likeBlog);
router.post("/comment/:id", addComment);
router.get("/comments/:id", getComments);
router.put("/comments/:commentId/:blogId", editComment);
router.delete("/deletecomments/:commentId/:blogId", deleteComment);



router.post("/addEvents",upload.array("img") ,  createTravelPlan);
router.get("/getEvents", getAllTravelPlans);
router.post("/sendUserDetailsToEventCreator", sendUserDetailsToEventCreator);
router.get("/getevents/:id", getTravelPlanById);
router.delete("/deleteTravelPlan/:id", deleteTravelPlan);
router.put("/updateTravelPlan/:id", upload.array("img"), updateTravelPlan);
router.post("/likes/:id", likeTravelPlan);
router.post("/commentevent/:id", commentOnTravelPlan);
router.get("/commentsevent/:id", geteventsComments);
router.put("/comments/:commentId/:travelPlanId", editevntsComment);
router.delete("/deletecomments/:commentId/:travelPlanId", deleteeventsComment);



 

router.post("/adminadd" , adminregister)
router.post("/adminget" , getAdmin)






module.exports = router;


