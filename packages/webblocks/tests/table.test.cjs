const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const packageRoot = path.resolve(__dirname, '..');

test('wb-table-key remains intrinsic and overflow-safe', () => {
  const source = fs.readFileSync(path.join(packageRoot, 'src/css/primitives/table.css'), 'utf8');
  const dist = fs.readFileSync(path.join(packageRoot, 'dist/webblocks-ui.css'), 'utf8');
  const contract = [
    '.wb-table th.wb-table-key {',
    'width: 1%;',
    'white-space: nowrap;',
  ];

  contract.forEach((fragment) => {
    assert.ok(source.includes(fragment), `source is missing ${fragment}`);
    assert.ok(dist.includes(fragment), `dist is missing ${fragment}`);
  });
});
