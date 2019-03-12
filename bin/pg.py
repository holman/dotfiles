#!/usr/bin/python
import sys

def parse(googurl):
        parts=googurl.split('&');
        #print(parts);
        for part in parts:
                u = part.split('=');
                #print(u);
                if u[0].replace(' ','') == 'url':
                        print(u);
                        ret=u[1].replace('%3A',':');
                        ret=ret.replace('%2F','/');
                        break;
        else:
                ret='No Google-Style URL Found';
        return ret;
if __name__ == "__main__":
        if len(sys.argv)!=2:
                print 'Please provide one URL.';
        else:
                print parse(sys.argv[1]);

