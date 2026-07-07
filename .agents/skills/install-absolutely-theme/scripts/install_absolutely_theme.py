#!/usr/bin/env python3
"""Install Absolutely Theme into a VS Code-compatible editor."""

from __future__ import annotations

import argparse
import os
import platform
import shlex
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

REPOSITORY = "zixuandai0217/Absolutely"
DEFAULT_VERSION = "v0.1.2"
EXTENSION_ID = "zixuandai0217.absolutely-theme"

EDITOR_CANDIDATES = {
    "codebuddy": [
        "/Applications/CodeBuddy.app/Contents/Resources/app/bin/code",
        "codebuddy",
    ],
    "vscode": [
        "code",
        "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code",
    ],
    "cursor": [
        "cursor",
        "/Applications/Cursor.app/Contents/Resources/app/bin/cursor",
    ],
    "windsurf": [
        "windsurf",
        "/Applications/Windsurf.app/Contents/Resources/app/bin/windsurf",
    ],
    "vscodium": [
        "codium",
        "/Applications/VSCodium.app/Contents/Resources/app/bin/codium",
    ],
}


def parse_args() -> argparse.Namespace:
    """Parse installer command-line options."""
    parser = argparse.ArgumentParser(description="Install the Absolutely Theme VSIX.")
    parser.add_argument(
        "--editor",
        choices=["auto", *EDITOR_CANDIDATES.keys()],
        default="auto",
        help="Target VS Code-compatible editor.",
    )
    parser.add_argument("--editor-cli", help="Explicit editor CLI path.")
    parser.add_argument("--version", default=DEFAULT_VERSION, help="Release tag, for example v0.1.2.")
    parser.add_argument("--vsix", help="Install a local VSIX instead of downloading from GitHub.")
    parser.add_argument("--extensions-dir", help="Optional temporary extensions directory.")
    parser.add_argument("--user-data-dir", help="Optional temporary user-data directory.")
    parser.add_argument("--dry-run", action="store_true", help="Print commands without installing.")
    return parser.parse_args()


def asset_name(version: str) -> str:
    """Return the VSIX asset name for a release tag."""
    normalized = version.removeprefix("v")
    return f"absolutely-theme-{normalized}.vsix"


def asset_url(version: str) -> str:
    """Return the GitHub Release download URL for a release tag."""
    return f"https://github.com/{REPOSITORY}/releases/download/{version}/{asset_name(version)}"


def resolve_cli(editor: str, explicit_cli: str | None) -> str | None:
    """Resolve an editor CLI from an explicit path or known editor candidates."""
    if explicit_cli:
        return explicit_cli if Path(explicit_cli).exists() or shutil.which(explicit_cli) else None

    candidate_groups = EDITOR_CANDIDATES.values() if editor == "auto" else [EDITOR_CANDIDATES[editor]]
    for candidates in candidate_groups:
        for candidate in candidates:
            resolved = shutil.which(candidate) if os.sep not in candidate else candidate
            if resolved and Path(resolved).exists():
                return resolved
    return None


def download_vsix(version: str) -> Path:
    """Download the release VSIX into a temporary directory."""
    destination = Path(tempfile.mkdtemp(prefix="absolutely-theme-")) / asset_name(version)
    request = urllib.request.Request(asset_url(version), headers={"User-Agent": "absolutely-theme-installer"})
    with urllib.request.urlopen(request, timeout=60) as response:
        destination.write_bytes(response.read())
    return destination


def common_editor_args(args: argparse.Namespace) -> list[str]:
    """Build optional editor CLI arguments for isolated installs."""
    common_args: list[str] = []
    if args.extensions_dir:
        common_args.extend(["--extensions-dir", args.extensions_dir])
    if args.user_data_dir:
        common_args.extend(["--user-data-dir", args.user_data_dir])
    return common_args


def run_command(command: list[str], dry_run: bool) -> subprocess.CompletedProcess[str]:
    """Run or print a command and return its process result."""
    print(shlex.join(command))
    if dry_run:
        return subprocess.CompletedProcess(command, 0, "", "")
    return subprocess.run(command, check=False, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)


def main() -> int:
    """Install the VSIX and verify the extension appears in the editor."""
    args = parse_args()
    cli = resolve_cli(args.editor, args.editor_cli)
    if not cli:
        print(f"Could not find a CLI for editor '{args.editor}'.", file=sys.stderr)
        print("Pass --editor-cli with the editor's bin path.", file=sys.stderr)
        return 2

    vsix_path = Path(args.vsix).expanduser().resolve() if args.vsix else download_vsix(args.version)
    if not vsix_path.exists():
        print(f"VSIX not found: {vsix_path}", file=sys.stderr)
        return 2

    common_args = common_editor_args(args)
    install_command = [cli, *common_args, "--install-extension", str(vsix_path)]
    install_result = run_command(install_command, args.dry_run)
    if install_result.stdout:
        print(install_result.stdout, end="")
    if install_result.returncode != 0:
        return install_result.returncode

    list_command = [cli, *common_args, "--list-extensions", "--show-versions"]
    list_result = run_command(list_command, args.dry_run)
    if list_result.stdout:
        print(list_result.stdout, end="")
    if list_result.returncode != 0:
        return list_result.returncode

    if args.dry_run:
        return 0

    expected_prefix = f"{EXTENSION_ID}@"
    installed = any(line.strip().startswith(expected_prefix) for line in list_result.stdout.splitlines())
    if not installed:
        print(f"Installed extension was not found in {platform.system()} editor output.", file=sys.stderr)
        return 3

    print(f"Verified {expected_prefix} is installed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
