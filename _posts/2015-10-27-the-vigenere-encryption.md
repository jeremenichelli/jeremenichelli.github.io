---
layout: default
title: The Vigenère encryption
resume: While doing a problem set for an online course I was asked to build a script that ciphers a phrase using this encryption method in language C. After finishing it, I decided to give it a try in JavaScript.
---

Before diving into the code let's do an introduction about Vigenère.


## That was plagiarism!

The Vigenère encryption method was developed (and broke) some centuries ago. It takes a phrase you want to encrypt and a secret word that only you and the receptor should know.

Now, consider the letters from the English alphabet numerically so **A** is **0**, **B** is **1** and so on. Take the first letter of the phrase to encrypt, convert it to its corresponding number, do the same to the first one from the secret word and sum them. The resulting number should be converted to a letter again.

Let's say that your phrase is **HELLOWORLD** and your secret word **BANANA**. In this system **H** is equivalent to **7** and **B** is **1**, the sum of them is **8** which is **I** in our system, becoming our first letter of our encrypted message. Then we continue with **E** and **A**, since **A** is **0** then the resulting letter is **E** and we continue doing the same for each letter.

If the phrase is longer than the secret word, as it is in this example, then we go back to the first letter of the second one until the whole phrase is encrypted.

```
HELLOWORLD
BANANABANA
```

The resulting arithmetic expression is that each encrypted letter equals to the module of 26 of the sum of the corresponding letters from the phrase and the secret word. In all programming languages I know module can be call with the `%` operator.

Assumming that **P** is the phrase, **K** the secret word and **H** the resulting ciphered phrase this would be the formula:

```
H[i] = P[i] + K[i] MODULE 26
```

In the decipher process the opposite happens to get the original phrase.

```
P[i] = H[i] - K[i] MODULE 26
```

If you want to know more about it you can go to <a href="https://en.wikipedia.org/wiki/Vigenère_cipher" target="_blank">the Wikipedia article about Vigenère</a> where you're going to find that actually the person who thought about this first was Giovan Battista Bellaso in 1553. Shame on you Vigenère!


## Alphabetic encryption in C

Each language has some cool stuff and caveats. **C** is not a new language so it might not be the choice of new developers, though I personally think it's a nice one to gain some knowledge about how computers and programming languages work thanks to pointers, memory location and types.

Sometimes those small quirks end up being the reason why solving a problem in a specific language is the right choice. If you are not familiar with it, in **C** there isn't such a thing as a type `string`, but there is a type `char` for character. Strings are actually arrays of characters.

Also, `char` variables can work both as characters and integers taking their numeric value from the <a href="http://www.asciitable.com/" target="_blank">ASCII table</a>.

```c
char letter = "A";
printf("%c: %d", letter, letter);
// prints "A: 65"
```

In that small portion of code I've printed both the character and its ASCII value as an integer using the same variable. Since in Vigenère we need to treat letters as numbers, this could be a big help. The only thing you need to take in count is that in ASCII the uppercase alphabet starts at **65**.

```c
char *phrase = "HELLOWORLD",
   *word = "BANANA";

for (int i = 0, len = strlen(phrase); i < len; i++) {
  int h = (phrase[i] - 65) + (word[i] - 65);
  h = h % 26;
  printf("%c", h + 65);
};
```

Notice that `h` is declared as an `int` and not as a `char` and it still works.

Though it looks like that simple loop would do the job, the index position of the phrase and the secret word should be independent since we need to reset the second one when we run out of letters.

```c
char *phrase = "HELLOWORLD",
   *word = "BANANA";

for (int i = 0, j = 0, len = strlen(phrase); i < len; i++) {
  int h = (phrase[i] - 65) + (word[j] - 65);
  h = h % 26;
  printf("%c", h + 65);
  j++;
  // reset word index
  if (j == strlen(word))
    j = 0;
};

// prints "IEYLBWPRYD"
```

To simplify the example I've just printed the result in the terminal, but returning it shouldn't alter the algorithm that much. Now, if you're a front end developer like me, you know that there isn't a *char* type in JavaScript... *but we have strings!*


## Alphabetic encryption in JavaScript

We already know how to solve this problem and the languages aren't that different in syntax so it wouldn't be that hard to translate the exact solution from **C** to **JavaScript**.

As I said we have to use strings, so we would need this two methods to convert the letters on the strings to their corresponding ASCII value and back again to a string after the math has been done.

```js
"A".charCodeAt(0);
// returns 65

String.fromCharCode(65);
// returns "A"
```

Though going on with this solution isn't a bad idea, we would be ignoring how **JavaScript** works, so when I started to write this new version I tried to come up with a new one from scratch.

As **C** lets you treat characters as integers, **JavaScript** is very flexible when working with strings. My approach was to create a string reference for all the letters in the alphabet and use `indexOf` to get its position which it is the letter's value in the Vigenère encryption, and that means no conversion or type changing at all.

```js
var ref = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

ref.indexOf('E');
// returns 5
```

In other words, you get the Vigenère equivalent of a letter using `indexOf`, apply the math and after you're done you just use the array notation to get the result.

```js
var ref = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  phrase = 'HELLOWORLD',
  word = 'BANANA',
  result = '';

for (var i = 0, j = 0, len = phrase.length; i < len; i++) {
  var h = ref.indexOf(phrase[i]) + ref.indexOf(word[j]);
  h %= 26;
  result += ref[h];
  j++;
  // reset word index
  if (j === word.length)
    j = 0;
}

// print result in console
console.log(result);
```

Using this approach you can apply any alphabetic encryption method changing only the algebraic portion of the script.

### Getting nitpicky

In the example from above the phrase was all in uppercase and with no spaces. That's the way encrypted messages were passed in wars, using telegraphs and morse code, so no time for spaces or other special characters.

But if you want you message to be more consistent and still work in these edge cases you can check if the character you're about to cipher is present in the reference string and after that's true, apply the encoding.

```js
// variables declaration

for (var i = 0, j = 0, len = phrase.length; i < len; i++) {
  if (ref.indexOf(phrase[i]) !== -1) {
    // apply encryption algorithm
  } else {
    // add to the result string without modification
    result += phrase[i];
  }
}
```

You can also create two reference strings one for lowercase and other for uppercase letters and choose which one to use in the process to have a case sensitive algorithm.


## Wrap-up

It's great to see how small parts of a language structure can change drastically the solution you build of the same problem. If you're more curious about this, I've put a Vigenère solution that works with both uppercase and lowercase and ignores special characters in a <a href="https://github.com/jeremenichelli/vigenere" target="_blank">GitHub repository</a> so you can check it out and play with it.

Happy encrypting!
