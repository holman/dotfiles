from killableprocess import Popen, mswindows
if mswindows:
	from winprocess import STARTUPINFO, STARTF_USESHOWWINDOW