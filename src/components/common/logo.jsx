import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";

const Logo = ({ hideText = false, redirect = "/" }) => {
  const pathname = usePathname();
  return (
    <Link
      href={redirect}
      className={cn("flex items-center w-fit cursor-pointer")}
      tabIndex="-1"
    >
      <div className="w-11 xs:w-12 items-center mr-2.5 text-base leading-5">
        <svg viewBox="0 0 48 32" y="0px" x="0px" id="AR" version="1.2">
          <path
            d="M42,32H22c-3.3,0-6-2.7-6-6V6c0-3.3,2.7-6,6-6h20c3.3,0,6,2.7,6,6v20C48,29.3,45.3,32,42,32z"
            fill="#ec601d"
            display="none"
          ></path>
          <polygon
            points="0,32 16,0 32,32 24,32 16,16 8,32"
            fill="#ec601d"
          ></polygon>
          <path
            d="M40,32l-8.8-17.6l0,0h6c2,0,3.6-1.6,3.6-3.6s-1.6-3.6-3.6-3.6h-9.6l0,0L24,0h13.2C43.2,0,48,4.8,48,10.8
c0,4.2-2.4,7.8-5.8,9.6l0,0L48,32"
            fill="#ec601d"
          ></path>
        </svg>
      </div>
      <div
        className={cn("text-base leading-5 font-bold text-primary", {
          "hidden md:block": hideText,
        })}
      >
        Expense
        <br />
        Tracker
      </div>
    </Link>
  );
};

export default Logo;
