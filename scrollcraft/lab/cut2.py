p = 'C:/Users/akshay/Desktop/Trahdo Website/src/styles/home.css'
s = open(p, encoding='utf8').read()
a = s.index('/* ================================================================== 1 hero == */')
b = s.index('/* ================================================================== 2 tabs == */')
s = s[:a] + s[b:]
open(p, 'w', encoding='utf8').write(s)

p = 'C:/Users/akshay/Desktop/Trahdo Website/src/index.css'
s = open(p, encoding='utf8').read()
s = s.replace('@import "./styles/home.css";', '@import "./styles/hero.css";\n@import "./styles/home.css";')
open(p, 'w', encoding='utf8').write(s)

# act retiming: the hero now runs 09:15 to 10:00
def sub(path, old, new):
    t = open(path, encoding='utf8').read()
    assert old in t, (path, old)
    open(path, 'w', encoding='utf8').write(t.replace(old, new, 1))

base = 'C:/Users/akshay/Desktop/Trahdo Website/src/components/home/'
sub(base + 'Tabs.tsx', 'data-t0="15"\n      data-t1="30"', 'data-t0="45"\n      data-t1="55"')
sub(base + 'Place.tsx', 'data-t0="30"\n      data-t1="30"', 'data-t0="55"\n      data-t1="55"')
sub(base + 'Research.tsx', 'data-t0="30"', 'data-t0="55"')
sub(base + 'Hero.tsx', '<a className="hero__announce" href="#products">', '<Link className="hero__announce" to="/#products">')
sub(base + 'Hero.tsx', '            <Arrow size={14} />\n          </a>\n          <h1', '            <Arrow size={14} />\n          </Link>\n          <h1')
print('ok')
