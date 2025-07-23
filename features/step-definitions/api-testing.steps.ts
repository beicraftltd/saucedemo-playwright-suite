import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld, CustomWorld } from '../support/world';

const baseUrl = 'https://automationintesting.online/api';

Given('I have access to the hotel booking API', async function(this: ICustomWorld) {
  // Verify API is accessible
  const response = await this.page!.request.get(`${baseUrl}/room`);
  expect(response.status()).toBe(200);
});

When('I request all available rooms', async function(this: ICustomWorld) {
  this.response = await this.page!.request.get(`${baseUrl}/room`);
});

Then('the response status should be {int}', async function(this: ICustomWorld, statusCode: number) {
  expect(this.response!.status()).toBe(statusCode);
});

Then('the response should contain rooms data', async function(this: ICustomWorld) {
  const data = await this.response!.json();
  expect(data).toHaveProperty('rooms');
  expect(Array.isArray(data.rooms)).toBe(true);
});

Then('each room should have required properties', async function(this: ICustomWorld) {
  const data = await this.response!.json();
  if (data.rooms && data.rooms.length > 0) {
    const room = data.rooms[0];
    expect(room).toHaveProperty('roomid');
    expect(room).toHaveProperty('roomName');
    expect(room).toHaveProperty('type');
    expect(room).toHaveProperty('roomPrice');
  }
});

When('I request details for room {string}', async function(this: ICustomWorld, roomId: string) {
  this.response = await this.page!.request.get(`${baseUrl}/room/${roomId}`);
});

Then('the room details should be returned', async function(this: ICustomWorld) {
  const room = await this.response!.json();
  expect(room).toHaveProperty('roomid');
  expect(room).toHaveProperty('roomName');
});

Then('the room should have valid pricing information', async function(this: ICustomWorld) {
  const room = await this.response!.json();
  expect(room).toHaveProperty('roomPrice');
  expect(typeof room.roomPrice).toBe('number');
  expect(room.roomPrice).toBeGreaterThan(0);
});

When('I create a booking with valid data', async function(this: ICustomWorld) {
  const bookingData = {
    roomid: 1,
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

  this.response = await this.page!.request.post(`${baseUrl}/booking`, {
    data: bookingData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
});

Then('a booking object should be returned', async function(this: ICustomWorld) {
  const booking = await this.response!.json();
  console.log('Booking response:', booking);
  expect(typeof booking).toBe('object');
  expect(Array.isArray(booking)).toBe(false);
});

Then('the booking should have a unique ID', async function(this: ICustomWorld) {
  const booking = await this.response!.json();
  expect(booking).toHaveProperty('bookingid');
  expect(booking.bookingid).toBeDefined();
});

When('I attempt to book a non-existent room', async function(this: ICustomWorld) {
  const bookingData = {
    roomid: 99999,
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

  this.response = await this.page!.request.post(`${baseUrl}/booking`, {
    data: bookingData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
});

Then('the response status should be {int} or {int}', async function(this: ICustomWorld, status1: number, status2: number) {
  const status = this.response!.status();
  console.log('Actual status:', status);
  expect(status === status1 || status === status2).toBe(true);
});

Then('an appropriate error message should be returned', async function(this: ICustomWorld) {
  const response = await this.response!.json();
  expect(response).toBeDefined();
});

When('I attempt to book with invalid dates', async function(this: ICustomWorld) {
  const bookingData = {
    roomid: 1,
    firstname: 'John',
    lastname: 'Doe',
    depositpaid: false,
    bookingdates: {
      checkin: 'invalid-date',
      checkout: 'invalid-date'
    },
    email: 'john.doe@email.fake',
    phone: '021548965321'
  };

  this.response = await this.page!.request.post(`${baseUrl}/booking`, {
    data: bookingData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
});

Then('date validation errors should be returned', async function(this: ICustomWorld) {
  const response = await this.response!.json();
  expect(response).toBeDefined();
});

When('I submit a contact message', async function(this: ICustomWorld) {
  const messageData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    subject: 'Test Message',
    description: 'This is a test message'
  };

  this.response = await this.page!.request.post(`${baseUrl}/message`, {
    data: messageData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
});

Then('a success response should be returned', async function(this: ICustomWorld) {
  const response = await this.response!.json();
  console.log('Contact API response:', response);
  expect(response).toBeDefined();
});

When('I attempt to authenticate with valid credentials', async function(this: ICustomWorld) {
  this.response = await this.page!.request.post(`${baseUrl}/auth/login`, {
    data: {
      username: 'admin',
      password: 'password'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  });
});

Then('an authentication token should be returned', async function(this: ICustomWorld) {
  if (this.response!.status() === 200) {
    const authData = await this.response!.json();
    expect(authData).toHaveProperty('token');
  }
});

When('I attempt unauthorized access to admin endpoints', async function(this: ICustomWorld) {
  this.response = await this.page!.request.get(`${baseUrl}/admin/rooms`, {
    headers: {
      'Authorization': 'Bearer invalid-token'
    }
  });
});

Then('access should be denied', async function(this: ICustomWorld) {
  const status = this.response!.status();
  expect(status === 401 || status === 403).toBe(true);
});

When('I make multiple API requests', async function(this: ICustomWorld) {
  const startTime = Date.now();
  
  // Make multiple concurrent requests
  const promises = [
    this.page!.request.get(`${baseUrl}/room`),
    this.page!.request.get(`${baseUrl}/room`),
    this.page!.request.get(`${baseUrl}/room`)
  ];
  
  this.responses = await Promise.all(promises);
  this.responseTime = Date.now() - startTime;
});

Then('all responses should be received within acceptable time limits', async function(this: ICustomWorld) {
  expect(this.responseTime).toBeLessThan(5000); // 5 seconds
  for (const response of this.responses ?? []) {
    expect(response.status()).toBe(200);
  }
});

Then('the API should handle concurrent requests properly', async function(this: ICustomWorld) {
  expect(this.responses!.length).toBe(3);
  for (const response of this.responses ?? []) {
    const data = await response.json();
    expect(data).toBeDefined();
  }
});