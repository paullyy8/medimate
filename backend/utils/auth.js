// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "fallbackSecretKey";

// export function createToken(userId) {
//   return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
// }

// export function verifyToken(req, res, next) {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Access Denied" });

//   try {
//     const verified = jwt.verify(token, JWT_SECRET);
//     req.userId = verified.userId;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid Token" });
//   }
// }

