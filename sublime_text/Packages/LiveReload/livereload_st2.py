import sublime,sublime_plugin,threading,json,os,threading,subprocess,socket      
from base64 import b64encode, b64decode
# python 2.6 differences
try: 
    from hashlib import md5, sha1
except: from md5 import md5; from sha import sha as sha1
from SimpleHTTPServer import SimpleHTTPRequestHandler
from struct import pack, unpack_from
import array, struct, os
import urllib2
s2a = lambda s: [ord(c) for c in s]
settings = sublime.load_settings('LiveReload.sublime-settings')
port = settings.get('port')
version = settings.get('version')
##LOAD latest livereload.js from github (for v2 of protocol) or if this fails local version
try:
    req = urllib2.urlopen(urllib2.Request("http://raw.github.com/livereload/livereload-js/master/dist/livereload.js"))
    source_livereload_js = req.read()
    if not "http://livereload.com/protocols/official-6" in source_livereload_js:
        raise Exception("Something wrong with download!")
except Exception, u:
    print u
    try:
        path = os.path.join(sublime.packages_path(), "LiveReload")
        local = open(os.path.join(path, "livereload.js"), "rU")
        source_livereload_js = local.read()
    except IOError, e:
        print e
        sublime.error_message("livereload.js is missing from LiveReload package install")


class LiveReload(threading.Thread):

    def run(self):
      global  LivereloadFactory
      threading.Thread.__init__(self)
      LivereloadFactory = WebSocketServer(port,version)
      LivereloadFactory.start()

class LiveReloadChange(sublime_plugin.EventListener):
    def __init__  (self):
      LiveReload().start()
      
    def __del__(self):
      global  LivereloadFactory
      LivereloadFactory.stop()

    def on_post_save(self, view):
      global  LivereloadFactory
      settings = sublime.load_settings('LiveReload.sublime-settings')
      filename = view.file_name()
      if view.file_name().find('.scss') > 0 and bool(settings.get('compass_css_dir')): 
        filename = filename.replace('sass',settings.get('compass_css_dir')).replace('.scss','.css')
        dirname = os.path.dirname(os.path.dirname(filename))
        compiler = CompassThread(dirname,filename,LivereloadFactory)
        compiler.start()
      else:
        filename = os.path.normcase(filename)
        filename = os.path.split(filename)[1]
        filename = filename.replace('.scss','.css').replace('.styl','.css').replace('.less','.css')
        filename = filename.replace('.coffee','.js')
        
        data = json.dumps(["refresh", {
              "path": filename,
              "apply_js_live": settings.get('apply_js_live'),
              "apply_css_live": settings.get('apply_css_live'),
              "apply_images_live": settings.get('apply_images_live')
          }])
        sublime.set_timeout(lambda: LivereloadFactory.send_all(data), int(settings.get('delay_ms')))  
        sublime.set_timeout(lambda: sublime.status_message("Sent LiveReload command for file: "+filename), int(settings.get('delay_ms')))  
    

class CompassThread(threading.Thread):

    def __init__(self, dirname,filename,LivereloadFactory):
      self.dirname = dirname
      self.filename = filename
      self.LivereloadFactory = LivereloadFactory
      self.stdout = None
      self.stderr = None
      threading.Thread.__init__(self)
      
    def run(self):
      global LivereloadFactory
      p = subprocess.Popen(['compass','compile',self.dirname],shell=True,  stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT )
      if p.stdout.read() :
        self.LivereloadFactory.send_all(json.dumps(["refresh", {
              "path": self.filename,
              "apply_js_live": True,
              "apply_css_live": True,
              "apply_images_live": True
        }]))


class WebSocketServer:
    """
    Handle the Server, bind and accept new connections, open and close
    clients connections.
    """
    
    def __init__(self, port, version):
      self.clients = []
      self.port = port
      self.version = version
      self.s = None

    def stop(self):
      [client.close() for client in self.clients]
      l = threading.Lock()
      l.acquire()
      l.release()

    def start(self):
      """
      Start the server.
      """
      try:
        self.s = socket.socket()
        self.s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.s.bind(('', self.port))
        self.s.listen(1)
      except Exception, e:
        self.stop()

      try:
        while 1:
          conn, addr = self.s.accept()
          newClient = WebSocketClient(conn, addr, self)
          self.clients.append(newClient)
          newClient.start()
      except Exception, e:
        self.stop()

    def send_all(self, data):
      """
      Send a message to all the currenly connected clients.
      """
      
      [client.send(data) for client in self.clients]

    def remove(self, client):
      """
      Remove a client from the connected list.
      """
      try:
        l = threading.Lock()
        l.acquire()
        self.clients.remove(client)
        l.release()
      except Exception, e:
        pass


