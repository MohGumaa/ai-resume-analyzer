// Simple test script for the formatSize function
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
};

// Test cases
const testCases = [
  { input: 0, expected: '0 B' },
  { input: 500, expected: '500.00 B' },
  { input: 1024, expected: '1.00 KB' },
  { input: 1500, expected: '1.46 KB' },
  { input: 1024 * 1024, expected: '1.00 MB' },
  { input: 1024 * 1024 * 2.5, expected: '2.50 MB' },
  { input: 1024 * 1024 * 1024, expected: '1.00 GB' },
  { input: 1024 * 1024 * 1024 * 1024, expected: '1.00 TB' }
];

// Run tests
console.log('Testing formatSize function:');
testCases.forEach(test => {
  const result = formatSize(test.input);
  const passed = result === test.expected;
  console.log(`${passed ? '✓' : '✗'} ${test.input} bytes => ${result} ${!passed ? `(expected: ${test.expected})` : ''}`);
});