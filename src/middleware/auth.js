// // src/middleware/auth.js
// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   // Get the Authorization header (case-insensitive by Express)
//   const authHeader = req.headers.authorization;

//   console.log("Authorization Header:", authHeader); 

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "No token provided or invalid format" });
//   }

//   const token = authHeader.split(" ")[1];
 

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     console.log("Decoded Token:", decoded); 
//     req.user = decoded;

//     // Proceed to the next middleware/route
//     next();
//   } catch (error) {
//     console.error("JWT Verification Error:", error.message); // 🔥 Debug: Token invalid or expired
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// module.exports = verifyToken;


const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id }; 
    console.log(decoded);
    
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;