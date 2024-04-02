import { ThemeProvider } from "@/components/theme-provider";
import { ContextProvider } from "@/context/useContext";
import { ClerkProvider } from "@clerk/nextjs";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

config.autoAddCss = false;
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Gas Tech Sign",
  description: "Automate your gas stations price sign",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ContextProvider>{children}</ContextProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
