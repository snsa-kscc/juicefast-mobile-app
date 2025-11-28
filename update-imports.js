const fs = require("fs");
const path = require("path");

// Define the directory to scan
const rootDir = path.join(__dirname, "src");

// Common React hooks to look for
const reactHooks = [
  "useState",
  "useEffect",
  "useContext",
  "useReducer",
  "useCallback",
  "useMemo",
  "useRef",
  "useImperativeHandle",
  "useLayoutEffect",
  "useDebugValue",
  "useDeferredValue",
  "useTransition",
  "useId",
  "useSyncExternalStore",
  "useInsertionEffect",
  "useOptimistic",
  "startTransition",
];

// Function to process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    const originalContent = content;

    // Check if file imports React
    const reactImportMatch = content.match(
      /^import\s+React(?:,\s*\{[^}]*\})?\s+from\s+['"]react['"]/m
    );
    if (!reactImportMatch) return false;

    const reactImport = reactImportMatch[0];

    // Find which hooks are used in the file
    const usedHooks = [];
    for (const hook of reactHooks) {
      const hookRegex = new RegExp(`\\b${hook}\\s*\\(`);
      if (hookRegex.test(content)) {
        usedHooks.push(hook);
      }
    }

    if (usedHooks.length === 0) {
      // No hooks used, keep the import as is
      return false;
    }

    // Create the new import statement
    let newImport;
    if (reactImport.includes("{") && reactImport.includes("}")) {
      // Update existing named imports
      const existingImports = reactImport
        .match(/\{([^}]*)\}/)[1]
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);
      const allImports = [
        ...new Set([...existingImports, ...usedHooks]),
      ].sort();
      newImport = `import React, { ${allImports.join(", ")} } from 'react'`;
    } else if (reactImport.includes("React")) {
      // Add named imports to default import
      newImport = `import React, { ${usedHooks.join(", ")} } from 'react'`;
    } else {
      // No React import found, skip
      return false;
    }

    // Replace the import statement
    content = content.replace(reactImport, newImport);

    // Only write if the content has changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, "utf8");
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Function to find all TypeScript and JavaScript files
function findFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (
      entry.isDirectory() &&
      !entry.name.includes("node_modules") &&
      !entry.name.startsWith(".")
    ) {
      files.push(...findFiles(fullPath));
    } else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

// Main function
function main() {
  console.log("Scanning for React imports...");

  const files = findFiles(process.cwd());
  let updatedCount = 0;

  for (const file of files) {
    if (processFile(file)) {
      console.log(`Updated: ${path.relative(process.cwd(), file)}`);
      updatedCount++;
    }
  }

  console.log(`\n✅ Updated ${updatedCount} files.`);
}

// Run the script
main();
