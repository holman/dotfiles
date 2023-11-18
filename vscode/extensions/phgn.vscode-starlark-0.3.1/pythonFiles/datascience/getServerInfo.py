# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

from notebook.notebookapp import list_running_servers
import json

server_list = list_running_servers()

server_info_list = []

for si in server_list:
    server_info_object = {}
    server_info_object["base_url"] = si['base_url']
    server_info_object["notebook_dir"] = si['notebook_dir']
    server_info_object["hostname"] = si['hostname']
    server_info_object["password"] = si['password']
    server_info_object["pid"] = si['pid']
    server_info_object["port"] = si['port']
    server_info_object["secure"] = si['secure']
    server_info_object["token"] = si['token']
    server_info_object["url"] = si['url']
    server_info_list.append(server_info_object)

print(json.dumps(server_info_list))
