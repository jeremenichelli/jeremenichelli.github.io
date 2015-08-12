# jeremenichelli.github.io

This is the repository that runs my personal site and blog.

### Build process

Every time a change in styles or scripts happens <a href="https://www.gulpjs.com" target="_blank">Gulp</a> is the one in charge of the heavy tasks. Two different set of LESS files are processed, one containing non-critical rules and other one that is transformed into an HTML include file that is placed in the *&lt;head&gt;* tag, both being previously <a href="https://www.npmjs.com/package/gulp-autoprefixer">autoprefixed</a> and minified. Something similar happens to scripts.

### Styles

This project uses <a href="https://www.lesscss.org" target="_blank">LESS</a> as the preprocessor for styles. The grid system was built using <a href="https://jeremenichelli.github.io/gridbuilder">this little helper</a> and the colors come from the <a href="https://www.google.com/design/spec/style/color.htm" target="_blank">Material Design</a> style guide by Google. The menu on mobile is heavily inspired on the one you can find in <a href="https://www.adtile.me" target="_blank">Adtile</a> website.

### Fonts
The font that rules the whole site is Roboto Condensed by Christian Robertson, interface designer at Google and the one from the logo is Southpaw crafted by <a href="https://www.tylerfinck.com/" target="_blank">Tyler Finck</a>, whose work you should definitely check out by the way, along with Allison Usavage. The social SVG icons are a creation by Sam Collins.

### Scripts

The only dependency until date that this site contains is a reading progress bar implemented in posts, in case you didn't notice it. It is an open source library so feel free to <a href="https://github.com/jeremenichelli/scrollProgress" target="_blank">grab it</a>.

### Writing

All the posts in my blog are written using Markdown.

### Site generator and hosting

As I mentioned above <a href="https://www.jekyllrb.com">Jekyll</a> is the site generator that runs this whole site that is hosted by <a href="https://pages.github.com" target="_blank">GitHub pages</a>. If you're more intereseted in creating a site using Jekyll, I wrote some posts showing how to set up, create layouts and generate posts with it.

### Browser support

This site *should* run perfectly in the lates versions of Chrome, Firefox, Safari, Safari mobile, Chrome for Android, Internet Explorer 9, 10 and 11 and Microsoft Edge.

If you see something that is not working good or that could be improved feel free to <a href="https://github.com/jeremenichelli/jeremenichelli.github.io/issues" target="_blank">report it</a>.
