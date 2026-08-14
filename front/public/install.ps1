$ErrorActionPreference = "Stop"
$Server = "https://nova-academy-8fk.pages.dev"
$UploadUrl = "https://aqelzocuukilmfakzgdv.supabase.co/functions/v1/token-rank-upload"
$DeviceKey = if ($args.Count -gt 0) { $args[0] } elseif ($env:NWH_TOKEN_RANK_DEVICE_KEY) { $env:NWH_TOKEN_RANK_DEVICE_KEY } else { "" }

if (-not $DeviceKey.StartsWith("nwh_tr_")) { throw "缺少有效设备密钥。请先在 NovaWorkHub 的 Token Rank 页面生成接入命令。" }

$BinDir = Join-Path $HOME ".local\bin"
$Bin = Join-Path $BinDir "novatoken.exe"
$ConfigDir = Join-Path $HOME ".config\novaworkhub"
$KeyFile = Join-Path $ConfigDir "token-rank-device-key"
$Sync = Join-Path $BinDir "novaworkhub-sync.ps1"
$Tmp = Join-Path ([IO.Path]::GetTempPath()) ("novatoken-" + [Guid]::NewGuid().ToString() + ".exe")

New-Item -ItemType Directory -Force -Path $BinDir, $ConfigDir | Out-Null
try {
  Write-Host "▸ 下载 NovaToken…"
  Invoke-WebRequest -UseBasicParsing -Uri "$Server/dl/novatoken-windows-amd64.exe" -OutFile $Tmp
  $Expected = ((Invoke-WebRequest -UseBasicParsing -Uri "$Server/dl/novatoken-windows-amd64.sha256").Content.Trim() -split "\s+")[0].ToLowerInvariant()
  $Actual = (Get-FileHash -Algorithm SHA256 $Tmp).Hash.ToLowerInvariant()
  if ($Expected -ne $Actual) { throw "下载校验失败，已停止安装。" }
  Move-Item -Force $Tmp $Bin
} finally {
  if (Test-Path $Tmp) { Remove-Item -Force $Tmp }
}

Set-Content -NoNewline -Path $KeyFile -Value $DeviceKey
@"
`$ErrorActionPreference = 'Stop'
`$Key = (Get-Content -Raw '$KeyFile').Trim()
& '$Bin' preview --json | curl.exe --fail-with-body --silent --show-error -X POST '$UploadUrl' -H 'Content-Type: application/json' -H "X-Token-Rank-Device-Key: `$Key" --data-binary '@-'
"@ | Set-Content -Path $Sync

Write-Host "▸ 已安装，正在扫描并上传汇总用量…"
& $Sync
Write-Host "✓ 接入完成。以后需要更新时，运行：powershell -ExecutionPolicy Bypass -File `"$Sync`""
