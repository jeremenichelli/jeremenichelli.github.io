---
layout: post
title: Pointers in C
resume: There are two things that I do every year in my life, one is turning one year older, the other is trying to remember again how to properly use pointers in C.
---

I'll try to help my memory a little bit by writing a small article about them. This will probably be one of the few posts without JavaScript on it, though it will be mentioned.

## Types and memory

C is a powerful language and one of the reasons is that you can control how much space your program will take while running. It doesn't seem to be such a deal nowadays, but in times where computers have a limited amount of RAM this was an amazing feature.

Every time you declare a new variable, any programming language takes a piece of the memory of the device to store it until the program dies or we make it available again somehow. In some languages these variables must be typed.

JavaScript doesn't have types, though we could differentiate between primitives and objects, but C is a strongly typed language. This means that you have to indicate what information your variable will contain.

```c
int n = 25;

float f = 2.5
```

When you declare variables, the language reserves an amount in memory that will depend on that type.


## Pointers

In C, we can also ask the program for a piece of memory to hold a certain type of data. Confusing? Let's put it in other words, instead of saying that I need to store an integer in a variable I can say, *give me the address of a chunk of memory where an integer can fit in*.

```c
// create a pointer to an integer
int* number;
```

When you do this, the variable itself will actually hold an address in memory, not a variable. So, trying to assign a value to `number` won't work as expected.


```c
number = 5;
// NOPE!!!
```

What you need to do is to create the variable and the pointer that will hold the address in memory, to accomplish we're going to use the ampersand `&` operator. When we precede a variable with an ampersand in C we get the address in memory of that variable.

```c
int *pointer;
int number = 5;
pointer = &number;
```

We can use the star operator `*` to get the content of a pointer.

```c
printf("%i", *pointer);
// prints 5
```

So what's the point of using *pointers*? Well, there's not a real benefit in using pointers unless you really need them, but there is a set of functions in C that will allow you to manipulate memory and those methods will expect pointers and not normal variables.

*You must specify the type of each parameter a function will receive in C.*

If you need to save an array of five numbers, you can use `malloc` to alocate memory for this data.

```c
int* numbers = malloc(sizeof(int) * 5);
numbers[2] = 11235;
```

You might have noticed that there's no star symbol `*` before `numbers` in the second line, that's because C always treats arrays as pointers, so in this particular case we don't need it.

Back to memory allocation, the strength of this approach is that in a large program when we don't need that array anymore we can liberate that memory so it's available for use.

```c
free(numbers);
```

This minimizes memory leaks and becomes a great improvement when dealing with big chunks of data.


## Parameter by value and by reference

Similar to JavaScript, in C every time the program enters in a function a new scope is created. The parameters of that function can be used and be changed, but since these actions took place inside a scoped created for that function exclusively, when the execution returns to the global scope this variables remain the unaltered.

```c
#include <stdio.h>

void increase(int n) {
    n = n + 1;    
};

int main(void) {
    int a = 1;
    increase(a);
    printf("%i", a);
    // prints 1
};
```

This didn't work as expected because we are not actually passing the variable, just its value.

Can we pass parameters by reference in C? **Yes!** How? **POINTERS!**

The only difference is that for this particular case, we don't need to create a pointer, we only need to pass the function the address of the variable we want to modify using the ampersand `&` operator.

```c
#include <stdio.h>

void increase(int* n) {
    *n = *n + 1;    
};

int main(void) {
    int a = 1;
    increase(&a);
    printf("%i", a);
    // prints 2
};
```

Every time we want to change the value of the pointer we need to use the star prefix `*`, for example `increase` function and it's also necessary to indicate that a pointer is expected in the header of the method.

## Wrap-up

Hopefully after writing this small article I won't have to google again how pointers work, but just in case I forget again, I know I just need to come back here.




