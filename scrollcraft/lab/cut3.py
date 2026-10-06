import re
p = 'C:/Users/akshay/Desktop/Trahdo Website/src/styles/home.css'
s = open(p, encoding='utf8').read()
# drop the old close block and its marker comment
s = re.sub(r'/\* =+ 7 close == \*/', '', s)
n = 0
while True:
    m = re.search(r'\n\s*\.close[^{}]*\{[^{}]*\}', s)
    if not m:
        break
    s = s[:m.start()] + s[m.end():]
    n += 1
open(p, 'w', encoding='utf8').write(s)
p2 = 'C:/Users/akshay/Desktop/Trahdo Website/src/index.css'
t = open(p2, encoding='utf8').read()
t = t.replace('@import "./styles/home.css";', '@import "./styles/home.css";\n@import "./styles/close.css";')
open(p2, 'w', encoding='utf8').write(t)
print('removed rules:', n)
