
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Inter, Outfit } from "next/font/google";


const inter = Outfit({ subsets: ["latin"] });


export const metadata = {
  title: "My Next App",
  description: "Using Google Fonts with Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
      {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
