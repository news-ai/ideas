import urllib2
import re
import string
from bs4 import BeautifulSoup


class NYPostColumnistProfileParser(object):

    def __init__(self, link):
        """ Start up... """
        self.link = link
        self.info = ()
        self.opener = urllib2.build_opener(
            urllib2.HTTPRedirectHandler(),
            urllib2.HTTPHandler(debuglevel=0),
            urllib2.HTTPSHandler(debuglevel=0),
        )
        self.opener.addheaders = [
            ('User-agent', ('Mozilla/4.0 (compatible; MSIE 6.0; '
                            'Windows NT 5.2; .NET CLR 1.1.4322)'))
        ]

        self.info = self.get_info()

    def load_page(self, url):
        response = self.opener.open(url)
        return ''.join(response.readlines())

    def get_info(self):
        # gets all info = current jobs, previous jobs, education
        html = self.load_page(self.link)
        soup = BeautifulSoup(html, 'html.parser')
        htmlcode = soup.prettify(soup.original_encoding)

        twitter_username = ''

        for meta in soup.findAll("meta"):
            metaname = meta.get('name', '').lower()
            metaprop = meta.get('property', '').lower()
            if 'twitter:creator' == metaname.strip() or metaprop.find("twitter:creator") > 0:
                desc = meta['content'].strip()
                twitter_username = desc

        email = soup.find_all(class_='author-email')
        if len(email) > 0:
            email = email[0]['data-author-email']

        return (twitter_username, email)


class NYPostColumnistPageParser(object):

    def __init__(self, link):
        """ Start up... """
        self.link = link
        self.info = {}
        self.opener = urllib2.build_opener(
            urllib2.HTTPRedirectHandler(),
            urllib2.HTTPHandler(debuglevel=0),
            urllib2.HTTPSHandler(debuglevel=0),
        )
        self.opener.addheaders = [
            ('User-agent', ('Mozilla/4.0 (compatible; MSIE 6.0; '
                            'Windows NT 5.2; .NET CLR 1.1.4322)'))
        ]

        self.get_info()

    def load_page(self, url, data=None):
        response = self.opener.open(url)
        return ''.join(response.readlines())

    def get_info(self):
        # gets all info = current jobs, previous jobs, education
        html = self.load_page(self.link)
        soup = BeautifulSoup(html, 'html.parser')
        htmlcode = soup.prettify(soup.original_encoding)
        primary_site = soup.find(id="primary")
        site_content = primary_site.find_all(class_="site-content")

        for columnist in site_content[0].find_all('a'):
            columnist_link = columnist['href']

            if len(columnist_link) > 4:
                details = NYPostColumnistProfileParser(columnist_link)
                print details.info

                columnist_name = columnist.find_all('h3')
                if len(columnist_name) > 0:
                    columnist_name = columnist_name[0].text

                print columnist_name

        return

columnists = "http://nypost.com/columnists/"
parser = NYPostColumnistPageParser(columnists)
