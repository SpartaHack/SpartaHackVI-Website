import os, sys, json


for i in range(1, len(sys.argv)):
    src = json.load(open(sys.argv[i]))

    out = {}
    for item in src:
        out[item['name'] if type(item) == dict else item[1]] = item

    with open(sys.argv[i][0:-5]+'-dict.json', 'w') as dest:
        json.dump(out, dest)