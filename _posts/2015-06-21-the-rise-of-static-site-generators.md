---
layout: post
title: The rise of the static site generators
resume: After several years of dynamic site generators, the second player is asking for a challenge. They are getting more powerful, easier to set and becoming more compelling tools to be the best solution for more web projects.
---

In the recent past years the more trending tools were dynamic site generators with Wordpress being the most popular. Truth is that both static and dynamic offer great solutions for different situations but they both have drawbacks and limitations too.

First of all, let's define what they are exactly and what are the differences between them and the simplest way to do that is to explain what happens when you request a web page to each one.


## Dynamic site

In a server hosting a site driven by a dynamic generator, that page you've just request doesn't exactly exist as it is. When that happens the url gets resolved, content is searched inside a database and a code potentially containing loops for multiple instances of data like categories, posts or comments and condition blocks to render different sections runs and resolves into a file which is retrieved and is what you finally see in the browser.

## Static site

In this case, there's no code running on the server, no logic or processing. The server already contains the page to respond to your request.

But we're talking about static site **generators** here. These means that you still have some of the advantages present in dynamic ones like looping through posts or includes statements for footers and headers to avoid repeating markup and make maintainance easier, the difference is that the engine builds the static site every time the developers changes something inside the project.

Every time you change something in a server, the server itself of you will have to trigger a build process where the files are processed again and static files are generated.

Both need a build process, the difference is the moment when that action is taken.


## Advantages and drawbacks

In favor of the static ones, since the file you as a user are requesting is already generated in the server the response is way more faster than in the dynamic ones where the needs to be generated in that moment.

Now, a caveat from the static ones is that the fact that they can't generate a page dynamically at request makes them less capable of accomplish complex data management, for example comments, something generally missing in these platforms.

Dynamic site generators also offer a control panel for more end users to edit content, add pages, create posts and even change settings related to the site layout while static ones are more aimed at developers because some skills are required to get them working.


## Is there a winner?

Well, there's no right answer to that question. They're both really nice solutions and they both have compromises. It's our job as developers to analyze the project and decide which one is more suitable.

If you need your client to post and edit content then probably a dynamic site will be the best.

Are you doing a simple blog? Then probably a static site generator is a better option, they are usually quicker to set up and you will have more awareness of the code that composes it.

While it's undeniable that Wordpress rules a big part of the web proving that dynamic site generators are not going anywhere, static site generators are part of big projects too like <a href="http://kylerush.net/blog/meet-the-obama-campaigns-250-million-fundraising-platform/" target="_blank">Obama's fundraising campaing</a>.


## Wrap-up

Dynamic site generators are a great option for end users to keep the content changing in their sites, but static ones offer similar features and they allow faster responses from the server if you can deal with their limitations. 

Here's a list of all the static generator around in the community: <a href="https://staticsitegenerators.net/" target="_blank">https://staticsitegenerators.net/</a> in case you want to investigate what your options are inside this category or you can watch <a href="https://www.youtube.com/watch?v=vT7DhK5zbv0" target="_blank">Brian Rinaldi comparing the eight more popular static site generators in JekyllConf</a>.

This site is built in <a href="http://jekyllrb.com/" target="_blank">Jekyll</a>, which is the most popular choice in the static field these days. If you have more questions about this feel free to send me an email or write me on twitter.
