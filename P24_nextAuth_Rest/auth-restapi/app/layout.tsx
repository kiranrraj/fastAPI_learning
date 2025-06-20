import AuthSession from "../app/components/AuthSession";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthSession>{children}</AuthSession>
      </body>
    </html>
  );
}
