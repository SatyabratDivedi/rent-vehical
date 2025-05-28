import type { Metadata } from 'next';
import { Fira_Code, Space_Mono, Sue_Ellen_Francisco } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Providers } from './providers';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fira',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-space',
});

const sueEllenFrancisco = Sue_Ellen_Francisco({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sue',
});

export const metadata: Metadata = {
  title: 'Rent Vehicle',
  description: 'Book any vehicle for free',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${firaCode.variable} ${spaceMono.variable} ${sueEllenFrancisco.variable} antialiased`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <Toaster reverseOrder={false}/>
          <Navbar />
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
