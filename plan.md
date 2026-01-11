# TDD Implementation Plan: CorporationService & ProfileService

## Overview

This plan implements two services using Test-Driven Development (TDD):
1. **CorporationService** - Validates corporation numbers via GET request
2. **ProfileService** - Submits profile details via POST request

Both services use `NetworkingService` interface as a dependency for testability.

### Key Decisions
- **Test location:** `__tests__/` (root folder)
- **Service location:** `src/business_logic/Service/`
- **Service style:** Factory functions with dependency injection
- **Types:** Defined at top of each service file

### How to Run Tests

Run all tests with `npm test`. Run a specific test file by appending the filename pattern, for example `npm test -- CorporationService` or `npm test -- ProfileService`.

---

## Phase 1: CorporationService Tests (Red Phase)

### Objective
Write failing tests for CorporationService before implementation exists.

### Tasks

1. Create the test file at `__tests__/CorporationService.test.ts`

2. Write the following test cases, each using a mock NetworkingService object with jest mock functions for get and post methods:

   - **Test 1: Returns valid result for valid corporation number** - Mock the get method to return a successful validation response with the corporation number and valid flag set to true. Call validate with a test number and assert the result contains the expected valid response.
   
   - **Test 2: Returns invalid result for invalid corporation number** - Mock the get method to return an invalid response with valid flag set to false and an error message. Assert the result contains the invalid flag and message.
   
   - **Test 3: Calls networking with correct endpoint** - Call validate with a specific corporation number and assert that the get method was called exactly once with the endpoint path containing that number.
   
   - **Test 4: Propagates network errors** - Mock the get method to reject with an error. Assert that calling validate also rejects with that same error.

3. Create the stub service file at `src/business_logic/Service/CorporationService.ts` containing:
   - Type definitions for the validation response (valid case with corporation number, invalid case with message, and a union type combining both)
   - A factory function that accepts a NetworkingService and returns an object with a validate method
   - The validate method should throw a "Not implemented" error to ensure tests fail

4. Run the CorporationService tests and confirm all 4 tests fail with the "Not implemented" error.

### Expected Outcome
All 4 tests should fail.

### ⛔ STOP
Ask human to confirm tests are failing correctly before proceeding to Phase 2.

---

## Phase 2: CorporationService Implementation (Green Phase)

### Objective
Implement CorporationService to make all tests pass.

### Tasks

1. Open the CorporationService file at `src/business_logic/Service/CorporationService.ts`

2. Implement the validate method to:
   - Accept a corporation number string as parameter
   - Call the networking service get method with the corporation-number endpoint including the number as a path parameter
   - Return the response from the networking service

3. Run the CorporationService tests and confirm all 4 tests pass.

### Expected Outcome
All 4 CorporationService tests should pass.

### ⛔ STOP
Ask human to confirm all CorporationService tests pass before proceeding to Phase 3.

---

## Phase 3: ProfileService Tests (Red Phase)

### Objective
Write failing tests for ProfileService before implementation exists.

### Tasks

1. Create the test file at `__tests__/ProfileService.test.ts`

2. Write the following test cases, each using a mock NetworkingService object:

   - **Test 1: Successfully submits profile data** - Mock the post method to resolve successfully. Call submit with valid profile data and assert no error is thrown.
   
   - **Test 2: Calls networking with correct endpoint and body** - Call submit with sample profile data containing first name, last name, corporation number, and phone. Assert the post method was called with the profile-details endpoint and the exact profile data object as the body.
   
   - **Test 3: Propagates submission errors** - Mock the post method to reject with an error containing a message. Assert that calling submit also rejects with that same error.

3. Create the stub service file at `src/business_logic/Service/ProfileService.ts` containing:
   - Type definition for profile data (first name, last name, corporation number, and phone fields)
   - A factory function that accepts a NetworkingService and returns an object with a submit method
   - The submit method should throw a "Not implemented" error to ensure tests fail

4. Run the ProfileService tests and confirm all 3 tests fail with the "Not implemented" error.

### Expected Outcome
All 3 tests should fail.

### ⛔ STOP
Ask human to confirm tests are failing correctly before proceeding to Phase 4.

---

## Phase 4: ProfileService Implementation (Green Phase)

### Objective
Implement ProfileService to make all tests pass.

### Tasks

1. Open the ProfileService file at `src/business_logic/Service/ProfileService.ts`

2. Implement the submit method to:
   - Accept a profile data object as parameter
   - Call the networking service post method with the profile-details endpoint and the profile data as the body
   - Return the result from the networking service

3. Run the ProfileService tests and confirm all 3 tests pass.

### Expected Outcome
All 3 ProfileService tests should pass.

### ⛔ STOP
Ask human to confirm all ProfileService tests pass before proceeding to Phase 5.

---

## Phase 5: Final Confirmation

### Objective
Verify all tests pass and implementation is complete.

### Tasks

1. Run the full test suite using npm test

2. Verify all tests pass including:
   - The pre-existing App test
   - All 4 CorporationService tests
   - All 3 ProfileService tests

3. Confirm these files were created:
   - `src/business_logic/Service/CorporationService.ts`
   - `src/business_logic/Service/ProfileService.ts`
   - `__tests__/CorporationService.test.ts`
   - `__tests__/ProfileService.test.ts`

### Expected Outcome
All 8 tests pass (1 existing plus 7 new).

### ✅ COMPLETE
Implementation finished. All services are tested and working.

---

## Reference: API Endpoints

### Corporation Validation
- **Method:** GET
- **URL:** Corporation number endpoint at the base API URL with the number as a path parameter
- **Success Response:** Object containing the corporation number and valid flag set to true
- **Failure Response:** Object containing valid flag set to false and an error message

### Profile Submission
- **Method:** POST
- **URL:** Profile details endpoint at the base API URL
- **Request Body:** Object with firstName, lastName, corporationNumber, and phone fields
- **Success Response:** HTTP 200 status with empty body
- **Failure Response:** HTTP 400 status with object containing error message
