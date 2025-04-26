"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "cookie-consent";

/**
 * A simple Cookie Consent modal that uses localStorage to remember if a user has accepted cookies.
 *
 * Displays a bottom sheet prompting the user to accept cookies if they haven't previously done so.
 */
export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already given cookie consent
    const hasConsented = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsented) {
      setOpen(true);
    }
  }, []);

  /**
   * Handles user acceptance of cookie usage.
   * Stores the consent in localStorage and closes the modal.
   */
  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="w-full">
        <SheetHeader>
          <SheetTitle>Cookie Consent</SheetTitle>
          <SheetDescription>
            By using this site, you consent to our use of cookies to enhance your experience.
            We use cookies for essential functionality and analytics.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleAccept}>Accept</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
