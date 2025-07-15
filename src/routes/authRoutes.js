const express = require('express');
const { register, login, updateUser, getUser, sendEmail, ChekEmail, verifyOtp, logout, forgotPassword, sendUserDetailsToEventCreator, adminregister, getAdmin, getInterestedUsersForEvent, createAdmin, listAdmins, removeAdmin } = require('../controllers/authController');
const upload = require('../../multer');
const { createBlog, getAllBlogs, getBlogById, deleteBlog, updateBlog, likeBlog, addComment, getComments, editComment, deleteComment, createWonderlustBlog } = require('../controllers/blogController');
const { createTravelPlan, getAllTravelPlans, getTravelPlanById, updateTravelPlan, deleteTravelPlan, likeTravelPlan, commentOnTravelPlan, geteventsComments, editevntsComment, deleteeventsComment, getMostLikedTravelPlans } = require('../controllers/travelPlanController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/register', upload.single('img'), register);
router.post('/login', login);
router.get('/user/:id', getUser);
router.put('/update/:id', upload.single('img'), updateUser);
router.post('/sendemail', sendEmail)
router.post('/checkemail', ChekEmail)
router.post("/verifyotp", verifyOtp);
router.post("/logout", logout);
router.post("/forgotpassword", forgotPassword)


router.post("/addblogs", upload.array("img"), verifyToken,createBlog);
router.get("/getblogs", getAllBlogs);
router.get("/getblog/:id", getBlogById);
router.delete("/deleteblog/:id", deleteBlog);
router.put("/updateblog/:id", upload.array("img"), updateBlog);
router.post("/like/:id", likeBlog);
router.post("/comment/:id", addComment);
router.get("/comments/:id", getComments);
router.put("/comments/:commentId/:blogId", editComment);
router.delete("/deletecomments/:commentId/:blogId", deleteComment);
router.get("/interested-users/:eventId", verifyToken,getInterestedUsersForEvent);


router.post("/addEvents", upload.array("img"),verifyToken ,createTravelPlan);
router.get("/getEvents", getAllTravelPlans);
router.post("/sendUserDetailsToEventCreator", sendUserDetailsToEventCreator);
router.get("/getevents/:id", getTravelPlanById);
router.delete("/deleteTravelPlan/:id", deleteTravelPlan);
router.put("/updateTravelPlan/:id", upload.array("img"), updateTravelPlan);
router.post("/likes/:id", likeTravelPlan);
router.post("/commentevent/:id", commentOnTravelPlan);
router.get("/commentsevent/:id", geteventsComments);
router.put("/editeventscomments/:commentId/:eventId", editevntsComment);
router.delete("/deleteeventscomments/:commentId/:eventId", deleteeventsComment);
router.delete("/getMostLikedTravelPlans", getMostLikedTravelPlans);


// Admin management (superadmin only)
router.post('/admin/create', verifyToken, requireRole(['superadmin']), createAdmin);
router.get('/admin/list', verifyToken, requireRole(['superadmin']), listAdmins);
router.delete('/admin/remove/:id', verifyToken, requireRole(['superadmin']), removeAdmin);

// Wonderlust blog creation (admin/superadmin only)
router.post('/blogs/wonderlust', verifyToken, requireRole(['admin', 'superadmin']), createWonderlustBlog);


router.post("/adminadd", adminregister)
router.post("/adminget", getAdmin)






module.exports = router;


