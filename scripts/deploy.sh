yarn release \
&& git init \
&& echo "node_modules" > .gitignore \
&& git add . \
&& git commit -m "Deploy site and assets to gh-pages" \
&& git push --force https://${GH_TOKEN}@github.com/jeremenichelli/jeremenichelli.github.io.git HEAD:gh-pages \
&& echo "Site and assets deployed correctly"
