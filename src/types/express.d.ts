// Augment Express's Request type so every handler can safely read `req.user`
// after the JWT auth middleware has verified and decoded the token.
declare namespace Express {
  interface Request {
    user?: {
      id: string;
    };
  }
}
