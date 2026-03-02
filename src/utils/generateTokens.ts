import jwt from "jsonwebtoken";

export function generateAccessToken(id: string): string {
  const accessToken = jwt.sign(
    { userId: id },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as any }
  );
  return accessToken;
}

export function generateRefreshToken(id: string): string {
  const refreshToken = jwt.sign(
    { userId: id },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as any }
  );
  return refreshToken;
}

export function verifyAccessToken(token: string): { userId: string } {
  const decoded = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string
  ) as { userId: string };
  return decoded;
}

export function verifyRefreshToken(token: string): { userId: string } {
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as { userId: string };
  return decoded;
}
