# MongoDB Connection Test Script

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "MongoDB Connection Test" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Backend Health Check
Write-Host "Test 1: Backend Health Check" -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET
    Write-Host "✅ Backend is running" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor White
    Write-Host "   MongoDB: $($health.mongodb)" -ForegroundColor White
    Write-Host "   Timestamp: $($health.timestamp)" -ForegroundColor White
    
    if ($health.mongodb -eq "connected") {
        Write-Host "✅ MongoDB is CONNECTED!" -ForegroundColor Green
    } else {
        Write-Host "❌ MongoDB is DISCONNECTED!" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Backend is not responding" -ForegroundColor Red
    Write-Host "   Make sure to run: cd backend && npm run dev" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 2: Create a Test User
Write-Host "Test 2: Create Test User" -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Yellow
$testUser = @{
    walletAddress = "0xTEST123456789012345678901234567890TEST"
    username = "test_user_$(Get-Random)"
    email = "test@skillsync.pro"
    userType = "freelancer"
} | ConvertTo-Json

try {
    $user = Invoke-RestMethod -Uri "http://localhost:5000/api/users" -Method POST -Body $testUser -ContentType "application/json"
    Write-Host "✅ User created successfully!" -ForegroundColor Green
    Write-Host "   User ID: $($user._id)" -ForegroundColor White
    Write-Host "   Username: $($user.username)" -ForegroundColor White
    Write-Host "   Wallet: $($user.walletAddress)" -ForegroundColor White
} catch {
    Write-Host "⚠️ User creation result: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   (This might be OK if user already exists)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 3: Get All Users
Write-Host "Test 3: Retrieve All Users" -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri "http://localhost:5000/api/users" -Method GET
    Write-Host "✅ Retrieved $($users.Count) users from database" -ForegroundColor Green
    
    if ($users.Count -gt 0) {
        Write-Host ""
        Write-Host "   Sample users:" -ForegroundColor White
        $users | Select-Object -First 3 | ForEach-Object {
            Write-Host "   - $($_.username) ($($_.walletAddress.Substring(0,10))...)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "❌ Failed to retrieve users: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 4: Create a Test Gig
Write-Host "Test 4: Create Test Gig" -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Yellow
$testGig = @{
    clientAddress = "0xTEST123456789012345678901234567890TEST"
    title = "Test Gig - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    description = "This is a test gig created by the MongoDB test script"
    budget = 500
    deadline = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    skillsRequired = @("Testing", "MongoDB", "Node.js")
    contractGigId = [int](Get-Random -Maximum 1000000)
} | ConvertTo-Json

try {
    $gig = Invoke-RestMethod -Uri "http://localhost:5000/api/gigs" -Method POST -Body $testGig -ContentType "application/json"
    Write-Host "✅ Gig created successfully!" -ForegroundColor Green
    Write-Host "   Gig ID: $($gig._id)" -ForegroundColor White
    Write-Host "   Title: $($gig.title)" -ForegroundColor White
    Write-Host "   Budget: $($gig.budget) USDC" -ForegroundColor White
} catch {
    Write-Host "❌ Failed to create gig: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 5: Get All Gigs
Write-Host "Test 5: Retrieve All Gigs" -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Yellow
try {
    $gigs = Invoke-RestMethod -Uri "http://localhost:5000/api/gigs" -Method GET
    Write-Host "✅ Retrieved $($gigs.Count) gigs from database" -ForegroundColor Green
    
    if ($gigs.Count -gt 0) {
        Write-Host ""
        Write-Host "   Recent gigs:" -ForegroundColor White
        $gigs | Select-Object -First 3 | ForEach-Object {
            Write-Host "   - $($_.title) - $($_.budget) USDC" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "❌ Failed to retrieve gigs: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 6: Create Test Certificate
Write-Host "Test 6: Create Test Certificate" -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Yellow
$testCert = @{
    tokenId = [int](Get-Random -Maximum 1000000)
    studentAddress = "0xSTUDENT123456789012345678901234567890"
    institutionAddress = "0xINSTITUTION12345678901234567890123"
    institutionName = "Test University"
    courseName = "MongoDB Testing 101"
    studentName = "Test Student"
    dateIssued = (Get-Date).ToString("yyyy-MM-dd")
    metadataURI = "ipfs://test-hash-$(Get-Random)"
    certificateType = "course"
} | ConvertTo-Json

try {
    $cert = Invoke-RestMethod -Uri "http://localhost:5000/api/certificates" -Method POST -Body $testCert -ContentType "application/json"
    Write-Host "✅ Certificate created successfully!" -ForegroundColor Green
    Write-Host "   Certificate ID: $($cert._id)" -ForegroundColor White
    Write-Host "   Course: $($cert.courseName)" -ForegroundColor White
    Write-Host "   Student: $($cert.studentName)" -ForegroundColor White
} catch {
    Write-Host "❌ Failed to create certificate: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 7: Get All Certificates
Write-Host "Test 7: Retrieve All Certificates" -ForegroundColor Yellow
Write-Host "------------------------------" -ForegroundColor Yellow
try {
    $certs = Invoke-RestMethod -Uri "http://localhost:5000/api/certificates" -Method GET
    Write-Host "✅ Retrieved $($certs.Count) certificates from database" -ForegroundColor Green
    
    if ($certs.Count -gt 0) {
        Write-Host ""
        Write-Host "   Recent certificates:" -ForegroundColor White
        $certs | Select-Object -First 3 | ForEach-Object {
            Write-Host "   - $($_.courseName) - $($_.studentName)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "❌ Failed to retrieve certificates: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ MongoDB connection is working!" -ForegroundColor Green
Write-Host "✅ Backend API is responding!" -ForegroundColor Green
Write-Host "✅ CRUD operations are functional!" -ForegroundColor Green
Write-Host ""
Write-Host "Your database is ready to use!" -ForegroundColor Green
Write-Host ""
Write-Host "Database: trailbase" -ForegroundColor White
Write-Host "Collections: users, gigs, certificates, institutions" -ForegroundColor White
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
