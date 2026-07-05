#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-zixuandai0217/MySkills}"
BRANCH="${BRANCH:-main}"
TARBALL_URL="${TARBALL_URL:-https://github.com/${REPO}/archive/refs/heads/${BRANCH}.tar.gz}"

TARGET_DIR="${1:-.}"
TARGET_DIR="$(cd "$TARGET_DIR" && pwd)"
TMP_DIR="$(mktemp -d)"

cleanup() { rm -rf "$TMP_DIR"; }
trap cleanup EXIT

echo "=== MySkills 安装脚本 (tarball 模式) ==="
echo "目标目录: ${TARGET_DIR}"
echo ""

echo "[1/2] 下载仓库归档 ..."
if command -v curl &>/dev/null; then
  curl -fsSL --retry 3 --retry-delay 3 "$TARBALL_URL" -o "${TMP_DIR}/repo.tar.gz"
elif command -v wget &>/dev/null; then
  wget -qO "${TMP_DIR}/repo.tar.gz" "$TARBALL_URL"
else
  echo "错误: 需要 curl 或 wget" >&2
  exit 1
fi
echo "  完成 ($(du -h "${TMP_DIR}/repo.tar.gz" | cut -f1) 已下载)"

echo "[2/2] 解压并安装文件 ..."
tar -xzf "${TMP_DIR}/repo.tar.gz" -C "$TMP_DIR"

EXTRACTED_DIR="${TMP_DIR}/MySkills-${BRANCH}"
if [ ! -d "$EXTRACTED_DIR" ]; then
  EXTRACTED_DIR="$(find "$TMP_DIR" -maxdepth 1 -type d ! -path "$TMP_DIR" | head -1)"
fi

cp -f "${EXTRACTED_DIR}/AGENTS.md" "${TARGET_DIR}/AGENTS.md"
echo "  已安装: AGENTS.md"

rm -rf "${TARGET_DIR}/.agents"
cp -R "${EXTRACTED_DIR}/.agents" "${TARGET_DIR}/.agents"

SKILL_COUNT="$(ls "${TARGET_DIR}/.agents/skills/" | wc -l | tr -d ' ')"
echo "  已安装: .agents/skills/ (${SKILL_COUNT} 个技能包)"

if [ -d "${EXTRACTED_DIR}/.claude/skills" ]; then
  mkdir -p "${TARGET_DIR}/.claude"
  rm -rf "${TARGET_DIR}/.claude/skills"
  cp -R "${EXTRACTED_DIR}/.claude/skills" "${TARGET_DIR}/.claude/skills"

  CLAUDE_SKILL_COUNT="$(ls "${TARGET_DIR}/.claude/skills/" | wc -l | tr -d ' ')"
  echo "  已安装: .claude/skills/ (${CLAUDE_SKILL_COUNT} 个技能包)"
fi

echo ""
echo "=== 安装完成! ==="
echo "文件已下载到: ${TARGET_DIR}"
echo ""
echo "已安装的技能包:"
ls "${TARGET_DIR}/.agents/skills/" | sed 's/^/  - /'
if [ -d "${TARGET_DIR}/.claude/skills" ]; then
  echo ""
  echo "已安装的 Claude 技能包:"
  ls "${TARGET_DIR}/.claude/skills/" | sed 's/^/  - /'
fi
