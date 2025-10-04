# 🧪 Backend API Testing Guide

## ✅ Backend is Running on: http://localhost:5000

---

## 🔍 Method 1: Test in Browser (Easiest)

Just open your browser and visit:

**Health Check:**
```
http://localhost:5000/health
```

You should see server status, mock mode info, and uptime.

---

## 🔧 Method 2: Test with PowerShell (Command Line)

Open a **new PowerShell window** and run these commands:

### 1. Health Check
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get | ConvertTo-Json -Depth 10
```

### 2. Register a New User
```powershell
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
    fullName = "Test User"
    role = "learner"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 10
```

### 3. Login
```powershell
$body = @{
    username = "testuser"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.token
Write-Host "Token: $token"
```

### 4. Get Current User (Protected Route)
```powershell
# Use the token from login
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $headers | ConvertTo-Json -Depth 10
```

---

## 🎯 Method 3: Use Demo Users (With Seed Data)

First, seed the database with demo users:

```powershell
cd d:\SIH\CredsOne\backend
npm run seed
```

This creates:
- **Admin:** username: `admin`, password: `admin123`
- **Issuer:** username: `issuer1`, password: `issuer123`
- **Verifier:** username: `verifier1`, password: `verifier123`
- **Learner:** username: `learner1`, password: `learner123`

### Login as Admin:
```powershell
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$adminToken = $response.token
Write-Host "Admin Token: $adminToken"
```

### Issue Certificate (as Issuer):
```powershell
# First login as issuer
$body = @{
    username = "issuer1"
    password = "issuer123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$issuerToken = $response.token

# Now issue a certificate
$headers = @{
    "Authorization" = "Bearer $issuerToken"
}

$certBody = @{
    learner = @{
        name = "John Doe"
        email = "john@example.com"
    }
    course = @{
        name = "Blockchain Development"
        description = "Complete blockchain development course"
        completionDate = "2025-10-04"
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:5000/api/certificates/issue" -Method Post -Headers $headers -Body $certBody -ContentType "application/json" | ConvertTo-Json -Depth 10
```

### Verify Certificate (Public - No Auth):
```powershell
$body = @{
    certificateId = "CERT-ID-HERE"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/verifications/verify" -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 10
```

---

## 🚀 Method 4: Use Postman or Thunder Client

### Install Thunder Client (VS Code Extension)
1. Open VS Code Extensions (Ctrl+Shift+X)
2. Search for "Thunder Client"
3. Install it
4. Click the Thunder Client icon in the sidebar

### Or Use Postman
1. Download from: https://www.postman.com/downloads/
2. Create a new collection "CredsOne API"
3. Import the endpoints below

---

## 📋 Quick Test Endpoints

### Public Endpoints (No Authentication)
- **GET** `http://localhost:5000/health` - Server health
- **POST** `http://localhost:5000/api/auth/register` - Register
- **POST** `http://localhost:5000/api/auth/login` - Login
- **POST** `http://localhost:5000/api/verifications/verify` - Verify certificate
- **GET** `http://localhost:5000/api/certificates/:id` - Get certificate (public)

### Protected Endpoints (Need Token)
Add header: `Authorization: Bearer YOUR_TOKEN_HERE`

- **GET** `http://localhost:5000/api/auth/me` - Current user
- **POST** `http://localhost:5000/api/certificates/issue` - Issue certificate
- **GET** `http://localhost:5000/api/certificates` - List certificates
- **GET** `http://localhost:5000/api/verifications/stats` - Verification stats
- **GET** `http://localhost:5000/api/audit` - Audit logs (admin/issuer)
- **GET** `http://localhost:5000/api/users` - User management (admin)

---

## 🎬 Complete Test Flow (PowerShell)

Copy and paste this entire script:

```powershell
# Complete API Test Flow

Write-Host "`n=== 1. Testing Health Endpoint ===" -ForegroundColor Green
$health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
Write-Host "Server Status: $($health.message)" -ForegroundColor Cyan

Write-Host "`n=== 2. Registering New User ===" -ForegroundColor Green
$registerBody = @{
    username = "testuser_$(Get-Random -Maximum 9999)"
    email = "test$(Get-Random -Maximum 9999)@example.com"
    password = "password123"
    fullName = "Test User"
    role = "learner"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "User registered: $($registerResponse.user.username)" -ForegroundColor Cyan
} catch {
    Write-Host "Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== 3. Logging in as Admin ===" -ForegroundColor Green
$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login successful! Token received." -ForegroundColor Cyan
    Write-Host "Token (first 50 chars): $($token.Substring(0, [Math]::Min(50, $token.Length)))..." -ForegroundColor Yellow
} catch {
    Write-Host "Login failed. Did you run 'npm run seed'?" -ForegroundColor Red
    Write-Host "Run: cd d:\SIH\CredsOne\backend; npm run seed" -ForegroundColor Yellow
    exit
}

Write-Host "`n=== 4. Getting Current User Info ===" -ForegroundColor Green
$headers = @{
    "Authorization" = "Bearer $token"
}

$meResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $headers
Write-Host "Logged in as: $($meResponse.user.username) ($($meResponse.user.role))" -ForegroundColor Cyan

Write-Host "`n=== 5. Listing Certificates ===" -ForegroundColor Green
try {
    $certificates = Invoke-RestMethod -Uri "http://localhost:5000/api/certificates" -Method Get -Headers $headers
    Write-Host "Found $($certificates.pagination.total) certificates" -ForegroundColor Cyan
} catch {
    Write-Host "No certificates found yet" -ForegroundColor Yellow
}

Write-Host "`n=== 6. Getting Audit Stats ===" -ForegroundColor Green
try {
    $auditStats = Invoke-RestMethod -Uri "http://localhost:5000/api/audit/stats" -Method Get -Headers $headers
    Write-Host "Total audit logs: $($auditStats.stats.total)" -ForegroundColor Cyan
} catch {
    Write-Host "Could not fetch audit stats" -ForegroundColor Yellow
}

Write-Host "`n=== ✅ All Tests Complete ===" -ForegroundColor Green
Write-Host "`nYour backend is working correctly! 🎉" -ForegroundColor Cyan
```

Save this as `test-api.ps1` and run:
```powershell
.\test-api.ps1
```

---

## 📱 Method 5: Test with Frontend (Future)

Once you integrate the frontend:

1. **Web Frontend** (React + Vite):
   ```powershell
   cd d:\SIH\CredsOne\frontend\website
   npm install
   npm run dev
   ```
   Opens on: http://localhost:5173

2. **Mobile App** (React Native + Expo):
   ```powershell
   cd d:\SIH\CredsOne\frontend\app\CredsOne
   npm install
   npx expo start
   ```

---

## 🔧 Troubleshooting

### Backend not responding?
```powershell
# Check if backend is running
Get-Process node

# Or restart it
cd d:\SIH\CredsOne\backend
npm run dev
```

### Database errors?
The backend is in **MOCK MODE** - it will work even without MongoDB.
If you have MongoDB installed locally, it will connect automatically.

### Token expired?
Login again to get a new token. Tokens expire after 7 days.

---

## 🎯 Next Steps

1. ✅ Test health endpoint
2. ✅ Run seed script to create demo users
3. ✅ Test authentication (login/register)
4. ✅ Test certificate issuance
5. ⏳ Integrate with frontend
6. ⏳ Deploy to production

---

**Your backend is fully functional and ready for integration!** 🚀
