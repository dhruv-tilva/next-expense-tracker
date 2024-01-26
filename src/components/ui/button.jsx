"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../utils";
import Link from "next/link";
import { Spinner } from "../common/spinner";
import useAuthStore from "@/store/auth";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-0 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-orange-600 text-white hover:bg-orange-700 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90",
        destructive:
          "bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90",
        primary:
          "bg-orange-600 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90",
        outline:
          "border border-stone-400 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        secondary:
          "bg-zinc-200 text-neutral-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-neutral-50 dark:hover:bg-zinc-800/80",
        ghost:
          "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        link: "text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50",
        pink: "bg-[#FF00D5] text-neutral-50 hover:bg-[#AC008F]",
      },
      size: {
        default: "h-10 rounded-[30px] text-base px-4 py-2",
        sm: "h-9 rounded-md px-3",
        md: "px-2.5 rounded-full py-1.5",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  (
    {
      className,
      onClick = async () => {},
      variant,
      disabled = false,
      size,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const { loading } = useAuthStore();

    const [clicked, setClicked] = React.useState(false);

    const Comp = asChild ? Slot : "button";

    const handleClick = async () => {
      setClicked(true);
      await onClick();
    };

    React.useEffect(() => {
      !loading && setClicked(false);
    }, [loading]);

    return (
      <Comp
        className={cn("relative", buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        disabled={loading || disabled}
        {...props}
      >
        {clicked && loading && (
          <>
            <Spinner className="absolute h-6" />
          </>
        )}
        <div
          className={cn("flex justify-center", {
            "opacity-0": clicked && loading,
          })}
        >
          {children}
        </div>
      </Comp>
    );
  }
);

const BackButton = (props) => {
  const router = useRouter();
  return (
    <>
      <Button onClick={() => router.back()} variant="outline" {...props}>
        Go Back
      </Button>
    </>
  );
};

const ButtonLink = ({
  className,
  variant,
  size,
  disabled,
  children,
  href,
  tabIndex = null,
}) => {
  const { loading } = useAuthStore();
  const pathname = usePathname();

  const isActive = pathname == href;

  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size, className }), {
        "pointer-events-none": loading || disabled || isActive,
        "bg-zinc-300": isActive,
      })}
      tabIndex={tabIndex}
      aria-disabled={loading || disabled || isActive}
    >
      {children}
    </Link>
  );
};

Button.displayName = "Button";

export { Button, BackButton, ButtonLink, buttonVariants };
