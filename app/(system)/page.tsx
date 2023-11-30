"use client";
import { useEffect } from "react";
import { useTitle } from "../components/Layout/LayoutStructure";

export default function Home() {
  const { updateTitle } = useTitle();

  useEffect(() => {
    updateTitle("TITLE");
  }, []);

  return (
    <>
      <div>
        <h1>Main Page</h1>
      </div>
    </>
  );
}
