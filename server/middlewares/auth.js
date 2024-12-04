import jwt from "jsonwebtoken";

export const IsAuthenticated = async (req, res, next) => {
  // Get the token from the Authorization header
  // const token = req.header("Authorization")?.replace("Bearer ", "");
  const token = req.cookies.uid;

  if (!token) {
    return res.status(401).json({ error: 'User not authenticated, please login', redirectToLogin: true });
  }
  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded user information to the request object
    req.userId = decoded.id;  // Assuming the token contains userId in the paload

    next()

  } catch (error) {
    console.error('Invalid token:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}