import * as React from "react";
import "@/styles/main.css";

import { Template as DocTemplate } from "@/templates/doc";
import { AppProps } from "next/app";
import motifConfig from "@/motif.json";
import { MDXProvider } from "@mdx-js/react";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

const components: any = {
  a: ({ href, ...props }: { href: string }) => (
    <Link href={href}>
      {" "}
      <a {...props} />
    </Link>
  ),
  img: ({ src, alt, ...props }: { src: string; alt: string }) => (
    <Image alt={alt} src={src} layout="responsive" {...props} />
  ),
};


function MyApp({ Component, pageProps, router }: AppProps) {
  const meta = (Component as any).meta || {};
  const filename = (Component as any).filename || {};
  const files = (Component as any).files || {};

  return (<>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
      </Head>
      <MDXProvider components={components}>
        <DocTemplate
          meta={meta}
          path={router.pathname}
          filename={filename}
          files={files}
        >
          <Component {...pageProps} />
        </DocTemplate>
      </MDXProvider>
    </>
  );
}

export default MyApp;
