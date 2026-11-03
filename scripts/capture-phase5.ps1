$viewports = @(
  @{ w = 1440; h = 900;  name = 'phase5_role_1440.png' },
  @{ w = 1024; h = 768;  name = 'phase5_role_1024.png' },
  @{ w = 768;  h = 1024; name = 'phase5_role_768.png' },
  @{ w = 390;  h = 844;  name = 'phase5_role_390.png' },
  @{ w = 360;  h = 800;  name = 'phase5_role_360.png' }
)
$dir = "C:\Users\Merch\.gemini\antigravity\brain\bd2de537-0962-45e2-a6f8-f3193ee33f5e"
foreach ($v in $viewports) {
  $out = Join-Path $dir $v.name
  Start-Process msedge -ArgumentList '--headless', '--disable-gpu', "--screenshot=$out", "--window-size=$($v.w),$($v.h)", 'http://localhost:3000' -Wait
}
Write-Output "All 5 Phase 5 role-adaptive viewports captured successfully"
