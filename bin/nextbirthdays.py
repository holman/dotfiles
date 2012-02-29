#!/usr/local/bin/python

import datetime
import argparse

today = datetime.date.today()
kReportingWindowsDays = 4
kReportingWindowsTimeDelta = datetime.timedelta(days=kReportingWindowsDays)
newThreadTF2 = 'http://bit.ly/qVz0Cl'
newThreadHL2 = 'http://bit.ly/pOwSba'
newThreadSuggestionThreshold = 1

class Birthday:
  def __init__(self, name, month, date):
    self.name = name
    self.birthday = datetime.date(today.year, int(month), int(date))
    while self.birthday < today:
      self.birthday = self.birthday.replace(year=today.year + 1)

def load(filepath):
  f = open(filepath, 'r')
  results = []
  for line in f.readlines():
    d = line.split(';')
    b = Birthday(d[0], month = d[1], date = d[2])
    results.append(b)
  return results

def isPlural(number):
  return number != 1

def getNext(birthdays):
  results = []
  for birthday in birthdays:
    if birthday.birthday - today < kReportingWindowsTimeDelta:
      results.append(birthday)
  return results

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Find nearby birthdays.')
  parser.add_argument('birthdays', help='path to the list of birthdays')
  args = parser.parse_args()
  birthdays = load(args.birthdays)
  upcoming = getNext(birthdays)
  suggestNewThread = False
  print "Birthdays:"
  for b in upcoming:
    daysDiff = (b.birthday - today).days
    if daysDiff <= newThreadSuggestionThreshold:
      suggestNewThread = True
	if isPlural(daysDiff):
		daysPluralized = 'days'
	else:
		daysPluralized = 'day'
    if daysDiff > 0:
      daysCountdownText = 'in ' + str(daysDiff) + ' ' + daysPluralized
    else:
      daysCountdownText = 'today!'

    print b.name, 'has a birthday', daysCountdownText 
  if suggestNewThread:
    print 'TF2?', newThreadTF2
    print 'HL2?', newThreadHL2
  if len(upcoming) == 0:
	print 'No birthdays in the next %i' % kReportingWindowsDays,
	if isPlural(kReportingWindowsDays):
		print 'days'
	else:
		print 'day'

