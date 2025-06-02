# PowerShell script to test incident automation
Write-Host "Testing incident automation..." -ForegroundColor Green

# 0. Login to get authentication token
Write-Host "Logging in to get authentication token..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@adm.ru"
    password = "emil123123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.access_token
    Write-Host "Authentication successful" -ForegroundColor Green
    
    # Set headers with authentication token
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    # 1. Create a test incident
    Write-Host "Creating a test incident..." -ForegroundColor Yellow
    $createIncidentBody = @{
        title = "Test Automation Incident"
        description = "This is a test incident for automation testing"
        severity = "high"
    } | ConvertTo-Json

    $createResponse = Invoke-RestMethod -Uri "http://localhost:5000/incidents" -Method Post -Body $createIncidentBody -ContentType "application/json" -Headers $headers
    Write-Host "Incident created successfully with ID: $($createResponse.id)" -ForegroundColor Green
    $incidentId = $createResponse.id
    
    # 2. Wait a moment for processing
    Write-Host "Waiting for incident processing..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    
    # 3. Get incident details
    Write-Host "Retrieving incident details..." -ForegroundColor Yellow
    $incidentDetails = Invoke-RestMethod -Uri "http://localhost:5000/incidents/$incidentId" -Method Get -Headers $headers
    Write-Host "Incident Status: $($incidentDetails.status)" -ForegroundColor Cyan
    
    # 4. Update incident status to resolved
    Write-Host "Resolving the incident..." -ForegroundColor Yellow
    $updateBody = @{
        status = "resolved"
        resolutionNotes = "Resolved through automation testing"
    } | ConvertTo-Json
    
    $updateResponse = Invoke-RestMethod -Uri "http://localhost:5000/incidents/$incidentId/status" -Method Patch -Body $updateBody -ContentType "application/json" -Headers $headers
    Write-Host "Incident resolved successfully" -ForegroundColor Green
    
    # 5. Get updated incident details
    Write-Host "Retrieving updated incident details..." -ForegroundColor Yellow
    $updatedIncidentDetails = Invoke-RestMethod -Uri "http://localhost:5000/incidents/$incidentId" -Method Get -Headers $headers
    Write-Host "Updated Incident Status: $($updatedIncidentDetails.status)" -ForegroundColor Cyan
    
    # 6. Check metrics
    Write-Host "Checking incident metrics..." -ForegroundColor Yellow
    $metrics = Invoke-RestMethod -Uri "http://localhost:5000/incidents/stats" -Method Get -Headers $headers
    Write-Host "Total Incidents: $($metrics.totalIncidents)" -ForegroundColor Cyan
    Write-Host "Resolved Incidents: $($metrics.resolvedIncidents)" -ForegroundColor Cyan
    Write-Host "MTTR (minutes): $($metrics.mttr)" -ForegroundColor Cyan
    
    Write-Host "Incident automation test completed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Error during incident automation test: $_" -ForegroundColor Red
    Write-Host "Response content: $($_.Exception.Response.Content)" -ForegroundColor Red
    Write-Host "Make sure the server is running at http://localhost:5000" -ForegroundColor Yellow
} 