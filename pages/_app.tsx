import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/navbar/navbar";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthState } from '../hooks/useAuthState'; // Adresa către hook-ul useAuthState

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const theme = extendTheme({ colors });

export default function App({ Component, pageProps }: AppProps) {
  const { user, isLoading } = useAuthState();

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && router.pathname !== '/login' && router.pathname !== '/signup') {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Poate fi un indicator de încărcare personalizat
  }

  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
