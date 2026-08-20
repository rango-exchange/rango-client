/**
 * Dynamically import a module and refine the error.
 *
 * @param importer - lazy import callback.
 * @returns A promise resolving to the imported module.
 */
export async function dynamicImportWithRefinedError<T>(
  importer: () => Promise<T>
): Promise<T> {
  try {
    return await importer();
  } catch (error) {
    throw new Error(
      'A network error occurred while processing your request. Please check your internet connection or refresh the page and try again.',
      {
        cause: error,
      }
    );
  }
}
