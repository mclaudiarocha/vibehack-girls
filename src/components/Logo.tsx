import logo from "@/assets/iris-logo.png";
import { Link } from "react-router-dom";

interface Props {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({ size = "md", showText = true }: Props) {
  const dim = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-14 w-14" : "h-10 w-10";
  const text = size === "sm" ? "text-xl" : size === "lg" ? "text-3xl" : "text-2xl";
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <img
        src={logo}
        alt="Íris"
        className={`${dim} object-contain transition-smooth group-hover:scale-105`}
      />
      {showText && (
        <span className={`font-display font-semibold ${text} text-foreground tracking-tight`}>
          Íris
        </span>
      )}
    </Link>
  );
}