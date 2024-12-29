# Education Smart Contract

This project is a Clarity smart contract implementation for managing education-related use cases on the Stacks blockchain. The smart contract covers three primary functionalities:

1. **Certification Verification**
2. **Decentralized Learning Platform**
3. **Scholarship Management**

## Features

### Certification Verification
- **Issue Certificates**: Enables trusted issuers to grant certificates to students for completed courses.
- **Verify Certificates**: Allows anyone to verify the authenticity of a certificate by querying the blockchain.

### Decentralized Learning Platform
- **Register Course Payments**: Students can pay for courses, with funds held until the course is completed.
- **Mark Course Completion**: Tutors can mark courses as completed, triggering the release of payments to them.

### Scholarship Management
- **Grant Scholarships**: Automates the distribution of scholarships based on predefined eligibility criteria.
- **Claim Scholarships**: Students can claim scholarships once eligibility criteria are met.

---

## Contract Methods

### Certification Verification

#### `issue-certificate`
**Description**: Issues a certificate to a student for a specified course.
- **Parameters**:
  - `student`: Principal of the student.
  - `course-id`: Unique ID for the course.
  - `issued-date`: The issuance date of the certificate.
- **Returns**: Confirmation message on successful issuance.

#### `verify-certificate`
**Description**: Verifies if a student holds a certificate for a given course.
- **Parameters**:
  - `student`: Principal of the student.
  - `course-id`: Unique ID for the course.
- **Returns**: Certificate details or an error if not found.

### Decentralized Learning Platform

#### `register-course-payment`
**Description**: Registers a course payment by a student.
- **Parameters**:
  - `course-id`: Unique ID for the course.
  - `tutor`: Principal of the tutor.
  - `amount`: Payment amount in microSTX.
- **Returns**: Confirmation message on successful registration.

#### `mark-course-complete`
**Description**: Marks a course as completed by the tutor, releasing payment to the tutor.
- **Parameters**:
  - `course-id`: Unique ID for the course.
  - `student`: Principal of the student.
- **Returns**: Confirmation message and transfers payment.

### Scholarship Management

#### `grant-scholarship`
**Description**: Grants a scholarship to a student.
- **Parameters**:
  - `student`: Principal of the student.
  - `amount`: Scholarship amount in microSTX.
  - `eligibility-date`: The eligibility date for the scholarship.
- **Returns**: Confirmation message on successful grant.

#### `claim-scholarship`
**Description**: Allows students to claim their scholarship if eligibility criteria are met.
- **Parameters**: None.
- **Returns**: Confirmation message and transfers scholarship amount.

---

## Usage Instructions

### Prerequisites
- Install the Stacks CLI.
- Deploy the Clarity smart contract on the Stacks blockchain.

### Deployment
1. Compile the Clarity contract using the Stacks CLI.
   ```bash
   clarity-cli check <contract-name>.clar
   ```
2. Deploy the contract to the Stacks blockchain.
   ```bash
   clarity-cli launch <contract-name>.clar --network <network-name>
   ```

### Interacting with the Contract
Use the following commands to interact with the contract:

- Call a public method:
  ```bash
  clarity-cli execute <contract-name> <method-name> <parameters> --network <network-name>
  ```
- Query a map or variable:
  ```bash
  clarity-cli query <contract-name> <variable-name> --network <network-name>
  ```

---

## Testing

Write tests using Clarity testing frameworks or integration tools like:
- [Clarinet](https://clarinet.io/): A tool for testing and simulating Clarity smart contracts.

### Example
To test the `issue-certificate` method:
```bash
clarinet test
```

---

## Contribution

Feel free to contribute to this project by submitting issues or pull requests. Ensure all code is tested and follows the Clarity best practices.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.