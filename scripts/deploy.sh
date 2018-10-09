yarn release \
&& echo "node_modules" > .gitignore \
&& git config --global user.email "travis@travis-ci.org"
&& git config --global user.name "Travis CI"
&& git checkout -b gh-pages
&& git add . \
&& git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
&& git remote add origin-pages https://${GH_TOKEN}@github.com/jeremenichelli/jeremenichelli.github.io.git
&& git push --quiet --set-upstream origin-pages gh-pages
