import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3csvg viewBox='-2 -2 128 60' xmlns='http://www.w3.org/2000/svg'%3e%3cstyle%3e.details{stroke:%23111827;fill:%23111827}@media(prefers-color-scheme:dark){.details{stroke:%23f9fafb;fill:%23f9fafb}}%3c/style%3e%3cpath d='M0 56V0H28C43.464 0 56 12.536 56 28V28C56 43.464 43.464 56 28 56H0Z' fill='%23FFCC01'/%3e%3cpath d='M68 56V0H96C111.464 0 124 12.536 124 28V28C124 43.464 111.464 56 96 56H68Z' fill='%23FFCC01'/%3e%3cpath class='details' d='M28.5 15L21 28.5H30L22.5 42' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3e%3ccircle class='details' cx='91' cy='28' r='4'/%3e%3ccircle class='details' cx='107' cy='28' r='4'/%3e%3c/svg%3e" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
