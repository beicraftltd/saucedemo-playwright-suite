export const USERS = {
  STANDARD: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  LOCKED_OUT: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  },
  PROBLEM: {
    username: 'problem_user',
    password: 'secret_sauce'
  }
} as const;

export const PRODUCTS = {
  BACKPACK: {
    name: 'Sauce Labs Backpack',
    price: '$29.99',
    addToCartId: 'add-to-cart-sauce-labs-backpack'
  },
  BIKE_LIGHT: {
    name: 'Sauce Labs Bike Light',
    price: '$9.99',
    addToCartId: 'add-to-cart-sauce-labs-bike-light'
  },
  BOLT_TSHIRT: {
    name: 'Sauce Labs Bolt T-Shirt',
    price: '$15.99',
    addToCartId: 'add-to-cart-sauce-labs-bolt-t-shirt'
  },
  FLEECE_JACKET: {
    name: 'Sauce Labs Fleece Jacket',
    price: '$49.99',
    addToCartId: 'add-to-cart-sauce-labs-fleece-jacket'
  },
  ONESIE: {
    name: 'Sauce Labs Onesie',
    price: '$7.99',
    addToCartId: 'add-to-cart-sauce-labs-onesie'
  },
  TEST_ALL_THINGS: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: '$15.99',
    addToCartId: 'add-to-cart-test.allthethings()-t-shirt-(red)'
  }
} as const;

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
  USERNAME_REQUIRED: 'Epic sadface: Username is required',
  PASSWORD_REQUIRED: 'Epic sadface: Password is required',
  FIRST_NAME_REQUIRED: 'Error: First Name is required',
  LAST_NAME_REQUIRED: 'Error: Last Name is required',
  POSTAL_CODE_REQUIRED: 'Error: Postal Code is required'
} as const;

export const URLS = {
  BASE_URL: 'https://www.saucedemo.com',
  LOGIN: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html'
} as const; 