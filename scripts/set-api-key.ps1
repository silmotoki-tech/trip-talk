$ErrorActionPreference = "Stop"
$projectDirectory = Split-Path -Parent $PSScriptRoot
$environmentFile = Join-Path $projectDirectory ".env.local"

Write-Host ""
Write-Host "Trip Talk - OpenAI APIキー設定" -ForegroundColor Cyan
$apiKey = (Get-Clipboard -Raw -ErrorAction SilentlyContinue).Trim()
$pointer = [IntPtr]::Zero

try {
    if (-not $apiKey.StartsWith("sk-")) {
        Write-Host "クリップボードにAPIキーが見つかりませんでした。"
        Write-Host "入力した文字は画面に表示されません。"
        $secureKey = Read-Host "APIキー（sk-...）を右クリックで貼り付け、Enter" -AsSecureString
        $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
        $apiKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    }
    if ([string]::IsNullOrWhiteSpace($apiKey) -or -not $apiKey.StartsWith("sk-")) {
        throw "APIキーの形式を確認してください（通常は sk- から始まります）。"
    }

    $content = @(
        "# Server only. Do not share or commit this file."
        "OPENAI_API_KEY=$apiKey"
        "OPENAI_REALTIME_MODEL=gpt-realtime"
        "OPENAI_ANALYSIS_MODEL=gpt-5-mini"
    )
    [IO.File]::WriteAllLines($environmentFile, $content, [Text.UTF8Encoding]::new($false))
    Write-Host ""
    Write-Host "クリップボードから設定できました。この画面を閉じてCodexへ戻ってください。" -ForegroundColor Green
}
catch {
    Write-Host ""
    Write-Host $_.Exception.Message -ForegroundColor Red
}
finally {
    if ($pointer -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    }
    $apiKey = $null
}
