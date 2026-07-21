"use client";
import React from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WavyBackgroundDemo() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <WavyBackground className="max-w-4xl mx-auto pb-40 flex flex-col items-center justify-center">
      <p className="text-4xl md:text-6xl lg:text-8xl text-white font-bold inter-var text-center tracking-tight drop-shadow-lg animate-fade-in">
        EcoSphere
      </p>
      <p className="text-base md:text-xl mt-4 text-emerald-200/90 font-medium inter-var text-center max-w-lg px-4 drop-shadow-md">
        Leading ESG & Carbon Footprint Management Platform for Sustainable Enterprises.
      </p>
      
      {isLoaded && (
        <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-6 px-8 rounded-xl shadow-lg shadow-emerald-900/40 border border-emerald-500/30 transition-all hover:scale-105 duration-200 text-base cursor-pointer">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold py-6 px-8 rounded-xl backdrop-blur-md transition-all hover:scale-105 duration-200 text-base cursor-pointer">
                  Create Account
                </Button>
              </SignUpButton>
            </>
          ) : (
            <Link href="/dashboard" passHref legacyBehavior>
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-6 px-8 rounded-xl shadow-lg shadow-emerald-900/40 border border-emerald-500/30 transition-all hover:scale-105 duration-200 text-base cursor-pointer">
                Enter Dashboard
              </Button>
            </Link>
          )}
        </div>
      )}
    </WavyBackground>
  );
}
