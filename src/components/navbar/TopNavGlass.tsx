import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { GiSelfLove } from "react-icons/gi";
import NavLink from "./NavLink";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";
import { getUserInfoForNav } from "@/app/actions/userActions";
import FiltersWrapper from "./FiltersWrapper";

export default async function TopNavGlass() {
  const session = await auth();
  const userInfo =
    session?.user && (await getUserInfoForNav());

  const memberLinks = [
    { href: "/members", label: "Matches" },
    { href: "/lists", label: "Lists" },
    { href: "/messages", label: "Messages" },
  ];

  const adminLinks = [
    {
      href: "/admin/moderation",
      label: "Photo Moderation",
    },
  ];

  const links =
    session?.user.role === "ADMIN"
      ? adminLinks
      : memberLinks;
  
  return (
    <>
      <Navbar
        maxWidth="full"
        className="bg-white/70 backdrop-blur-xl border-b border-gray-200/60 shadow-sm relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/80 before:to-gray-50/30"
        classNames={{
          item: [
            "text-lg",
            "text-slate-800",
            "font-medium",
            "tracking-wide",
            "transition-all",
            "duration-200",
            "hover:text-slate-900",
            "hover:bg-black/5",
            "hover:backdrop-blur-sm",
            "rounded-lg",
            "px-3",
            "py-1",
            "data-[active=true]:text-pink-600",
            "data-[active=true]:font-semibold",
            "data-[active=true]:bg-pink-50/60",
          ],
          wrapper: "px-6 relative z-10",
        }}
      >
        <NavbarBrand as={Link} href="/" className="gap-3">
          <GiSelfLove
            size={36}
            className="text-pink-500 drop-shadow-sm"
          />
          <div className="font-bold text-2xl flex">
            <span className="text-slate-800 tracking-tight">
              MatchMe
            </span>
          </div>
        </NavbarBrand>
        <NavbarContent justify="center" className="gap-8">
          {session &&
            links.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
              />
            ))}
        </NavbarContent>
        <NavbarContent justify="end" className="gap-3">
          {userInfo ? (
            <UserMenu userInfo={userInfo} />
          ) : (
            <>
              <Button
                as={Link}
                href="/login"
                variant="bordered"
                className="border-gray-300/80 text-slate-700 bg-white/60 backdrop-blur-md hover:bg-white/80 hover:border-gray-400/80 transition-all duration-200 font-medium shadow-sm rounded-lg"
                size="sm"
              >
                Login
              </Button>
              <Button
                as={Link}
                href="/register"
                variant="solid"
                className="bg-pink-500/90 backdrop-blur-md text-white border-0 hover:bg-pink-600 transition-all duration-200 font-medium shadow-md rounded-lg hover:shadow-lg"
                size="sm"
              >
                Register
              </Button>
            </>
          )}
        </NavbarContent>
      </Navbar>
      <FiltersWrapper />
    </>
  );
}