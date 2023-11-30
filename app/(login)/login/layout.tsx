import "@/app/globals.css";
import LoginProvider from "./loginProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <LoginProvider>{children}</LoginProvider>
    </main>
  );
}
