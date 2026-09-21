$m2 = "$env:USERPROFILE\.m2\repository"

$files = @(
    "org/codehaus/plexus/plexus-archiver/4.9.2/plexus-archiver-4.9.2.jar",
    "org/codehaus/plexus/plexus-archiver/4.9.2/plexus-archiver-4.9.2.pom",
    "org/apache/commons/commons-compress/1.26.1/commons-compress-1.26.1.jar",
    "org/apache/commons/commons-compress/1.26.1/commons-compress-1.26.1.pom",
    "org/apache/commons/commons-lang3/3.14.0/commons-lang3-3.14.0.jar",
    "org/apache/commons/commons-lang3/3.14.0/commons-lang3-3.14.0.pom",
    "com/github/luben/zstd-jni/1.5.5-11/zstd-jni-1.5.5-11.jar",
    "com/github/luben/zstd-jni/1.5.5-11/zstd-jni-1.5.5-11.pom"
)

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0")

foreach ($file in $files) {
    $targetPath = Join-Path $m2 ($file.Replace('/', '\'))
    $targetDir = Split-Path $targetPath -Parent
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    $url = "https://repo1.maven.org/maven2/$file"
    Write-Host "Fetching $file..."
    try {
        $wc.DownloadFile($url, $targetPath)
        Write-Host "Downloaded $file successfully"
    } catch {
        Write-Host "Failed to fetch $file : $_"
    }
}
