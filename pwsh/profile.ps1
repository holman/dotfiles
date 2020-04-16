${Global:LastPromptTime} = $(get-date)
${Global:IsAdmin} = $true # TODO: get this

function prompt
{
    $currentTime = $(get-date)
    $elapsed = $currentTime.Subtract(${Global:LastPromptTime})
    $elapsedStr = "[" + $elapsed.ToString('c') + "] "
    if ($elapsed.Hours -gt 0)
    {
        $color = "Red"
    }
    elseif ($elapsed.Minutes -gt 30)
    {
        $color = "Red"
    }
    elseif ($elapsed.Minutes -gt 10)
    {
        $color = "Yellow"
    }
    elseif ($elapsed.Seconds -gt 0)
    {
        $color = "White"
    }
    else
    {
        $color = "Gray"
    }

    $windowTitle = $env:WindowTitlePrefix + " ";
    if (${Global:IsAdmin})
    {
        $windowTitle += "Administrator: "
    }
    $windowTitle += $currentTime.ToString('yyyy-MM-dd HH:mm:ss') + " " + (get-item -path .)
    (get-host).UI.RawUI.WindowTitle = $windowTitle

    $restOfPrompt1 = $currentTime.ToString('HH:mm:ss')
    $restOfPrompt2 = " macos>skyrise: "
    $restOfPrompt3 = (get-item -path .).name

    Write-Host $elapsedStr -nonewline -ForegroundColor $color

    if (${Global:IsAdmin})
    {
        Write-Host $restOfPrompt1 -nonewline -foregroundcolor White -backgroundColor DarkRed
        Write-Host $restOfPrompt2 -nonewline -foregroundcolor Green -backgroundColor DarkRed
        Write-Host $restOfPrompt3 -nonewline -foregroundcolor Blue -backgroundColor DarkRed
        Write-Host ">" -nonewline -foregroundcolor White
    }
    else
    {
        Write-Host $restOfPrompt1 -nonewline -foregroundcolor White
        Write-Host $restOfPrompt2 -nonewline -foregroundcolor Green
        Write-Host $restOfPrompt3 -nonewline -foregroundcolor Blue
        Write-Host ">" -nonewline -foregroundcolor White
    }

    ${Global:LastPromptTime} = $currentTime
    return " "
}

function sln ($name)
{
    dotnet msbuild -r -t:MakeSolution -p:MakeSolutionName=$name
}
