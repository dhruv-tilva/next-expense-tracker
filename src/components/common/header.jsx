"use client";
import React from "react";
import Logo from "./logo";
import {
  cn,
  getUserCookie,
  removeTokenCookie,
  removeUserCookie,
} from "@/utils";
import { ButtonLink } from "../ui/button";
import useAuthStore from "@/store/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { auth } from "@/firebase";
import { SignOutIcon } from "@/assets/signout-icon";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { ProfileIcon } from "@/assets/profile-icon";
import { signOut } from "firebase/auth";

const Header = () => {
  const user = getUserCookie();
  const { toast } = useToast();
  const { loading, setLoading } = useAuthStore();
  const router = useRouter();

  const onSignOut = async () => {
    await signOut(auth)
      .then(() => {
        removeTokenCookie();
        removeUserCookie();
        window.location.href = "/sign-in";
        setTimeout(() => {
          router.replace("/sign-in");
        }, 300);
        toast({
          variant: "success",
          title: "Logout successfully!",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
        });
      });
  };
  return (
    <header className="z-50 flex items-center justify-between w-full p-2.5 md:px-5 md:py-4 bg-white">
      <Logo />

      {!user ? (
        <div className="flex gap-1.5 xs:gap-2.5">
          <ButtonLink href="/sign-in" variant="defaul" tabIndex="-1">
            Sign In
          </ButtonLink>
          <ButtonLink href="/sign-up" variant="secondary" tabIndex="-1">
            Register
          </ButtonLink>
        </div>
      ) : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="flex outline-0" tabIndex="-1">
            <Avatar>
              <AvatarFallback className="bg-orange-100 text-orange-700">
                {user?.displayName?.split(" ")[0].charAt(0).toUpperCase() +
                  user?.displayName?.split(" ")[1].charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="p-0 w-52 rounded-[10px] mr-5 mt-2 bg-orange-50">
            <DropdownMenuItem className="flex gap-2.5 px-5 py-2.5 md:hidden">
              <Avatar>
                <AvatarFallback className="bg-orange-200 text-orange-700">
                  {user?.displayName?.split(" ")[0].charAt(0).toUpperCase() +
                    user?.displayName?.split(" ")[1].charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <strong className="block text-base font-bold leading-5 text-left">
                  {user?.displayName}
                </strong>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="md:hidden" />
            <DropdownMenuItem
              onClick={() => router.push("/my-profile")}
              className={cn("py-2.5 px-5 hover:bg-zinc-100 cursor-pointer")}
            >
              <ProfileIcon className="text-primary" />
              <span className="ml-2.5">My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onSignOut}
              className="py-2.5 px-5 hover:bg-zinc-100 cursor-pointer"
            >
              <SignOutIcon className="text-primary" />
              <span className="ml-2.5">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};

export default Header;
