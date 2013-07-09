# coding=utf-8
import sublime
import sublime_plugin
import os
import sys
import subprocess
import zipfile
import urllib
import urllib2
import json
from fnmatch import fnmatch
import re
import threading
import datetime
import time
import shutil
import tempfile
import httplib
import socket
import hashlib
import base64
import locale
import urlparse
import gzip
import StringIO
import zlib


if os.name == 'nt':
    from ctypes import windll, create_unicode_buffer


def add_to_path(path):
    # Python 2.x on Windows can't properly import from non-ASCII paths, so
    # this code added the DOC 8.3 version of the lib folder to the path in
    # case the user's username includes non-ASCII characters
    if os.name == 'nt':
        buf = create_unicode_buffer(512)
        if windll.kernel32.GetShortPathNameW(path, buf, len(buf)):
            path = buf.value

    if path not in sys.path:
        sys.path.append(path)


lib_folder = os.path.join(sublime.packages_path(), 'Package Control', 'lib')
add_to_path(os.path.join(lib_folder, 'all'))


import semver


if os.name == 'nt':
    add_to_path(os.path.join(lib_folder, 'windows'))
    from ntlm import ntlm


def unicode_from_os(e):
    # This is needed as some exceptions coming from the OS are
    # already encoded and so just calling unicode(e) will result
    # in an UnicodeDecodeError as the string isn't in ascii form.
    try:
        # Sublime Text on OS X does not seem to report the correct encoding
        # so we hard-code that to UTF-8
        encoding = 'UTF-8' if os.name == 'darwin' else locale.getpreferredencoding()
        return unicode(str(e), encoding)

    # If the "correct" encoding did not work, try some defaults, and then just
    # obliterate characters that we can't seen to decode properly
    except UnicodeDecodeError:
        encodings = ['utf-8', 'cp1252']
        for encoding in encodings:
            try:
                return unicode(str(e), encoding, errors='strict')
            except:
                pass
    return unicode(str(e), errors='replace')


def create_cmd(args, basename_binary=False):
    if basename_binary:
        args[0] = os.path.basename(args[0])

    if os.name == 'nt':
        return subprocess.list2cmdline(args)
    else:
        escaped_args = []
        for arg in args:
            if re.search('^[a-zA-Z0-9/_^\\-\\.:=]+$', arg) == None:
                arg = u"'" + arg.replace(u"'", u"'\\''") + u"'"
            escaped_args.append(arg)
        return u' '.join(escaped_args)


# Monkey patch AbstractBasicAuthHandler to prevent infinite recursion
def non_recursive_http_error_auth_reqed(self, authreq, host, req, headers):
    authreq = headers.get(authreq, None)

    if not hasattr(self, 'retried'):
        self.retried = 0

    if self.retried > 5:
        raise urllib2.HTTPError(req.get_full_url(), 401, "basic auth failed",
            headers, None)
    else:
        self.retried += 1

    if authreq:
        mo = urllib2.AbstractBasicAuthHandler.rx.search(authreq)
        if mo:
            scheme, quote, realm = mo.groups()
            if scheme.lower() == 'basic':
                return self.retry_http_basic_auth(host, req, realm)

urllib2.AbstractBasicAuthHandler.http_error_auth_reqed = non_recursive_http_error_auth_reqed


class DebuggableHTTPResponse(httplib.HTTPResponse):
    """
    A custom HTTPResponse that formats debugging info for Sublime Text
    """

    _debug_protocol = 'HTTP'

    def __init__(self, sock, debuglevel=0, strict=0, method=None):
        # We have to use a positive debuglevel to get it passed to here,
        # however we don't want to use it because by default debugging prints
        # to the stdout and we can't capture it, so we use a special -1 value
        if debuglevel == 5:
            debuglevel = -1
        httplib.HTTPResponse.__init__(self, sock, debuglevel, strict, method)

    def begin(self):
        return_value = httplib.HTTPResponse.begin(self)
        if self.debuglevel == -1:
            print '%s: Urllib2 %s Debug Read' % (__name__, self._debug_protocol)
            headers = self.msg.headers
            versions = {
                9: 'HTTP/0.9',
                10: 'HTTP/1.0',
                11: 'HTTP/1.1'
            }
            status_line = versions[self.version] + ' ' + str(self.status) + ' ' + self.reason
            headers.insert(0, status_line)
            for line in headers:
                print u"  %s" % line.rstrip()
        return return_value

    def read(self, *args):
        try:
            return httplib.HTTPResponse.read(self, *args)
        except (httplib.IncompleteRead) as (e):
            return e.partial


class DebuggableHTTPSResponse(DebuggableHTTPResponse):
    """
    A version of DebuggableHTTPResponse that sets the debug protocol to HTTPS
    """

    _debug_protocol = 'HTTPS'


class DebuggableHTTPConnection(httplib.HTTPConnection):
    """
    A custom HTTPConnection that formats debugging info for Sublime Text
    """

    response_class = DebuggableHTTPResponse
    _debug_protocol = 'HTTP'

    def __init__(self, host, port=None, strict=None,
                 timeout=socket._GLOBAL_DEFAULT_TIMEOUT, **kwargs):
        self.passwd = kwargs.get('passwd')

        # Python 2.6.1 on OS X 10.6 does not include these
        self._tunnel_host = None
        self._tunnel_port = None
        self._tunnel_headers = {}

        httplib.HTTPConnection.__init__(self, host, port, strict, timeout)

    def connect(self):
        if self.debuglevel == -1:
            print '%s: Urllib2 %s Debug General' % (__name__, self._debug_protocol)
            print u"  Connecting to %s on port %s" % (self.host, self.port)
        httplib.HTTPConnection.connect(self)

    def send(self, string):
        # We have to use a positive debuglevel to get it passed to the
        # HTTPResponse object, however we don't want to use it because by
        # default debugging prints to the stdout and we can't capture it, so
        # we temporarily set it to -1 for the standard httplib code
        reset_debug = False
        if self.debuglevel == 5:
            reset_debug = 5
            self.debuglevel = -1
        httplib.HTTPConnection.send(self, string)
        if reset_debug or self.debuglevel == -1:
            if len(string.strip()) > 0:
                print '%s: Urllib2 %s Debug Write' % (__name__, self._debug_protocol)
                for line in string.strip().splitlines():
                    print '  ' + line
            if reset_debug:
                self.debuglevel = reset_debug

    def request(self, method, url, body=None, headers={}):
        original_headers = headers.copy()

        # Handles the challenge request response cycle before the real request
        proxy_auth = headers.get('Proxy-Authorization')
        if os.name == 'nt' and proxy_auth and proxy_auth.lstrip()[0:4] == 'NTLM':
            # The default urllib2.AbstractHTTPHandler automatically sets the
            # Connection header to close because of urllib.addinfourl(), but in
            # this case we are going to do some back and forth first for the NTLM
            # proxy auth
            headers['Connection'] = 'Keep-Alive'
            self._send_request(method, url, body, headers)

            response = self.getresponse()

            content_length = int(response.getheader('content-length', 0))
            if content_length:
                response._safe_read(content_length)

            proxy_authenticate = response.getheader('proxy-authenticate', None)
            if not proxy_authenticate:
                raise URLError('Invalid NTLM proxy authentication response')
            ntlm_challenge = re.sub('^\s*NTLM\s+', '', proxy_authenticate)

            if self.host.find(':') != -1:
                host_port = self.host
            else:
                host_port = "%s:%s" % (self.host, self.port)
            username, password = self.passwd.find_user_password(None, host_port)
            domain = ''
            user = username
            if username.find('\\') != -1:
                domain, user = username.split('\\', 1)

            challenge, negotiate_flags = ntlm.parse_NTLM_CHALLENGE_MESSAGE(ntlm_challenge)
            new_proxy_authorization = 'NTLM %s' % ntlm.create_NTLM_AUTHENTICATE_MESSAGE(challenge, user,
                domain, password, negotiate_flags)
            original_headers['Proxy-Authorization'] = new_proxy_authorization
            response.close()

        httplib.HTTPConnection.request(self, method, url, body, original_headers)


class DebuggableHTTPHandler(urllib2.HTTPHandler):
    """
    A custom HTTPHandler that formats debugging info for Sublime Text
    """

    def __init__(self, debuglevel=0, debug=False, **kwargs):
        # This is a special value that will not trigger the standard debug
        # functionality, but custom code where we can format the output
        if debug:
            self._debuglevel = 5
        else:
            self._debuglevel = debuglevel
        self.passwd = kwargs.get('passwd')

    def http_open(self, req):
        def http_class_wrapper(host, **kwargs):
            kwargs['passwd'] = self.passwd
            return DebuggableHTTPConnection(host, **kwargs)

        return self.do_open(http_class_wrapper, req)


class RateLimitException(httplib.HTTPException, urllib2.URLError):
    """
    An exception for when the rate limit of an API has been exceeded.
    """

    def __init__(self, host, limit):
        httplib.HTTPException.__init__(self)
        self.host = host
        self.limit = limit

    def __str__(self):
        return ('Rate limit of %s exceeded for %s' % (self.limit, self.host))


if os.name == 'nt':
    class ProxyNtlmAuthHandler(urllib2.BaseHandler):

        handler_order = 300
        auth_header = 'Proxy-Authorization'

        def __init__(self, password_manager=None):
            if password_manager is None:
                password_manager = HTTPPasswordMgr()
            self.passwd = password_manager
            self.retried = 0

        def http_error_407(self, req, fp, code, msg, headers):
            proxy_authenticate = headers.get('proxy-authenticate')
            if os.name != 'nt' or proxy_authenticate[0:4] != 'NTLM':
                return None

            type1_flags = ntlm.NTLM_TYPE1_FLAGS

            if req.host.find(':') != -1:
                host_port = req.host
            else:
                host_port = "%s:%s" % (req.host, req.port)
            username, password = self.passwd.find_user_password(None, host_port)
            if not username:
                return None

            if username.find('\\') == -1:
                type1_flags &= ~ntlm.NTLM_NegotiateOemDomainSupplied

            negotiate_message = ntlm.create_NTLM_NEGOTIATE_MESSAGE(username, type1_flags)
            auth = 'NTLM %s' % negotiate_message
            if req.headers.get(self.auth_header, None) == auth:
                return None
            req.add_unredirected_header(self.auth_header, auth)
            return self.parent.open(req, timeout=req.timeout)


# The following code is wrapped in a try because the Linux versions of Sublime
# Text do not include the ssl module due to the fact that different distros
# have different versions
try:
    import ssl

    class InvalidCertificateException(httplib.HTTPException, urllib2.URLError):
        """
        An exception for when an SSL certification is not valid for the URL
        it was presented for.
        """

        def __init__(self, host, cert, reason):
            httplib.HTTPException.__init__(self)
            self.host = host
            self.cert = cert
            self.reason = reason

        def __str__(self):
            return ('Host %s returned an invalid certificate (%s) %s\n' %
                (self.host, self.reason, self.cert))


    class ValidatingHTTPSConnection(DebuggableHTTPConnection):
        """
        A custom HTTPConnection class that validates SSL certificates, and
        allows proxy authentication for HTTPS connections.
        """

        default_port = httplib.HTTPS_PORT

        response_class = DebuggableHTTPSResponse
        _debug_protocol = 'HTTPS'

        def __init__(self, host, port=None, key_file=None, cert_file=None,
                ca_certs=None, strict=None, **kwargs):
            passed_args = {}
            if 'timeout' in kwargs:
                passed_args['timeout'] = kwargs['timeout']
            DebuggableHTTPConnection.__init__(self, host, port, strict, **passed_args)

            self.passwd = kwargs.get('passwd')
            self.key_file = key_file
            self.cert_file = cert_file
            self.ca_certs = ca_certs
            if 'user_agent' in kwargs:
                self.user_agent = kwargs['user_agent']
            if self.ca_certs:
                self.cert_reqs = ssl.CERT_REQUIRED
            else:
                self.cert_reqs = ssl.CERT_NONE

        def get_valid_hosts_for_cert(self, cert):
            """
            Returns a list of valid hostnames for an SSL certificate

            :param cert: A dict from SSLSocket.getpeercert()

            :return: An array of hostnames
            """

            if 'subjectAltName' in cert:
                return [x[1] for x in cert['subjectAltName']
                             if x[0].lower() == 'dns']
            else:
                return [x[0][1] for x in cert['subject']
                                if x[0][0].lower() == 'commonname']

        def validate_cert_host(self, cert, hostname):
            """
            Checks if the cert is valid for the hostname

            :param cert: A dict from SSLSocket.getpeercert()

            :param hostname: A string hostname to check

            :return: A boolean if the cert is valid for the hostname
            """

            hosts = self.get_valid_hosts_for_cert(cert)
            for host in hosts:
                host_re = host.replace('.', '\.').replace('*', '[^.]*')
                if re.search('^%s$' % (host_re,), hostname, re.I):
                    return True
            return False

        def _tunnel(self, ntlm_follow_up=False):
            """
            This custom _tunnel method allows us to read and print the debug
            log for the whole response before throwing an error, and adds
            support for proxy authentication
            """

            self._proxy_host = self.host
            self._proxy_port = self.port
            self._set_hostport(self._tunnel_host, self._tunnel_port)

            self._tunnel_headers['Host'] = u"%s:%s" % (self.host, self.port)
            self._tunnel_headers['User-Agent'] = self.user_agent
            self._tunnel_headers['Proxy-Connection'] = 'Keep-Alive'

            request = "CONNECT %s:%d HTTP/1.1\r\n" % (self.host, self.port)
            for header, value in self._tunnel_headers.iteritems():
                request += "%s: %s\r\n" % (header, value)
            self.send(request + "\r\n")

            response = self.response_class(self.sock, strict=self.strict,
                method=self._method)
            (version, code, message) = response._read_status()

            status_line = u"%s %s %s" % (version, code, message.rstrip())
            headers = [status_line]

            if self.debuglevel in [-1, 5]:
                print '%s: Urllib2 %s Debug Read' % (__name__, self._debug_protocol)
                print u"  %s" % status_line

            content_length = 0
            close_connection = False
            while True:
                line = response.fp.readline()
                if line == '\r\n': break

                headers.append(line.rstrip())

                parts = line.rstrip().split(': ', 1)
                name = parts[0].lower()
                value = parts[1].lower().strip()
                if name == 'content-length':
                    content_length = int(value)

                if name in ['connection', 'proxy-connection'] and value == 'close':
                    close_connection = True

                if self.debuglevel in [-1, 5]:
                    print u"  %s" % line.rstrip()

            # Handle proxy auth for SSL connections since regular urllib2 punts on this
            if code == 407 and self.passwd and ('Proxy-Authorization' not in self._tunnel_headers or ntlm_follow_up):
                if content_length:
                    response._safe_read(content_length)

                supported_auth_methods = {}
                for line in headers:
                    parts = line.split(': ', 1)
                    if parts[0].lower() != 'proxy-authenticate':
                        continue
                    details = parts[1].split(' ', 1)
                    supported_auth_methods[details[0].lower()] = details[1] if len(details) > 1 else ''

                username, password = self.passwd.find_user_password(None, "%s:%s" % (
                    self._proxy_host, self._proxy_port))

                do_ntlm_follow_up = False

                if 'digest' in supported_auth_methods:
                    response_value = self.build_digest_response(
                        supported_auth_methods['digest'], username, password)
                    if response_value:
                        self._tunnel_headers['Proxy-Authorization'] = u"Digest %s" % response_value

                elif 'basic' in supported_auth_methods:
                    response_value = u"%s:%s" % (username, password)
                    response_value = base64.b64encode(response_value).strip()
                    self._tunnel_headers['Proxy-Authorization'] = u"Basic %s" % response_value

                elif 'ntlm' in supported_auth_methods and os.name == 'nt':
                    ntlm_challenge = supported_auth_methods['ntlm']
                    if not len(ntlm_challenge):
                        type1_flags = ntlm.NTLM_TYPE1_FLAGS
                        if username.find('\\') == -1:
                            type1_flags &= ~ntlm.NTLM_NegotiateOemDomainSupplied

                        negotiate_message = ntlm.create_NTLM_NEGOTIATE_MESSAGE(username, type1_flags)
                        self._tunnel_headers['Proxy-Authorization'] = 'NTLM %s' % negotiate_message
                        do_ntlm_follow_up = True
                    else:
                        domain = ''
                        user = username
                        if username.find('\\') != -1:
                            domain, user = username.split('\\', 1)

                        challenge, negotiate_flags = ntlm.parse_NTLM_CHALLENGE_MESSAGE(ntlm_challenge)
                        self._tunnel_headers['Proxy-Authorization'] = 'NTLM %s' % ntlm.create_NTLM_AUTHENTICATE_MESSAGE(challenge, user,
                            domain, password, negotiate_flags)

                if 'Proxy-Authorization' in self._tunnel_headers:
                    self.host = self._proxy_host
                    self.port = self._proxy_port

                    # If the proxy wanted the connection closed, we need to make a new connection
                    if close_connection:
                        self.sock.close()
                        self.sock = socket.create_connection((self.host, self.port), self.timeout)

                    return self._tunnel(do_ntlm_follow_up)

            if code != 200:
                self.close()
                raise socket.error("Tunnel connection failed: %d %s" % (code,
                    message.strip()))

        def build_digest_response(self, fields, username, password):
            """
            Takes a Proxy-Authenticate: Digest header and creates a response
            header

            :param fields:
                The string portion of the Proxy-Authenticate header after
                "Digest "

            :param username:
                The username to use for the response

            :param password:
                The password to use for the response

            :return:
                None if invalid Proxy-Authenticate header, otherwise the
                string of fields for the Proxy-Authorization: Digest header
            """

            fields = urllib2.parse_keqv_list(urllib2.parse_http_list(fields))

            realm = fields.get('realm')
            nonce = fields.get('nonce')
            qop = fields.get('qop')
            algorithm = fields.get('algorithm')
            if algorithm:
                algorithm = algorithm.lower()
            opaque = fields.get('opaque')

            if algorithm in ['md5', None]:
                def hash(string):
                    return hashlib.md5(string).hexdigest()
            elif algorithm == 'sha':
                def hash(string):
                    return hashlib.sha1(string).hexdigest()
            else:
                return None

            host_port = u"%s:%s" % (self.host, self.port)

            a1 = "%s:%s:%s" % (username, realm, password)
            a2 = "CONNECT:%s" % host_port
            ha1 = hash(a1)
            ha2 = hash(a2)

            if qop == None:
                response = hash(u"%s:%s:%s" % (ha1, nonce, ha2))
            elif qop == 'auth':
                nc = '00000001'
                cnonce = hash(urllib2.randombytes(8))[:8]
                response = hash(u"%s:%s:%s:%s:%s:%s" % (ha1, nonce, nc, cnonce, qop, ha2))
            else:
                return None

            response_fields = {
                'username': username,
                'realm': realm,
                'nonce': nonce,
                'response': response,
                'uri': host_port
            }
            if algorithm:
                response_fields['algorithm'] = algorithm
            if qop == 'auth':
                response_fields['nc'] = nc
                response_fields['cnonce'] = cnonce
                response_fields['qop'] = qop
            if opaque:
                response_fields['opaque'] = opaque

            return ', '.join([u"%s=\"%s\"" % (field, response_fields[field]) for field in response_fields])

        def connect(self):
            """
            Adds debugging and SSL certification validation
            """

            if self.debuglevel == -1:
                print '%s: Urllib2 HTTPS Debug General' % __name__
                print u"  Connecting to %s on port %s" % (self.host, self.port)

            self.sock = socket.create_connection((self.host, self.port), self.timeout)
            if self._tunnel_host:
                self._tunnel()

            if self.debuglevel == -1:
                print u"%s: Urllib2 HTTPS Debug General" % __name__
                print u"  Connecting to %s on port %s" % (self.host, self.port)
                print u"  CA certs file at %s" % (self.ca_certs)

            self.sock = ssl.wrap_socket(self.sock, keyfile=self.key_file,
                certfile=self.cert_file, cert_reqs=self.cert_reqs,
                ca_certs=self.ca_certs)

            if self.debuglevel == -1:
                print u"  Successfully upgraded connection to %s:%s with SSL" % (
                    self.host, self.port)

            # This debugs and validates the SSL certificate
            if self.cert_reqs & ssl.CERT_REQUIRED:
                cert = self.sock.getpeercert()

                if self.debuglevel == -1:
                    subjectMap = {
                        'organizationName': 'O',
                        'commonName': 'CN',
                        'organizationalUnitName': 'OU',
                        'countryName': 'C',
                        'serialNumber': 'serialNumber',
                        'commonName': 'CN',
                        'localityName': 'L',
                        'stateOrProvinceName': 'S'
                    }
                    subject_list = list(cert['subject'])
                    subject_list.reverse()
                    subject_parts = []
                    for pair in subject_list:
                        if pair[0][0] in subjectMap:
                            field_name = subjectMap[pair[0][0]]
                        else:
                            field_name = pair[0][0]
                        subject_parts.append(field_name + '=' + pair[0][1])

                    print u"  Server SSL certificate:"
                    print u"    subject: " + ','.join(subject_parts)
                    if 'subjectAltName' in cert:
                        print u"    common name: " + cert['subjectAltName'][0][1]
                    if 'notAfter' in cert:
                        print u"    expire date: " + cert['notAfter']

                hostname = self.host.split(':', 0)[0]

                if not self.validate_cert_host(cert, hostname):
                    if self.debuglevel == -1:
                        print u"  Certificate INVALID"

                    raise InvalidCertificateException(hostname, cert,
                        'hostname mismatch')

                if self.debuglevel == -1:
                    print u"  Certificate validated for %s" % hostname

    if hasattr(urllib2, 'HTTPSHandler'):
        class ValidatingHTTPSHandler(urllib2.HTTPSHandler):
            """
            A urllib2 handler that validates SSL certificates for HTTPS requests
            """

            def __init__(self, **kwargs):
                # This is a special value that will not trigger the standard debug
                # functionality, but custom code where we can format the output
                self._debuglevel = 0
                if 'debug' in kwargs and kwargs['debug']:
                    self._debuglevel = 5
                elif 'debuglevel' in kwargs:
                    self._debuglevel = kwargs['debuglevel']
                self._connection_args = kwargs

            def https_open(self, req):
                def http_class_wrapper(host, **kwargs):
                    full_kwargs = dict(self._connection_args)
                    full_kwargs.update(kwargs)
                    return ValidatingHTTPSConnection(host, **full_kwargs)

                try:
                    return self.do_open(http_class_wrapper, req)
                except urllib2.URLError, e:
                    if type(e.reason) == ssl.SSLError and e.reason.args[0] == 1:
                        raise InvalidCertificateException(req.host, '',
                                                          e.reason.args[1])
                    raise

            https_request = urllib2.AbstractHTTPHandler.do_request_

