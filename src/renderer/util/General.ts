// Contains general utility functions

// Asynchronous sleeping
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