class WebSocketClient(threading.Thread):
    """
    A single connection (client) of the program
    """

    # Handshaking, create the WebSocket connection
    server_handshake_hybi = """HTTP/1.1 101 Switching Protocols\r
Upgrade: websocket\r
Connection: Upgrade\r
Sec-WebSocket-Accept: %s\r
"""
    GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

    def __init__(self, sock, addr, server):
        threading.Thread.__init__(self)
        self.s = sock
        self.addr = addr
        self.server = server

    def run(self):

        wsh = WSRequestHandler(self.s, self.addr, False)
        h = self.headers = wsh.headers
        ver = h.get('Sec-WebSocket-Version')
        if ver:
            # HyBi/IETF version of the protocol

            # HyBi-07 report version 7
            # HyBi-08 - HyBi-12 report version 8
            # HyBi-13 reports version 13
            if ver in ['7', '8', '13']:
                self.version = "hybi-%02d" % int(ver)
            else:
                raise Exception('Unsupported protocol version %s' % ver)

            key = h['Sec-WebSocket-Key']
            print key
            # Generate the hash value for the accept header
            accept = b64encode(sha1(key + self.GUID).digest())

            response = self.server_handshake_hybi % accept
            response += "\r\n"
            print response
            self.s.send(response.encode())
            self.new_client()
            
        # Receive and handle data
        while 1:
            try:
              data = self.s.recv(1024)
            except Exception, e:
              break
            if not data: break
            dec = WebSocketClient.decode_hybi(data)
            if dec["opcode"] == 8:
              self.close()
            else:
              self.onreceive(dec)

        # Close the client connection
        self.close()

    @staticmethod
    def unmask(buf, f):
        pstart = f['hlen'] + 4
        pend = pstart + f['length']
        # Slower fallback
        data = array.array('B')
        mask = s2a(f['mask'])
        data.fromstring(buf[pstart:pend])
        for i in range(len(data)):
            data[i] ^= mask[i % 4]
        return data.tostring()

    @staticmethod
    def encode_hybi(buf, opcode, base64=False):
        """ Encode a HyBi style WebSocket frame.
        Optional opcode:
            0x0 - continuation
            0x1 - text frame (base64 encode buf)
            0x2 - binary frame (use raw buf)
            0x8 - connection close
            0x9 - ping
            0xA - pong
        """
        if base64:
            buf = b64encode(buf)

        b1 = 0x80 | (opcode & 0x0f) # FIN + opcode
        payload_len = len(buf)
        if payload_len <= 125:
            header = pack('>BB', b1, payload_len)
        elif payload_len > 125 and payload_len < 65536:
            header = pack('>BBH', b1, 126, payload_len)
        elif payload_len >= 65536:
            header = pack('>BBQ', b1, 127, payload_len)

        print("Encoded: %s" % repr(header + buf))

        return header + buf, len(header), 0   
            
    @staticmethod
    def decode_hybi(buf, base64=False):
        """ Decode HyBi style WebSocket packets.
        Returns:
            {'fin'          : 0_or_1,
             'opcode'       : number,
             'mask'         : 32_bit_number,
             'hlen'         : header_bytes_number,
             'length'       : payload_bytes_number,
             'payload'      : decoded_buffer,
             'left'         : bytes_left_number,
             'close_code'   : number,
             'close_reason' : string}
        """

        f = {'fin'          : 0,
             'opcode'       : 0,
             'mask'         : 0,
             'hlen'         : 2,
             'length'       : 0,
             'payload'      : None,
             'left'         : 0,
             'close_code'   : None,
             'close_reason' : None}

        blen = len(buf)
        f['left'] = blen

        if blen < f['hlen']:
            return f # Incomplete frame header

        b1, b2 = unpack_from(">BB", buf)
        f['opcode'] = b1 & 0x0f
        f['fin'] = (b1 & 0x80) >> 7
        has_mask = (b2 & 0x80) >> 7

        f['length'] = b2 & 0x7f

        if f['length'] == 126:
            f['hlen'] = 4
            if blen < f['hlen']:
                return f # Incomplete frame header
            (f['length'],) = unpack_from('>xxH', buf)
        elif f['length'] == 127:
            f['hlen'] = 10
            if blen < f['hlen']:
                return f # Incomplete frame header
            (f['length'],) = unpack_from('>xxQ', buf)

        full_len = f['hlen'] + has_mask * 4 + f['length']

        if blen < full_len: # Incomplete frame
            return f # Incomplete frame header

        # Number of bytes that are part of the next frame(s)
        f['left'] = blen - full_len

        # Process 1 frame
        if has_mask:
            # unmask payload
            f['mask'] = buf[f['hlen']:f['hlen']+4]
            f['payload'] = WebSocketClient.unmask(buf, f)
        else:
            print("Unmasked frame: %s" % repr(buf))
            f['payload'] = buf[(f['hlen'] + has_mask * 4):full_len]

        if base64 and f['opcode'] in [1, 2]:
            try:
                f['payload'] = b64decode(f['payload'])
            except:
                print("Exception while b64decoding buffer: %s" %
                        repr(buf))
                raise

        if f['opcode'] == 0x08:
            if f['length'] >= 2:
                f['close_code'] = unpack_from(">H", f['payload'])
            if f['length'] > 3:
                f['close_reason'] = f['payload'][2:]

        return f
    def close(self):
        """
        Close this connection
        """
        self.server.remove(self)
        self.s.close()

    def send(self, msg):
        """
        Send a message to this client
        """
        msg = WebSocketClient.encode_hybi(msg, 0x1, False)
        self.s.send(msg[0])

    def onreceive(self, data):
        """
        Event called when a message is received from this client
        """
        try:
            print data
            if "payload" in data:
                print "payload true"
                if "hello" in data.get("payload"):
                    sublime.set_timeout(lambda: sublime.status_message("New LiveReload v2 client connected"), 100)
                    self.send('{"command":"hello","protocols":["http://livereload.com/protocols/connection-check-1","http://livereload.com/protocols/official-6"]}')
                else:
                    sublime.set_timeout(lambda: sublime.status_message("New LiveReload v1 client connected"), 100)
                    self.send("!!ver:" + str(self.server.version))
        except Exception, e:
            print e


    def new_client(self):
        """
        Event called when handshake is compleated
        """
        #self.send("!!ver:"+str(self.server.version))

    def _clean(self, msg):
        """
        Remove special chars used for the transmission
        """
        msg = msg.replace(b'\x00', b'', 1)
        msg = msg.replace(b'\xff', b'', 1)
        return msg


