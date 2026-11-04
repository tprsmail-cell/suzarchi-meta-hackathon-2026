Add-Type -AssemblyName System.Runtime.WindowsRuntime

# Helper to await WinRT async operations
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

if ($heera) {
    Write-Host "Found Indian Voice: $($heera.DisplayName) ($($heera.Language)) - ID: $($heera.Id)"
    $synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
    $synth.Voice = $heera

    $testText = "Every day, valuable textiles go to waste. SUZARCHI connects surplus materials to new possibilities."
    $streamOp = $synth.SynthesizeTextToStreamAsync($testText)
    $stream = Await-WinRtTask $streamOp ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])

    $outputFile = "D:\SUZARCHI hackathon\docs\release\demo-recording-evidence\audio\test-heera-opening.wav"
    $bytes = New-Object byte[] ($stream.Size)
    $reader = New-Object Windows.Storage.Streams.DataReader ($stream.GetInputStreamAt(0))
    $loadOp = $reader.LoadAsync($stream.Size)
    $loadTask = Await-WinRtTask $loadOp ([uint32])
    $reader.ReadBytes($bytes)
    [System.IO.File]::WriteAllBytes($outputFile, $bytes)
    Write-Host "Success! Created Indian English audio file: $outputFile ($($bytes.Length) bytes)"
} else {
    Write-Host "No en-IN voice found in Windows.Media.SpeechSynthesis. Available voices:"
    $voices | ForEach-Object { Write-Host "$($_.DisplayName) - $($_.Language)" }
}
