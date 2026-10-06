import re
p = 'C:/Users/akshay/Desktop/Trahdo Website/src/styles/base.css'
s = open(p, encoding='utf8').read()
a = s.index('/* -------------------------------------------------------------------- nav -- */')
b = s.index('/* ----------------------------------------------------------------- footer -- */')
s = s[:a] + s[b:]
a = s.index('/* ------------------------------------------------------------ session rail -- */')
s = s[:a].rstrip() + '\n'
open(p, 'w', encoding='utf8').write(s)

p = 'C:/Users/akshay/Desktop/Trahdo Website/src/styles/tokens.css'
s = open(p, encoding='utf8').read()
s = s.replace('  --r-lg: 16px;', '  --r-lg: 16px;\n  --r-xl: 20px; /* floating chrome: nav pill, dock, hero window */')
s = s.replace('--nav-h: 64px;\n  --rail-h: 44px;', '--nav-h: 72px;\n  --rail-h: 68px;')
open(p, 'w', encoding='utf8').write(s)

p = 'C:/Users/akshay/Desktop/Trahdo Website/src/index.css'
s = open(p, encoding='utf8').read()
s = s.replace('@import "./styles/base.css";', '@import "./styles/base.css";\n@import "./styles/chrome.css";')
open(p, 'w', encoding='utf8').write(s)
print('ok')
