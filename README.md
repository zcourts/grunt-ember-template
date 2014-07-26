grunt-ember-template
====================

A EmberJS app template configured with grunt. Includes bootstrap 3

### Intro

Start by cloning the repo.

Once cloned, cd into the directory and run

Install the NPM and bower dependencies using

'''sh

bower install
npm install

'''

Now you can build the app using

'''sh

#these two commands do the same thing
grunt 
grunt dev
#same as above but also minifies css and js
grunt dist

# while developing you can run
grunt watch
# this will automatically run grunt dev when files have changed. dist will be updated without manaually running grunt
'''

