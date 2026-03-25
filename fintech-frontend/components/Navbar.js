"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload", label: "Upload" },
  { href: "/decision", label: "Decisions" },
  { href: "/simulation", label: "Simulator" },
  { href: "/email", label: "Email" },
  { href: "/reports", label: "Reports" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span className="font-bold text-white text-lg tracking-tight hidden sm:block">
            Fintech<span className="text-indigo-400">AI</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                pathname === href
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-2 ml-2">
          {user ? (
            <>
              <span className="text-gray-400 text-sm hidden md:block">
                {user.name}
              </span>
              <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary text-sm py-1.5 px-3">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
