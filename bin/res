#!/usr/bin/osascript
#
# A small command line script to change screen resolutions on Mountain Lion.
#
# Primarily I switch between two resolutions on my Retina MacBook Pro: Retina,
# and the full resolution setting. This means for particular apps I use, I can
# quickly jump between seeing more pixels and less.
#
# There doesn't appear to be an easy way to do this without just using
# AppleScript to automate clicking buttons, so that's what this does.
#
# Most of this script is adapted from this helpful answer:
#
#   http://apple.stackexchange.com/a/91590
#
# Make sure "Enable access for assistive devices" is checked in the
# Accessibility section of System Properties.

local index1, index2

set index1 to 3 -- 1440 x 900 (Best for Retina)
set index2 to 5 -- 1920 x 1200 (More Space)

tell application "System Preferences"
	reveal anchor "displaysDisplayTab" of pane "com.apple.preference.displays"
end tell

local indexToUse

tell application "System Events" to tell process "System Preferences" to tell window "Built-in Retina Display"

	click radio button "Display" of tab group 1
	click radio button "Scaled" of radio group 1 of tab group 1

	-- Click the "Scaled" radio button
	click radio button "Scaled" of radio group 1 of tab group 1

	tell tab group 1
		tell radio group 1 of group 1
			-- Depending on what scale option/index is current selected, set the appropriate new option/index to use
			if (value of radio button index1) is true then
				set indexToUse to index2
			else if (value of radio button index2) is true then
				set indexToUse to index1
			end if

			-- Click the radio button for the new scale option/index
			click radio button indexToUse
		end tell
	end tell

	-- If option/index 1 is selected a warning prompt is displayed, click the OK button to dismiss the prompt
	if indexToUse = 1 then
		click button "OK" of sheet 1
	end if
end tell

tell application "System Preferences"
	quit
end tell
