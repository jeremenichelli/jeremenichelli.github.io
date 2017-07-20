---
title: Advantages and caveats of a one stylesheet per page&nbsp;strategy
resume: I recently changed the CSS structure of my personal site and blog aiming for better loading times and moved to single set of styles. Not every project will benefit from this.
---

Here are a few indicators and things you might need to know before changing from a global stylesheet to a set of them.


## Advantages

- **Each page will load only the rules it needs**, not only this means a lighter file and faster loading, but also much better rendering times because we are handing a much shorter CSSOM tree to the browser.
- **Minimize the impact of the Flash Of Unstyled Content** when using JavaScript to load stylesheets asynchronously.
- **Lower speed index** and higher search engine positioning as a consequence of faster loading.
- **Helps you to detect design patterns** and improve rules structure.

## Caveats

- **Building processes and templating gain complexity** because of multiple file existence and the need of loading stylesheets in conditional a manner.
- **Harder to maintain**, when debugging you now how to search between a bigger amount of files which can become a pain on a site with a big variety of single page styles.
- **It might complicate your mixins dependencies** when using then with a preprocessor to componentize a project's style architecture.
- **Moving to it can take too long**, it requires a heavy revision of the current set of rules &mdash; even more if you're inling critical styles in the head since you will need to define critical and non critical styles for each page.


## Wrap-up

In web development there are no winners nor losers when talking about concepts and strategies.

Moving to a set of specific stylesheets per page will be convenient only in certain cases where small variations happen across each corner of the project.

This site is using this approach because I've found out, after some authoring, it had small tweaks and variations from page to page and the only heavy styled ones were **posts**.

Also there is no *team impact* since I am the only one maintaining the site.

In my experience, even if you don't end up applying this, the authoring process you need to go through will expose a lot of improvements you can do to your current styles architecture.
