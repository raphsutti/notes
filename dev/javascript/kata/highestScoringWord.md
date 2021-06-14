Given a string of words, you need to find the highest scoring word.

Each letter of a word scores points according to its position in the alphabet: a = 1, b = 2, c = 3 etc.

You need to return the highest scoring word as a string.

If two words score the same, return the word that appears earliest in the original string.

All letters will be lowercase and all inputs will be valid.

## Solution

Create a wordScorer function
- Create array of letters with destructuring and make them lowercase
- Adds each letter values up with `reduce`

Find highest scoring word
- Creating array of words with `split`
- Use `reduce` to only return the highest scoring word


```typescript
const wordScorer = (word: string) => {
  const letters = [...word.toLowerCase()];
  return letters.reduce((acc, curr) => acc + curr.charCodeAt(0) - 96, 0);
};

const highestScoringWord = (sentence: string) => {
  const words = sentence.split(" ");

  return words.reduce((prev, curr) => {
    if (wordScorer(curr) > wordScorer(prev)) {
      return curr;
    }
    return prev;
  });
};

highestScoringWord("man i need a taxi up to ubud"); // taxi
```
