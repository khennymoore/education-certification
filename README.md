# Education Certificate Smart Contract

A decentralized education certification system built on Stacks blockchain that handles course certificates, payments, and scholarships. This smart contract enables secure and transparent management of educational credentials, course payments, and scholarship distributions.

## Features

### Certificate Management
- Issue digital certificates for completed courses
- Verify certificate authenticity
- Store certificate data on-chain with issuer and timestamp information

### Course Payment System
- Register course payments
- Track payment status
- Automated payment release upon course completion
- Tutor verification system

### Scholarship Management
- Grant scholarships with eligibility dates
- Automated scholarship claiming system
- Time-locked scholarship distribution

## Contract Components

### Storage Maps

1. **Certificates Storage**
```clarity
(define-map certificates
  { student: principal, course-id: uint }
  { issuer: principal, issued-date: uint })
```

2. **Scholarships Storage**
```clarity
(define-map scholarships
  { student: principal }
  { amount: uint, eligibility-date: uint })
```

3. **Course Payments Storage**
```clarity
(define-map course-payments
  { course-id: uint, student: principal }
  { tutor: principal, amount: uint, is-completed: bool })
```

### Event Tracking

The contract maintains event logs for:
- Certificate issuance
- Scholarship grants
- Course payments

Each event list has a maximum capacity of 200 entries.

## Public Functions

### Certificate Functions

1. `issue-certificate`
   - Parameters: `student`, `course-id`, `issued-date`
   - Issues a new certificate for a completed course

2. `verify-certificate`
   - Parameters: `student`, `course-id`
   - Verifies the authenticity of a certificate

### Course Payment Functions

1. `register-course-payment`
   - Parameters: `course-id`, `tutor`, `amount`
   - Registers a new course payment

2. `mark-course-complete`
   - Parameters: `course-id`, `student`
   - Marks a course as complete and releases payment to student

### Scholarship Functions

1. `grant-scholarship`
   - Parameters: `student`, `amount`, `eligibility-date`
   - Grants a scholarship to a student

2. `claim-scholarship`
   - No parameters (uses tx-sender)
   - Claims an eligible scholarship

## Error Codes

| Code | Description |
|------|-------------|
| u100 | Certificate already exists |
| u101 | Certificate not found |
| u200 | Invalid payment amount |
| u201 | Unauthorized tutor |
| u202 | Course already completed |
| u301 | Eligibility criteria not met |
| u403 | Event list capacity exceeded |
| u404 | Entry not found |

## Usage Examples

### Issuing a Certificate
```clarity
(contract-call? .education-certificate issue-certificate 
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM 
  u1 
  u100)
```

### Registering a Course Payment
```clarity
(contract-call? .education-certificate register-course-payment 
  u1 
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM 
  u1000)
```

### Granting a Scholarship
```clarity
(contract-call? .education-certificate grant-scholarship 
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM 
  u5000 
  u720)
```

## Security Considerations

1. Only authorized tutors can mark courses as complete
2. Scholarships are time-locked until eligibility date
3. Certificate uniqueness is enforced
4. Events have maximum capacity to prevent DOS attacks
5. All critical operations require proper authorization

## Installation

1. Deploy the contract on the Stacks blockchain
2. Initialize any necessary configuration
3. Grant appropriate permissions for contract administration

## Testing

Recommended test scenarios:
1. Certificate issuance and verification
2. Course payment registration and completion
3. Scholarship granting and claiming
4. Error handling for all edge cases
5. Authorization checks
6. Event emission verification

## Contributing

When contributing to this contract:
1. Follow the existing code structure
2. Add appropriate error codes for new functionality
3. Document all new functions and features
4. Ensure proper error handling
5. Add test cases for new features

## License

[Add your chosen license here]