import re

p = 'brag-output-2026-10-17-164801/index.template.html'
t = open(p, encoding='utf-8').read()
t = t.replace('duration: 2.8, ease: "sine.inOut", repeat: 2, yoyo: true }, 68.2', 'duration: 2.4, ease: "sine.inOut", repeat: 1, yoyo: true }, 68.2')
open(p, 'w', encoding='utf-8').write(t)
print("Overlap corrigido!")
