let g:Powerline#Segments#ctrlp#segments = Pl#Segment#Init(['ctrlp'
	\ , Pl#Segment#Create('focus', '%{"%0"}')
	\ , Pl#Segment#Create('byfname', '%{"%1"}')
	\ , Pl#Segment#Create('prev', '%-3{"%3"}')
	\ , Pl#Segment#Create('item', '%-9{"%4"}')
	\ , Pl#Segment#Create('next', '%-3{"%5"}')
	\ , Pl#Segment#Create('marked', '%{"%6" == " <+>" ? "" : strpart("%6", 2, len("%6") - 3)}')
	\
	\ , Pl#Segment#Create('count', '%-6{"%0"}')
\ ])
