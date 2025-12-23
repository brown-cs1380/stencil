const execSync = require('child_process').execSync;
const path = require('path');

test('(9 pts) test student', () => {
  const command = `"${path.join(__dirname, 'test-student-provided.sh')}"`;
  execSync(command).toString().trim();
});

test('(5 pts) lint', () => {
  const command = `"${path.join(__dirname, 'test-lint.sh')}"`;
  execSync(command).toString().trim();
});

test('(7 pts) test-stem', () => {
  const command = `"${path.join(__dirname, 'test-stem.sh')}"`;
  execSync(command).toString().trim();
});

test('(7 pts) test-query', () => {
  const command = `"${path.join(__dirname, 'test-query.sh')}"`;
  execSync(command).toString().trim();
});

test('(5 pts) test-process', () => {
  const command = `"${path.join(__dirname, 'test-process.sh')}"`;
  execSync(command).toString().trim();
});

test('(5 pts) test-merge-heredoc', () => {
  const command = `"${path.join(__dirname, 'test-merge-heredoc.sh')}"`;
  execSync(command).toString().trim();
});

test('(8 pts) test-merge', () => {
  const command = `"${path.join(__dirname, 'test-merge.sh')}"`;
  execSync(command).toString().trim();
});

test('(5 pts) test-combine', () => {
  const command = `"${path.join(__dirname, 'test-combine.sh')}"`;
  execSync(command).toString().trim();
});

test('(7 pts) test-invert', () => {
  const command = `"${path.join(__dirname, 'test-invert.sh')}"`;
  execSync(command).toString().trim();
});

test('(5 pts) test-getURL', () => {
  const command = `"${path.join(__dirname, 'test-getURLs.sh')}"`;
  execSync(command).toString().trim();
});

test('(7 pts) test-getText', () => {
  const command = `"${path.join(__dirname, 'test-getText.sh')}"`;
  execSync(command).toString().trim();
});

test('(10 pts) test-end_to_end', () => {
  const command = `"${path.join(__dirname, 'test-end_to_end.sh')}"`;
  execSync(command, {stdio: ['pipe', 'pipe', 'inherit']}).toString().trim();
});

test('(20 pts) test-sandbox_1', () => {
  const command = `"${path.join(__dirname, 'grade-sandbox-1.sh')}"`;
  execSync(command, {stdio: ['pipe', 'pipe', 'inherit']}).toString().trim();
});

test('(20 pts) test-sandbox_2', () => {
  const command = `"${path.join(__dirname, 'grade-sandbox-2.sh')}"`;
  execSync(command, {stdio: ['pipe', 'pipe', 'inherit']}).toString().trim();
});
