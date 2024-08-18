import { NavLink } from "react-router-dom";
import { Button } from "../components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "../components/mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Menu } from "lucide-react";
import { Separator } from "../components/ui/separator";

const Navbar = () => {
  return (
    <div className="flex justify-between md:px-[150px] py-[15px] px-[20px] fixed w-full z-[99999] bg-background">
      <div className="flex items-center justify-center gap-2">
        <div className="text-primary-foreground font-medium px-[6px] py-[5px] bg-primary rounded-[4px]">
          CM
        </div>
        <div className="text-secondary-foreground font-medium">ConvertMate</div>
      </div>
      <div className="items-center justify-center hidden md:flex">
        <div className="flex items-center justify-center gap-2 font-medium text-sm">
          <NavLink
            to="/"
            className={({ isActive, isPending }) =>
              isPending
                ? ""
                : isActive
                ? "bg-primary/90 w-[80px] h-[30px] flex items-center justify-center rounded-[4px] text-white"
                : "hover:bg-primary/90 w-[80px] h-[30px] flex items-center justify-center rounded-[4px] hover:text-white"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive, isPending }) =>
              isPending
                ? ""
                : isActive
                ? "bg-primary/90 w-[80px] h-[30px] flex items-center justify-center rounded-[4px] text-white"
                : "hover:bg-primary/90 w-[80px] h-[30px] flex items-center justify-center rounded-[4px] hover:text-white"
            }
          >
            About
          </NavLink>
        </div>
      </div>
      <div className="hidden items-center justify-center gap-3 md:flex">
        <Button variant="outline" className="flex gap-2 rounded-[4px]">
          <GitHubLogoIcon /> GitHub
        </Button>
        <ModeToggle  />
      </div>

      <Sheet>
        <SheetTrigger className="md:hidden block">
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="py-16">
            <SheetTitle>
              {" "}
              <ModeToggle />
            </SheetTitle>
            <SheetDescription>
              <div className="flex flex-col items-center justify-center gap-2 font-medium text-sm mt-5">
                <NavLink
                  to="/"
                  className={({ isActive, isPending }) =>
                    isPending
                      ? ""
                      : isActive
                      ? "bg-primary/90 w-[80px] h-[30px] flex items-center justify-center rounded-xl text-white"
                      : "hover:bg-primary/90 w-[80px] h-[30px] flex items-center justify-center rounded-xl hover:text-white"
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive, isPending }) =>
                    isPending
                      ? ""
                      : isActive
                      ? "bg-primary/90 w-[80px] h-[30px] flex items-center justify-center rounded-xl text-white"
                      : "w-[80px] h-[30px] flex items-center justify-center rounded-xl hover:text-white"
                  }
                >
                  About
                </NavLink>
                <Separator className="mt-2" />
                <Button variant="outline" className="flex gap-2 mt-5">
                  <GitHubLogoIcon /> GitHub
                </Button>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navbar;
