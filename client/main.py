###
### Created/Written by John "JFTActual" Thantranon & UniConStudios for MetaEden
### Contact: http://www.about.me/JFT
###

import os
from os import listdir
from os.path import isfile, join
import jinja2
import webapp2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])

class MainPage(webapp2.RequestHandler): # Landing page for TCBEdit, No real use ATM
    def get(self):
        cssPath = 'css/'
        cssFiles = [cssPath+f for f in listdir(cssPath) if isfile(join(cssPath,f)) ]
        cssLoads = [];
        for file in cssFiles:
            cssLoads.append('<link rel="stylesheet" href="'+file+'" type="text/css" />')

        jsPath = 'js/'
        jsFiles = [jsPath+f for f in listdir(jsPath) if isfile(join(jsPath,f)) ]
        jsLoads = [];
        for file in jsFiles:
            jsLoads.append('<script src="'+file+'"></script>')

        template_values = { 'cssLoads': cssLoads,
                            'jsLoads': jsLoads,
                            }
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render(template_values))


app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)

