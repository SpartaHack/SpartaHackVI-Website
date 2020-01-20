import os, sys, json


# for i in range(1, len(sys.argv)):
#     src = json.load(open(sys.argv[i]))

#     out = {}
#     for item in src:
#         out[item['name'] if type(item) == dict else item[1]] = item

#     with open(sys.argv[i][0:-5]+'-dict.json', 'w') as dest:
#         json.dump(out, dest)

start = json.load(open('majors.json'))
out1 = []
out2 = {}

for src in start:
    for i in range(1,3):
        src[i] = src[i][0] + src[i][1:].lower()

    out1.append(src[1])
    out2[src[1]] = src

json.dump(out1, open('majors-set.json', 'w'))
json.dump(out2, open('majors-dict.json', 'w'))