import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/jobs/:path*", "/applicants/:path*", "/interviews/:path*", "/reports", "/settings", "/settings/:path*"],
};
