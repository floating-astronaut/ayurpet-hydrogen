#!/usr/bin/env python3
"""Sync the AyurPet CRO checklist Google Sheet from this repo.

Two modes:
    list                    — print all tabs + their tasks (with row numbers)
    mark <tab> <row> <progress>   — mark a row as Done by setting:
                                       ✅ column → TRUE
                                       PROGRESS column → <progress>
                                                           (default "Done")
                                    Row is the 1-based row number from `list`.

Requires:
    - Service account at /home/support/glitch-grow-public/credentials/google-sa.json
    - That SA email shared on the sheet with Editor permission for `mark`

Examples:
    python3 scripts/cro_sheet.py list
    python3 scripts/cro_sheet.py list "📦 Product Page"
    python3 scripts/cro_sheet.py mark "📦 Product Page" 60 Done
    python3 scripts/cro_sheet.py mark "🌐 Home Page" 7 "In progress"
"""
from __future__ import annotations
import sys, argparse
from typing import Optional
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SHEET_ID = '1nH4Y2EUXDKcnlgFTHWE5Dpe2k7wxEz44sWxh_8fpGt0'
SA_PATH = '/home/support/glitch-grow-public/credentials/google-sa.json'
WRITE_SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# Column letters in the AyurPet sheets (verified by dumping raw values):
#   A: (empty)         B: section/group   C: TASK description
#   D: Example link    E: ✅ (checkbox)   F: PROGRESS
#   G: (empty)         H: Difficulty      I: Impact
#   J: Priority        K: Evaluation      L: Notes
SECTION_COL = 'B'
TASK_COL = 'C'
DONE_COL = 'E'
PROGRESS_COL = 'F'


def svc():
    creds = service_account.Credentials.from_service_account_file(
        SA_PATH, scopes=WRITE_SCOPES,
    )
    return build('sheets', 'v4', credentials=creds, cache_discovery=False)


def get_meta(s):
    return s.spreadsheets().get(spreadsheetId=SHEET_ID).execute()


def cmd_list(tab: Optional[str]) -> int:
    s = svc()
    meta = get_meta(s)
    tabs = [sh['properties']['title'] for sh in meta.get('sheets', [])]
    if tab and tab not in tabs:
        print(f"unknown tab: {tab!r}\navailable tabs:\n  - " + "\n  - ".join(tabs), file=sys.stderr)
        return 1
    target_tabs = [tab] if tab else tabs
    batch = s.spreadsheets().values().batchGet(
        spreadsheetId=SHEET_ID, ranges=target_tabs,
    ).execute()
    for t, vr in zip(target_tabs, batch.get('valueRanges', [])):
        rows = vr.get('values', [])
        print(f"\n## {t}  ({len(rows)} rows)")
        for i, row in enumerate(rows, start=1):
            cells = [str(c).strip() for c in row]
            # Pad so we can index safely: A B C D E F ...
            while len(cells) < 6:
                cells.append('')
            section, task, _example, done, progress = cells[1], cells[2], cells[3], cells[4], cells[5]
            checked = done.upper() == 'TRUE'
            mark = '✓' if checked else ' '
            label = (section + ' · ' if section else '') + task
            print(f"  [{mark}] row {i:>3} | {progress:<13} | {label[:96]}")
    return 0


def cmd_mark(tab: str, row: int, progress: str) -> int:
    s = svc()
    try:
        # Range like: '📦 Product Page'!C60
        done_rng = f"'{tab}'!{DONE_COL}{row}"
        prog_rng = f"'{tab}'!{PROGRESS_COL}{row}"
        body = {
            'valueInputOption': 'USER_ENTERED',
            'data': [
                {'range': done_rng, 'values': [['TRUE']]},
                {'range': prog_rng, 'values': [[progress]]},
            ],
        }
        s.spreadsheets().values().batchUpdate(
            spreadsheetId=SHEET_ID, body=body,
        ).execute()
        print(f"✓ marked '{tab}' row {row} → {DONE_COL}=TRUE, {PROGRESS_COL}={progress!r}")
        return 0
    except HttpError as e:
        reason = ''
        try:
            reason = e._get_reason()  # type: ignore[attr-defined]
        except Exception:  # pragma: no cover
            reason = str(e)
        print(f"ERROR marking row: {reason}", file=sys.stderr)
        if 'permission' in reason.lower() or '403' in reason:
            print(
                'Share the sheet with this Editor email:\n'
                '  glitch-vertex-ai@capable-boulder-487806-j0.iam.gserviceaccount.com',
                file=sys.stderr,
            )
        return 1