except (ImportError):
    pass


def preferences_filename():
    """:return: The appropriate settings filename based on the version of Sublime Text"""

    if int(sublime.version()) >= 2174:
        return 'Preferences.sublime-settings'
    return 'Global.sublime-settings'


class ThreadProgress():
    """
    Animates an indicator, [=   ], in the status area while a thread runs

    :param thread:
        The thread to track for activity

    :param message:
        The message to display next to the activity indicator

    :param success_message:
        The message to display once the thread is complete
    """

    def __init__(self, thread, message, success_message):
        self.thread = thread
        self.message = message
        self.success_message = success_message
        self.addend = 1
        self.size = 8
        sublime.set_timeout(lambda: self.run(0), 100)

    def run(self, i):
        if not self.thread.is_alive():
            if hasattr(self.thread, 'result') and not self.thread.result:
                sublime.status_message('')
                return
            sublime.status_message(self.success_message)
            return

        before = i % self.size
        after = (self.size - 1) - before

        sublime.status_message('%s [%s=%s]' % \
            (self.message, ' ' * before, ' ' * after))

        if not after:
            self.addend = -1
        if not before:
            self.addend = 1
        i += self.addend

        sublime.set_timeout(lambda: self.run(i), 100)


class PlatformComparator():
    def get_best_platform(self, platforms):
        ids = [sublime.platform() + '-' + sublime.arch(), sublime.platform(),
            '*']

        for id in ids:
            if id in platforms:
                return id

        return None


class ChannelProvider(PlatformComparator):
    """
    Retrieves a channel and provides an API into the information

    The current channel/repository infrastructure caches repository info into
    the channel to improve the Package Control client performance. This also
    has the side effect of lessening the load on the GitHub and BitBucket APIs
    and getting around not-infrequent HTTP 503 errors from those APIs.

    :param channel:
        The URL of the channel

    :param package_manager:
        An instance of :class:`PackageManager` used to download the file
    """

    def __init__(self, channel, package_manager):
        self.channel_info = None
        self.channel = channel
        self.package_manager = package_manager
        self.unavailable_packages = []

    def match_url(self):
        """Indicates if this provider can handle the provided channel"""

        return True

    def fetch_channel(self):
        """Retrieves and loads the JSON for other methods to use"""

        if self.channel_info != None:
            return

        channel_json = self.package_manager.download_url(self.channel,
            'Error downloading channel.')
        if channel_json == False:
            self.channel_info = False
            return

        try:
            channel_info = json.loads(channel_json)
        except (ValueError):
            print '%s: Error parsing JSON from channel %s.' % (__name__,
                self.channel)
            channel_info = False

        self.channel_info = channel_info

    def get_name_map(self):
        """:return: A dict of the mapping for URL slug -> package name"""

        self.fetch_channel()
        if self.channel_info == False:
            return False
        return self.channel_info.get('package_name_map', {})

    def get_renamed_packages(self):
        """:return: A dict of the packages that have been renamed"""

        self.fetch_channel()
        if self.channel_info == False:
            return False
        return self.channel_info.get('renamed_packages', {})

    def get_repositories(self):
        """:return: A list of the repository URLs"""

        self.fetch_channel()
        if self.channel_info == False:
            return False
        return self.channel_info['repositories']

    def get_certs(self):
        """
        Provides a secure way for distribution of SSL CA certificates

        Unfortunately Python does not include a bundle of CA certs with urllib2
        to perform SSL certificate validation. To circumvent this issue,
        Package Control acts as a distributor of the CA certs for all HTTPS
        URLs of package downloads.

        The default channel scrapes and caches info about all packages
        periodically, and in the process it checks the CA certs for all of
        the HTTPS URLs listed in the repositories. The contents of the CA cert
        files are then hashed, and the CA cert is stored in a filename with
        that hash. This is a fingerprint to ensure that Package Control has
        the appropriate CA cert for a domain name.

        Next, the default channel file serves up a JSON object of the domain
        names and the hashes of their current CA cert files. If Package Control
        does not have the appropriate hash for a domain, it may retrieve it
        from the channel server. To ensure that Package Control is talking to
        a trusted authority to get the CA certs from, the CA cert for
        sublime.wbond.net is bundled with Package Control. Then when downloading
        the channel file, Package Control can ensure that the channel file's
        SSL certificate is valid, thus ensuring the resulting CA certs are
        legitimate.

        As a matter of optimization, the distribution of Package Control also
        includes the current CA certs for all known HTTPS domains that are
        included in the channel, as of the time when Package Control was
        last released.

        :return: A dict of {'Domain Name': ['cert_file_hash', 'cert_file_download_url']}
        """

        self.fetch_channel()
        if self.channel_info == False:
            return False
        return self.channel_info.get('certs', {})

    def get_packages(self, repo):
        """
        Provides access to the repository info that is cached in a channel

        :param repo:
            The URL of the repository to get the cached info of

        :return:
            A dict in the format:
            {
                'Package Name': {
                    # Package details - see example-packages.json for format
                },
                ...
            }
            or False if there is an error
        """

        self.fetch_channel()
        if self.channel_info == False:
            return False
        if self.channel_info.get('packages', False) == False:
            return False
        if self.channel_info['packages'].get(repo, False) == False:
            return False

        output = {}
        for package in self.channel_info['packages'][repo]:
            copy = package.copy()

            platforms = copy['platforms'].keys()
            best_platform = self.get_best_platform(platforms)

            if not best_platform:
                self.unavailable_packages.append(copy['name'])
                continue

            copy['downloads'] = copy['platforms'][best_platform]

            del copy['platforms']

            copy['url'] = copy['homepage']
            del copy['homepage']

            output[copy['name']] = copy

        return output

    def get_unavailable_packages(self):
        """
        Provides a list of packages that are unavailable for the current
        platform/architecture that Sublime Text is running on.

        This list will be empty unless get_packages() is called first.

        :return: A list of package names
        """

        return self.unavailable_packages


# The providers (in order) to check when trying to download a channel
_channel_providers = [ChannelProvider]


class PackageProvider(PlatformComparator):
    """
    Generic repository downloader that fetches package info

    With the current channel/repository architecture where the channel file
    caches info from all includes repositories, these package providers just
    serve the purpose of downloading packages not in the default channel.

    The structure of the JSON a repository should contain is located in
    example-packages.json.

    :param repo:
        The URL of the package repository

    :param package_manager:
        An instance of :class:`PackageManager` used to download the file
    """
    def __init__(self, repo, package_manager):
        self.repo_info = None
        self.repo = repo
        self.package_manager = package_manager
        self.unavailable_packages = []

    def match_url(self):
        """Indicates if this provider can handle the provided repo"""

        return True

    def fetch_repo(self):
        """Retrieves and loads the JSON for other methods to use"""

        if self.repo_info != None:
            return

        repository_json = self.package_manager.download_url(self.repo,
            'Error downloading repository.')
        if repository_json == False:
            self.repo_info = False
            return

        try:
            self.repo_info = json.loads(repository_json)
        except (ValueError):
            print '%s: Error parsing JSON from repository %s.' % (__name__,
                self.repo)
            self.repo_info = False

    def get_packages(self):
        """
        Provides access to the repository info that is cached in a channel

        :return:
            A dict in the format:
            {
                'Package Name': {
                    # Package details - see example-packages.json for format
                },
                ...
            }
            or False if there is an error
        """

        self.fetch_repo()
        if self.repo_info == False:
            return False

        output = {}

        for package in self.repo_info['packages']:

            platforms = package['platforms'].keys()
            best_platform = self.get_best_platform(platforms)

            if not best_platform:
                self.unavailable_packages.append(package['name'])
                continue

            # Rewrites the legacy "zipball" URLs to the new "zip" format
            downloads = package['platforms'][best_platform]
            rewritten_downloads = []
            for download in downloads:
                download['url'] = re.sub(
                    '^(https://nodeload.github.com/[^/]+/[^/]+/)zipball(/.*)$',
                    '\\1zip\\2', download['url'])
                rewritten_downloads.append(download)

            info = {
                'name': package['name'],
                'description': package.get('description'),
                'url': package.get('homepage', self.repo),
                'author': package.get('author'),
                'last_modified': package.get('last_modified'),
                'downloads': rewritten_downloads
            }

            output[package['name']] = info

        return output

    def get_renamed_packages(self):
        """:return: A dict of the packages that have been renamed"""

        return self.repo_info.get('renamed_packages', {})

    def get_unavailable_packages(self):
        """
        Provides a list of packages that are unavailable for the current
        platform/architecture that Sublime Text is running on.

        This list will be empty unless get_packages() is called first.

        :return: A list of package names
        """

        return self.unavailable_packages


class NonCachingProvider():
    """
    Base for package providers that do not need to cache the JSON
    """

    def fetch_json(self, url):
        """
        Retrieves and parses the JSON from a URL

        :return: A dict or list from the JSON, or False on error
        """

        repository_json = self.package_manager.download_url(url,
            'Error downloading repository.')
        if repository_json == False:
            return False
        try:
            return json.loads(repository_json)
        except (ValueError):
            print '%s: Error parsing JSON from repository %s.' % (__name__,
                url)
        return False

    def get_unavailable_packages(self):
        """
        Method for compatibility with PackageProvider class. These providers
        are based on API calls, and thus do not support different platform
        downloads, making it impossible for there to be unavailable packages.

        :return: An empty list
        """

        return []


class GitHubPackageProvider(NonCachingProvider):
    """
    Allows using a public GitHub repository as the source for a single package

    :param repo:
        The public web URL to the GitHub repository. Should be in the format
        `https://github.com/user/package` for the master branch, or
        `https://github.com/user/package/tree/{branch_name}` for any other
        branch.

    :param package_manager:
        An instance of :class:`PackageManager` used to access the API
    """

    def __init__(self, repo, package_manager):
        # Clean off the trailing .git to be more forgiving
        self.repo = re.sub('\.git$', '', repo)
        self.package_manager = package_manager

    def match_url(self):
        """Indicates if this provider can handle the provided repo"""

        master = re.search('^https?://github.com/[^/]+/[^/]+/?$', self.repo)
        branch = re.search('^https?://github.com/[^/]+/[^/]+/tree/[^/]+/?$',
            self.repo)
        return master != None or branch != None

    def get_packages(self):
        """Uses the GitHub API to construct necessary info for a package"""

        branch = 'master'
        branch_match = re.search(
            '^https?://github.com/[^/]+/[^/]+/tree/([^/]+)/?$', self.repo)
        if branch_match != None:
            branch = branch_match.group(1)

        api_url = re.sub('^https?://github.com/([^/]+)/([^/]+)($|/.*$)',
            'https://api.github.com/repos/\\1/\\2', self.repo)

        repo_info = self.fetch_json(api_url)
        if repo_info == False:
            return False

        # In addition to hitting the main API endpoint for this repo, we
        # also have to list the commits to get the timestamp of the last
        # commit since we use that to generate a version number
        commit_api_url = api_url + '/commits?' + \
            urllib.urlencode({'sha': branch, 'per_page': 1})

        commit_info = self.fetch_json(commit_api_url)
        if commit_info == False:
            return False

        # We specifically use nodeload.github.com here because the download
        # URLs all redirect there, and some of the downloaders don't follow
        # HTTP redirect headers
        download_url = 'https://nodeload.github.com/' + \
            repo_info['owner']['login'] + '/' + \
            repo_info['name'] + '/zip/' + urllib.quote(branch)

        commit_date = commit_info[0]['commit']['committer']['date']
        timestamp = datetime.datetime.strptime(commit_date[0:19],
            '%Y-%m-%dT%H:%M:%S')
        utc_timestamp = timestamp.strftime(
            '%Y.%m.%d.%H.%M.%S')

        homepage = repo_info['homepage']
        if not homepage:
            homepage = repo_info['html_url']

        package = {
            'name': repo_info['name'],
            'description': repo_info['description'] if \
                repo_info['description'] else 'No description provided',
            'url': homepage,
            'author': repo_info['owner']['login'],
            'last_modified': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'downloads': [
                {
                    'version': utc_timestamp,
                    'url': download_url
                }
            ]
        }
        return {package['name']: package}

    def get_renamed_packages(self):
        """For API-compatibility with :class:`PackageProvider`"""

        return {}


