export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/((?!login|favicon.ico|backgroundLogin.mp4).*)"],
};
