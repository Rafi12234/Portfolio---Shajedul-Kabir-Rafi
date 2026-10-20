#!/usr/bin/env python3
"""Add Section 04 to the existing site without replacing user's local modifications.
Safe to re-run. Assumes Section 03 / SkillAtlas already integrated.
"""
from pathlib import Path
import argparse
p=argparse.ArgumentParser()
p.add_argument('--dry-run',action='store_true')
a=p.parse_args()
root=Path(__file__).resolve().parents[1]
file=root/'src/pages/index.astro'
if not file.is_file(): raise SystemExit('Missing src/pages/index.astro — extract this ZIP into the project root.')
s=file.read_text(encoding='utf-8')
changes=[
('import SelectedProjects from "../components/SelectedProjects.astro";',
 'import WhatIBuild from "../components/WhatIBuild.astro";',
 'import WhatIBuild from "../components/WhatIBuild.astro";\nimport SelectedProjects from "../components/SelectedProjects.astro";'),
('<link rel="stylesheet" href="./styles/selected-projects.css" />',
 '<link rel="stylesheet" href="./styles/what-i-build.css" />',
 '<link rel="stylesheet" href="./styles/what-i-build.css" />\n    <link rel="stylesheet" href="./styles/selected-projects.css" />'),
("import '../scripts/selected-projects.ts';", "import '../scripts/what-i-build.ts';", "import '../scripts/what-i-build.ts';\n      import '../scripts/selected-projects.ts';"),
('<SelectedProjects />','<SkillAtlas />','<SkillAtlas />\n        <SelectedProjects />')]
planned=[]
for target,anchor,replacement in changes:
    if target in s:continue
    if s.count(anchor)!=1:raise SystemExit(f'Cannot safely patch homepage: expected exactly one {anchor!r}. Nothing written.')
    s=s.replace(anchor,replacement,1)
    planned.append(target)
# Navigation should point to local selected work, not the external GitHub profile.
# Change only existing nav labels, leaving links in project cards and Hero CTA untouched.
import re
s,n=re.subn(r'(<a href=")https://github.com/Rafi12234("[^>]*>SELECTED WORK)',r'\g<1>#selected-work\2',s)
if n:planned.append(f'{n} primary navigation links to #selected-work')
if not planned:print('Section 04 already integrated — no changes needed.')
elif a.dry_run:print('Would update homepage:', *planned,sep='\n  + ')
else:
    file.write_text(s,encoding='utf-8')
    print('Integrated Section 04 while preserving existing source:',*planned,sep='\n  + ')
    print('Open http://localhost:4321/#selected-work after npm run dev')
