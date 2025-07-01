// Error Page

"use client";

export default function ErrorPage() {
  return (
    <div className="container">
      <h1>Something went wrong</h1>
      <p>Please try again later.</p>
      <style jsx>{`
        .container {
          text-align: center;
          padding: 60px;
          color: red;
        }
      `}</style>
    </div>
  );
}
