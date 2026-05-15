import { Request, Response, NextFunction } from "express";
// Ensure TypeScript loads the custom Express types
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers["authorization"];
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "No token provided" });
	}
	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; email?: string };
		(req as any).user = { id: decoded.id, email: decoded.email || "" };
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid token" });
	}
};

export default authMiddleware;
