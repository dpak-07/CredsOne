# CredsOne Backend API

Blockchain-based Credential Verification System Backend

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Update the following variables in `.env`:
- `JWT_SECRET`: Generate a secure secret key
- `MONGODB_URI`: Your MongoDB connection string
- `ADMIN_PRIVATE_KEY`: Your Ethereum wallet private key (for blockchain transactions)
- `CONTRACT_ADDRESS`: Deployed smart contract address

### 3. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

### 4. Seed Database (Optional)

Create demo users for testing:

```bash
npm run seed
```

This will create:
- **Admin**: username=`admin`, password=`admin123`
- **Issuer**: username=`issuer1`, password=`issuer123`
- **Verifier**: username=`verifier1`, password=`verifier123`
- **Learner**: username=`learner1`, password=`learner123`

### 5. Start Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-2fa` - Verify 2FA OTP
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Certificates
- `POST /api/certificates/issue` - Issue certificate
- `POST /api/certificates/batch-issue` - Batch issue certificates
- `GET /api/certificates` - Get all certificates (paginated)
- `GET /api/certificates/:id` - Get certificate by ID
- `GET /api/certificates/learner/:userId` - Get certificates by learner
- `PUT /api/certificates/:id/revoke` - Revoke certificate
- `POST /api/certificates/upload` - Upload certificate for OCR
- `GET /api/certificates/:id/download` - Download certificate (VC format)
- `POST /api/certificates/migrate-legacy` - Migrate legacy certificate
- `PUT /api/certificates/legacy/:id/approve` - Approve legacy certificate

### Verifications
- `POST /api/verifications/verify` - Verify certificate
- `POST /api/verifications/manual` - Manual verification
- `GET /api/verifications` - Get all verifications (paginated)
- `GET /api/verifications/:id` - Get verification by ID
- `GET /api/verifications/certificate/:certificateId` - Get verifications for certificate

### Audit Logs
- `GET /api/audit` - Get audit logs (paginated)
- `GET /api/audit/export` - Export audit logs (CSV/JSON)
- `GET /api/audit/stats` - Get audit statistics

### DigiLocker
- `POST /api/digilocker/export` - Export to DigiLocker
- `POST /api/digilocker/import` - Import from DigiLocker
- `GET /api/digilocker/list` - List DigiLocker documents

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/role` - Update user role
- `PUT /api/users/:id/toggle-status` - Toggle user status

## Testing

Use the provided demo users or create new users via the registration endpoint.

### Example API Call

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

## Project Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic services
├── utils/           # Utility functions
├── uploads/         # File upload directory
├── scripts/         # Database scripts
├── server.js        # Entry point
├── package.json     # Dependencies
└── .env             # Environment variables
```

## Features

✅ JWT Authentication
✅ Role-Based Access Control (RBAC)
✅ Blockchain Integration (Polygon Mumbai)
✅ Certificate Issuance & Verification
✅ QR Code Generation
✅ OCR Processing (Mock)
✅ Audit Logging
✅ File Upload Support
✅ Pagination & Filtering
✅ Error Handling
✅ Input Validation
✅ Rate Limiting

## Technologies

- Node.js & Express.js
- MongoDB & Mongoose
- Ethers.js v6 (Blockchain)
- JWT (Authentication)
- QRCode (QR Generation)
- Express-validator (Validation)
- Multer (File Upload)
- Bcryptjs (Password Hashing)

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Rate limiting on auth routes
- Input validation
- CORS configuration
- Helmet.js security headers

## License

MIT © 2025 DEEPAK

