---
title: How to shuffle an&nbsp;array
resume: The other day I was asked at work to sort randomly an array of objects and while it didn't seem a very complex task it turned out into hours of investigation. There are a lot of things to take care of, so yes, it is a complex scenario and there are a lot of possible solutions.
---

Whatever the solution was it needed to cover two concerns to beat any other possible one. The first thing was the frequency distribution of the possible results which basically means that I wanted any combination of the items to be equally probable to appear. The second one was performance.

Without overthinking too much about them I decided to quickly bring an algorithm that would do the job, just as a start and dive into alternatives and testing later.


## From the scratch

Trying to achieve equally probable results, I came up with this idea. First of all make a copy of the array. Get a random position, take the item in that position out of the array and put it inside a new one. Then repeat that again considering that now the array length has decreased by one until the copied array is empty.

The best thing of this approach is that every iteration is independent from the previous one, which it should be pretty obvious and not a big deal but I'll show you some code samples that are popular in forums that don't even cover this when they are asked for a solution to this problem, but let's stick with this for now.

### Copy an array

We need to do this so we don't actually modify the original one. There's an array method called *slice* that takes two parameters, a start position and a number of elements you want to take from that position. It returns a new array containing only those elements, if you need a better understanding of it check <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice" target="blank">MDN reference</a>.

What's funny is that if you don't pass any arguments to slice it returns a new array with the exact same elements, which is exactly what we need.

```js
function shuffle(array) {
  var origArray = array.slice();
}
```

### Get a random position

There's a pretty famous guy in the neighbourhood called <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random" target="_blank">Math.random()</a> that picks a number between *0* and *0.99* and returns it. Let's say we have an array with three elements, if we call this method and then multiply the result with the length of the array we can get a value between *0 * 3 = 0* and *0.99 * 3 = 2.99*. Removing the floating part of any of the possible result we can get zero, one or two which are the three available indexes in an array of three elements.

```js
function shuffle(array) {
  var origArray = array.slice();
  var len = origArray.length;
  var position;

  position = Math.floor(Math.random() * len);
}
```

Now we must put this logic inside a loop and decrease the length in every iteration.

```js
function shuffle(array) {
  var origArray = array.slice();
  var len = origArray.length;
  var position;

  while (len) {
    position = Math.floor(Math.random() * len--);
  }
}
```

Simple and beautiful... and useless, because it's still doing nothing.


### Return a new shuffled array

We still need to extract the element in that position from *origArray* and store it in a new one. For that we can use *splice* which does the same thing as *slice* but it removes the result from the original array.

```js
function shuffle(array) {
  var origArray = array.slice();
  var len = origArray.length;
  var newArray = [];
  var position;

  while (len) {
    position = Math.floor(Math.random() * len--);
    newArray.push(origArray.splice(position, 1)[0]);
  }

  return newArray;
}
```

If you want to shorten this code you can put all the logic in a single line. Also I don't want to go through all these steps if I receive an array with a single element or an undefined object so we can add an exception for that.

```js
function shuffle(array) {
  if (!!array && array.length > 1) {
    var origArray = array.slice();
    var len = origArray.length;
    var newArray = [];

    while (len) {
      newArray.push(
        origArray.splice(Math.floor(Math.random() * len--), 1)[0]
      );
    }
  } else {
    return array ? array.slice() : [];
  }

  return newArray;
}
```

<a
  class="blocked__link blocked__link--centered"
  href="https://jsfiddle.net/jeremenichelli/7qLbpr1b/6/"
  rel="noopener noreferrer">
  See it in action
</a>

I've created a fiddle (link above) where you can see this working. It also contains an iteration that gets executed a thousand times with the results that shows the frequencies distribution in console.

After running those tests and making sure it worked well I started searching for alternatives and stepped out with what I think is an ugly solution to this.


## Using sort, just don't

Don't get me wrong, I think <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort" target="_blank">sort</a> is great, but when it's used for its original purpose which is to establish a new known order in an array. For that you need a criteria and a compare function that responds to it. Random isn't a known order and has no criteria, but well, here's the little monster I found out there...

```js
array.sort(function() { return 0.5 - Math.random() });
```

Beautiful, isn't it? Just one line, something that will encourage you to put it inside your code right away because, you know, it's just one line man! The problem with this is that is not taking in consideration how *sort* really works. Every time the compare function is called, sort expects a negative number, a positive number or zero. In case the number is negative the second element in comparison will be moved before the first one, the opposite will happen if the number is positive and nothing will happen if the number returned is zero.

That's pretty useful when you are actually sorting elements but since we want to create a random scenario half of the times the compare function is called nothing will changes, leaving the elements in the position they are. We don't want that. If you send an array of two or three elements there's a high probability you will get the exact same array.


## The best solution out there

I supposed that this problem wasn't new and that probably smarter people than me already had a solution for a well distributed and performant algorithm.

Luckily that was true. The solution is very old and it's called <a href="http://en.wikipedia.org/wiki/Fisher–Yates_shuffle" target="_blank">Fisher-Yates shuffle</a> named after Ronald Fisher and Frank Yates and it assures that any possible permutation is equally likely.

This algorithm is the one applied by underscore library in their **_.shuffle** method and you can see its implementation in <a href="https://github.com/jashkenas/underscore/blob/master/underscore.js#L342" target="_blank">github</a>.


## Wrap-up

I knew that there was probably a better solution for this before starting my own approach, but I think that giving it a try gives you a great opportunity to think, investigate and learn a lot not only about the problem itself, you also get to know new methods, new tools, new patterns.

That's the good thing about trying to make your own way through challenges. I hope this post reflected some of that experience and in case you were looking for a nice solution to shuffle an array that it was also useful.

Happy shuffling!
