#!/usr/bin/env python3
"""Safely integrate SkillAtlas into the existing Astro homepage, without overwriting edits."""
from pathlib import Path
import argparse

parser=argparse.ArgumentParser(description='Integrate Section 03 / The Toolkit into src/pages/index.astro')
parser.add_argument('--dry-run',action='store_true',help='Print planned insertions without writing')
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
page=root/'src/pages/index.astro'
if not page.exists():
    raise SystemExit(f'Could not find {page}. Extract this ZIP into your existing Astro project root.')
text=page.read_text(encoding='utf-8')
steps=[
('import SkillAtlas from "../components/SkillAtlas.astro";',
 'import WhatIBuild from "../components/WhatIBuild.astro";',
 'import WhatIBuild from "../components/WhatIBuild.astro";\nimport SkillAtlas from "../components/SkillAtlas.astro";'),
('<link rel="stylesheet" href="./styles/skill-atlas.css" />',
 '<link rel="stylesheet" href="./styles/what-i-build.css" />',
 '<link rel="stylesheet" href="./styles/what-i-build.css" />\n    <link rel="stylesheet" href="./styles/skill-atlas.css" />'),
("import '../scripts/skill-atlas.ts';",
 "import '../scripts/what-i-build.ts';",
 "import '../scripts/what-i-build.ts';\n      import '../scripts/skill-atlas.ts';"),
('<SkillAtlas />', '<WhatIBuild />', '<WhatIBuild />\n        <SkillAtlas />')
]
changed=[]
for target,original,replacement in steps:
    if target in text:
        continue
    if text.count(original)!=1:
        raise SystemExit(f'Integration stopped without writing. Expected one occurrence of: {original}')
    text=text.replace(original,replacement,1)
    changed.append(target)
if not changed:
    print('Already integrated. No changes needed.')
elif args.dry_run:
    print(f'Would add {len(changed)} homepage integration points:')
    print('\n'.join('  + '+x for x in changed))
else:
    page.write_text(text,encoding='utf-8')
    print(f'Integrated {len(changed)} additions in {page.relative_to(root)}; existing content preserved.')
    print('Run npm run dev to inspect Section 03 after What I Build.')
