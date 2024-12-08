import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";

const DarkMode = () => {
  // TODO: Update Theme Functionality
  const { setTheme } = useTheme();

  return (
    <>
      <DropdownMenu className="text-center">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border mr-2 border-gray-300 p-3 bg-white rounded-md my-4 shadow-lg">
          <DropdownMenuItem
            className="px-4 outline-none py-1 my-1 text-sm cursor-pointer hover:bg-slate-100 transition-all duration-150 rounded-md"
            onClick={() => setTheme("light")}
          >
            Light
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[1px] bg-[#eee]" />
          <DropdownMenuItem
            className="px-4 outline-none py-1 my-1 text-sm cursor-pointer hover:bg-slate-100 transition-all duration-150 rounded-md"
            onClick={() => setTheme("dark")}
          >
            Dark
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-[1px] bg-[#eee]" />
          <DropdownMenuItem
            className="px-4 outline-none py-1 my-1 text-sm cursor-pointer hover:bg-slate-100 transition-all duration-150 rounded-md"
            onClick={() => setTheme("system")}
          >
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default DarkMode;
