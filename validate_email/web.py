#!/usr/bin/env python
import tornado.escape
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
import os.path
from tornado.options import define, options

from validate_email import check_email

define("port", default=8000, help="port to run on", type=int)


class MainHandler(tornado.web.RequestHandler):

    def get(self):
        self.render("index.html")


class EmailValidatorHandler(tornado.web.RequestHandler):

    def post(self):
        data = tornado.escape.json_decode(self.request.body)

        email_valid = (False, '')
        if 'email' in data:
            email_valid = check_email(data['email'])

        response = {
            'valid': email_valid[0],
            'reason': email_valid[1],
        }

        self.write(response)


class Application(tornado.web.Application):

    def __init__(self):
        handlers = [
            (r"/", MainHandler),
            (r"/validate_email", EmailValidatorHandler),
        ]
        settings = dict(
            cookie_secret="6fC8vlxvQWSYHz4GPfktgvTTNRA5TEI+k2hqvkAG2bI=",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            xsrf_cookies=False,
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)


def main():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.autoreload.add_reload_hook(main)
    tornado.autoreload.start()
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
