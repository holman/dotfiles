from os import linesep,path,mkdir,listdir

class BlockNames:
    FUNCTION = 1
    IF = 2
    FOR = 3 
    WHILE = 4

def outFormat(s,line,numTabs):
    sout = s + linesep
    if numTabs<0: #Preserve starting tabs and whitespaces
        idx = -numTabs
        sout = line[0:idx] + sout
    else:
        sout = '\t'*numTabs + sout
    return sout

def nT(S,idx):
    if smartTabify:
        return len(S)
    return -idx
 
smartTabify = False  #Not implemented yet
            
print("\nStarting octave2matlab...") 
octavedirname = './octave/'  
if not path.exists(octavedirname+'Matlab'):
    mkdir(octavedirname+'Matlab/')
octavefilenames = listdir(octavedirname)
print(octavefilenames) 
for octavefilename in  octavefilenames:  
    if not(octavefilename.lower().endswith('.m')):
        print("Skipping "+octavefilename)
        continue
    print("Converting "+octavefilename)
    outstr = ''
    stack = [];
    f = open(octavedirname+octavefilename,'r')
    g = open(octavedirname+'Matlab/'+octavefilename,'w')
    lines = f.readlines()
    for line in lines:
        s = line.strip()
        wsidx = line.find(s)
        #print("S="+s) 
        s  = s.replace('"',"'")   
        commentIndex = s.find('%')
        comments = ''
        if commentIndex>=0:
            comments = s[commentIndex:]
            t  = s[0:commentIndex]
        else:
            t = s   
            
        endkeywords = ('endif','endfor','endwhile')
        for ekw in endkeywords: 
            #print(s) 
            t  = t.replace(ekw,'end')  
            #print(s)
        t  = t.replace('endfunction','')          
        t  = t.replace("!","~")
        t  = t.replace("printf(","fprintf(1,")
        #print("T="+t) 
        #print(line)
        #print("S="+s)
        #outstr += outFormat(s+comments,line,nT(stack))
        if (t.endswith('||') or t.endswith('&&')):
            t = t + ' ...'
        g.write(outFormat(t+comments,line,nT(stack,wsidx)))       
        #print(outstr)
    f.close()
    g.close()
