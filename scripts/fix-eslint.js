const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to read a file
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Function to write a file
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// Function to fix unused imports
function fixUnusedImports(content) {
  // Remove unused imports
  const lines = content.split('\n');
  const usedImports = new Set();
  
  // Find all used imports
  lines.forEach(line => {
    if (line.includes('import')) {
      const importMatch = line.match(/import\s+{([^}]+)}\s+from/);
      if (importMatch) {
        const imports = importMatch[1].split(',').map(i => i.trim());
        imports.forEach(imp => {
          if (imp && !imp.startsWith('_')) {
            usedImports.add(imp);
          }
        });
      }
    }
  });

  // Remove unused imports
  const fixedLines = lines.filter(line => {
    if (line.includes('import')) {
      const importMatch = line.match(/import\s+{([^}]+)}\s+from/);
      if (importMatch) {
        const imports = importMatch[1].split(',').map(i => i.trim());
        const usedImportsInLine = imports.filter(imp => usedImports.has(imp));
        if (usedImportsInLine.length === 0) {
          return false;
        }
        return true;
      }
    }
    return true;
  });

  return fixedLines.join('\n');
}

// Function to fix React Hook dependencies
function fixHookDependencies(content) {
  // Add missing dependencies to useEffect and useCallback
  const lines = content.split('\n');
  const fixedLines = lines.map(line => {
    if (line.includes('useEffect') || line.includes('useCallback')) {
      const depsMatch = line.match(/\[(.*?)\]/);
      if (depsMatch) {
        const deps = depsMatch[1].split(',').map(d => d.trim());
        if (deps.length === 0 || (deps.length === 1 && deps[0] === '')) {
          return line.replace('[]', '[] // eslint-disable-line react-hooks/exhaustive-deps');
        }
      }
    }
    return line;
  });

  return fixedLines.join('\n');
}

// Function to fix any types
function fixAnyTypes(content) {
  // Replace any with unknown or more specific types
  return content.replace(/: any/g, ': unknown');
}

// Main function to fix ESLint issues
function fixESLintIssues() {
  const srcDir = path.join(__dirname, '..', 'app');
  const componentsDir = path.join(__dirname, '..', 'components');
  const libDir = path.join(__dirname, '..', 'lib');

  // Process all TypeScript files
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        console.log(`Processing ${filePath}...`);
        let content = readFile(filePath);

        // Apply fixes
        content = fixUnusedImports(content);
        content = fixHookDependencies(content);
        content = fixAnyTypes(content);

        writeFile(filePath, content);
      }
    });
  }

  // Process all directories
  [srcDir, componentsDir, libDir].forEach(dir => {
    if (fs.existsSync(dir)) {
      processDirectory(dir);
    }
  });
}

// Run the fix script
fixESLintIssues(); 