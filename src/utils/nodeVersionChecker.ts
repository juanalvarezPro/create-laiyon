// Check Node.js version compatibility
export function checkNodeVersion(): void {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 18) {
    console.error(`❌ Node.js version ${nodeVersion} is not supported.`);
    console.error(`💡 Please upgrade to Node.js 18+ (LTS recommended)`);
    console.error(`🔗 Download: https://nodejs.org/`);
    process.exit(1);
  }
  
  if (majorVersion >= 23) {
    console.warn(`⚠️  Node.js version ${nodeVersion}`);
    console.warn(`💡 Consider using Node.js 18-22 LTS for best compatibility.`);
  }
}