# HTTP handler with WebSocket upgrade support
class WSRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, req, addr, only_upgrade=True):
        self.only_upgrade = only_upgrade  # only allow upgrades
        SimpleHTTPRequestHandler.__init__(self, req, addr, object())

    def do_GET(self):
        if (self.headers.get('upgrade') and
                self.headers.get('upgrade').lower() == 'websocket'):

            if (self.headers.get('sec-websocket-key1') or
                    self.headers.get('websocket-key1')):
                # For Hixie-76 read out the key hash
                self.headers.__setitem__('key3', self.rfile.read(8))

            # Just indicate that an WebSocket upgrade is needed
            self.last_code = 101
            self.last_message = "101 Switching Protocols"
        elif self.only_upgrade:
            # Normal web request responses are disabled
            self.last_code = 405
            self.last_message = "405 Method Not Allowed"
        else:
            #Self injecting plugin
            if "livereload.js" in self.path:
                self.send_response(200, 'OK')
                self.send_header('Content-type', 'text/javascript')
                self.send_header("Content-Length", len(source_livereload_js))
                self.end_headers()
                self.wfile.write(bytes(source_livereload_js))
                return
            else:
                #Disable other requests
                self.send_response(405, 'Method Not Allowed')
                self.send_header('Content-type', 'text/plain')
                self.send_header("Content-Length", len("Method Not Allowed"))
                self.end_headers()
                self.wfile.write(bytes("Method Not Allowed"))
                return

    def send_response(self, code, message=None):
        # Save the status code
        self.last_code = code
        SimpleHTTPRequestHandler.send_response(self, code, message)

    def log_message(self, f, *args):
        # Save instead of printing
        self.last_message = f % args