def parse_audit(path: str) -> list[tuple[str, int, str]]:
    """Pull (tab, row, status) tuples from the CRO_AUDIT.md tables.

    The audit file uses GFM tables with the columns "Row | Status | …".
    Sections are delimited by `## <emoji> <Tab Name>` headers that match
    the sheet's tab names exactly. We collect rows that have an
    actionable status: Done, In progress, N/A. "To do" rows are skipped
    (they're the sheet default, no write needed).
    """
    actionable = {'Done', 'In progress', 'N/A'}
    out: list[tuple[str, int, str]] = []
    current_tab: Optional[str] = None
    in_table = False
    with open(path, encoding='utf-8') as f:
        for raw in f:
            line = raw.rstrip('\n')
            if line.startswith('## '):
                # Tab header — strip the "## " prefix only; emoji + name match the sheet
                current_tab = line[3:].strip()
                in_table = False
                continue
            if not current_tab:
                continue
            if line.startswith('Row |'):
                in_table = True
                continue
            if in_table and line.startswith('--- '):
                continue
            if in_table and line.strip() == '':
                in_table = False
                continue
            if not in_table:
                continue
            # Expect: "<row> | <status> | <note>"
            parts = [p.strip() for p in line.split('|', 2)]
            if len(parts) < 2:
                continue
            try:
                row = int(parts[0])
            except ValueError:
                continue
            status = parts[1]
            if status not in actionable:
                continue
            out.append((current_tab, row, status))
    return out


def cmd_sync(audit_path: str, dry_run: bool) -> int:
    items = parse_audit(audit_path)
    if not items:
        print(f"no actionable rows found in {audit_path}", file=sys.stderr)
        return 1
    print(f"parsed {len(items)} items from {audit_path}")
    if dry_run:
        for tab, row, status in items:
            print(f"  would mark '{tab}' row {row} → {status}")
        return 0
    s = svc()
    data = []
    for tab, row, status in items:
        # ✅ column is FALSE for "In progress" but TRUE for Done. N/A also goes
        # to TRUE since the row is no longer "to do".
        done = 'TRUE' if status in ('Done', 'N/A') else 'FALSE'
        data.append({'range': f"'{tab}'!{DONE_COL}{row}", 'values': [[done]]})
        data.append({'range': f"'{tab}'!{PROGRESS_COL}{row}", 'values': [[status]]})
    body = {'valueInputOption': 'USER_ENTERED', 'data': data}
    try:
        resp = s.spreadsheets().values().batchUpdate(spreadsheetId=SHEET_ID, body=body).execute()
        print(f"✓ updated {resp.get('totalUpdatedCells', 0)} cells across {resp.get('totalUpdatedRows', 0)} ranges")
        return 0
    except HttpError as e:
        try:
            reason = e._get_reason()  # type: ignore[attr-defined]
        except Exception:  # pragma: no cover
            reason = str(e)
        print(f"ERROR syncing audit: {reason}", file=sys.stderr)
        return 1


def main(argv: list[str]) -> int:
    p = argparse.ArgumentParser(prog='cro_sheet')
    sub = p.add_subparsers(dest='cmd', required=True)
    pl = sub.add_parser('list')
    pl.add_argument('tab', nargs='?', default=None)
    pm = sub.add_parser('mark')
    pm.add_argument('tab')
    pm.add_argument('row', type=int)
    pm.add_argument('progress', nargs='?', default='Done')
    ps = sub.add_parser('sync', help='Push docs/CRO_AUDIT.md statuses to the sheet')
    ps.add_argument('--audit', default='docs/CRO_AUDIT.md')
    ps.add_argument('--dry-run', action='store_true')
    args = p.parse_args(argv)
    if args.cmd == 'list':
        return cmd_list(args.tab)
    if args.cmd == 'mark':
        return cmd_mark(args.tab, args.row, args.progress)
    if args.cmd == 'sync':
        return cmd_sync(args.audit, args.dry_run)
    p.print_help()
    return 2


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
