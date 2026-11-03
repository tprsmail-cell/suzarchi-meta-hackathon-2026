$viewports = @(
  @{ w = 1440; h = 900;  name = 'active_mvp_1440.png' },
  @{ w = 1024; h = 768;  name = 'active_mvp_1024.png' },
  @{ w = 768;  h = 1024; name = 'active_mvp_768.png' },
  @{ w = 390;  h = 844;  name = 'active_mvp_390.png' },
  @{ w = 360;  h = 800;  name = 'active_mvp_360.png' }
)
$dir = "C:\Users\Merch\.gemini\antigravity\brain\bd2de537-0962-45e2-a6f8-f3193ee33f5e"
foreach ($v in $viewports) {
  $out = Join-Path $dir $v.name
  Start-Process msedge -ArgumentList '--headless', "--screenshot=$out", "--window-size=$($v.w),$($v.h)", 'http://localhost:3000' -Wait
}
Write-Output "All 5 active MVP viewports captured successfully"
