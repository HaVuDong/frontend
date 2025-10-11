"use client";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Header from "@/components/site/layout/Header";
import AuthRequiredModal from "@/components/site/AuthRequiredModal";

export default function SiteLayout({ children }) {
  return (
    <AuthProvider>
      <SiteContent>{children}</SiteContent>
    </AuthProvider>
  );
}

function SiteContent({ children }) {
  const { user, isReady } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.requireLogin = (callback) => {
        if (!user) setShowModal(true);
        else callback();
      };
    }
  }, [user]);

  if (!isReady) return null;

  return (
    <>
      <Header />
      <main>{children}</main>
      <AuthRequiredModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
