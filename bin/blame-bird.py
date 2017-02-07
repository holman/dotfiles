
#!/usr/bin/env python

""" This script tries to figure out the app responsible for
    a huge Library/Caches/com.apple.bird folder. """

import os
import sys
import uuid
import sqlite3
import os.path

def maybe_uuid(x):
    """ Tries to parse x as an UUID and return that, otherwise return None. """
    try:
        return uuid.UUID(x)
    except ValueError:
        return None

def main():
    cache_path = os.path.expanduser('~/Library/Caches/com.apple.bird/session/g')
    # if there is no cache we can exit right away
    if not (os.path.isdir(cache_path)):
        print("{}: does not exist at all".format(cache_path))
        return

    # Ignore files in the bird cache directory that do not appear to be UUIDs
    unaccounted_for = set(filter(bool, map(maybe_uuid, os.listdir(cache_path))))
    client_db = sqlite3.connect(os.path.expanduser(
                '~/Library/Application Support/CloudDocs/session/db/client.db'))
    c = client_db.cursor()

    zones = {}
    zonesize = {}
    zonefiles = {}
    zone_name2id = {}
    for rowid, name in c.execute('select rowid, zone_name from client_zones'):
        zones[rowid] = name
        zonesize[rowid] = 0
        zonefiles[rowid] = []
        zone_name2id[name] = rowid

    for raw_guid, zone_id in c.execute(
            'select item_id, zone_rowid from client_unapplied_table'):
        # Apparently, not every item_id is an UUID.
        if len(raw_guid) != 16:
            continue
        guid = uuid.UUID(bytes=raw_guid)
        if guid not in unaccounted_for:
            continue
        path = os.path.join(cache_path, str(guid).upper())
        if not os.path.exists(path):
            continue
        zonesize[zone_id] += os.stat(path).st_size
        zonefiles[zone_id].append(path)
        unaccounted_for.remove(guid)

    accounted_size = 0
    unaccounted_size = 0

    if len(sys.argv) > 1:
        if sys.argv[1] not in zone_name2id:
            print('{}: no such zone'.format(sys.argv[1]))
            return -1
        print '\n'.join(zonefiles[zone_name2id[sys.argv[1]]])
        return 0

    for zone_id, size in sorted(zonesize.items(), key=lambda x: x[1]):
        if size == 0:
            continue
        print('{:<45} {:>10.2f}MB {:>6}'.format(zones[zone_id],
                        zonesize[zone_id] / 1000000., len(zonefiles[zone_id])))
        accounted_size += zonesize[zone_id]

    for guid in unaccounted_for:
        path = os.path.join(cache_path, str(guid).upper())
        unaccounted_size += os.stat(path).st_size

    print('')
    print('Accounted for: {}MB.  Still unaccounted: {}MB'.format(
                accounted_size // 1000000, unaccounted_size // 1000000))



if __name__ == '__main__':
    sys.exit(main())
