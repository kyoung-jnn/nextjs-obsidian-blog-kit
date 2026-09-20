import assert from 'node:assert/strict';
import test from 'node:test';

import { getMermaidTheme } from '../src/lib/mermaidTheme.ts';

test('uses a light shadcn-style palette for the light theme', () => {
  const config = getMermaidTheme('light');

  assert.equal(config.theme, 'base');
  assert.equal(config.themeVariables.primaryColor, '#ffffff');
  assert.equal(config.themeVariables.primaryTextColor, '#202020');
});

test('uses a dark shadcn-style palette for the dark theme', () => {
  const config = getMermaidTheme('dark');

  assert.equal(config.theme, 'base');
  assert.equal(config.themeVariables.primaryColor, '#222325');
  assert.equal(config.themeVariables.primaryTextColor, '#ededf0');
});
