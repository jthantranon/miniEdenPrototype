###
### Created/Written by John "JFTActual" Thantranon & UniConStudios for MetaEden
### Contact: http://www.about.me/JFT
###

import os
from os import listdir
from os.path import isfile, join
import jinja2
import webapp2
import json

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])


class MainPage(webapp2.RequestHandler):
    def get(self):

        css_path = 'css/'
        css_files = [css_path+f for f in listdir(css_path) if isfile(join(css_path, f))]

        js_pre_path = 'js/preload/'
        js_pre_files = [js_pre_path+f for f in listdir(js_pre_path) if isfile(join(js_pre_path, f))]

        js_path = 'js/'
        js_files = [js_path+f for f in listdir(js_path) if isfile(join(js_path, f))]

        js_post_path = 'js/postload/'
        js_post_files = [js_post_path+f for f in listdir(js_post_path) if isfile(join(js_post_path, f))]

        template_values = {
            'cssFiles': json.dumps(css_files),
            'jsPreFiles': json.dumps(js_pre_files),
            'jsFiles': json.dumps(js_files),
            'jsPostFiles': json.dumps(js_post_files),
            'appEngineLoaded': '<span id="appEngineLoaded"></span>',
        }

        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render(template_values))


app = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)

