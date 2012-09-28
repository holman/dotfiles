let g:Powerline#Segments#tagbar#segments = Pl#Segment#Init(['tagbar',
	\ (exists(':Tagbar') > 0),
	\
	\ Pl#Segment#Create('currenttag', '%{tagbar#currenttag("%s", "")}', Pl#Segment#Modes('!N'))
\ ])
