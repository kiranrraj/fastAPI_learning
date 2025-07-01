// 404 Page

"use client";

export default function NotFoundPage() {
  return (
    <div className="container">
      <h1>404 - Page Not Found</h1>
      <a href="/gbeex/auth/login">Go to Login</a>
      <style jsx>{`
        .container {
          text-align: center;
          padding: 50px;
        }
        a {
          display: block;
          margin-top: 10px;
          color: blue;
        }
      `}</style>
    </div>
  );
}
