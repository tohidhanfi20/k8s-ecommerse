import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // console.log(req.nextauth.token,"from middleware***")
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "admin",
    },
  }
)

export const config = { matcher: ["/admin"] }