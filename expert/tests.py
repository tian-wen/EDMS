from django.test import TestCase
import operator
import json
# import requests
#
# url = "http://127.0.0.1:8983/solr/test/select?q=name:张晓华&wt=json&rows=1000"
# r = requests.get(url)
#
# for expert in r.json()['response']['docs']:
#     print(expert['id'])
#
# print(r.json()['response']['docs'])
# compare(property){
#     return function(a, b) {
#         var value1 = a[property];
#         var value2 = b[property];
#         return value1 - value2;
#     }
# }


data = [{"name":"Bob", "age":18}, {"name":"Alice", "age":20},{"name":"Jhon", "age":19}]
print(type(data))
js = json.dumps(data)
print(js)
print(type(js))

data1 = json.loads(js)
data1.sort(key = lambda x:x["age"], reverse=True)
print(data1)