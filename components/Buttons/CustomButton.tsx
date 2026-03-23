import Link from "next/link";
import type { Route } from "next";
import type { ButtonHTMLAttributes } from "react";

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode: "link" | "default";
  href: Route;
}

export const CustomButton = ({
  mode = "default",
  children,
  href,
  ...rest
}: CustomButtonProps) => {
  switch (mode) {
    case "link":
      return <Link href={href}>{children}</Link>;
    default:
      return <button {...rest}>{children}</button>;
  }
};
