import { Request, Response, NextFunction } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import dotenv from "dotenv";
dotenv.config();

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID as string,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID as string,
});

export const validateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"]?.split("Bearer ")[1];
    if (!token)
      return res.status(403).json({
        message: "Not Authenticated",
      });
    const payload = await verifier.verify(token);
    req.body = {
      ...req.body,
      jwtPayload: payload,
    };
    next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
