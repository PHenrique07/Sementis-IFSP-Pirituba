import re

with open('brag-output/composition/index.html', 'r', encoding='utf-8') as f:
    orig = f.read()

sections = re.findall(r'<section[^>]*>.*?</section>', orig, re.DOTALL)
for s in sections:
    sid = re.search(r'id="([^"]+)"', s)
    title = re.search(r'<h[12][^>]*>(.*?)</h[12]>', s)
    print(sid.group(1) if sid else 'no-id', '-->', title.group(1) if title else '')
