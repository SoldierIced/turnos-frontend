import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/hooks/useAuth";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./globals.css";

export const metadata = {
    title: "Magic Hands",
    description: "Sistema privado.",
    icons: {
        icon: [
            { url: "/favicon.ico" }, // fallback
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: "/apple-touch-icon.png",
        other: [
            {
                rel: "manifest",
                url: "/site.webmanifest",
            },
        ],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        </body>
        </html>
    );
}
