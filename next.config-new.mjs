import nextMdx from '@next/mdx';
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { createLoader } from "simple-functional-loader";
import path from "path";
import fs from "fs";
import matter from "gray-matter";


const withMDX = nextMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
  },
});


const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx', 'mdoc'],
  reactStrictMode: true,
  webpack(config, options) {
    return config;
  },
};

export default withMDX(nextConfig);