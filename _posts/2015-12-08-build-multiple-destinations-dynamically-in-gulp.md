---
layout: post
title: Build multiple destinations dynamically in Gulp
resume: Usually streams start with one file or a bunch of them that go through some transformations and end up in one destination, like getting together JavaScript modules or processing LESS files. What if the end of the stream needs multiple output paths? And even more complicated, what if those multiple destination can change as the project grows?
---

To start, let's build a small example where this can actually be a problem to solve. Consider a project where you have multiple stand-alone pages that resides in the same folder, but after a build process they need to be in separate folders with their own main style sheet.

So, the initial directory would be this one.

```bash
├── styles
│      └── global.css
│ index.html
│ about.html
│ archive.html
```

And after running our build task this should be the final result.

```bash
├── styles
│      └── global.css
│ index.html
│ about.html
│ archive.html
```
 Something else

