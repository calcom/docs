import * as React from "react";
import "@/styles/main.css";

import { AppProps } from "next/app";
import motifConfig from "@/motif.json";
import dynamic from "next/dynamic";
import fastLevenshtein from "fast-levenshtein";
import minimatch from "minimatch";
import { MDXProvider } from "@mdx-js/react";
import Link from "next/link";
import Image from "next/image";

export const getBestGlobMatch = (
  globs: string[],
  path: string
): string | undefined => {
  const match = globs
    .filter((p) => minimatch(path, p))
    .sort((m1, m2) => {
      const d1 = fastLevenshtein.get(m1, path);
      const d2 = fastLevenshtein.get(m2, path);
      return d1 < d2 ? -1 : 1;
    })?.[0];

  if (match === undefined && globs.includes("**/*")) {
    return "**/*";
  }
  return match;
};

const getTemplateId = (pathname: string) => {
  const templateMappings =
    (motifConfig.templates as { [k: string]: string }) || {};
  const path = pathname === "/" ? "" : pathname?.replace(/^\//, "");
  const matchingGlob = getBestGlobMatch(Object.keys(templateMappings), path);
  return matchingGlob && templateMappings[matchingGlob];
};

// const getTemplate = (pathname: string) => {
//   switch (getTemplateId(pathname)) {
//     // Add other template mappings here
//     case "doc":
//       return dynamic(() =>
//         import("@templates/doc.mdx").then((mod) => mod.Template)
//       );
//     default:
//       return dynamic(() =>
//         import("@templates/plain.mdx").then((mod) => mod.Template)
//       );
//   }
// };

const components = {
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
  const Template = getTemplate(router.pathname);

  const meta = (Component as any).meta || {};
  const filename = (Component as any).filename || {};
  const files = (Component as any).files || {};

  return (

    <MDXProvider components={components}>
      <Template
        meta={meta}
        path={router.pathname}
        filename={filename}
        files={files}
      >
        <Component {...pageProps} />
      </Template>
    </MDXProvider>
  );
}

export default MyApp;
