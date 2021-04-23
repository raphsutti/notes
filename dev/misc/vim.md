# VIM

## Navigation
- `h`,`j`,`k`,`l`
- provide number beforehand to perform that action x times
- `f` and `F` to find a letter. `;` to go to next occurence
- `/` and `?` to search. `n` and `N` for next occurence
- `*` on current word will find next occurence of the word

## Copy and pasting - Registers
- Yanking `y`, deleting `d`, replace `c`, or remove `x` cuts the text into default (unnamed) registers. 
  - These can be accessed with `""`
- To store values in special named registers, we do `"<letter>`

eg. Saving the text into the `r` register, we type `"r` then perform the action

- There are also numbered registers `"0` all the way to `"9` being the oldest
