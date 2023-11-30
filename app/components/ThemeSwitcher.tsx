"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button, Switch } from "@nextui-org/react";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <Switch
        defaultSelected={resolvedTheme === "dark" ? false : true}
        size="sm"
        color="primary"
        thumbIcon={({ isSelected }) =>
          isSelected ? <Sun color="#000" /> : <Moon color="#000" />
        }
        onValueChange={(isSelected: boolean) =>
          isSelected === true ? setTheme("light") : setTheme("dark")
        }
      >
        Switch Theme
      </Switch>
    </div>
  );
}
