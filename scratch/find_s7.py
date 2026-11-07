import sys
sys.stdout.reconfigure(encoding="utf-8")

with open("brag-output-2026-10-17-164801/index.template.html", "r", encoding="utf-8") as f:
    text = f.read()

pos = text.find('id="s7"')
if pos != -1:
    print(text[pos:pos+2500])
else:
    print("s7 not found")
