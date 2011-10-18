#!/usr/local/bin/python

import datetime
import argparse

today = datetime.date.today()
kReportingWindows = datetime.timedelta(days=7)

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

def getNext(birthdays):
  results = []
  for birthday in birthdays:
    if birthday.birthday - today < kReportingWindows:
      results.append(birthday)
  return results

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Find nearby birthdays.')
  parser.add_argument('birthdays', help='path to the list of birthdays')
  args = parser.parse_args()
  birthdays = load(args.birthdays)
  upcoming = getNext(birthdays)
  for b in upcoming:
    print b.name, 'has a birthday on', b.birthday.isoformat()
