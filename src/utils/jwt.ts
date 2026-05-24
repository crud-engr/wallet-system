import jwt, { type JwtPayload } from "jsonwebtoken";
import { AppError } from "@/utils/errors";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

export interface TokenPayload extends JwtPayload {
  sub: string;
}

function isTokenPayload(decoded: string | JwtPayload): decoded is TokenPayload {
  return (
    typeof decoded === "object" &&
    decoded !== null &&
    typeof (decoded as JwtPayload).sub === "string"
  );
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

export function verifyToken(token: string): TokenPayload {
  let decoded: string | JwtPayload;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    throw new AppError("Invalid or expired token.", 401);
  }

  if (!isTokenPayload(decoded)) {
    throw new AppError("Invalid token payload.", 401);
  }

  return decoded;
}
