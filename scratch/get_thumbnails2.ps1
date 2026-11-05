Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Runtime.WindowsRuntime

[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null

function Await-Async($asyncOp) {
    $asTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
        $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod
    } | Select-Object -First 1
    $task = $asTaskGeneric.MakeGenericMethod($asyncOp.GetType().GetGenericArguments()).Invoke($null, @($asyncOp))
    $task.Wait()
    return $task.Result
}

function Get-Thumb($videoPath, $outPath) {
    $fileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($videoPath)
    $asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
        $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
    } | Select-Object -First 1
    $fileTask = $asTask.MakeGenericMethod([Windows.Storage.StorageFile]).Invoke($null, @($fileOp))
    $fileTask.Wait()
    $file = $fileTask.Result

    $thumbOp = $file.GetThumbnailAsync([Windows.Storage.FileProperties.ThumbnailMode]::VideosView, 640)
    $thumbTask = $asTask.MakeGenericMethod([Windows.Storage.FileProperties.StorageItemThumbnail]).Invoke($null, @($thumbOp))
    $thumbTask.Wait()
    $thumb = $thumbTask.Result

    $stream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($thumb)
    $img = [System.Drawing.Image]::FromStream($stream)
    $img.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $stream.Close()
    Write-Output "Successfully saved thumbnail: $outPath"
}

Get-Thumb 'C:\Users\RESA\.gemini\antigravity\brain\1bb5a204-33f6-454b-b1c0-b10f32c509c4\.user_uploaded\media_1793886307220_06cdacfa.mp4' 'f:\PPG\Semester 2\Buat Game\scratch\thumb_v1.jpg'
Get-Thumb 'C:\Users\RESA\.gemini\antigravity\brain\1bb5a204-33f6-454b-b1c0-b10f32c509c4\.user_uploaded\media_1793886307377_d81c7cc2.mp4' 'f:\PPG\Semester 2\Buat Game\scratch\thumb_v2.jpg'