class GitHubUserProvider(NonCachingProvider):
    """
    Allows using a GitHub user/organization as the source for multiple packages

    :param repo:
        The public web URL to the GitHub user/org. Should be in the format
        `https://github.com/user`.

    :param package_manager:
        An instance of :class:`PackageManager` used to access the API
    """

    def __init__(self, repo, package_manager):
        self.repo = repo
        self.package_manager = package_manager

    def match_url(self):
        """Indicates if this provider can handle the provided repo"""

        return re.search('^https?://github.com/[^/]+/?$', self.repo) != None

    def get_packages(self):
        """Uses the GitHub API to construct necessary info for all packages"""

        user_match = re.search('^https?://github.com/([^/]+)/?$', self.repo)
        user = user_match.group(1)

        api_url = 'https://api.github.com/users/%s/repos?per_page=100' % user

        repo_info = self.fetch_json(api_url)
        if repo_info == False:
            return False

        packages = {}
        for package_info in repo_info:
            # All packages for the user are made available, and always from
            # the master branch. Anything else requires a custom packages.json
            commit_api_url = ('https://api.github.com/repos/%s/%s/commits' + \
                '?sha=master&per_page=1') % (user, package_info['name'])

            commit_info = self.fetch_json(commit_api_url)
            if commit_info == False:
                return False

            commit_date = commit_info[0]['commit']['committer']['date']
            timestamp = datetime.datetime.strptime(commit_date[0:19],
                '%Y-%m-%dT%H:%M:%S')
            utc_timestamp = timestamp.strftime(
                '%Y.%m.%d.%H.%M.%S')

            homepage = package_info['homepage']
            if not homepage:
                homepage = package_info['html_url']

            package = {
                'name': package_info['name'],
                'description': package_info['description'] if \
                    package_info['description'] else 'No description provided',
                'url': homepage,
                'author': package_info['owner']['login'],
                'last_modified': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'downloads': [
                    {
                        'version': utc_timestamp,
                        # We specifically use nodeload.github.com here because
                        # the download URLs all redirect there, and some of the
                        # downloaders don't follow HTTP redirect headers
                        'url': 'https://nodeload.github.com/' + \
                            package_info['owner']['login'] + '/' + \
                            package_info['name'] + '/zip/master'
                    }
                ]
            }
            packages[package['name']] = package
        return packages

    def get_renamed_packages(self):
        """For API-compatibility with :class:`PackageProvider`"""

        return {}


class BitBucketPackageProvider(NonCachingProvider):
    """
    Allows using a public BitBucket repository as the source for a single package

    :param repo:
        The public web URL to the BitBucket repository. Should be in the format
        `https://bitbucket.org/user/package`.

    :param package_manager:
        An instance of :class:`PackageManager` used to access the API
    """

    def __init__(self, repo, package_manager):
        self.repo = repo
        self.package_manager = package_manager

    def match_url(self):
        """Indicates if this provider can handle the provided repo"""

        return re.search('^https?://bitbucket.org', self.repo) != None

    def get_packages(self):
        """Uses the BitBucket API to construct necessary info for a package"""

        api_url = re.sub('^https?://bitbucket.org/',
            'https://api.bitbucket.org/1.0/repositories/', self.repo)
        api_url = api_url.rstrip('/')

        repo_info = self.fetch_json(api_url)
        if repo_info == False:
            return False

        # Since HG allows for arbitrary main branch names, we have to hit
        # this URL just to get that info
        main_branch_url = api_url + '/main-branch/'
        main_branch_info = self.fetch_json(main_branch_url)
        if main_branch_info == False:
            return False

        # Grabbing the changesets is necessary because we construct the
        # version number from the last commit timestamp
        changeset_url = api_url + '/changesets/' + main_branch_info['name']
        last_commit = self.fetch_json(changeset_url)
        if last_commit == False:
            return False

        commit_date = last_commit['timestamp']
        timestamp = datetime.datetime.strptime(commit_date[0:19],
            '%Y-%m-%d %H:%M:%S')
        utc_timestamp = timestamp.strftime(
            '%Y.%m.%d.%H.%M.%S')

        homepage = repo_info['website']
        if not homepage:
            homepage = self.repo
        package = {
            'name': repo_info['name'],
            'description': repo_info['description'] if \
                repo_info['description'] else 'No description provided',
            'url': homepage,
            'author': repo_info['owner'],
            'last_modified': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'downloads': [
                {
                    'version': utc_timestamp,
                    'url': self.repo + '/get/' + \
                        last_commit['node'] + '.zip'
                }
            ]
        }
        return {package['name']: package}

    def get_renamed_packages(self):
        """For API-compatibility with :class:`PackageProvider`"""

        return {}


# The providers (in order) to check when trying to download repository info
_package_providers = [BitBucketPackageProvider, GitHubPackageProvider,
    GitHubUserProvider, PackageProvider]


class BinaryNotFoundError(Exception):
    """If a necessary executable is not found in the PATH on the system"""

    pass


class NonCleanExitError(Exception):
    """
    When an subprocess does not exit cleanly

    :param returncode:
        The command line integer return code of the subprocess
    """

    def __init__(self, returncode):
        self.returncode = returncode

    def __str__(self):
        return repr(self.returncode)


class NonHttpError(Exception):
    """If a downloader had a non-clean exit, but it was not due to an HTTP error"""

    pass


class Downloader():
    """
    A base downloader that actually performs downloading URLs

    The SSL module is not included with the bundled Python for Linux
    users of Sublime Text, so Linux machines will fall back to using curl
    or wget for HTTPS URLs.
    """

    def check_certs(self, domain, timeout):
        """
        Ensures that the SSL CA cert for a domain is present on the machine

        :param domain:
            The domain to ensure there is a CA cert for

        :param timeout:
            The int timeout for downloading the CA cert from the channel

        :return:
            The CA cert bundle path on success, or False on error
        """

        cert_match = False

        certs_list = self.settings.get('certs', {})
        certs_dir = os.path.join(sublime.packages_path(), 'Package Control',
            'certs')
        ca_bundle_path = os.path.join(certs_dir, 'ca-bundle.crt')

        cert_info = certs_list.get(domain)
        if cert_info:
            cert_match = self.locate_cert(certs_dir, cert_info[0], cert_info[1])

        wildcard_info = certs_list.get('*')
        if wildcard_info:
            cert_match = self.locate_cert(certs_dir, wildcard_info[0], wildcard_info[1]) or cert_match

        if not cert_match:
            print '%s: No CA certs available for %s.' % (__name__, domain)
            return False

        return ca_bundle_path

    def locate_cert(self, certs_dir, cert_id, location):
        """
        Makes sure the SSL cert specified has been added to the CA cert
        bundle that is present on the machine

        :param certs_dir:
            The path of the folder that contains the cert files

        :param cert_id:
            The identifier for CA cert(s). For those provided by the channel
            system, this will be an md5 of the contents of the cert(s). For
            user-provided certs, this is something they provide.

        :param location:
            An http(s) URL, or absolute filesystem path to the CA cert(s)

        :return:
            If the cert specified (by cert_id) is present on the machine and
            part of the ca-bundle.crt file in the certs_dir
        """

        cert_path = os.path.join(certs_dir, cert_id)
        if not os.path.exists(cert_path):
            if str(location) != '':
                if re.match('^https?://', location):
                    contents = self.download_cert(cert_id, location)
                else:
                    contents = self.load_cert(cert_id, location)
                if contents:
                    self.save_cert(certs_dir, cert_id, contents)
                    return True
            return False
        return True

    def download_cert(self, cert_id, url):
        """
        Downloads CA cert(s) from a URL

        :param cert_id:
            The identifier for CA cert(s). For those provided by the channel
            system, this will be an md5 of the contents of the cert(s). For
            user-provided certs, this is something they provide.

        :param url:
            An http(s) URL to the CA cert(s)

        :return:
            The contents of the CA cert(s)
        """

        cert_downloader = self.__class__(self.settings)
        return cert_downloader.download(url,
            'Error downloading CA certs for %s.' % (domain), timeout, 1)

    def load_cert(self, cert_id, path):
        """
        Copies CA cert(s) from a file path

        :param cert_id:
            The identifier for CA cert(s). For those provided by the channel
            system, this will be an md5 of the contents of the cert(s). For
            user-provided certs, this is something they provide.

        :param path:
            The absolute filesystem path to a file containing the CA cert(s)

        :return:
            The contents of the CA cert(s)
        """

        if os.path.exists(path):
            with open(path, 'rb') as f:
                return f.read()

    def save_cert(self, certs_dir, cert_id, contents):
        """
        Saves CA cert(s) to the certs_dir (and ca-bundle.crt file)

        :param certs_dir:
            The path of the folder that contains the cert files

        :param cert_id:
            The identifier for CA cert(s). For those provided by the channel
            system, this will be an md5 of the contents of the cert(s). For
            user-provided certs, this is something they provide.

        :param contents:
            The contents of the CA cert(s)
        """

        ca_bundle_path = os.path.join(certs_dir, 'ca-bundle.crt')
        cert_path = os.path.join(certs_dir, cert_id)
        with open(cert_path, 'wb') as f:
            f.write(contents)
        with open(ca_bundle_path, 'ab') as f:
            f.write("\n" + contents)

    def decode_response(self, encoding, response):
        if encoding == 'gzip':
            return gzip.GzipFile(fileobj=StringIO.StringIO(response)).read()
        elif encoding == 'deflate':
            decompresser = zlib.decompressobj(-zlib.MAX_WBITS)
            return decompresser.decompress(response) + decompresser.flush()
        return response


