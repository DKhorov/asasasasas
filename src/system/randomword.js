import { words, tips } from './data';

export function getRandomWord() {
  const idx = Math.floor(Math.random() * words.length);
  return words[idx];
}

export function getRandomTip() {
  const idx = Math.floor(Math.random() * tips.length);
  return tips[idx];
} 