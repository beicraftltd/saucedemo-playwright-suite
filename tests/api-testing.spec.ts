import { test, expect } from '@playwright/test';

/**
 * Strict API Testing Suite - Tests Will Fail When API Behaves Incorrectly
 * 
 * This test suite will fail when the API doesn't behave as expected:
 * - Booking API should return booking object, not empty array
 * - API should reject bookings for non-existent rooms
 * - Date validation should return 400, not 500
 * - Message API should return detailed response, not just {success: true}
 * - API should handle validation properly
 */

test.describe('Strict API Testing Suite', () => {
  const baseUrl = 'https://automationintesting.online/api';
  let authToken: string | null = null;
  let availableRooms: any[] = [];

  // Setup: Authenticate and get available rooms
  test.beforeAll(async ({ request }) => {
    console.log('🔧 Setting up test environment...');

    // Try to authenticate (adjust credentials as needed)
    try {
      const authResponse = await request.post(`${baseUrl}/auth/login`, {
        data: {
          username: 'admin',
          password: 'password'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (authResponse.status() === 200) {
        const authData = await authResponse.json();
        authToken = authData.token;
        console.log('✅ Authentication successful');
      }
    } catch (error) {
      console.log('⚠️  Authentication failed, proceeding without auth token');
    }

    // Get available rooms
    try {
      const roomsResponse = await request.get(`${baseUrl}/room`);
      if (roomsResponse.status() === 200) {
        const roomsData = await roomsResponse.json();
        availableRooms = roomsData.rooms || roomsData || [];
        console.log(`✅ Found ${availableRooms.length} available rooms`);
      }
    } catch (error) {
      console.log('⚠️  Failed to fetch rooms');
    }
  });

  test.describe('Room Management API Tests', () => {
    test('should fetch available rooms successfully', async ({ request }) => {
      console.log('🏨 Testing room listing...');

      const response = await request.get(`${baseUrl}/room`);
      console.log(`📊 Response status: ${response.status()}`);

      expect(response.status()).toBe(200);

      const rooms = await response.json();
      console.log(`📋 Response structure:`, Object.keys(rooms));

      // Verify response has rooms data
      expect(rooms).toHaveProperty('rooms');
      expect(Array.isArray(rooms.rooms)).toBe(true);
      expect(rooms.rooms.length).toBeGreaterThan(0); // Should have at least one room

      if (rooms.rooms.length > 0) {
        const firstRoom = rooms.rooms[0];
        console.log(`📋 Sample room structure:`, Object.keys(firstRoom));
        expect(firstRoom).toHaveProperty('roomid');
        expect(firstRoom).toHaveProperty('roomName');
        expect(firstRoom).toHaveProperty('type');
        expect(firstRoom).toHaveProperty('roomPrice');
      }

      console.log('✅ Room listing test passed');
    });

    test('should handle room details request', async ({ request }) => {
      test.skip(availableRooms.length === 0, 'No available rooms for testing');
      
      if (availableRooms.length === 0) {
        return;
      }

      const testRoomId = availableRooms[0].roomid;
      console.log(`🏨 Testing room details for room ${testRoomId}...`);

      const response = await request.get(`${baseUrl}/room/${testRoomId}`);
      console.log(`📊 Response status: ${response.status()}`);

      // Should return 200 for valid room
      expect(response.status()).toBe(200);

      if (response.status() === 200) {
        const room = await response.json();
        console.log('📋 Room details received successfully');
        expect(room).toHaveProperty('roomid', testRoomId);
        expect(room).toHaveProperty('roomName');
        expect(room).toHaveProperty('type');
        expect(room).toHaveProperty('roomPrice');
      }

      console.log('✅ Room details test completed');
    });
  });

  test.describe('Booking API Tests - Strict Validation', () => {
    const bookingEndpoint = `${baseUrl}/booking`;

    test('should create booking and return proper booking object', async ({ request }) => {
      console.log('📋 Testing booking creation with strict validation...');

      test.skip(availableRooms.length === 0, 'No available rooms for booking test');
      
      if (availableRooms.length === 0) {
        return;
      }

      const roomToBook = availableRooms[0].roomid;
      console.log(`🏨 Attempting to book room ID: ${roomToBook}`);

      const bookingData = {
        roomid: roomToBook,
        firstname: 'John',
        lastname: 'Doe',
        depositpaid: false,
        bookingdates: {
          checkin: '2025-07-10',
          checkout: '2025-07-11'
        },
        email: 'john.doe@email.fake',
        phone: '021548965321'
      };

      const response = await request.post(bookingEndpoint, {
        data: bookingData,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`📊 Response status: ${response.status()}`);

      // Should return 200 for successful booking
      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      console.log('📋 Booking response type:', typeof responseBody);
      console.log('📋 Booking response:', responseBody);

      // Should return a booking object, not empty array
      expect(Array.isArray(responseBody)).toBe(false);
      expect(typeof responseBody).toBe('object');
      expect(responseBody).not.toBeNull();

      // Should have booking properties
      expect(responseBody).toHaveProperty('bookingid');
      expect(responseBody).toHaveProperty('roomid', roomToBook);
      expect(responseBody).toHaveProperty('firstname', 'John');
      expect(responseBody).toHaveProperty('lastname', 'Doe');
      expect(responseBody).toHaveProperty('email', 'john.doe@email.fake');

      console.log('✅ Booking creation test passed');
    });

    test('should reject booking for non-existent room', async ({ request }) => {
      console.log('📋 Testing booking with non-existent room...');

      const nonExistentRoomId = 99999;
      const bookingData = {
        roomid: nonExistentRoomId,
        firstname: 'John',
        lastname: 'Doe',
        depositpaid: false,
        bookingdates: {
          checkin: '2025-07-10',
          checkout: '2025-07-11'
        },
        email: 'john.doe@email.fake',
        phone: '021548965321'
      };

      const response = await request.post(bookingEndpoint, {
        data: bookingData,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`📊 Response status: ${response.status()}`);

      // Should reject booking for non-existent room with 400 or 404
      expect([400, 404]).toContain(response.status());

      if (response.status() === 200) {
        // If API incorrectly accepts it, this will fail the test
        throw new Error('API incorrectly accepted booking for non-existent room');
      }

      console.log('✅ Non-existent room validation test passed');
    });

    test('should validate checkout date after checkin date', async ({ request }) => {
      console.log('📋 Testing date validation (checkout before checkin)...');

      test.skip(availableRooms.length === 0, 'No available rooms for date validation test');
      
      if (availableRooms.length === 0) {
        return;
      }

      const roomToBook = availableRooms[0].roomid;

      const invalidDateBookingData = {
        roomid: roomToBook,
        firstname: 'John',
        lastname: 'Doe',
        depositpaid: false,
        bookingdates: {
          checkin: '2025-07-11',
          checkout: '2025-07-10' // Checkout before checkin
        },
        email: 'john.doe@email.fake',
        phone: '021548965321'
      };

      const response = await request.post(bookingEndpoint, {
        data: invalidDateBookingData,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`📊 Response status: ${response.status()}`);

      // Should return 400 for invalid date range, not 500
      expect(response.status()).toBe(400);

      if (response.status() === 500) {
        throw new Error('API returned 500 for date validation instead of 400');
      }

      console.log('✅ Date validation test passed');
    });

    test('should handle booking conflicts properly', async ({ request }) => {
      console.log('📋 Testing booking conflict handling...');

      test.skip(availableRooms.length === 0, 'No available rooms for conflict test');
      
      if (availableRooms.length === 0) {
        return;
      }

      const roomToBook = availableRooms[0].roomid;
      const conflictingDates = {
        checkin: '2025-08-01',
        checkout: '2025-08-02'
      };

      // Create first booking
      const firstBookingData = {
        roomid: roomToBook,
        firstname: 'John',
        lastname: 'Doe',
        depositpaid: false,
        bookingdates: conflictingDates,
        email: 'john.doe@email.fake',
        phone: '021548965321'
      };

      const firstResponse = await request.post(bookingEndpoint, {
        data: firstBookingData,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`📊 First booking status: ${firstResponse.status()}`);

      // First booking should succeed
      expect(firstResponse.status()).toBe(200);

      // Try to create conflicting booking
      const secondBookingData = {
        roomid: roomToBook,
        firstname: 'Jane',
        lastname: 'Smith',
        depositpaid: false,
        bookingdates: conflictingDates,
        email: 'jane.smith@email.fake',
        phone: '021548965322'
      };

      const secondResponse = await request.post(bookingEndpoint, {
        data: secondBookingData,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`📊 Conflicting booking status: ${secondResponse.status()}`);

      // Should reject conflicting booking with 400 or 409
      expect([400, 409]).toContain(secondResponse.status());

      if (secondResponse.status() === 200) {
        throw new Error('API incorrectly accepted conflicting booking');
      }

      console.log('✅ Booking conflict test passed');
    });
  });

  test.describe('Contact/Message API Tests - Strict', () => {
    const messageEndpoint = `${baseUrl}/message`;

    test('should return detailed message response', async ({ request }) => {
      console.log('📧 Testing message submission with detailed response...');

      const messageData = {
        name: 'Jane Smith',
        email: 'jane.smith@email.fake',
        phone: '54663313132',
        subject: 'Test Inquiry',
        description: 'This is a test message from the strict API testing suite.'
      };

      const response = await request.post(messageEndpoint, {
        data: messageData,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`📊 Response status: ${response.status()}`);

      expect(response.status()).toBe(200);

      const responseBody = await response.json();
      console.log('📧 Response body:', responseBody);
      console.log('📧 Response type:', typeof responseBody);

      // Should return detailed response, not just {success: true}
      expect(responseBody).toHaveProperty('messageid');
      expect(responseBody).toHaveProperty('name', 'Jane Smith');
      expect(responseBody).toHaveProperty('email', 'jane.smith@email.fake');
      expect(responseBody).toHaveProperty('subject', 'Test Inquiry');
      expect(responseBody).toHaveProperty('description');

      if (responseBody.success === true && !responseBody.messageid) {
        throw new Error('API returned simple success response instead of detailed message object');
      }

      console.log('✅ Message submission test passed');
    });

    test('should reject message with invalid email format', async ({ request }) => {
      console.log('📧 Testing message validation...');

      const invalidMessageData = {
        name: 'Jane Smith',
        email: 'invalid-email', // Invalid email format
        phone: '54663313132',
        subject: 'Test Inquiry',
        description: 'Test message with invalid email.'
      };

      const response = await request.post(messageEndpoint, {
        data: invalidMessageData,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`📊 Response status: ${response.status()}`);

      // Should return 400 for invalid email
      expect(response.status()).toBe(400);

      if (response.status() === 200) {
        throw new Error('API incorrectly accepted invalid email format');
      }

      console.log('✅ Message validation test passed');
    });
  });

  test.describe('Authentication API Tests', () => {
    const authEndpoint = `${baseUrl}/auth/login`;

    test('should reject login with invalid credentials', async ({ request }) => {
      console.log('🔐 Testing authentication...');

      const invalidCredentials = {
        username: 'invaliduser',
        password: 'invalidpass'
      };

      const response = await request.post(authEndpoint, {
        data: invalidCredentials,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`📊 Response status: ${response.status()}`);

      // Should return 401 for invalid credentials
      expect(response.status()).toBe(401);

      const responseBody = await response.json();
      console.log('🔐 Auth response:', responseBody);

      // Should have error message
      expect(responseBody).toHaveProperty('error');

      console.log('✅ Authentication test passed');
    });

    test('should reject login with missing fields', async ({ request }) => {
      console.log('🔐 Testing authentication with missing fields...');

      const incompleteCredentials = {
        username: 'testuser'
        // Missing password
      };

      const response = await request.post(authEndpoint, {
        data: incompleteCredentials,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`📊 Response status: ${response.status()}`);

      // Should return 401 for incomplete credentials
      expect(response.status()).toBe(401);

      console.log('✅ Missing fields authentication test passed');
    });
  });

  test.describe('API Quality Assurance', () => {
    test('should document and fail on API quality issues', async ({ request }) => {
      console.log('📝 Running API quality checks...');

      const qualityIssues = [];

      // Test 1: Check if booking returns empty array
      try {
        const bookingResponse = await request.post(`${baseUrl}/booking`, {
          data: {
            roomid: 1,
            firstname: 'Test',
            lastname: 'User',
            depositpaid: false,
            bookingdates: { checkin: '2025-07-10', checkout: '2025-07-11' },
            email: 'test@email.fake',
            phone: '1234567890'
          },
          headers: { 'Content-Type': 'application/json' }
        });

        if (bookingResponse.status() === 200) {
          const bookingData = await bookingResponse.json();
          if (Array.isArray(bookingData) && bookingData.length === 0) {
            qualityIssues.push('Booking API returns empty array instead of booking object');
          }
        }
      } catch (error) {
        // Ignore errors for this check
      }

      // Test 2: Check if non-existent room booking is accepted
      try {
        const invalidRoomResponse = await request.post(`${baseUrl}/booking`, {
          data: {
            roomid: 99999,
            firstname: 'Test',
            lastname: 'User',
            depositpaid: false,
            bookingdates: { checkin: '2025-07-10', checkout: '2025-07-11' },
            email: 'test@email.fake',
            phone: '1234567890'
          },
          headers: { 'Content-Type': 'application/json' }
        });

        if (invalidRoomResponse.status() === 200) {
          qualityIssues.push('API accepts bookings for non-existent rooms');
        }
      } catch (error) {
        // Ignore errors for this check
      }

      // Test 3: Check message API response format
      try {
        const messageResponse = await request.post(`${baseUrl}/message`, {
          data: {
            name: 'Test User',
            email: 'test@email.fake',
            phone: '1234567890',
            subject: 'Test',
            description: 'Test message'
          },
          headers: { 'Content-Type': 'application/json' }
        });

        if (messageResponse.status() === 200) {
          const messageData = await messageResponse.json();
          if (messageData.success === true && !messageData.messageid) {
            qualityIssues.push('Message API returns simple success response instead of detailed object');
          }
        }
      } catch (error) {
        // Ignore errors for this check
      }

      console.log('📋 API Quality Issues Found:');
      qualityIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });

      // Fail the test if any quality issues are found
      if (qualityIssues.length > 0) {
        throw new Error(`API Quality Issues Found:\n${qualityIssues.join('\n')}`);
      }

      console.log('✅ No API quality issues found');
    });
  });
});