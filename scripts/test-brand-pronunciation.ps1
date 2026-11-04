Add-Type -AssemblyName System.Runtime.WindowsRuntime

$asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
}[0]

Function Await-WinRtTask($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    return $netTask.Result
}

[Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime] | Out-Null
$voices = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices
$heera = $voices | Where-Object { $_.DisplayName -like '*Heera*' -or $_.Id -like '*Heera*' -or $_.Language -eq 'en-IN' } | Select-Object -First 1

if (-not $heera) {
    Write-Error "No Indian English (en-IN) voice found!"
    exit 1
}

Write-Host "Found Voice: $($heera.DisplayName)"
$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$synth.Voice = $heera
$synth.Options.SpeakingRate = 1.15

$testDir = "D:\SUZARCHI hackathon\docs\release\demo-recording-evidence\audio\pronunciation-tests"
if (-not (Test-Path $testDir)) {
    New-Item -ItemType Directory -Force -Path $testDir | Out-Null
}

$variants = @(
    @{ Id = "test-01-default"; Text = "Welcome to SUZARCHI: One Material, Multiple Possibilities." },
    @{ Id = "test-02-hyphenated"; Text = "Welcome to Su-zhar-chi: One Material, Multiple Possibilities." },
    @{ Id = "test-03-spaced"; Text = "Welcome to Su zhar chi: One Material, Multiple Possibilities." },
    @{ Id = "test-04-soozharchi"; Text = "Welcome to Soo-zhar-chi: One Material, Multiple Possibilities." },
    @{ Id = "test-05-tamil-phrase"; Text = "Every day, valuable textiles go to waste. Su-zhar-chi connects surplus materials to new possibilities." }
)

foreach ($v in $variants) {
    $streamOp = $synth.SynthesizeTextToStreamAsync($v.Text)
    $stream = Await-WinRtTask $streamOp ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
    
    $targetPath = Join-Path $testDir "$($v.Id).wav"
    $bytes = New-Object byte[] ($stream.Size)
    $reader = New-Object Windows.Storage.Streams.DataReader ($stream.GetInputStreamAt(0))
    $loadOp = $reader.LoadAsync($stream.Size)
    $loadTask = Await-WinRtTask $loadOp ([uint32])
    $reader.ReadBytes($bytes)
    [System.IO.File]::WriteAllBytes($targetPath, $bytes)
    Write-Host "[OK] Created $($v.Id).wav ($($bytes.Length) bytes)"
}
