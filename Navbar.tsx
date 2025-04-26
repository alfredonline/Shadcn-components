"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils"; // Utility function to join classNames
import { navigationItems } from "@/constants/navigation"; // Your navigation structure
import { Button, buttonVariants } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

/**
 * Header component with responsive navigation, dropdown menus, and authentication buttons.
 * @component
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
              YourLogo
              <Image
                src="/your-logo.svg" // Replace with your logo
                alt="Logo"
                width={20}
                height={20}
              />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <button
                    className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors py-2"
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === item.label}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "transition-transform duration-200",
                        activeDropdown === item.label && "rotate-180"
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
                {/* Dropdown */}
                <AnimatePresence>
                  {activeDropdown === item.label && item.dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-1 w-56 bg-background rounded-xl shadow-lg border border-border overflow-hidden"
                    >
                      <div className="py-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.label}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-accent/10 hover:text-primary transition-colors"
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton />
                <Button variant="default" className="shadow-sm hover:shadow-md transition-shadow">
                  <SignUpButton />
                </Button>
              </SignedOut>
              <SignedIn>
                <UserButton />
                <Link
                  href="/dashboard"
                  className={buttonVariants({ variant: "default" })}
                >
                  Dashboard
                </Link>
              </SignedIn>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="lg:hidden relative z-50 p-2 -mr-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 top-0 z-40 bg-background pt-20 pb-6 px-4 overflow-y-auto"
            >
              <nav className="flex flex-col space-y-6">
                {navigationItems.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="font-medium text-foreground px-2">{item.label}</div>
                    {item.dropdown && (
                      <div className="pl-4 space-y-2 border-l-2 border-border">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.label}
                            href={dropdownItem.href}
                            className="block py-2 text-foreground/60 hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Example extra mobile links */}
                <Link
                  href="/pricing"
                  className="block px-2 py-2 font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/success"
                  className="block px-2 py-2 font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Success Stories
                </Link>

                {/* Mobile Auth Actions */}
                <div className="pt-6 space-y-4">
                  <Link
                    href="/login"
                    className="block px-2 py-2 font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full shadow-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Book a Demo
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