class CliDownloader(Downloader):
    """
    Base for downloaders that use a command line program

    :param settings:
        A dict of the various Package Control settings. The Sublime Text
        Settings API is not used because this code is run in a thread.
    """

    def __init__(self, settings):
        self.settings = settings

    def clean_tmp_file(self):
        if os.path.exists(self.tmp_file):
            os.remove(self.tmp_file)

    def find_binary(self, name):
        """
        Finds the given executable name in the system PATH

        :param name:
            The exact name of the executable to find

        :return:
            The absolute path to the executable

        :raises:
            BinaryNotFoundError when the executable can not be found
        """

        for dir in os.environ['PATH'].split(os.pathsep):
            path = os.path.join(dir, name)
            if os.path.exists(path):
                return path

        raise BinaryNotFoundError('The binary %s could not be located' % name)

    def execute(self, args):
        """
        Runs the executable and args and returns the result

        :param args:
            A list of the executable path and all arguments to be passed to it

        :return:
            The text output of the executable

        :raises:
            NonCleanExitError when the executable exits with an error
        """

        if self.settings.get('debug'):
            print u"%s: Trying to execute command %s" % (
                __name__, create_cmd(args))

        proc = subprocess.Popen(args, stdin=subprocess.PIPE,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        output = proc.stdout.read()
        self.stderr = proc.stderr.read()
        returncode = proc.wait()
        if returncode != 0:
            error = NonCleanExitError(returncode)
            error.stderr = self.stderr
            error.stdout = output
            raise error
        return output


class UrlLib2Downloader(Downloader):
    """
    A downloader that uses the Python urllib2 module

    :param settings:
        A dict of the various Package Control settings. The Sublime Text
        Settings API is not used because this code is run in a thread.
    """

    def __init__(self, settings):
        self.settings = settings

    def download(self, url, error_message, timeout, tries):
        """
        Downloads a URL and returns the contents

        Uses the proxy settings from the Package Control.sublime-settings file,
        however there seem to be a decent number of proxies that this code
        does not work with. Patches welcome!

        :param url:
            The URL to download

        :param error_message:
            A string to include in the console error that is printed
            when an error occurs

        :param timeout:
            The int number of seconds to set the timeout to

        :param tries:
            The int number of times to try and download the URL in the case of
            a timeout or HTTP 503 error

        :return:
            The string contents of the URL, or False on error
        """

        http_proxy = self.settings.get('http_proxy')
        https_proxy = self.settings.get('https_proxy')
        if http_proxy or https_proxy:
            proxies = {}
            if http_proxy:
                proxies['http'] = http_proxy
            if https_proxy:
                proxies['https'] = https_proxy
            proxy_handler = urllib2.ProxyHandler(proxies)
        else:
            proxy_handler = urllib2.ProxyHandler()

        password_manager = urllib2.HTTPPasswordMgrWithDefaultRealm()
        proxy_username = self.settings.get('proxy_username')
        proxy_password = self.settings.get('proxy_password')
        if proxy_username and proxy_password:
            if http_proxy:
                password_manager.add_password(None, http_proxy, proxy_username,
                    proxy_password)
            if https_proxy:
                password_manager.add_password(None, https_proxy, proxy_username,
                    proxy_password)

        handlers = [proxy_handler]
        if os.name == 'nt':
            ntlm_auth_handler = ProxyNtlmAuthHandler(password_manager)
            handlers.append(ntlm_auth_handler)

        basic_auth_handler = urllib2.ProxyBasicAuthHandler(password_manager)
        digest_auth_handler = urllib2.ProxyDigestAuthHandler(password_manager)
        handlers.extend([digest_auth_handler, basic_auth_handler])

        debug = self.settings.get('debug')

        if debug:
            print u"%s: Urllib2 Debug Proxy" % __name__
            print u"  http_proxy: %s" % http_proxy
            print u"  https_proxy: %s" % https_proxy
            print u"  proxy_username: %s" % proxy_username
            print u"  proxy_password: %s" % proxy_password

        secure_url_match = re.match('^https://([^/]+)', url)
        if secure_url_match != None:
            secure_domain = secure_url_match.group(1)
            bundle_path = self.check_certs(secure_domain, timeout)
            if not bundle_path:
                return False
            bundle_path = bundle_path.encode(sys.getfilesystemencoding())
            handlers.append(ValidatingHTTPSHandler(ca_certs=bundle_path,
                debug=debug, passwd=password_manager,
                user_agent=self.settings.get('user_agent')))
        else:
            handlers.append(DebuggableHTTPHandler(debug=debug,
                passwd=password_manager))
        urllib2.install_opener(urllib2.build_opener(*handlers))

        while tries > 0:
            tries -= 1
            try:
                request = urllib2.Request(url, headers={
                    "User-Agent": self.settings.get('user_agent'),
                    # Don't be alarmed if the response from the server does not
                    # select one of these since the server runs a relatively new
                    # version of OpenSSL which supports compression on the SSL
                    # layer, and Apache will use that instead of HTTP-level
                    # encoding.
                    "Accept-Encoding": "gzip,deflate"})
                http_file = urllib2.urlopen(request, timeout=timeout)
                self.handle_rate_limit(http_file, url)
                result = http_file.read()
                encoding = http_file.headers.get('Content-Encoding')
                return self.decode_response(encoding, result)

            except (httplib.HTTPException) as (e):
                print '%s: %s HTTP exception %s (%s) downloading %s.' % (
                    __name__, error_message, e.__class__.__name__,
                    unicode_from_os(e), url)

            except (urllib2.HTTPError) as (e):
                # Make sure we obey Github's rate limiting headers
                self.handle_rate_limit(e, url)

                # Bitbucket and Github return 503 a decent amount
                if unicode_from_os(e.code) == '503':
                    print ('%s: Downloading %s was rate limited, ' +
                        'trying again') % (__name__, url)
                    continue
                print '%s: %s HTTP error %s downloading %s.' % (__name__,
                    error_message, unicode_from_os(e.code), url)

            except (urllib2.URLError) as (e):

                # Bitbucket and Github timeout a decent amount
                if unicode_from_os(e.reason) == 'The read operation timed out' \
                        or unicode_from_os(e.reason) == 'timed out':
                    print (u'%s: Downloading %s timed out, trying ' +
                        u'again') % (__name__, url)
                    continue
                print u'%s: %s URL error %s downloading %s.' % (__name__,
                    error_message, unicode_from_os(e.reason), url)
            break
        return False

    def handle_rate_limit(self, response, url):
        """
        Checks the headers of a respone object to make sure we are obeying the
        rate limit

        :param response:
            The response object that has a headers dict

        :param url:
            The URL that was requested

        :raises:
            RateLimitException when the rate limit has been hit
        """

        limit_remaining = response.headers.get('X-RateLimit-Remaining', 1)
        if str(limit_remaining) == '0':
            hostname = urlparse.urlparse(url).hostname
            limit = response.headers.get('X-RateLimit-Limit', 1)
            raise RateLimitException(hostname, limit)


class WgetDownloader(CliDownloader):
    """
    A downloader that uses the command line program wget

    :param settings:
        A dict of the various Package Control settings. The Sublime Text
        Settings API is not used because this code is run in a thread.
    """

    def __init__(self, settings):
        self.settings = settings
        self.debug = settings.get('debug')
        self.wget = self.find_binary('wget')

    def download(self, url, error_message, timeout, tries):
        """
        Downloads a URL and returns the contents

        :param url:
            The URL to download

        :param error_message:
            A string to include in the console error that is printed
            when an error occurs

        :param timeout:
            The int number of seconds to set the timeout to

        :param tries:
            The int number of times to try and download the URL in the case of
            a timeout or HTTP 503 error

        :return:
            The string contents of the URL, or False on error
        """

        if not self.wget:
            return False

        self.tmp_file = tempfile.NamedTemporaryFile().name
        command = [self.wget, '--connect-timeout=' + str(int(timeout)), '-o',
            self.tmp_file, '-O', '-', '-U',
            self.settings.get('user_agent'), '--header',
            # Don't be alarmed if the response from the server does not select
            # one of these since the server runs a relatively new version of
            # OpenSSL which supports compression on the SSL layer, and Apache
            # will use that instead of HTTP-level encoding.
            'Accept-Encoding: gzip,deflate']

        secure_url_match = re.match('^https://([^/]+)', url)
        if secure_url_match != None:
            secure_domain = secure_url_match.group(1)
            bundle_path = self.check_certs(secure_domain, timeout)
            if not bundle_path:
                return False
            command.append(u'--ca-certificate=' + bundle_path)

        if self.debug:
            command.append('-d')
        else:
            command.append('-S')

        http_proxy = self.settings.get('http_proxy')
        https_proxy = self.settings.get('https_proxy')
        proxy_username = self.settings.get('proxy_username')
        proxy_password = self.settings.get('proxy_password')

        if proxy_username:
            command.append(u"--proxy-user=%s" % proxy_username)
        if proxy_password:
            command.append(u"--proxy-password=%s" % proxy_password)

        if self.debug:
            print u"%s: Wget Debug Proxy" % __name__
            print u"  http_proxy: %s" % http_proxy
            print u"  https_proxy: %s" % https_proxy
            print u"  proxy_username: %s" % proxy_username
            print u"  proxy_password: %s" % proxy_password

        command.append(url)

        if http_proxy:
            os.putenv('http_proxy', http_proxy)
        if https_proxy:
            os.putenv('https_proxy', https_proxy)

        while tries > 0:
            tries -= 1
            try:
                result = self.execute(command)

                general, headers = self.parse_output()
                encoding = headers.get('content-encoding')
                if encoding:
                    result = self.decode_response(encoding, result)

                return result

            except (NonCleanExitError) as (e):

                try:
                    general, headers = self.parse_output()
                    self.handle_rate_limit(headers, url)

                    if general['status'] == '503':
                        # GitHub and BitBucket seem to rate limit via 503
                        print ('%s: Downloading %s was rate limited' +
                            ', trying again') % (__name__, url)
                        continue

                    error_string = 'HTTP error %s %s' % (general['status'],
                        general['message'])

                except (NonHttpError) as (e):

                    error_string = unicode_from_os(e)

                    # GitHub and BitBucket seem to time out a lot
                    if error_string.find('timed out') != -1:
                        print ('%s: Downloading %s timed out, ' +
                            'trying again') % (__name__, url)
                        continue

                print (u'%s: %s %s downloading %s.' % (__name__, error_message,
                    error_string, url)).encode('UTF-8')

            break
        return False

    def parse_output(self):
        with open(self.tmp_file, 'r') as f:
            output = f.read().splitlines()
        self.clean_tmp_file()

        error = None
        header_lines = []
        if self.debug:
            section = 'General'
            last_section = None
            for line in output:
                if section == 'General':
                    if self.skippable_line(line):
                        continue

                # Skip blank lines
                if line.strip() == '':
                    continue

                # Error lines
                if line[0:5] == 'wget:':
                    error = line[5:].strip()
                if line[0:7] == 'failed:':
                    error = line[7:].strip()

                if line == '---request begin---':
                    section = 'Write'
                    continue
                elif line == '---request end---':
                    section = 'General'
                    continue
                elif line == '---response begin---':
                    section = 'Read'
                    continue
                elif line == '---response end---':
                    section = 'General'
                    continue

                if section != last_section:
                    print "%s: Wget HTTP Debug %s" % (__name__, section)

                if section == 'Read':
                    header_lines.append(line)

                print '  ' + line
                last_section = section

        else:
            for line in output:
                if self.skippable_line(line):
                    continue

                # Check the resolving and connecting to lines for errors
                if re.match('(Resolving |Connecting to )', line):
                    failed_match = re.search(' failed: (.*)$', line)
                    if failed_match:
                        error = failed_match.group(1).strip()

                # Error lines
                if line[0:5] == 'wget:':
                    error = line[5:].strip()
                if line[0:7] == 'failed:':
                    error = line[7:].strip()

                if line[0:2] == '  ':
                    header_lines.append(line.lstrip())

        if error:
            raise NonHttpError(error)

        return self.parse_headers(header_lines)

    def skippable_line(self, line):
        # Skip date lines
        if re.match('--\d{4}-\d{2}-\d{2}', line):
            return True
        if re.match('\d{4}-\d{2}-\d{2}', line):
            return True
        # Skip HTTP status code lines since we already have that info
        if re.match('\d{3} ', line):
            return True
        # Skip Saving to and progress lines
        if re.match('(Saving to:|\s*\d+K)', line):
            return True
        # Skip notice about ignoring body on HTTP error
        if re.match('Skipping \d+ byte', line):
            return True

    def parse_headers(self, output=None):
        if not output:
            with open(self.tmp_file, 'r') as f:
                output = f.read().splitlines()
            self.clean_tmp_file()

        general = {
            'version': '0.9',
            'status':  '200',
            'message': 'OK'
        }
        headers = {}
        for line in output:
            # When using the -S option, headers have two spaces before them,
            # additionally, valid headers won't have spaces, so this is always
            # a safe operation to perform
            line = line.lstrip()
            if line.find('HTTP/') == 0:
                match = re.match('HTTP/(\d\.\d)\s+(\d+)\s+(.*)$', line)
                general['version'] = match.group(1)
                general['status']  = match.group(2)
                general['message'] = match.group(3)
            else:
                name, value = line.split(':', 1)
                headers[name.lower()] = value.strip()

        return (general, headers)

    def handle_rate_limit(self, headers, url):
        limit_remaining = headers.get('x-ratelimit-remaining', '1')
        limit = headers.get('x-ratelimit-limit', '1')

        if str(limit_remaining) == '0':
            hostname = urlparse.urlparse(url).hostname
            raise RateLimitException(hostname, limit)


class CurlDownloader(CliDownloader):
    """
    A downloader that uses the command line program curl

    :param settings:
        A dict of the various Package Control settings. The Sublime Text
        Settings API is not used because this code is run in a thread.
    """

    def __init__(self, settings):
        self.settings = settings
        self.curl = self.find_binary('curl')

    def download(self, url, error_message, timeout, tries):
        """
        Downloads a URL and returns the contents

        :param url:
            The URL to download

        :param error_message:
            A string to include in the console error that is printed
            when an error occurs

        :param timeout:
            The int number of seconds to set the timeout to

        :param tries:
            The int number of times to try and download the URL in the case of
            a timeout or HTTP 503 error

        :return:
            The string contents of the URL, or False on error
        """

        if not self.curl:
            return False

        self.tmp_file = tempfile.NamedTemporaryFile().name
        command = [self.curl, '--user-agent', self.settings.get('user_agent'),
            '--connect-timeout', str(int(timeout)), '-sSL',
            # Don't be alarmed if the response from the server does not select
            # one of these since the server runs a relatively new version of
            # OpenSSL which supports compression on the SSL layer, and Apache
            # will use that instead of HTTP-level encoding.
            '--compressed',
            # We have to capture the headers to check for rate limit info
            '--dump-header', self.tmp_file]

        secure_url_match = re.match('^https://([^/]+)', url)
        if secure_url_match != None:
            secure_domain = secure_url_match.group(1)
            bundle_path = self.check_certs(secure_domain, timeout)
            if not bundle_path:
                return False
            command.extend(['--cacert', bundle_path])

        debug = self.settings.get('debug')
        if debug:
            command.append('-v')

        http_proxy = self.settings.get('http_proxy')
        https_proxy = self.settings.get('https_proxy')
        proxy_username = self.settings.get('proxy_username')
        proxy_password = self.settings.get('proxy_password')

        if debug:
            print u"%s: Curl Debug Proxy" % __name__
            print u"  http_proxy: %s" % http_proxy
            print u"  https_proxy: %s" % https_proxy
            print u"  proxy_username: %s" % proxy_username
            print u"  proxy_password: %s" % proxy_password

        if http_proxy or https_proxy:
            command.append('--proxy-anyauth')

        if proxy_username or proxy_password:
            command.extend(['-U', u"%s:%s" % (proxy_username, proxy_password)])

        if http_proxy:
            os.putenv('http_proxy', http_proxy)
        if https_proxy:
            os.putenv('HTTPS_PROXY', https_proxy)

        command.append(url)

        while tries > 0:
            tries -= 1
            try:
                output = self.execute(command)

                with open(self.tmp_file, 'r') as f:
                    headers = f.read()
                self.clean_tmp_file()

                limit = 1
                limit_remaining = 1
                status = '200 OK'
                for header in headers.splitlines():
                    if header[0:5] == 'HTTP/':
                        status = re.sub('^HTTP/\d\.\d\s+', '', header)
                    if header.lower()[0:22] == 'x-ratelimit-remaining:':
                        limit_remaining = header.lower()[22:].strip()
                    if header.lower()[0:18] == 'x-ratelimit-limit:':
                        limit = header.lower()[18:].strip()

                if debug:
                    self.print_debug(self.stderr)

                if str(limit_remaining) == '0':
                    hostname = urlparse.urlparse(url).hostname
                    raise RateLimitException(hostname, limit)

                if status != '200 OK':
                    e = NonCleanExitError(22)
                    e.stderr = status
                    raise e

                return output

            except (NonCleanExitError) as (e):
                # Stderr is used for both the error message and the debug info
                # so we need to process it to extra the debug info
                if self.settings.get('debug'):
                    e.stderr = self.print_debug(e.stderr)

                self.clean_tmp_file()

                if e.returncode == 22:
                    code = re.sub('^.*?(\d+)([\w\s]+)?$', '\\1', e.stderr)
                    if code == '503':
                        # GitHub and BitBucket seem to rate limit via 503
                        print ('%s: Downloading %s was rate limited' +
                            ', trying again') % (__name__, url)
                        continue
                    error_string = 'HTTP error ' + code
                elif e.returncode == 6:
                    error_string = 'URL error host not found'
                elif e.returncode == 28:
                    # GitHub and BitBucket seem to time out a lot
                    print ('%s: Downloading %s timed out, trying ' +
                        'again') % (__name__, url)
                    continue
                else:
                    error_string = e.stderr.rstrip()

                print '%s: %s %s downloading %s.' % (__name__, error_message,
                    error_string, url)
            break

        return False

    def print_debug(self, string):
        section = 'General'
        last_section = None

        output = ''

        for line in string.splitlines():
            # Placeholder for body of request
            if line and line[0:2] == '{ ':
                continue

            if len(line) > 1:
                subtract = 0
                if line[0:2] == '* ':
                    section = 'General'
                    subtract = 2
                elif line[0:2] == '> ':
                    section = 'Write'
                    subtract = 2
                elif line[0:2] == '< ':
                    section = 'Read'
                    subtract = 2
                line = line[subtract:]

                # If the line does not start with "* ", "< ", "> " or "  "
                # then it is a real stderr message
                if subtract == 0 and line[0:2] != '  ':
                    output += line
                    continue

            if line.strip() == '':
                continue

            if section != last_section:
                print "%s: Curl HTTP Debug %s" % (__name__, section)

            print '  ' + line
            last_section = section

        return output


# A cache of channel and repository info to allow users to install multiple
# packages without having to wait for the metadata to be downloaded more
# than once. The keys are managed locally by the utilizing code.
_channel_repository_cache = {}


class RepositoryDownloader(threading.Thread):
    """
    Downloads information about a repository in the background

    :param package_manager:
        An instance of :class:`PackageManager` used to download files

    :param name_map:
        The dict of name mapping for URL slug -> package name

    :param repo:
        The URL of the repository to download info about
    """

    def __init__(self, package_manager, name_map, repo):
        self.package_manager = package_manager
        self.repo = repo
        self.packages = {}
        self.name_map = name_map
        threading.Thread.__init__(self)

    def run(self):
        for provider_class in _package_providers:
            provider = provider_class(self.repo, self.package_manager)
            if provider.match_url():
                break
        packages = provider.get_packages()
        if packages == False:
            self.packages = False
            return

        mapped_packages = {}
        for package in packages.keys():
            mapped_package = self.name_map.get(package, package)
            mapped_packages[mapped_package] = packages[package]
            mapped_packages[mapped_package]['name'] = mapped_package
        packages = mapped_packages

        self.packages = packages
        self.renamed_packages = provider.get_renamed_packages()
        self.unavailable_packages = provider.get_unavailable_packages()


class VcsUpgrader():
    """
    Base class for updating packages that are a version control repository on local disk

    :param vcs_binary:
        The full filesystem path to the executable for the version control
        system. May be set to None to allow the code to try and find it.

    :param update_command:
        The command to pass to the version control executable to update the
        repository.

    :param working_copy:
        The local path to the working copy/package directory

    :param cache_length:
        The lenth of time to cache if incoming changesets are available
    """

    def __init__(self, vcs_binary, update_command, working_copy, cache_length, debug):
        self.binary = vcs_binary
        self.update_command = update_command
        self.working_copy = working_copy
        self.cache_length = cache_length
        self.debug = debug

    def execute(self, args, dir):
        """
        Creates a subprocess with the executable/args

        :param args:
            A list of the executable path and all arguments to it

        :param dir:
            The directory in which to run the executable

        :return: A string of the executable output
        """

        startupinfo = None
        if os.name == 'nt':
            startupinfo = subprocess.STARTUPINFO()
            startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW

        if self.debug:
            print u"%s: Trying to execute command %s" % (
                __name__, create_cmd(args))
        proc = subprocess.Popen(args, stdin=subprocess.PIPE,
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
            startupinfo=startupinfo, cwd=dir)

        return proc.stdout.read().replace('\r\n', '\n').rstrip(' \n\r')

    def find_binary(self, name):
        """
        Locates the executable by looking in the PATH and well-known directories

        :param name:
            The string filename of the executable

        :return: The filesystem path to the executable, or None if not found
        """

        if self.binary:
            if self.debug:
                print u"%s: Using \"%s_binary\" from settings \"%s\"" % (
                    __name__, self.vcs_type, self.binary)
            return self.binary

        # Try the path first
        for dir in os.environ['PATH'].split(os.pathsep):
            path = os.path.join(dir, name)
            if os.path.exists(path):
                if self.debug:
                    print u"%s: Found %s at \"%s\"" % (__name__, self.vcs_type,
                        path)
                return path

        # This is left in for backwards compatibility and for windows
        # users who may have the binary, albeit in a common dir that may
        # not be part of the PATH
        if os.name == 'nt':
            dirs = ['C:\\Program Files\\Git\\bin',
                'C:\\Program Files (x86)\\Git\\bin',
                'C:\\Program Files\\TortoiseGit\\bin',
                'C:\\Program Files\\Mercurial',
                'C:\\Program Files (x86)\\Mercurial',
                'C:\\Program Files (x86)\\TortoiseHg',
                'C:\\Program Files\\TortoiseHg',
                'C:\\cygwin\\bin']
        else:
            dirs = ['/usr/local/git/bin']

        for dir in dirs:
            path = os.path.join(dir, name)
            if os.path.exists(path):
                if self.debug:
                    print u"%s: Found %s at \"%s\"" % (__name__, self.vcs_type,
                        path)
                return path

        if self.debug:
            print u"%s: Could not find %s on your machine" % (__name__,
                self.vcs_type)
        return None


class GitUpgrader(VcsUpgrader):
    """
    Allows upgrading a local git-repository-based package
    """

    vcs_type = 'git'

    def retrieve_binary(self):
        """
        Returns the path to the git executable

        :return: The string path to the executable or False on error
        """

        name = 'git'
        if os.name == 'nt':
            name += '.exe'
        binary = self.find_binary(name)
        if binary and os.path.isdir(binary):
            full_path = os.path.join(binary, name)
            if os.path.exists(full_path):
                binary = full_path
        if not binary:
            sublime.error_message(('%s: Unable to find %s. ' +
                'Please set the git_binary setting by accessing the ' +
                'Preferences > Package Settings > %s > ' +
                u'Settings – User menu entry. The Settings – Default entry ' +
                'can be used for reference, but changes to that will be ' +
                'overwritten upon next upgrade.') % (__name__, name, __name__))
            return False

        if os.name == 'nt':
            tortoise_plink = self.find_binary('TortoisePlink.exe')
            if tortoise_plink:
                os.environ.setdefault('GIT_SSH', tortoise_plink)
        return binary

    def run(self):
        """
        Updates the repository with remote changes

        :return: False or error, or True on success
        """

        binary = self.retrieve_binary()
        if not binary:
            return False
        args = [binary]
        args.extend(self.update_command)
        self.execute(args, self.working_copy)
        return True

    def incoming(self):
        """:return: bool if remote revisions are available"""

        cache_key = self.working_copy + '.incoming'
        working_copy_cache = _channel_repository_cache.get(cache_key)
        if working_copy_cache and working_copy_cache.get('time') > \
                time.time():
            return working_copy_cache.get('data')

        binary = self.retrieve_binary()
        if not binary:
            return False
        self.execute([binary, 'fetch'], self.working_copy)
        args = [binary, 'log']
        args.append('..' + '/'.join(self.update_command[-2:]))
        output = self.execute(args, self.working_copy)
        incoming = len(output) > 0

        _channel_repository_cache[cache_key] = {
            'time': time.time() + self.cache_length,
            'data': incoming
        }
        return incoming


class HgUpgrader(VcsUpgrader):
    """
    Allows upgrading a local mercurial-repository-based package
    """

    vcs_type = 'hg'

    def retrieve_binary(self):
        """
        Returns the path to the hg executable

        :return: The string path to the executable or False on error
        """

        name = 'hg'
        if os.name == 'nt':
            name += '.exe'
        binary = self.find_binary(name)
        if binary and os.path.isdir(binary):
            full_path = os.path.join(binary, name)
            if os.path.exists(full_path):
                binary = full_path
        if not binary:
            sublime.error_message(('%s: Unable to find %s. ' +
                'Please set the hg_binary setting by accessing the ' +
                'Preferences > Package Settings > %s > ' +
                u'Settings – User menu entry. The Settings – Default entry ' +
                'can be used for reference, but changes to that will be ' +
                'overwritten upon next upgrade.') % (__name__, name, __name__))
            return False
        return binary

    def run(self):
        """
        Updates the repository with remote changes

        :return: False or error, or True on success
        """

        binary = self.retrieve_binary()
        if not binary:
            return False
        args = [binary]
        args.extend(self.update_command)
        self.execute(args, self.working_copy)
        return True

    def incoming(self):
        """:return: bool if remote revisions are available"""

        cache_key = self.working_copy + '.incoming'
        working_copy_cache = _channel_repository_cache.get(cache_key)
        if working_copy_cache and working_copy_cache.get('time') > \
                time.time():
            return working_copy_cache.get('data')

        binary = self.retrieve_binary()
        if not binary:
            return False
        args = [binary, 'in', '-q']
        args.append(self.update_command[-1])
        output = self.execute(args, self.working_copy)
        incoming = len(output) > 0

        _channel_repository_cache[cache_key] = {
            'time': time.time() + self.cache_length,
            'data': incoming
        }
        return incoming


def clear_directory(directory, ignore_paths=None):
    was_exception = False
    for root, dirs, files in os.walk(directory, topdown=False):
        paths = [os.path.join(root, f) for f in files]
        paths.extend([os.path.join(root, d) for d in dirs])

        for path in paths:
            try:
                # Don't delete the metadata file, that way we have it
                # when the reinstall happens, and the appropriate
                # usage info can be sent back to the server
                if ignore_paths and path in ignore_paths:
                    continue
                if os.path.isdir(path):
                    os.rmdir(path)
                else:
                    os.remove(path)
            except (OSError, IOError) as (e):
                was_exception = True

    return not was_exception



class PackageManager():
    """
    Allows downloading, creating, installing, upgrading, and deleting packages

    Delegates metadata retrieval to the _channel_providers and
    _package_providers classes. Uses VcsUpgrader-based classes for handling
    git and hg repositories in the Packages folder. Downloader classes are
    utilized to fetch contents of URLs.

    Also handles displaying package messaging, and sending usage information to
    the usage server.
    """

    def __init__(self):
        # Here we manually copy the settings since sublime doesn't like
        # code accessing settings from threads
        self.settings = {}
        settings = sublime.load_settings(__name__ + '.sublime-settings')
        for setting in ['timeout', 'repositories', 'repository_channels',
                'package_name_map', 'dirs_to_ignore', 'files_to_ignore',
                'package_destination', 'cache_length', 'auto_upgrade',
                'files_to_ignore_binary', 'files_to_keep', 'dirs_to_keep',
                'git_binary', 'git_update_command', 'hg_binary',
                'hg_update_command', 'http_proxy', 'https_proxy',
                'auto_upgrade_ignore', 'auto_upgrade_frequency',
                'submit_usage', 'submit_url', 'renamed_packages',
                'files_to_include', 'files_to_include_binary', 'certs',
                'ignore_vcs_packages', 'proxy_username', 'proxy_password',
                'debug', 'user_agent']:
            if settings.get(setting) == None:
                continue
            self.settings[setting] = settings.get(setting)

        # https_proxy will inherit from http_proxy unless it is set to a
        # string value or false
        no_https_proxy = self.settings.get('https_proxy') in ["", None]
        if no_https_proxy and self.settings.get('http_proxy'):
            self.settings['https_proxy'] = self.settings.get('http_proxy')
        if self.settings['https_proxy'] == False:
            self.settings['https_proxy'] = ''

        self.settings['platform'] = sublime.platform()
        self.settings['version'] = sublime.version()

    def compare_versions(self, version1, version2):
        """
        Compares to version strings to see which is greater

        Date-based version numbers (used by GitHub and BitBucket providers)
        are automatically pre-pended with a 0 so they are always less than
        version 1.0.

        :return:
            -1  if version1 is less than version2
             0  if they are equal
             1  if version1 is greater than version2
        """

        def date_compat(v):
            # We prepend 0 to all date-based version numbers so that developers
            # may switch to explicit versioning from GitHub/BitBucket
            # versioning based on commit dates
            date_match = re.match('(\d{4})\.(\d{2})\.(\d{2})\.(\d{2})\.(\d{2})\.(\d{2})$', v)
            if date_match:
                v = '0.%s.%s.%s.%s.%s.%s' % date_match.groups()
            return v

        def semver_compat(v):
            # When translating dates into semver, the way to get each date
            # segment into the version is to treat the year and month as
            # minor and patch, and then the rest as a numeric build version
            # with four different parts. The result looks like:
            # 0.2012.11+10.31.23.59
            date_match = re.match('(\d{4}(?:\.\d{2}){2})\.(\d{2}(?:\.\d{2}){3})$', v)
            if date_match:
                v = '%s+%s' % (date_match.group(1), date_match.group(2))

            # Semver must have major, minor, patch
            elif re.match('^\d+$', v):
                v += '.0.0'
            elif re.match('^\d+\.\d+$', v):
                v += '.0'
            return v

        def cmp_compat(v):
            return [int(x) for x in re.sub(r'(\.0+)*$', '', v).split(".")]

        version1 = date_compat(version1)
        version2 = date_compat(version2)
        try:
            return semver.compare(semver_compat(version1), semver_compat(version2))
        except (ValueError):
            return cmp(cmp_compat(version1), cmp_compat(version2))

    def download_url(self, url, error_message):
        """
        Downloads a URL and returns the contents

        :param url:
            The string URL to download

        :param error_message:
            The error message to include if the download fails

        :return:
            The string contents of the URL, or False on error
        """

        has_ssl = 'ssl' in sys.modules and hasattr(urllib2, 'HTTPSHandler')
        is_ssl = re.search('^https://', url) != None
        downloader = None

        if (is_ssl and has_ssl) or not is_ssl:
            downloader = UrlLib2Downloader(self.settings)
        else:
            for downloader_class in [CurlDownloader, WgetDownloader]:
                try:
                    downloader = downloader_class(self.settings)
                    break
                except (BinaryNotFoundError):
                    pass

        if not downloader:
            sublime.error_message(('%s: Unable to download %s due to no ' +
                'ssl module available and no capable program found. Please ' +
                'install curl or wget.') % (__name__, url))
            return False

        url = url.replace(' ', '%20')
        hostname = urlparse.urlparse(url).hostname.lower()
        timeout = self.settings.get('timeout', 3)

        rate_limited_cache = _channel_repository_cache.get('rate_limited_domains', {})
        if rate_limited_cache.get('time') and rate_limited_cache.get('time') > time.time():
            rate_limited_domains = rate_limited_cache.get('data', [])
        else:
            rate_limited_domains = []

        if self.settings.get('debug'):
            try:
                ip = socket.gethostbyname(hostname)
            except (socket.gaierror) as (e):
                ip = unicode_from_os(e)

            print u"%s: Download Debug" % __name__
            print u"  URL: %s" % url
            print u"  Resolved IP: %s" % ip
            print u"  Timeout: %s" % str(timeout)

        if hostname in rate_limited_domains:
            if self.settings.get('debug'):
                print u"  Skipping due to hitting rate limit for %s" % hostname
            return False

        try:
            return downloader.download(url, error_message, timeout, 3)
        except (RateLimitException) as (e):

            rate_limited_domains.append(hostname)
            _channel_repository_cache['rate_limited_domains'] = {
                'data': rate_limited_domains,
                'time': time.time() + self.settings.get('cache_length',
                    300)
                }

            print ('%s: Hit rate limit of %s for %s, skipping all futher ' +
                'download requests for this domain') % (__name__,
                e.limit, e.host)
        return False

    def get_metadata(self, package):
        """
        Returns the package metadata for an installed package

        :return:
            A dict with the keys:
                version
                url
                description
            or an empty dict on error
        """

        metadata_filename = os.path.join(self.get_package_dir(package),
            'package-metadata.json')
        if os.path.exists(metadata_filename):
            with open(metadata_filename) as f:
                try:
                    return json.load(f)
                except (ValueError):
                    return {}
        return {}

    def list_repositories(self):
        """
        Returns a master list of all repositories pulled from all sources

        These repositories come from the channels specified in the
        "repository_channels" setting, plus any repositories listed in the
        "repositories" setting.

        :return:
            A list of all available repositories
        """

        repositories = self.settings.get('repositories')
        repository_channels = self.settings.get('repository_channels')
        for channel in repository_channels:
            channel = channel.strip()

            channel_repositories = None

            # Caches various info from channels for performance
            cache_key = channel + '.repositories'
            repositories_cache = _channel_repository_cache.get(cache_key)
            if repositories_cache and repositories_cache.get('time') > \
                    time.time():
                channel_repositories = repositories_cache.get('data')

            name_map_cache_key = channel + '.package_name_map'
            name_map_cache = _channel_repository_cache.get(
                name_map_cache_key)
            if name_map_cache and name_map_cache.get('time') > \
                    time.time():
                name_map = name_map_cache.get('data')
                name_map.update(self.settings.get('package_name_map', {}))
                self.settings['package_name_map'] = name_map

            renamed_cache_key = channel + '.renamed_packages'
            renamed_cache = _channel_repository_cache.get(
                renamed_cache_key)
            if renamed_cache and renamed_cache.get('time') > \
                    time.time():
                renamed_packages = renamed_cache.get('data')
                renamed_packages.update(self.settings.get('renamed_packages',
                    {}))
                self.settings['renamed_packages'] = renamed_packages

            unavailable_cache_key = channel + '.unavailable_packages'
            unavailable_cache = _channel_repository_cache.get(
                unavailable_cache_key)
            if unavailable_cache and unavailable_cache.get('time') > \
                    time.time():
                unavailable_packages = unavailable_cache.get('data')
                unavailable_packages.extend(self.settings.get('unavailable_packages',
                    []))
                self.settings['unavailable_packages'] = unavailable_packages

            certs_cache_key = channel + '.certs'
            certs_cache = _channel_repository_cache.get(certs_cache_key)
            if certs_cache and certs_cache.get('time') > time.time():
                certs = self.settings.get('certs', {})
                certs.update(certs_cache.get('data'))
                self.settings['certs'] = certs

            # If any of the info was not retrieved from the cache, we need to
            # grab the channel to get it
            if channel_repositories == None or \
                    self.settings.get('package_name_map') == None or \
                    self.settings.get('renamed_packages') == None:

                for provider_class in _channel_providers:
                    provider = provider_class(channel, self)
                    if provider.match_url():
                        break

                channel_repositories = provider.get_repositories()

                if channel_repositories == False:
                    continue
                _channel_repository_cache[cache_key] = {
                    'time': time.time() + self.settings.get('cache_length',
                        300),
                    'data': channel_repositories
                }

                for repo in channel_repositories:
                    if provider.get_packages(repo) == False:
                        continue
                    packages_cache_key = repo + '.packages'
                    _channel_repository_cache[packages_cache_key] = {
                        'time': time.time() + self.settings.get('cache_length',
                            300),
                        'data': provider.get_packages(repo)
                    }

                # Have the local name map override the one from the channel
                name_map = provider.get_name_map()
                name_map.update(self.settings.get('package_name_map', {}))
                self.settings['package_name_map'] = name_map
                _channel_repository_cache[name_map_cache_key] = {
                    'time': time.time() + self.settings.get('cache_length',
                        300),
                    'data': name_map
                }

                renamed_packages = provider.get_renamed_packages()
                _channel_repository_cache[renamed_cache_key] = {
                    'time': time.time() + self.settings.get('cache_length',
                        300),
                    'data': renamed_packages
                }
                if renamed_packages:
                    self.settings['renamed_packages'] = self.settings.get(
                        'renamed_packages', {})
                    self.settings['renamed_packages'].update(renamed_packages)

                unavailable_packages = provider.get_unavailable_packages()
                _channel_repository_cache[unavailable_cache_key] = {
                    'time': time.time() + self.settings.get('cache_length',
                        300),
                    'data': unavailable_packages
                }
                if unavailable_packages:
                    self.settings['unavailable_packages'] = self.settings.get(
                        'unavailable_packages', [])
                    self.settings['unavailable_packages'].extend(unavailable_packages)

                certs = provider.get_certs()
                _channel_repository_cache[certs_cache_key] = {
                    'time': time.time() + self.settings.get('cache_length',
                        300),
                    'data': certs
                }
                if certs:
                    self.settings['certs'] = self.settings.get('certs', {})
                    self.settings['certs'].update(certs)

            repositories.extend(channel_repositories)
        return [repo.strip() for repo in repositories]

    def list_available_packages(self):
        """
        Returns a master list of every available package from all sources

        :return:
            A dict in the format:
            {
                'Package Name': {
                    # Package details - see example-packages.json for format
                },
                ...
            }
        """

        repositories = self.list_repositories()
        packages = {}
        downloaders = []
        grouped_downloaders = {}

        # Repositories are run in reverse order so that the ones first
        # on the list will overwrite those last on the list
        for repo in repositories[::-1]:
            repository_packages = None

            cache_key = repo + '.packages'
            packages_cache = _channel_repository_cache.get(cache_key)
            if packages_cache and packages_cache.get('time') > \
                    time.time():
                repository_packages = packages_cache.get('data')
                packages.update(repository_packages)

            if repository_packages == None:
                downloader = RepositoryDownloader(self,
                    self.settings.get('package_name_map', {}), repo)
                domain = re.sub('^https?://[^/]*?(\w+\.\w+)($|/.*$)', '\\1',
                    repo)

                # downloaders are grouped by domain so that multiple can
                # be run in parallel without running into API access limits
                if not grouped_downloaders.get(domain):
                    grouped_downloaders[domain] = []
                grouped_downloaders[domain].append(downloader)

        # Allows creating a separate named function for each downloader
        # delay. Not having this contained in a function causes all of the
        # schedules to reference the same downloader.start()
        def schedule(downloader, delay):
            downloader.has_started = False

            def inner():
                downloader.start()
                downloader.has_started = True
            sublime.set_timeout(inner, delay)

        # Grabs every repo grouped by domain and delays the start
        # of each download from that domain by a fixed amount
        for domain_downloaders in grouped_downloaders.values():
            for i in range(len(domain_downloaders)):
                downloader = domain_downloaders[i]
                downloaders.append(downloader)
                schedule(downloader, i * 150)

        complete = []

        # Wait for all of the downloaders to finish
        while downloaders:
            downloader = downloaders.pop()
            if downloader.has_started:
                downloader.join()
                complete.append(downloader)
            else:
                downloaders.insert(0, downloader)

        # Grabs the results and stuff if all in the cache
        for downloader in complete:
            repository_packages = downloader.packages
            if repository_packages == False:
                continue
            cache_key = downloader.repo + '.packages'
            _channel_repository_cache[cache_key] = {
                'time': time.time() + self.settings.get('cache_length', 300),
                'data': repository_packages
            }
            packages.update(repository_packages)

            renamed_packages = downloader.renamed_packages
            if renamed_packages == False:
                continue
            renamed_cache_key = downloader.repo + '.renamed_packages'
            _channel_repository_cache[renamed_cache_key] = {
                'time': time.time() + self.settings.get('cache_length', 300),
                'data': renamed_packages
            }
            if renamed_packages:
                self.settings['renamed_packages'] = self.settings.get(
                    'renamed_packages', {})
                self.settings['renamed_packages'].update(renamed_packages)

            unavailable_packages = downloader.unavailable_packages
            unavailable_cache_key = downloader.repo + '.unavailable_packages'
            _channel_repository_cache[unavailable_cache_key] = {
                'time': time.time() + self.settings.get('cache_length', 300),
                'data': unavailable_packages
            }
            if unavailable_packages:
                self.settings['unavailable_packages'] = self.settings.get(
                    'unavailable_packages', [])
                self.settings['unavailable_packages'].extend(unavailable_packages)

        return packages

    def list_packages(self):
        """ :return: A list of all installed, non-default, package names"""

        package_names = os.listdir(sublime.packages_path())
        package_names = [path for path in package_names if
            os.path.isdir(os.path.join(sublime.packages_path(), path))]

        # Ignore things to be deleted
        ignored = []
        for package in package_names:
            cleanup_file = os.path.join(sublime.packages_path(), package,
                'package-control.cleanup')
            if os.path.exists(cleanup_file):
                ignored.append(package)

        packages = list(set(package_names) - set(ignored) -
            set(self.list_default_packages()))
        packages = sorted(packages, key=lambda s: s.lower())

        return packages

    def list_all_packages(self):
        """ :return: A list of all installed package names, including default packages"""

        packages = os.listdir(sublime.packages_path())
        packages = sorted(packages, key=lambda s: s.lower())
        return packages

    def list_default_packages(self):
        """ :return: A list of all default package names"""

        files = os.listdir(os.path.join(os.path.dirname(
            sublime.packages_path()), 'Pristine Packages'))
        files = list(set(files) - set(os.listdir(
            sublime.installed_packages_path())))
        packages = [file.replace('.sublime-package', '') for file in files]
        packages = sorted(packages, key=lambda s: s.lower())
        return packages

    def get_package_dir(self, package):
        """:return: The full filesystem path to the package directory"""

        return os.path.join(sublime.packages_path(), package)

    def get_mapped_name(self, package):
        """:return: The name of the package after passing through mapping rules"""

        return self.settings.get('package_name_map', {}).get(package, package)

    def create_package(self, package_name, package_destination,
            binary_package=False):
        """
        Creates a .sublime-package file from the running Packages directory

        :param package_name:
            The package to create a .sublime-package file for

        :param package_destination:
            The full filesystem path of the directory to save the new
            .sublime-package file in.

        :param binary_package:
            If the created package should follow the binary package include/
            exclude patterns from the settings. These normally include a setup
            to exclude .py files and include .pyc files, but that can be
            changed via settings.

        :return: bool if the package file was successfully created
        """

        package_dir = self.get_package_dir(package_name) + '/'

        if not os.path.exists(package_dir):
            sublime.error_message(('%s: The folder for the package name ' +
                'specified, %s, does not exist in %s') %
                (__name__, package_name, sublime.packages_path()))
            return False

        package_filename = package_name + '.sublime-package'
        package_path = os.path.join(package_destination,
            package_filename)

        if not os.path.exists(sublime.installed_packages_path()):
            os.mkdir(sublime.installed_packages_path())

        if os.path.exists(package_path):
            os.remove(package_path)

        try:
            package_file = zipfile.ZipFile(package_path, "w",
                compression=zipfile.ZIP_DEFLATED)
        except (OSError, IOError) as (exception):
            sublime.error_message(('%s: An error occurred creating the ' +
                'package file %s in %s. %s') % (__name__, package_filename,
                package_destination, unicode_from_os(exception)))
            return False

        dirs_to_ignore = self.settings.get('dirs_to_ignore', [])
        if not binary_package:
            files_to_ignore = self.settings.get('files_to_ignore', [])
            files_to_include = self.settings.get('files_to_include', [])
        else:
            files_to_ignore = self.settings.get('files_to_ignore_binary', [])
            files_to_include = self.settings.get('files_to_include_binary', [])

        package_dir_regex = re.compile('^' + re.escape(package_dir))
        for root, dirs, files in os.walk(package_dir):
            [dirs.remove(dir) for dir in dirs if dir in dirs_to_ignore]
            paths = dirs
            paths.extend(files)
            for path in paths:
                full_path = os.path.join(root, path)
                relative_path = re.sub(package_dir_regex, '', full_path)

                ignore_matches = [fnmatch(relative_path, p) for p in files_to_ignore]
                include_matches = [fnmatch(relative_path, p) for p in files_to_include]
                if any(ignore_matches) and not any(include_matches):
                    continue

                if os.path.isdir(full_path):
                    continue
                package_file.write(full_path, relative_path)

        package_file.close()

        return True

    def install_package(self, package_name):
        """
        Downloads and installs (or upgrades) a package

        Uses the self.list_available_packages() method to determine where to
        retrieve the package file from.

        The install process consists of:

        1. Finding the package
        2. Downloading the .sublime-package/.zip file
        3. Extracting the package file
        4. Showing install/upgrade messaging
        5. Submitting usage info
        6. Recording that the package is installed

        :param package_name:
            The package to download and install

        :return: bool if the package was successfully installed
        """

        packages = self.list_available_packages()

        if package_name in self.settings.get('unavailable_packages', []):
            print ('%s: The package "%s" is not available ' +
                   'on this platform.') % (__name__, package_name)
            return False

        if package_name not in packages.keys():
            sublime.error_message(('%s: The package specified, %s, is ' +
                'not available.') % (__name__, package_name))
            return False

        download = packages[package_name]['downloads'][0]
        url = download['url']

        package_filename = package_name + \
            '.sublime-package'
        package_path = os.path.join(sublime.installed_packages_path(),
            package_filename)
        pristine_package_path = os.path.join(os.path.dirname(
            sublime.packages_path()), 'Pristine Packages', package_filename)

        package_dir = self.get_package_dir(package_name)

        package_metadata_file = os.path.join(package_dir,
            'package-metadata.json')

        if os.path.exists(os.path.join(package_dir, '.git')):
            if self.settings.get('ignore_vcs_packages'):
                sublime.error_message(('%s: Skipping git package %s since ' +
                    'the setting ignore_vcs_packages is set to true') %
                    (__name__, package_name))
                return False
            return GitUpgrader(self.settings['git_binary'],
                self.settings['git_update_command'], package_dir,
                self.settings['cache_length'], self.settings['debug']).run()
        elif os.path.exists(os.path.join(package_dir, '.hg')):
            if self.settings.get('ignore_vcs_packages'):
                sublime.error_message(('%s: Skipping hg package %s since ' +
                    'the setting ignore_vcs_packages is set to true') %
                    (__name__, package_name))
                return False
            return HgUpgrader(self.settings['hg_binary'],
                self.settings['hg_update_command'], package_dir,
                self.settings['cache_length'], self.settings['debug']).run()

        is_upgrade = os.path.exists(package_metadata_file)
        old_version = None
        if is_upgrade:
            old_version = self.get_metadata(package_name).get('version')

        package_bytes = self.download_url(url, 'Error downloading package.')
        if package_bytes == False:
            return False
        with open(package_path, "wb") as package_file:
            package_file.write(package_bytes)

        if not os.path.exists(package_dir):
            os.mkdir(package_dir)

        # We create a backup copy incase something was edited
        else:
            try:
                backup_dir = os.path.join(os.path.dirname(
                    sublime.packages_path()), 'Backup',
                    datetime.datetime.now().strftime('%Y%m%d%H%M%S'))
                if not os.path.exists(backup_dir):
                    os.makedirs(backup_dir)
                package_backup_dir = os.path.join(backup_dir, package_name)
                shutil.copytree(package_dir, package_backup_dir)
            except (OSError, IOError) as (exception):
                sublime.error_message(('%s: An error occurred while trying ' +
                    'to backup the package directory for %s. %s') %
                    (__name__, package_name, unicode_from_os(exception)))
                shutil.rmtree(package_backup_dir)
                return False

        try:
            package_zip = zipfile.ZipFile(package_path, 'r')
        except (zipfile.BadZipfile):
            sublime.error_message(('%s: An error occurred while ' +
                'trying to unzip the package file for %s. Please try ' +
                'installing the package again.') % (__name__, package_name))
            return False

        root_level_paths = []
        last_path = None
        for path in package_zip.namelist():
            last_path = path
            if path.find('/') in [len(path) - 1, -1]:
                root_level_paths.append(path)
            if path[0] == '/' or path.find('../') != -1 or path.find('..\\') != -1:
                sublime.error_message(('%s: The package specified, %s, ' +
                    'contains files outside of the package dir and cannot ' +
                    'be safely installed.') % (__name__, package_name))
                return False

        if last_path and len(root_level_paths) == 0:
            root_level_paths.append(last_path[0:last_path.find('/') + 1])

        os.chdir(package_dir)

        overwrite_failed = False

        # Here we don’t use .extractall() since it was having issues on OS X
        skip_root_dir = len(root_level_paths) == 1 and \
            root_level_paths[0].endswith('/')
        extracted_paths = []
        for path in package_zip.namelist():
            dest = path
            try:
                if not isinstance(dest, unicode):
                    dest = unicode(dest, 'utf-8', 'strict')
            except (UnicodeDecodeError):
                dest = unicode(dest, 'cp1252', 'replace')

            if os.name == 'nt':
                regex = ':|\*|\?|"|<|>|\|'
                if re.search(regex, dest) != None:
                    print ('%s: Skipping file from package named %s due to ' +
                        'an invalid filename') % (__name__, path)
                    continue

            # If there was only a single directory in the package, we remove
            # that folder name from the paths as we extract entries
            if skip_root_dir:
                dest = dest[len(root_level_paths[0]):]

            if os.name == 'nt':
                dest = dest.replace('/', '\\')
            else:
                dest = dest.replace('\\', '/')

            dest = os.path.join(package_dir, dest)

            def add_extracted_dirs(dir):
                while dir not in extracted_paths:
                    extracted_paths.append(dir)
                    dir = os.path.dirname(dir)
                    if dir == package_dir:
                        break

            if path.endswith('/'):
                if not os.path.exists(dest):
                    os.makedirs(dest)
                add_extracted_dirs(dest)
            else:
                dest_dir = os.path.dirname(dest)
                if not os.path.exists(dest_dir):
                    os.makedirs(dest_dir)
                add_extracted_dirs(dest_dir)
                extracted_paths.append(dest)
                try:
                    open(dest, 'wb').write(package_zip.read(path))
                except (IOError) as (e):
                    message = unicode_from_os(e)
                    if re.search('[Ee]rrno 13', message):
                        overwrite_failed = True
                        break
                    print ('%s: Skipping file from package named %s due to ' +
                        'an invalid filename') % (__name__, path)

                except (UnicodeDecodeError):
                    print ('%s: Skipping file from package named %s due to ' +
                        'an invalid filename') % (__name__, path)
        package_zip.close()


        # If upgrading failed, queue the package to upgrade upon next start
        if overwrite_failed:
            reinstall_file = os.path.join(package_dir, 'package-control.reinstall')
            open(reinstall_file, 'w').close()

            # Don't delete the metadata file, that way we have it
            # when the reinstall happens, and the appropriate
            # usage info can be sent back to the server
            clear_directory(package_dir, [reinstall_file, package_metadata_file])

            sublime.error_message(('%s: An error occurred while trying to ' +
                'upgrade %s. Please restart Sublime Text to finish the ' +
                'upgrade.') % (__name__, package_name))
            return False


        # Here we clean out any files that were not just overwritten. It is ok
        # if there is an error removing a file. The next time there is an
        # upgrade, it should be cleaned out successfully then.
        clear_directory(package_dir, extracted_paths)


        self.print_messages(package_name, package_dir, is_upgrade, old_version)

        with open(package_metadata_file, 'w') as f:
            metadata = {
                "version": packages[package_name]['downloads'][0]['version'],
                "url": packages[package_name]['url'],
                "description": packages[package_name]['description']
            }
            json.dump(metadata, f)

        # Submit install and upgrade info
        if is_upgrade:
            params = {
                'package': package_name,
                'operation': 'upgrade',
                'version': packages[package_name]['downloads'][0]['version'],
                'old_version': old_version
            }
        else:
            params = {
                'package': package_name,
                'operation': 'install',
                'version': packages[package_name]['downloads'][0]['version']
            }
        self.record_usage(params)

        # Record the install in the settings file so that you can move
        # settings across computers and have the same packages installed
        def save_package():
            settings = sublime.load_settings(__name__ + '.sublime-settings')
            installed_packages = settings.get('installed_packages', [])
            if not installed_packages:
                installed_packages = []
            installed_packages.append(package_name)
            installed_packages = list(set(installed_packages))
            installed_packages = sorted(installed_packages,
                key=lambda s: s.lower())
            settings.set('installed_packages', installed_packages)
            sublime.save_settings(__name__ + '.sublime-settings')
        sublime.set_timeout(save_package, 1)

        # Here we delete the package file from the installed packages directory
        # since we don't want to accidentally overwrite user changes
        os.remove(package_path)
        # We have to remove the pristine package too or else Sublime Text 2
        # will silently delete the package
        if os.path.exists(pristine_package_path):
            os.remove(pristine_package_path)

        os.chdir(sublime.packages_path())
        return True

    def print_messages(self, package, package_dir, is_upgrade, old_version):
        """
        Prints out package install and upgrade messages

        The functionality provided by this allows package maintainers to
        show messages to the user when a package is installed, or when
        certain version upgrade occur.

        :param package:
            The name of the package the message is for

        :param package_dir:
            The full filesystem path to the package directory

        :param is_upgrade:
            If the install was actually an upgrade

        :param old_version:
            The string version of the package before the upgrade occurred
        """

        messages_file = os.path.join(package_dir, 'messages.json')
        if not os.path.exists(messages_file):
            return

        messages_fp = open(messages_file, 'r')
        try:
            message_info = json.load(messages_fp)
        except (ValueError):
            print '%s: Error parsing messages.json for %s' % (__name__, package)
            return
        messages_fp.close()

        output = ''
        if not is_upgrade and message_info.get('install'):
            install_messages = os.path.join(package_dir,
                message_info.get('install'))
            message = '\n\n%s:\n%s\n\n  ' % (package,
                        ('-' * len(package)))
            with open(install_messages, 'r') as f:
                message += unicode(f.read(), 'utf-8', errors='replace').replace('\n', '\n  ')
            output += message + '\n'

        elif is_upgrade and old_version:
            upgrade_messages = list(set(message_info.keys()) -
                set(['install']))
            upgrade_messages = sorted(upgrade_messages,
                cmp=self.compare_versions, reverse=True)
            for version in upgrade_messages:
                if self.compare_versions(old_version, version) >= 0:
                    break
                if not output:
                    message = '\n\n%s:\n%s\n' % (package,
                        ('-' * len(package)))
                    output += message
                upgrade_messages = os.path.join(package_dir,
                    message_info.get(version))
                message = '\n  '
                with open(upgrade_messages, 'r') as f:
                    message += unicode(f.read(), 'utf-8', errors='replace').replace('\n', '\n  ')
                output += message + '\n'

        if not output:
            return

        def print_to_panel():
            window = sublime.active_window()

            views = window.views()
            view = None
            for _view in views:
                if _view.name() == 'Package Control Messages':
                    view = _view
                    break

            if not view:
                view = window.new_file()
                view.set_name('Package Control Messages')
                view.set_scratch(True)

            def write(string):
                edit = view.begin_edit()
                view.insert(edit, view.size(), string)
                view.end_edit(edit)

            if not view.size():
                view.settings().set("word_wrap", True)
                write('Package Control Messages\n' +
                    '========================')

            write(output)
        sublime.set_timeout(print_to_panel, 1)

    def remove_package(self, package_name):
        """
        Deletes a package

        The deletion process consists of:

        1. Deleting the directory (or marking it for deletion if deletion fails)
        2. Submitting usage info
        3. Removing the package from the list of installed packages

        :param package_name:
            The package to delete

        :return: bool if the package was successfully deleted
        """

        installed_packages = self.list_packages()

        if package_name not in installed_packages:
            sublime.error_message(('%s: The package specified, %s, is not ' +
                'installed.') % (__name__, package_name))
            return False

        os.chdir(sublime.packages_path())

        # Give Sublime Text some time to ignore the package
        time.sleep(1)

        package_filename = package_name + '.sublime-package'
        package_path = os.path.join(sublime.installed_packages_path(),
            package_filename)
        installed_package_path = os.path.join(os.path.dirname(
            sublime.packages_path()), 'Installed Packages', package_filename)
        pristine_package_path = os.path.join(os.path.dirname(
            sublime.packages_path()), 'Pristine Packages', package_filename)
        package_dir = self.get_package_dir(package_name)

        version = self.get_metadata(package_name).get('version')

        try:
            if os.path.exists(package_path):
                os.remove(package_path)
        except (OSError, IOError) as (exception):
            sublime.error_message(('%s: An error occurred while trying to ' +
                'remove the package file for %s. %s') % (__name__,
                package_name, unicode_from_os(exception)))
            return False

        try:
            if os.path.exists(installed_package_path):
                os.remove(installed_package_path)
        except (OSError, IOError) as (exception):
            sublime.error_message(('%s: An error occurred while trying to ' +
                'remove the installed package file for %s. %s') % (__name__,
                package_name, unicode_from_os(exception)))
            return False

        try:
            if os.path.exists(pristine_package_path):
                os.remove(pristine_package_path)
        except (OSError, IOError) as (exception):
            sublime.error_message(('%s: An error occurred while trying to ' +
                'remove the pristine package file for %s. %s') % (__name__,
                package_name, unicode_from_os(exception)))
            return False

        # We don't delete the actual package dir immediately due to a bug
        # in sublime_plugin.py
        can_delete_dir = True
        if not clear_directory(package_dir):
            # If there is an error deleting now, we will mark it for
            # cleanup the next time Sublime Text starts
            open(os.path.join(package_dir, 'package-control.cleanup'),
                'w').close()
            can_delete_dir = False

        params = {
            'package': package_name,
            'operation': 'remove',
            'version': version
        }
        self.record_usage(params)

        # Remove the package from the installed packages list
        def clear_package():
            settings = sublime.load_settings('%s.sublime-settings' % __name__)
            installed_packages = settings.get('installed_packages', [])
            if not installed_packages:
                installed_packages = []
            installed_packages.remove(package_name)
            settings.set('installed_packages', installed_packages)
            sublime.save_settings('%s.sublime-settings' % __name__)
        sublime.set_timeout(clear_package, 1)

        if can_delete_dir:
            os.rmdir(package_dir)

        return True

    def record_usage(self, params):
        """
        Submits install, upgrade and delete actions to a usage server

        The usage information is currently displayed on the Package Control
        community package list at http://wbond.net/sublime_packages/community

        :param params:
            A dict of the information to submit
        """

        if not self.settings.get('submit_usage'):
            return
        params['package_control_version'] = \
            self.get_metadata('Package Control').get('version')
        params['sublime_platform'] = self.settings.get('platform')
        params['sublime_version'] = self.settings.get('version')
        url = self.settings.get('submit_url') + '?' + urllib.urlencode(params)

        result = self.download_url(url, 'Error submitting usage information.')
        if result == False:
            return

        try:
            result = json.loads(result)
            if result['result'] != 'success':
                raise ValueError()
        except (ValueError):
            print '%s: Error submitting usage information for %s' % (__name__,
                params['package'])


class PackageCreator():
    """
    Abstract class for commands that create .sublime-package files
    """

    def show_panel(self):
        """
        Shows a list of packages that can be turned into a .sublime-package file
        """

        self.manager = PackageManager()
        self.packages = self.manager.list_packages()
        if not self.packages:
            sublime.error_message(('%s: There are no packages available to ' +
                'be packaged.') % (__name__))
            return
        self.window.show_quick_panel(self.packages, self.on_done)

    def get_package_destination(self):
        """
        Retrieves the destination for .sublime-package files

        :return:
            A string - the path to the folder to save .sublime-package files in
        """

        destination = self.manager.settings.get('package_destination')

        # We check destination via an if statement instead of using
        # the dict.get() method since the key may be set, but to a blank value
        if not destination:
            destination = os.path.join(os.path.expanduser('~'), 'Desktop')

        return destination


class CreatePackageCommand(sublime_plugin.WindowCommand, PackageCreator):
    """
    Command to create a regular .sublime-package file
    """

    def run(self):
        self.show_panel()

    def on_done(self, picked):
        """
        Quick panel user selection handler - processes the user package
        selection and create the package file

        :param picked:
            An integer of the 0-based package name index from the presented
            list. -1 means the user cancelled.
        """

        if picked == -1:
            return
        package_name = self.packages[picked]
        package_destination = self.get_package_destination()

        if self.manager.create_package(package_name, package_destination):
            self.window.run_command('open_dir', {"dir":
                package_destination, "file": package_name +
                '.sublime-package'})


class CreateBinaryPackageCommand(sublime_plugin.WindowCommand, PackageCreator):
    """
    Command to create a binary .sublime-package file. Binary packages in
    general exclude the .py source files and instead include the .pyc files.
    Actual included and excluded files are controlled by settings.
    """

    def run(self):
        self.show_panel()

    def on_done(self, picked):
        """
        Quick panel user selection handler - processes the user package
        selection and create the package file

        :param picked:
            An integer of the 0-based package name index from the presented
            list. -1 means the user cancelled.
        """

        if picked == -1:
            return
        package_name = self.packages[picked]
        package_destination = self.get_package_destination()

        if self.manager.create_package(package_name, package_destination,
                binary_package=True):
            self.window.run_command('open_dir', {"dir":
                package_destination, "file": package_name +
                '.sublime-package'})


class PackageRenamer():
    """
    Class to handle renaming packages via the renamed_packages setting
    gathered from channels and repositories.
    """

    def load_settings(self):
        """
        Loads the list of installed packages from the
        Package Control.sublime-settings file.
        """

        self.settings_file = '%s.sublime-settings' % __name__
        self.settings = sublime.load_settings(self.settings_file)
        self.installed_packages = self.settings.get('installed_packages', [])
        if not isinstance(self.installed_packages, list):
            self.installed_packages = []

    def rename_packages(self, installer):
        """
        Renames any installed packages that the user has installed.

        :param installer:
            An instance of :class:`PackageInstaller`
        """

        # Fetch the packages since that will pull in the renamed packages list
        installer.manager.list_available_packages()
        renamed_packages = installer.manager.settings.get('renamed_packages', {})
        if not renamed_packages:
            renamed_packages = {}

        # These are packages that have been tracked as installed
        installed_pkgs = self.installed_packages
        # There are the packages actually present on the filesystem
        present_packages = installer.manager.list_packages()

        # Rename directories for packages that have changed names
        for package_name in renamed_packages:
            package_dir = os.path.join(sublime.packages_path(), package_name)
            metadata_path = os.path.join(package_dir, 'package-metadata.json')
            if not os.path.exists(metadata_path):
                continue

            new_package_name = renamed_packages[package_name]
            new_package_dir = os.path.join(sublime.packages_path(),
                new_package_name)

            changing_case = package_name.lower() == new_package_name.lower()
            case_insensitive_fs = sublime.platform() in ['windows', 'osx']

            # Since Windows and OSX use case-insensitive filesystems, we have to
            # scan through the list of installed packages if the rename of the
            # package is just changing the case of it. If we don't find the old
            # name for it, we continue the loop since os.path.exists() will return
            # true due to the case-insensitive nature of the filesystems.
            if case_insensitive_fs and changing_case:
                has_old = False
                for present_package_name in present_packages:
                    if present_package_name == package_name:
                        has_old = True
                        break
                if not has_old:
                    continue

            if not os.path.exists(new_package_dir) or (case_insensitive_fs and changing_case):

                # Windows will not allow you to rename to the same name with
                # a different case, so we work around that with a temporary name
                if os.name == 'nt' and changing_case:
                    temp_package_name = '__' + new_package_name
                    temp_package_dir = os.path.join(sublime.packages_path(),
                        temp_package_name)
                    os.rename(package_dir, temp_package_dir)
                    package_dir = temp_package_dir

                os.rename(package_dir, new_package_dir)
                installed_pkgs.append(new_package_name)

                print '%s: Renamed %s to %s' % (__name__, package_name,
                    new_package_name)

            else:
                installer.manager.remove_package(package_name)
                print ('%s: Removed %s since package with new name (%s) ' +
                    'already exists') % (__name__, package_name,
                    new_package_name)

            try:
                installed_pkgs.remove(package_name)
            except (ValueError):
                pass

        sublime.set_timeout(lambda: self.save_packages(installed_pkgs), 10)

    def save_packages(self, installed_packages):
        """
        Saves the list of installed packages (after having been appropriately
        renamed)

        :param installed_packages:
            The new list of installed packages
        """

        installed_packages = list(set(installed_packages))
        installed_packages = sorted(installed_packages,
            key=lambda s: s.lower())

        if installed_packages != self.installed_packages:
            self.settings.set('installed_packages', installed_packages)
            sublime.save_settings(self.settings_file)


class PackageInstaller():
    """
    Provides helper functionality related to installing packages
    """

    def __init__(self):
        self.manager = PackageManager()

    def make_package_list(self, ignore_actions=[], override_action=None,
            ignore_packages=[]):
        """
        Creates a list of packages and what operation would be performed for
        each. Allows filtering by the applicable action or package name.
        Returns the information in a format suitable for displaying in the
        quick panel.

        :param ignore_actions:
            A list of actions to ignore packages by. Valid actions include:
            `install`, `upgrade`, `downgrade`, `reinstall`, `overwrite`,
            `pull` and `none`. `pull` andd `none` are for Git and Hg
            repositories. `pull` is present when incoming changes are detected,
            where as `none` is selected if no commits are available. `overwrite`
            is for packages that do not include version information via the
            `package-metadata.json` file.

        :param override_action:
            A string action name to override the displayed action for all listed
            packages.

        :param ignore_packages:
            A list of packages names that should not be returned in the list

        :return:
            A list of lists, each containing three strings:
              0 - package name
              1 - package description
              2 - action; [extra info;] package url
        """

        packages = self.manager.list_available_packages()
        installed_packages = self.manager.list_packages()

        package_list = []
        for package in sorted(packages.iterkeys(), key=lambda s: s.lower()):
            if ignore_packages and package in ignore_packages:
                continue
            package_entry = [package]
            info = packages[package]
            download = info['downloads'][0]

            if package in installed_packages:
                installed = True
                metadata = self.manager.get_metadata(package)
                if metadata.get('version'):
                    installed_version = metadata['version']
                else:
                    installed_version = None
            else:
                installed = False

            installed_version_name = 'v' + installed_version if \
                installed and installed_version else 'unknown version'
            new_version = 'v' + download['version']

            vcs = None
            package_dir = self.manager.get_package_dir(package)
            settings = self.manager.settings

            if override_action:
                action = override_action
                extra = ''

            else:
                if os.path.exists(os.path.join(sublime.packages_path(),
                        package, '.git')):
                    if settings.get('ignore_vcs_packages'):
                        continue
                    vcs = 'git'
                    incoming = GitUpgrader(settings.get('git_binary'),
                        settings.get('git_update_command'), package_dir,
                        settings.get('cache_length'), settings.get('debug')
                        ).incoming()
                elif os.path.exists(os.path.join(sublime.packages_path(),
                        package, '.hg')):
                    if settings.get('ignore_vcs_packages'):
                        continue
                    vcs = 'hg'
                    incoming = HgUpgrader(settings.get('hg_binary'),
                        settings.get('hg_update_command'), package_dir,
                        settings.get('cache_length'), settings.get('debug')
                        ).incoming()

                if installed:
                    if not installed_version:
                        if vcs:
                            if incoming:
                                action = 'pull'
                                extra = ' with ' + vcs
                            else:
                                action = 'none'
                                extra = ''
                        else:
                            action = 'overwrite'
                            extra = ' %s with %s' % (installed_version_name,
                                new_version)
                    else:
                        res = self.manager.compare_versions(
                            installed_version, download['version'])
                        if res < 0:
                            action = 'upgrade'
                            extra = ' to %s from %s' % (new_version,
                                installed_version_name)
                        elif res > 0:
                            action = 'downgrade'
                            extra = ' to %s from %s' % (new_version,
                                installed_version_name)
                        else:
                            action = 'reinstall'
                            extra = ' %s' % new_version
                else:
                    action = 'install'
                    extra = ' %s' % new_version
                extra += ';'

                if action in ignore_actions:
                    continue

            description = info.get('description')
            if not description:
                description = 'No description provided'
            package_entry.append(description)
            package_entry.append(action + extra + ' ' +
                re.sub('^https?://', '', info['url']))
            package_list.append(package_entry)
        return package_list

    def disable_package(self, package):
        """
        Disables a package before installing or upgrading to prevent errors
        where Sublime Text tries to read files that no longer exist, or read a
        half-written file.

        :param package: The string package name
        """

        # Don't disable Package Control so it does not get stuck disabled
        if package == 'Package Control':
            return False

        settings = sublime.load_settings(preferences_filename())
        ignored = settings.get('ignored_packages')
        if not ignored:
            ignored = []
        if not package in ignored:
            ignored.append(package)
            settings.set('ignored_packages', ignored)
            sublime.save_settings(preferences_filename())
            return True
        return False

    def reenable_package(self, package):
        """
        Re-enables a package after it has been installed or upgraded

        :param package: The string package name
        """

        settings = sublime.load_settings(preferences_filename())
        ignored = settings.get('ignored_packages')
        if not ignored:
            return
        if package in ignored:
            settings.set('ignored_packages',
                list(set(ignored) - set([package])))
            sublime.save_settings(preferences_filename())

    def on_done(self, picked):
        """
        Quick panel user selection handler - disables a package, installs or
        upgrades it, then re-enables the package

        :param picked:
            An integer of the 0-based package name index from the presented
            list. -1 means the user cancelled.
        """

        if picked == -1:
            return
        name = self.package_list[picked][0]

        if self.disable_package(name):
            on_complete = lambda: self.reenable_package(name)
        else:
            on_complete = None

        thread = PackageInstallerThread(self.manager, name, on_complete)
        thread.start()
        ThreadProgress(thread, 'Installing package %s' % name,
            'Package %s successfully %s' % (name, self.completion_type))


class PackageInstallerThread(threading.Thread):
    """
    A thread to run package install/upgrade operations in so that the main
    Sublime Text thread does not get blocked and freeze the UI
    """

    def __init__(self, manager, package, on_complete):
        """
        :param manager:
            An instance of :class:`PackageManager`

        :param package:
            The string package name to install/upgrade

        :param on_complete:
            A callback to run after installing/upgrading the package
        """

        self.package = package
        self.manager = manager
        self.on_complete = on_complete
        threading.Thread.__init__(self)

    def run(self):
        try:
            self.result = self.manager.install_package(self.package)
        finally:
            if self.on_complete:
                sublime.set_timeout(self.on_complete, 1)


class InstallPackageCommand(sublime_plugin.WindowCommand):
    """
    A command that presents the list of available packages and allows the
    user to pick one to install.
    """

    def run(self):
        thread = InstallPackageThread(self.window)
        thread.start()
        ThreadProgress(thread, 'Loading repositories', '')


class InstallPackageThread(threading.Thread, PackageInstaller):
    """
    A thread to run the action of retrieving available packages in. Uses the
    default PackageInstaller.on_done quick panel handler.
    """

    def __init__(self, window):
        """
        :param window:
            An instance of :class:`sublime.Window` that represents the Sublime
            Text window to show the available package list in.
        """

        self.window = window
        self.completion_type = 'installed'
        threading.Thread.__init__(self)
        PackageInstaller.__init__(self)

    def run(self):
        self.package_list = self.make_package_list(['upgrade', 'downgrade',
            'reinstall', 'pull', 'none'])

        def show_quick_panel():
            if not self.package_list:
                sublime.error_message(('%s: There are no packages ' +
                    'available for installation.') % __name__)
                return
            self.window.show_quick_panel(self.package_list, self.on_done)
        sublime.set_timeout(show_quick_panel, 10)


class DiscoverPackagesCommand(sublime_plugin.WindowCommand):
    """
    A command that opens the community package list webpage
    """

    def run(self):
        self.window.run_command('open_url',
            {'url': 'http://wbond.net/sublime_packages/community'})


class UpgradePackageCommand(sublime_plugin.WindowCommand):
    """
    A command that presents the list of installed packages that can be upgraded.
    """

    def run(self):
        package_renamer = PackageRenamer()
        package_renamer.load_settings()

        thread = UpgradePackageThread(self.window, package_renamer)
        thread.start()
        ThreadProgress(thread, 'Loading repositories', '')


class UpgradePackageThread(threading.Thread, PackageInstaller):
    """
    A thread to run the action of retrieving upgradable packages in.
    """

    def __init__(self, window, package_renamer):
        """
        :param window:
            An instance of :class:`sublime.Window` that represents the Sublime
            Text window to show the list of upgradable packages in.

        :param package_renamer:
            An instance of :class:`PackageRenamer`
        """
        self.window = window
        self.package_renamer = package_renamer
        self.completion_type = 'upgraded'
        threading.Thread.__init__(self)
        PackageInstaller.__init__(self)

    def run(self):
        self.package_renamer.rename_packages(self)

        self.package_list = self.make_package_list(['install', 'reinstall',
            'none'])

        def show_quick_panel():
            if not self.package_list:
                sublime.error_message(('%s: There are no packages ' +
                    'ready for upgrade.') % __name__)
                return
            self.window.show_quick_panel(self.package_list, self.on_done)
        sublime.set_timeout(show_quick_panel, 10)

    def on_done(self, picked):
        """
        Quick panel user selection handler - disables a package, upgrades it,
        then re-enables the package

        :param picked:
            An integer of the 0-based package name index from the presented
            list. -1 means the user cancelled.
        """

        if picked == -1:
            return
        name = self.package_list[picked][0]

        if self.disable_package(name):
            on_complete = lambda: self.reenable_package(name)
        else:
            on_complete = None

        thread = PackageInstallerThread(self.manager, name, on_complete)
        thread.start()
        ThreadProgress(thread, 'Upgrading package %s' % name,
            'Package %s successfully %s' % (name, self.completion_type))


class UpgradeAllPackagesCommand(sublime_plugin.WindowCommand):
    """
    A command to automatically upgrade all installed packages that are
    upgradable.
    """

    def run(self):
        package_renamer = PackageRenamer()
        package_renamer.load_settings()

        thread = UpgradeAllPackagesThread(self.window, package_renamer)
        thread.start()
        ThreadProgress(thread, 'Loading repositories', '')


class UpgradeAllPackagesThread(threading.Thread, PackageInstaller):
    """
    A thread to run the action of retrieving upgradable packages in.
    """

    def __init__(self, window, package_renamer):
        self.window = window
        self.package_renamer = package_renamer
        self.completion_type = 'upgraded'
        threading.Thread.__init__(self)
        PackageInstaller.__init__(self)

    def run(self):
        self.package_renamer.rename_packages(self)
        package_list = self.make_package_list(['install', 'reinstall', 'none'])

        disabled_packages = {}

        def do_upgrades():
            # Pause so packages can be disabled
            time.sleep(0.5)

            # We use a function to generate the on-complete lambda because if
            # we don't, the lambda will bind to info at the current scope, and
            # thus use the last value of info from the loop
            def make_on_complete(name):
                return lambda: self.reenable_package(name)

            for info in package_list:
                if disabled_packages.get(info[0]):
                    on_complete = make_on_complete(info[0])
                else:
                    on_complete = None
                thread = PackageInstallerThread(self.manager, info[0], on_complete)
                thread.start()
                ThreadProgress(thread, 'Upgrading package %s' % info[0],
                    'Package %s successfully %s' % (info[0], self.completion_type))

        # Disabling a package means changing settings, which can only be done
        # in the main thread. We then create a new background thread so that
        # the upgrade process does not block the UI.
        def disable_packages():
            for info in package_list:
                disabled_packages[info[0]] = self.disable_package(info[0])
            threading.Thread(target=do_upgrades).start()

        sublime.set_timeout(disable_packages, 1)


class ExistingPackagesCommand():
    """
    Allows listing installed packages and their current version
    """

    def __init__(self):
        self.manager = PackageManager()

    def make_package_list(self, action=''):
        """
        Returns a list of installed packages suitable for displaying in the
        quick panel.

        :param action:
            An action to display at the beginning of the third element of the
            list returned for each package

        :return:
            A list of lists, each containing three strings:
              0 - package name
              1 - package description
              2 - [action] installed version; package url
        """

        packages = self.manager.list_packages()

        if action:
            action += ' '

        package_list = []
        for package in sorted(packages, key=lambda s: s.lower()):
            package_entry = [package]
            metadata = self.manager.get_metadata(package)
            package_dir = os.path.join(sublime.packages_path(), package)

            description = metadata.get('description')
            if not description:
                description = 'No description provided'
            package_entry.append(description)

            version = metadata.get('version')
            if not version and os.path.exists(os.path.join(package_dir,
                    '.git')):
                installed_version = 'git repository'
            elif not version and os.path.exists(os.path.join(package_dir,
                    '.hg')):
                installed_version = 'hg repository'
            else:
                installed_version = 'v' + version if version else \
                    'unknown version'

            url = metadata.get('url')
            if url:
                url = '; ' + re.sub('^https?://', '', url)
            else:
                url = ''

            package_entry.append(action + installed_version + url)
            package_list.append(package_entry)

        return package_list


class ListPackagesCommand(sublime_plugin.WindowCommand):
    """
    A command that shows a list of all installed packages in the quick panel
    """

    def run(self):
        ListPackagesThread(self.window).start()


class ListPackagesThread(threading.Thread, ExistingPackagesCommand):
    """
    A thread to prevent the listing of existing packages from freezing the UI
    """

    def __init__(self, window):
        """
        :param window:
            An instance of :class:`sublime.Window` that represents the Sublime
            Text window to show the list of installed packages in.
        """

        self.window = window
        threading.Thread.__init__(self)
        ExistingPackagesCommand.__init__(self)

    def run(self):
        self.package_list = self.make_package_list()

        def show_quick_panel():
            if not self.package_list:
                sublime.error_message(('%s: There are no packages ' +
                    'to list.') % __name__)
                return
            self.window.show_quick_panel(self.package_list, self.on_done)
        sublime.set_timeout(show_quick_panel, 10)

    def on_done(self, picked):
        """
        Quick panel user selection handler - opens the homepage for any
        selected package in the user's browser

        :param picked:
            An integer of the 0-based package name index from the presented
            list. -1 means the user cancelled.
        """

        if picked == -1:
            return
        package_name = self.package_list[picked][0]

        def open_dir():
            self.window.run_command('open_dir',
                {"dir": os.path.join(sublime.packages_path(), package_name)})
        sublime.set_timeout(open_dir, 10)


class RemovePackageCommand(sublime_plugin.WindowCommand,
        ExistingPackagesCommand):
    """
    A command that presents a list of installed packages, allowing the user to
    select one to remove
    """

    def __init__(self, window):
        """
        :param window:
            An instance of :class:`sublime.Window` that represents the Sublime
            Text window to show the list of installed packages in.
        """

        self.window = window
        ExistingPackagesCommand.__init__(self)

    def run(self):
        self.package_list = self.make_package_list('remove')
        if not self.package_list:
            sublime.error_message(('%s: There are no packages ' +
                'that can be removed.') % __name__)
            return
        self.window.show_quick_panel(self.package_list, self.on_done)

    def on_done(self, picked):
        """
        Quick panel user selection handler - deletes the selected package

        :param picked:
            An integer of the 0-based package name index from the presented
            list. -1 means the user cancelled.
        """

        if picked == -1:
            return
        package = self.package_list[picked][0]

        # Don't disable Package Control so it does not get stuck disabled
        if package != 'Package Control':
            settings = sublime.load_settings(preferences_filename())
            ignored = settings.get('ignored_packages')
            if not ignored:
                ignored = []
            if not package in ignored:
                ignored.append(package)
                settings.set('ignored_packages', ignored)
                sublime.save_settings(preferences_filename())

        ignored.remove(package)
        thread = RemovePackageThread(self.manager, package,
            ignored)
        thread.start()
        ThreadProgress(thread, 'Removing package %s' % package,
            'Package %s successfully removed' % package)


class RemovePackageThread(threading.Thread):
    """
    A thread to run the remove package operation in so that the Sublime Text
    UI does not become frozen
    """

    def __init__(self, manager, package, ignored):
        self.manager = manager
        self.package = package
        self.ignored = ignored
        threading.Thread.__init__(self)

    def run(self):
        self.result = self.manager.remove_package(self.package)

        def unignore_package():
            settings = sublime.load_settings(preferences_filename())
            settings.set('ignored_packages', self.ignored)
            sublime.save_settings(preferences_filename())
        sublime.set_timeout(unignore_package, 10)


class AddRepositoryChannelCommand(sublime_plugin.WindowCommand):
    """
    A command to add a new channel (list of repositories) to the user's machine
    """

    def run(self):
        self.window.show_input_panel('Channel JSON URL', '',
            self.on_done, self.on_change, self.on_cancel)

    def on_done(self, input):
        """
        Input panel handler - adds the provided URL as a channel

        :param input:
            A string of the URL to the new channel
        """

        settings = sublime.load_settings('%s.sublime-settings' % __name__)
        repository_channels = settings.get('repository_channels', [])
        if not repository_channels:
            repository_channels = []
        repository_channels.append(input)
        settings.set('repository_channels', repository_channels)
        sublime.save_settings('%s.sublime-settings' % __name__)
        sublime.status_message(('Channel %s successfully ' +
            'added') % input)

    def on_change(self, input):
        pass

    def on_cancel(self):
        pass


class AddRepositoryCommand(sublime_plugin.WindowCommand):
    """
    A command to add a new repository to the user's machine
    """

    def run(self):
        self.window.show_input_panel('GitHub or BitBucket Web URL, or Custom' +
                ' JSON Repository URL', '', self.on_done,
            self.on_change, self.on_cancel)

    def on_done(self, input):
        """
        Input panel handler - adds the provided URL as a repository

        :param input:
            A string of the URL to the new repository
        """

        settings = sublime.load_settings('%s.sublime-settings' % __name__)
        repositories = settings.get('repositories', [])
        if not repositories:
            repositories = []
        repositories.append(input)
        settings.set('repositories', repositories)
        sublime.save_settings('%s.sublime-settings' % __name__)
        sublime.status_message('Repository %s successfully added' % input)

    def on_change(self, input):
        pass

    def on_cancel(self):
        pass


class DisablePackageCommand(sublime_plugin.WindowCommand):
    """
    A command that adds a package to Sublime Text's ignored packages list
    """

    def run(self):
        manager = PackageManager()
        packages = manager.list_all_packages()
        self.settings = sublime.load_settings(preferences_filename())
        ignored = self.settings.get('ignored_packages')
        if not ignored:
            ignored = []
        self.package_list = list(set(packages) - set(ignored))
        self.package_list.sort()
        if not self.package_list:
            sublime.error_message(('%s: There are no enabled packages' +
                'to disable.') % __name__)
            return
        self.window.show_quick_panel(self.package_list, self.on_done)

    def on_done(self, picked):
        """
        Quick panel user selection handler - disables the selected package

        :param picked:
            An integer of the 0-based package name index from the presented
            list. -1 means the user cancelled.
        """

        if picked == -1:
            return
        package = self.package_list[picked]
        ignored = self.settings.get('ignored_packages')
        if not ignored:
            ignored = []
        ignored.append(package)
        self.settings.set('ignored_packages', ignored)
        sublime.save_settings(preferences_filename())
        sublime.status_message(('Package %s successfully added to list of ' +
            'disabled packages - restarting Sublime Text may be required') %
            package)


class EnablePackageCommand(sublime_plugin.WindowCommand):
    """
    A command that removes a package from Sublime Text's ignored packages list
    """

    def run(self):
        self.settings = sublime.load_settings(preferences_filename())
        self.disabled_packages = self.settings.get('ignored_packages')
        self.disabled_packages.sort()
        if not self.disabled_packages:
            sublime.error_message(('%s: There are no disabled packages ' +
                'to enable.') % __name__)
            return
        self.window.show_quick_panel(self.disabled_packages, self.on_done)

    def on_done(self, picked):
        """
        Quick panel user selection handler - enables the selected package

        :param picked:
            An integer of the 0-based package name index from the presented
            list. -1 means the user cancelled.
        """

        if picked == -1:
            return
        package = self.disabled_packages[picked]
        ignored = self.settings.get('ignored_packages')
        self.settings.set('ignored_packages',
            list(set(ignored) - set([package])))
        sublime.save_settings(preferences_filename())
        sublime.status_message(('Package %s successfully removed from list ' +
            'of disabled packages - restarting Sublime Text may be required') %
            package)


class AutomaticUpgrader(threading.Thread):
    """
    Automatically checks for updated packages and installs them. controlled
    by the `auto_upgrade`, `auto_upgrade_ignore`, `auto_upgrade_frequency` and
    `auto_upgrade_last_run` settings.
    """

    def __init__(self, found_packages):
        """
        :param found_packages:
            A list of package names for the packages that were found to be
            installed on the machine.
        """

        self.installer = PackageInstaller()
        self.manager = self.installer.manager

        self.load_settings()

        self.package_renamer = PackageRenamer()
        self.package_renamer.load_settings()

        self.auto_upgrade = self.settings.get('auto_upgrade')
        self.auto_upgrade_ignore = self.settings.get('auto_upgrade_ignore')

        self.next_run = int(time.time())
        self.last_run = None
        last_run_file = os.path.join(sublime.packages_path(), 'User',
            'Package Control.last-run')

        if os.path.isfile(last_run_file):
            with open(last_run_file) as fobj:
                try:
                    self.last_run = int(fobj.read())
                except ValueError:
                    pass

        frequency = self.settings.get('auto_upgrade_frequency')
        if frequency:
            if self.last_run:
                self.next_run = int(self.last_run) + (frequency * 60 * 60)
            else:
                self.next_run = time.time()

        # Detect if a package is missing that should be installed
        self.missing_packages = list(set(self.installed_packages) -
            set(found_packages))

        if self.auto_upgrade and self.next_run <= time.time():
            with open(last_run_file, 'w') as fobj:
                fobj.write(str(int(time.time())))

        threading.Thread.__init__(self)

    def load_settings(self):
        """
        Loads the list of installed packages from the
        Package Control.sublime-settings file
        """

        self.settings_file = '%s.sublime-settings' % __name__
        self.settings = sublime.load_settings(self.settings_file)
        self.installed_packages = self.settings.get('installed_packages', [])
        self.should_install_missing = self.settings.get('install_missing')
        if not isinstance(self.installed_packages, list):
            self.installed_packages = []

    def run(self):
        self.install_missing()

        if self.next_run > time.time():
            self.print_skip()
            return

        self.upgrade_packages()

    def install_missing(self):
        """
        Installs all packages that were listed in the list of
        `installed_packages` from Package Control.sublime-settings but were not
        found on the filesystem and passed as `found_packages`.
        """

        if not self.missing_packages or not self.should_install_missing:
            return

        print '%s: Installing %s missing packages' % \
            (__name__, len(self.missing_packages))
        for package in self.missing_packages:
            if self.installer.manager.install_package(package):
                print '%s: Installed missing package %s' % \
                    (__name__, package)

    def print_skip(self):
        """
        Prints a notice in the console if the automatic upgrade is skipped
        due to already having been run in the last `auto_upgrade_frequency`
        hours.
        """

        last_run = datetime.datetime.fromtimestamp(self.last_run)
        next_run = datetime.datetime.fromtimestamp(self.next_run)
        date_format = '%Y-%m-%d %H:%M:%S'
        print ('%s: Skipping automatic upgrade, last run at ' +
            '%s, next run at %s or after') % (__name__,
            last_run.strftime(date_format), next_run.strftime(date_format))

    def upgrade_packages(self):
        """
        Upgrades all packages that are not currently upgraded to the lastest
        version. Also renames any installed packages to their new names.
        """

        if not self.auto_upgrade:
            return

        self.package_renamer.rename_packages(self.installer)

        packages = self.installer.make_package_list(['install',
            'reinstall', 'downgrade', 'overwrite', 'none'],
            ignore_packages=self.auto_upgrade_ignore)

        # If Package Control is being upgraded, just do that and restart
        for package in packages:
            if package[0] != __name__:
                continue

            def reset_last_run():
                settings = sublime.load_settings(self.settings_file)
                settings.set('auto_upgrade_last_run', None)
                sublime.save_settings(self.settings_file)
            sublime.set_timeout(reset_last_run, 1)
            packages = [package]
            break

        if not packages:
            print '%s: No updated packages' % __name__
            return

        print '%s: Installing %s upgrades' % (__name__, len(packages))
        for package in packages:
            self.installer.manager.install_package(package[0])
            version = re.sub('^.*?(v[\d\.]+).*?$', '\\1', package[2])
            if version == package[2] and version.find('pull with') != -1:
                vcs = re.sub('^pull with (\w+).*?$', '\\1', version)
                version = 'latest %s commit' % vcs
            print '%s: Upgraded %s to %s' % (__name__, package[0], version)


class PackageCleanup(threading.Thread, PackageRenamer):
    """
    Cleans up folders for packages that were removed, but that still have files
    in use.
    """

    def __init__(self):
        self.manager = PackageManager()
        self.load_settings()
        threading.Thread.__init__(self)

    def run(self):
        found_pkgs = []
        installed_pkgs = self.installed_packages
        for package_name in os.listdir(sublime.packages_path()):
            package_dir = os.path.join(sublime.packages_path(), package_name)
            metadata_path = os.path.join(package_dir, 'package-metadata.json')

            # Cleanup packages that could not be removed due to in-use files
            cleanup_file = os.path.join(package_dir, 'package-control.cleanup')
            if os.path.exists(cleanup_file):
                try:
                    shutil.rmtree(package_dir)
                    print '%s: Removed old directory for package %s' % \
                        (__name__, package_name)
                except (OSError) as (e):
                    if not os.path.exists(cleanup_file):
                        open(cleanup_file, 'w').close()
                    print ('%s: Unable to remove old directory for package ' +
                        '%s - deferring until next start: %s') % (__name__,
                        package_name, unicode_from_os(e))

            # Finish reinstalling packages that could not be upgraded due to
            # in-use files
            reinstall = os.path.join(package_dir, 'package-control.reinstall')
            if os.path.exists(reinstall):
                if not clear_directory(package_dir, [metadata_path]):
                    if not os.path.exists(reinstall):
                        open(reinstall, 'w').close()
                    # Assigning this here prevents the callback from referencing the value
                    # of the "package_name" variable when it is executed
                    restart_message = ('%s: An error occurred while trying to ' +
                        'finish the upgrade of %s. You will most likely need to ' +
                        'restart your computer to complete the upgrade.') % (
                        __name__, package_name)
                    def show_still_locked():
                        sublime.error_message(restart_message)
                    sublime.set_timeout(show_still_locked, 10)
                else:
                    self.manager.install_package(package_name)

            # This adds previously installed packages from old versions of PC
            if os.path.exists(metadata_path) and \
                    package_name not in self.installed_packages:
                installed_pkgs.append(package_name)
                params = {
                    'package': package_name,
                    'operation': 'install',
                    'version': \
                        self.manager.get_metadata(package_name).get('version')
                }
                self.manager.record_usage(params)

            found_pkgs.append(package_name)

        sublime.set_timeout(lambda: self.finish(installed_pkgs, found_pkgs), 10)

    def finish(self, installed_pkgs, found_pkgs):
        """
        A callback that can be run the main UI thread to perform saving of the
        Package Control.sublime-settings file. Also fires off the
        :class:`AutomaticUpgrader`.

        :param installed_pkgs:
            A list of the string package names of all "installed" packages,
            even ones that do not appear to be in the filesystem.

        :param found_pkgs:
            A list of the string package names of all packages that are
            currently installed on the filesystem.
        """

        self.save_packages(installed_pkgs)
        AutomaticUpgrader(found_pkgs).start()


# Start shortly after Sublime starts so package renames don't cause errors
# with keybindings, settings, etc disappearing in the middle of parsing
sublime.set_timeout(lambda: PackageCleanup().start(), 2000)
