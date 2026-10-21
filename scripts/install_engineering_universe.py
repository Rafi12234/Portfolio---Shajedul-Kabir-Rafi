#!/usr/bin/env python3
"""Replace What I Build + Skills Atlas with one Engineering Universe section.

Run from the Astro project root: python scripts/install_engineering_universe.py
Safe, repeatable and intentionally limited to src/pages/index.astro.
"""
from pathlib import Path
import re
import sys

ROOT = Path.cwd()
INDEX = ROOT / "src" / "pages" / "index.astro"
COMPONENT = ROOT / "src" / "components" / "EngineeringUniverse.astro"
DATA = ROOT / "src" / "data" / "skillAtlas.ts"
SCRIPT = ROOT / "src" / "scripts" / "engineering-universe.ts"
CSS = ROOT / "public" / "styles" / "engineering-universe.css"
for p in (INDEX, COMPONENT, DATA, SCRIPT, CSS):
    if not p.exists():
        sys.exit(f"Missing {p.relative_to(ROOT)}. Extract the entire ZIP into your project root first.")

src = INDEX.read_text(encoding="utf-8")
if '<EngineeringUniverse />' in src:
    print("Engineering Universe is already integrated — nothing was changed.")
    sys.exit(0)

required = ["<WhatIBuild />", "<SkillAtlas />", "<SelectedProjects />", "<head>"]
missing = [token for token in required if token not in src]
if missing:
    sys.exit("Cannot safely integrate: expected homepage markers are missing: " + ", ".join(missing) + "\nPlease review README_INSTALL.md for manual integration.")

modified = src
# Remove the old section imports without deleting their source files.
for name in ("WhatIBuild", "SkillAtlas"):
    modified, _ = re.subn(rf'^import\s+{name}\s+from\s+[\'\"][^\'\"]+[\'\"];?\s*\n', "", modified, flags=re.M)

# Put the replacement immediately after Beyond the Title; preserve the rest of page.
modified, n = re.subn(r'^(\s*)<WhatIBuild\s*/>\s*<SkillAtlas\s*/>\s*',
                      r'\1<EngineeringUniverse />\n\1', modified, count=1, flags=re.M)
if n != 1:
    sys.exit("The two existing section tags aren't adjacent. Nothing changed. Place <EngineeringUniverse /> after <BeyondTitle /> manually and remove the old two tags.")

component_import = 'import EngineeringUniverse from "../components/EngineeringUniverse.astro";\n'
modified = modified.replace('---\n', '---\n' + component_import, 1)

# Keep only one stylesheet for the new skills section.
modified = re.sub(r'^\s*<link[^>]+href=["\']\./styles/(?:what-i-build|skill-atlas)\.css["\'][^>]*>\s*\n', '\n', modified, flags=re.M)
styles_tag = '    <link rel="stylesheet" href="./styles/engineering-universe.css" />\n'
modified = modified.replace('</head>', styles_tag + '  </head>')

# Remove the old per-section animation modules. Shared GSAP/Lenis is retained.
modified = re.sub(r'^\s*import\s+["\']\.\./scripts/(?:what-i-build|skill-atlas)\.ts["\'];?\s*\n', '\n', modified, flags=re.M)
if "import '../scripts/motion.ts';" in modified:
    modified = modified.replace("import '../scripts/motion.ts';", "import '../scripts/motion.ts';\n      import '../scripts/engineering-universe.ts';", 1)
elif 'import "../scripts/motion.ts";' in modified:
    modified = modified.replace('import "../scripts/motion.ts";', 'import "../scripts/motion.ts";\n      import "../scripts/engineering-universe.ts";', 1)
else:
    sys.exit("Cannot find the existing shared motion import. Nothing changed; please integrate the new module manually.")

modified = modified.replace('href="#what-i-build"', 'href="#engineering-universe"')
modified = modified.replace('href="#skills"', 'href="#engineering-universe"')

# Validate before touching the original.
assert modified.count('<EngineeringUniverse />') == 1
assert modified.count('engineering-universe.css') == 1
assert modified.count('engineering-universe.ts') == 1
assert '<SelectedProjects />' in modified
assert 'what-i-build.ts' not in modified and 'skill-atlas.ts' not in modified
assert '<WhatIBuild />' not in modified and '<SkillAtlas />' not in modified
backup = INDEX.with_suffix('.astro.before-engineering-universe.bak')
if not backup.exists():
    backup.write_text(src, encoding='utf-8')
INDEX.write_text(modified, encoding='utf-8')
print('Integrated Engineering Universe into src/pages/index.astro.')
print('Replaced What I Build + Skills Atlas, preserving Hero, Beyond Title, Projects and shared Lenis/GSAP.')
print('Backup:', backup.relative_to(ROOT))
print('Run npm run dev, then npm run build to validate your environment.')
