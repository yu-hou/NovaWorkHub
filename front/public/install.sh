#!/bin/sh
# NovaWorkHub Token Rank — macOS / Linux one-command installer.
set -eu

SERVER="https://nova-academy-8fk.pages.dev"
UPLOAD_URL="https://aqelzocuukilmfakzgdv.supabase.co/functions/v1/token-rank-upload"
INSTALL_TOKEN="${1:-${NWH_TOKEN_RANK_INSTALL_TOKEN:-}}"

if [ -z "$INSTALL_TOKEN" ]; then
  echo "缺少安装令牌。请先在 NovaWorkHub 的 Token Rank 页面生成接入命令。" >&2
  exit 1
fi

case "$INSTALL_TOKEN" in
  nwh_setup_*) ;;
  *) echo "安装令牌格式无效。" >&2; exit 1 ;;
esac

CONNECT="$(curl --fail --location --silent --show-error -X POST 'https://aqelzocuukilmfakzgdv.supabase.co/functions/v1/token-rank-connect' -H 'Content-Type: application/json' --data "{\"token\":\"$INSTALL_TOKEN\",\"label\":\"本机客户端\"}")"
DEVICE_KEY="$(printf '%s' "$CONNECT" | sed -n 's/.*"device_key":"\([^"]*\)".*/\1/p')"
if [ -z "$DEVICE_KEY" ]; then echo "关联 NovaWorkHub 账号失败。" >&2; exit 1; fi
echo "Token Rank setup complete"

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
echo "Cloud sync ok"
if [ "$(uname -s)" = "Darwin" ]; then
  PLIST="$HOME/Library/LaunchAgents/com.novaworkhub.token-rank.plist"
  mkdir -p "$HOME/Library/LaunchAgents"
  cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>Label</key><string>com.novaworkhub.token-rank</string><key>ProgramArguments</key><array><string>$SYNC</string></array><key>StartInterval</key><integer>1800</integer></dict></plist>
EOF
  launchctl bootstrap "gui/$(id -u)" "$PLIST" 2>/dev/null || true
  echo "Background sync installed"
elif command -v systemctl >/dev/null 2>&1; then
  UNIT_DIR="$HOME/.config/systemd/user"
  mkdir -p "$UNIT_DIR"
  cat > "$UNIT_DIR/novaworkhub-token-rank.service" <<EOF
[Unit]
Description=NovaWorkHub Token Rank sync
[Service]
Type=oneshot
ExecStart=$SYNC
EOF
  cat > "$UNIT_DIR/novaworkhub-token-rank.timer" <<EOF
[Unit]
Description=NovaWorkHub Token Rank sync timer
[Timer]
OnBootSec=3m
OnUnitActiveSec=30m
[Install]
WantedBy=timers.target
EOF
  systemctl --user daemon-reload && systemctl --user enable --now novaworkhub-token-rank.timer
  echo "Background sync installed"
fi
echo ""
echo "Done"
