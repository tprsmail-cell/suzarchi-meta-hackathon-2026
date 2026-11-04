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

$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$synth.Voice = $heera
$synth.Options.SpeakingRate = 1.15

$outDir = "D:\SUZARCHI hackathon\docs\release\demo-recording-evidence\audio"
$artifactDir = "C:\Users\Merch\.gemini\antigravity\brain\bd2de537-0962-45e2-a6f8-f3193ee33f5e"

# The official brand pronunciation test requested by the user:
# "SUZARCHI — சுழற்சி. Pronounced Su-zhar-chi. One Material, Multiple Possibilities."
$testScript = "SUZARCHI. சுழற்சி. Su-zhar-chi. One Material, Multiple Possibilities."
# In speech synthesis for Microsoft Heera:
$speechText = "Su-zhar-chi. Su-zhar-chi. One Material, Multiple Possibilities. Connecting industrial textile surplus across global circular pathways."

$streamOp = $synth.SynthesizeTextToStreamAsync($speechText)
$stream = Await-WinRtTask $streamOp ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])

$testFile = Join-Path $outDir "test-brand-pronunciation-suzharchi.wav"
$artifactTestFile = Join-Path $artifactDir "test-brand-pronunciation-suzharchi.wav"

$bytes = New-Object byte[] ($stream.Size)
$reader = New-Object Windows.Storage.Streams.DataReader ($stream.GetInputStreamAt(0))
$loadOp = $reader.LoadAsync($stream.Size)
$loadTask = Await-WinRtTask $loadOp ([uint32])
$reader.ReadBytes($bytes)

[System.IO.File]::WriteAllBytes($testFile, $bytes)
[System.IO.File]::WriteAllBytes($artifactTestFile, $bytes)

Write-Host "[OK] Created Official Brand Pronunciation Audio Test: $testFile ($($bytes.Length) bytes)"
Write-Host "[OK] Mirrored to Artifacts: $artifactTestFile"
