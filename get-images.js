const fs = require('fs').promises;
const path = require('path');
const https = require('https');

// Define the pattern to search for
const pattern = /https:\/\/res\.cloudinary\.com\/\S+/g;


export const uniqByNoDeps = (arr, testFn) => {
  const seen = new Set();
  return arr.filter((item) => {
    const keyValue = testFn(item);
    if (seen.has(keyValue)) {
      return false;
    }
    seen.add(keyValue);
    return true;
  });
};

export const uniqNoDeps = (arr) => {
  return uniqByNoDeps(arr, (i) => i);
};

async function downloadFile(fileUrl) {
  const fileName = fileUrl.split("/").slice(-1)[0]
  const result = await fetch(fileUrl);
  const path = "public/images/" + fileName;
  await Bun.write(path, result);
}

// Async function to search for the pattern in a file
async function searchFile(filePath) {
  let files = []
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const matches = data.match(pattern);
    if (matches) {
      matches.forEach(match => files.push(match
        .replace(/\.svg.*/, ".svg")
        .replace(/\.png.*/, ".png")
        .replace(/\.gif.*/, ".gif")
      ));
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error}`);
  }
  return files
}


// Async function to recursively traverse directories and search files
async function traverseDirectory(dirPath) {
  if (dirPath.includes(".next") || dirPath.includes("node_modules")) {
    return []
  }
  let allPaths = []
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (let entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        const newPaths = await traverseDirectory(fullPath);
        allPaths = [...allPaths, ...newPaths]
      } else {
        const paths = await searchFile(fullPath);
        allPaths = [...allPaths, ...paths]
      }
    }
  } catch (error) {
      console.error(`Error reading directory ${dirPath}: ${error}`);
  }

  return allPaths
}

const run = async () =>{
  const allPaths = await traverseDirectory(".")
  for (const path of allPaths) {
    await downloadFile(path)
  }
}

run()