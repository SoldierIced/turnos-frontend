"use client";
import AuthButton from "@/components/AuthButton";
import Image from "next/image";

export default function Home() {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center " style={{backgroundColor: "#1d181c"}}>
        {/* Logo */}
        <Image
            src="/logo.png"
            alt="Logo MagicHands"
            width={200}
            height={200}
            priority
            className="mb-6"
        />

        {/* Título */}
        <h1 className="text-4xl font-bold text-army mb-8">MagicHands</h1>

        {/* Botones */}
        <div className="flex gap-6">
          <AuthButton />
        </div>
      </div>
  );
}
