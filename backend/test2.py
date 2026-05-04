import requests
import json

code='''#include <stdio.h>
int main() {
  char ch = 'A';
  if((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z'))
  {
  if(ch=='a'||ch=='e'||ch=='i'||ch=='o'||ch=='u'||
  ch=='A'||ch=='E'||ch=='I'||ch=='O'||ch=='U')
  printf("Vowel\\n");
  else
  printf("Consonant\\n");
  } else if(ch >= '0' && ch <= '9') {
  printf("Digit\\n");
  } else {
  printf("Special Character\\n");
  }
  return 0;
}'''

try:
    res = requests.post('http://127.0.0.1:8000/compile', json={'code': code})
    print(json.dumps(res.json().get('ast', {}), indent=2))
except Exception as e:
    print(e)
