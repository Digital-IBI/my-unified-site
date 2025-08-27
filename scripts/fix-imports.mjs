#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Function to convert @/lib/ imports to relative imports
function convertImports(content, filePath) {
  // Convert @/lib/ imports to relative imports
  let converted = content.replace(
    /from ['"]@\/lib\/([^'"]+)['"]/g,
    (match, libPath) => {
      const currentDir = path.dirname(filePath)
      const relativePath = path.relative(currentDir, path.join(__dirname, '..', 'lib', libPath))
      return `from '${relativePath.startsWith('.') ? relativePath : './' + relativePath}'`
    }
  )

  // Convert @/components/ imports to relative imports
  converted = converted.replace(
    /from ['"]@\/components\/([^'"]+)['"]/g,
    (match, componentPath) => {
      const currentDir = path.dirname(filePath)
      const relativePath = path.relative(currentDir, path.join(__dirname, '..', 'components', componentPath))
      return `from '${relativePath.startsWith('.') ? relativePath : './' + relativePath}'`
    }
  )

  // Convert @/app/ imports to relative imports
  converted = converted.replace(
    /from ['"]@\/app\/([^'"]+)['"]/g,
    (match, appPath) => {
      const currentDir = path.dirname(filePath)
      const relativePath = path.relative(currentDir, path.join(__dirname, '..', 'app', appPath))
      return `from '${relativePath.startsWith('.') ? relativePath : './' + relativePath}'`
    }
  )

  return converted
}

// Function to process a file
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const converted = convertImports(content, filePath)
    
    if (content !== converted) {
      fs.writeFileSync(filePath, converted, 'utf8')
      console.log(`✅ Updated: ${filePath}`)
      return true
    }
    return false
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message)
    return false
  }
}

// Function to recursively find and process TypeScript/JavaScript files
function processDirectory(dir) {
  const files = fs.readdirSync(dir)
  let updatedCount = 0

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      updatedCount += processDirectory(filePath)
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      if (processFile(filePath)) {
        updatedCount++
      }
    }
  }

  return updatedCount
}

// Main execution
console.log('🔄 Converting @/ imports to relative imports...')

const projectRoot = path.join(__dirname, '..')
const updatedCount = processDirectory(projectRoot)

console.log(`\n✅ Conversion complete! Updated ${updatedCount} files.`)
console.log('\n📝 Next steps:')
console.log('1. Test the build locally: npm run build')
console.log('2. Commit and push changes')
console.log('3. Deploy to Netlify')
