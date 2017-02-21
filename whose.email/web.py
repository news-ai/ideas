'''
    - https://tools.verifyemailaddress.io/Articles/Ping/How_To_Ping_Email_Address/
'''

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


class GeneralEmailHandler(tornado.web.RequestHandler):

    def post(self):
        data = tornado.escape.json_decode(self.request.body)

        valid_email = ''
        if 'firstName' in data and 'lastName' in data and 'domain' in data:
            data['firstName'] = data['firstName'].lower()
            data['lastName'] = data['lastName'].lower()
            data['domain'] = data['domain'].lower()

            domain_extension = data['domain']
            if '@' not in data['domain']:
                domain_extension = '@' + data['domain']

            valid_email = ''

            emails_to_test = []
            emails_to_test.append(data['firstName'] + domain_extension)
            emails_to_test.append(data['firstName'] + '.' + data['lastName'] + domain_extension)
            emails_to_test.append(data['firstName'][0] + data['lastName'] + domain_extension)
            emails_to_test.append(data['firstName'][0] + data['lastName'][0] + domain_extension)
            emails_to_test.append(data['lastName'] + domain_extension)

            for email in emails_to_test:
                email_valid = check_email(email)
                print email_valid
                if email_valid and email_valid[0]:
                    valid_email = email
                    break

        response = {
            'email': valid_email
        }

        self.write(response)


class Application(tornado.web.Application):

    def __init__(self):
        handlers = [
            (r"/", MainHandler),
            (r"/validate_email", EmailValidatorHandler),
            (r"/generate_email", GeneralEmailHandler),
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
