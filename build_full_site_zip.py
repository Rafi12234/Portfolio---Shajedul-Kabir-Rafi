#!/usr/bin/env python3
"""Create a self-contained updated website ZIP from an existing checkout.

You already have the complete repo and binary image backups on disk. This
command copies it, applies every optimization without touching your checkout,
then bundles Astro code and the assets into a deployable project archive.

    python build_full_site_zip.py /path/to/Portfolio---Shajedul-Kabir-Rafi
"""
from __future__ import annotations
import argparse
from datetime import datetime, timezone
import os
from pathlib import Path
import shutil
import tempfile
from zipfile import ZIP_DEFLATED, ZipFile
from apply_optimizations import apply_changes

IGNORE = {'.git', 'node_modules', '.astro', 'dist', '.next', '.rafi-performance-backup',
          '__pycache__', '.DS_Store', '.venv', '.cache'}

def create(source: Path, destination: Path) -> tuple[Path, list[str]]:
    source = source.expanduser().resolve()
    destination = destination.expanduser().resolve()
    if not (source / 'src/pages/index.astro').is_file():
        raise ValueError('Please pass your existing GitHub repository directory.')
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='rafi-optimized-') as temp:
        project = Path(temp) / 'Rafi-Portfolio-Optimized'
        shutil.copytree(source, project, ignore=lambda _, names: [n for n in names if n in IGNORE])
        changes = apply_changes(project, dry_run=False)
        shutil.rmtree(project / '.rafi-performance-backup', ignore_errors=True)
        note = project / 'SCROLL_OPTIMIZATION_NOTES.md'
        note.write_text(
            '# Scroll performance optimization\n\n'
            'Updated with Sicko Soul-inspired gesture-priority animation controls.\n'
            'Images, CV PDF, Astro content, and existing section components preserved.\n'
            'The optimization controls live in `src/scripts/scroll-budget.ts` and '
            '`public/styles/scroll-performance.css`.\n\n'
            'Build and validate with `npm ci && npm run build`.\n'
            'This package has NOT been visually profiled on your actual device.\n', encoding='utf-8'
        )
        with ZipFile(destination, 'w', ZIP_DEFLATED, compresslevel=6, allowZip64=True) as z:
            for f in sorted(project.rglob('*')):
                if f.is_file() and not f.is_symlink():
                    z.write(f, f.relative_to(project.parent))
    return destination, changes


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('repository', type=Path)
    parser.add_argument('--output', type=Path, default=Path.cwd() / 'Rafi-Portfolio-Optimized-Complete.zip')
    args = parser.parse_args()
    target, changes = create(args.repository, args.output)
    print(f'Created {target} ({target.stat().st_size / 1048576:.2f} MiB).')
    print(f'Optimized {len(changes)} code files. Original repository was NOT modified.')
    print('No files were pushed to GitHub.')


if __name__ == '__main__':
    main()
