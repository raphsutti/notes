// solution('abc', 'bc') // returns true
// solution('abc', 'd') // returns false

const solution = (input, endsWith) => input.endsWith(endsWith);

// Test.assertEquals(solution('abcde', 'cde'), true)
// Test.assertEquals(solution('abcde', 'abc'), false)
