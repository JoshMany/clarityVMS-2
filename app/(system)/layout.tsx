import { SystemProvider } from "./systemProvider";
import LayoutStructure from "../components/Layout/LayoutStructure";

export default function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <SystemProvider>
        <LayoutStructure>{children}</LayoutStructure>
      </SystemProvider>
    </main>
  );
}
