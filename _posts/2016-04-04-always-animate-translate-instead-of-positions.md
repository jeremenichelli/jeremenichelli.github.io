---
title: Always animate translate instead of&nbsp;positions
resume: While visiting an article in WebKit's blog I noticed how badly an animation in a nested menu performed and decided to fix it.
---

Not only it was slow, you could actually see the browser pushing each pixel of the menu with their list of links so I inspected its styles and this was the output.

```css
/*
 * I deleted the styles that don't matter
 * to this case studdy
 */

.sub-menu-layer {
  opacity: 0;
  position: absolute;
  top: 7rem;
  transition: opacity 0.6s, top 0.6s;
}

.menu-item:hover .sub-menu-layer {
  opacity: 1;
  top: 8rem;
}
```

As you might have noticed that this code is animating from **7rem** to **8rem** the `top` property giving the menu a slide in entrance effect.

This triggers layout and paint unnecessarily while we could use composition properties and improve frames per second numbers making it smoothier visually speaking.

The solution is to take the element to its final position by default, add a negative translate value on the **y axis** and reset it on hover.

```css
.sub-menu-layer {
  opacity: 0;
  position: absolute;
  top: 8rem;
  transform: translateY(-1rem);
  transition: opacity 0.6s, transform 0.6s;
}

.menu-item:hover .sub-menu-layer {
  opacity: 1;
  transform: translateY(0);
}
```

**Done!** This runs smooth now.


## User experience and animation times

Still the transition duration is **600ms** and that is too much. Users expect micro animations like this one to finish in **~350ms** or they will feel they are waiting for it.

If you want to create a nice *but not immediate* animation is better to add a subtle delay to it.

```css
.sub-menu-layer {
  opacity: 0;
  position: absolute;
  top: 8rem;
  transform: translateY(-1rem);
  transition: opacity 0.35s, transform 0.35s;
  transition-delay: .05s;
}

.menu-item:hover .sub-menu-layer {
  opacity: 1;
  transform: translateY(0);
}
```

The transition delay should not exceed the **100ms** neither or users will feel it *unresponsive*.


### Recommended links
- Post by Paul Irish about the benefits of [moving objects using translate][1]
- Google Developers article on [composition layers and animation][2]
- UX question in StackOverflow about [optimal duration on transitions][3]


## Wrap-up

When animating elements think a way to accomplish the desired effect using tranform operations and opacity to avoid unperformant results and show nice animations and transitions to the user.


### Update

**7 APR 2014** &mdash; after reporting this to the WebKit team about this, they quickly fixed and shipped the new improved transitions to their site.


[1]: http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
[2]: https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count?hl=en
[3]: http://ux.stackexchange.com/questions/66604/optimal-duration-for-animating-transitions
