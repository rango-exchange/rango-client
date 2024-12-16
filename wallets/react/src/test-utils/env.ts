const TEST_ENVIRONMENT_AGENT = 'HappyDOM/0.0.0';

/**
 * Detecting wether our code is running in a test environment or not.
 *
 * Note: This is only useful when HappyDOM or jsdom has been added to test runner.
 */
export function isRunningInTestEnvironmentWithDom(): boolean {
  return navigator.userAgent.includes(TEST_ENVIRONMENT_AGENT);
}
