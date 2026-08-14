#!/bin/sh
# NovaWorkHub Token Rank — macOS / Linux one-command installer.
set -eu

SERVER="https://nova-academy-8fk.pages.dev"
UPLOAD_URL="https://aqelzocuukilmfakzgdv.supabase.co/functions/v1/token-rank-upload"
DEVICE_KEY="${1:-${NWH_TOKEN_RANK_DEVICE_KEY:-}}"

if [ -z "$DEVICE_KEY" ]; then
  echo "缺少设备密钥。请先在 NovaWorkHub 的 Token Rank 页面生成接入命令。" >&2
  exit 1
fi

case "$DEVICE_KEY" in
  nwh_tr_*) ;;
  *) echo "设备密钥格式无效。" >&2; exit 1 ;;
esac

OS="$(uname -s)"
ARCH="$(uname -m)"
case "$OS/$ARCH" in
  Darwin/arm64|Darwin/x86_64) ASSET="novatoken" ;;
  Linux/x86_64|Linux/amd64) ASSET="novatoken-linux-amd64" ;;
  Linux/aarch64|Linux/arm64) ASSET="novatoken-linux-arm64" ;;
  *) echo "暂不支持 $OS/$ARCH。请在网页下载对应版本。" >&2; exit 1 ;;
esac

BIN_DIR="$HOME/.local/bin"
BIN="$BIN_DIR/novatoken"
CONFIG_DIR="$HOME/.config/novaworkhub"
SYNC="$BIN_DIR/novaworkhub-sync"
TMP="${TMPDIR:-/tmp}/novatoken-$$"
cleanup() { rm -f "$TMP"; }
trap cleanup EXIT HUP INT TERM

mkdir -p "$BIN_DIR"
echo "▸ 下载 NovaToken…"
curl --fail --location --silent --show-error --retry 2 "$SERVER/dl/$ASSET" -o "$TMP"

EXPECTED="$(curl --fail --location --silent --show-error "$SERVER/dl/$ASSET.sha256" | awk 'NR == 1 { print $1 }')"
if command -v shasum >/dev/null 2>&1; then
  ACTUAL="$(shasum -a 256 "$TMP" | awk '{ print $1 }')"
elif command -v sha256sum >/dev/null 2>&1; then
  ACTUAL="$(sha256sum "$TMP" | awk '{ print $1 }')"
else
  echo "未找到 SHA-256 校验工具，已停止安装。" >&2
  exit 1
fi
if [ -z "$EXPECTED" ] || [ "$EXPECTED" != "$ACTUAL" ]; then
  echo "下载校验失败，已停止安装。" >&2
  exit 1
fi

chmod 700 "$TMP"
mv "$TMP" "$BIN"
trap - EXIT HUP INT TERM
mkdir -p "$CONFIG_DIR"
(umask 077; printf '%s\n' "$DEVICE_KEY" > "$CONFIG_DIR/token-rank-device-key")
cat > "$SYNC" <<EOF
#!/bin/sh
set -eu
"$BIN" preview --json | curl --fail-with-body --silent --show-error -X POST "$UPLOAD_URL" \\
  -H 'Content-Type: application/json' \\
  -H "X-Token-Rank-Device-Key: \$(cat "$CONFIG_DIR/token-rank-device-key")" \\
  --data-binary @-
EOF
chmod 700 "$SYNC"
echo "▸ 已安装，正在扫描并上传汇总用量…"
"$SYNC"
echo ""
echo "✓ 接入完成。以后需要更新时，运行：$SYNC"
