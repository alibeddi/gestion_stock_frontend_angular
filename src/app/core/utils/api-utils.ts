/**
 * Utility functions for handling API responses
 */

/**
 * Extracts data from various API response formats
 * @param response The API response object
 * @returns The extracted data or the original response
 */
export function extractData<T>(response: any): T {
  if (!response) {
    return response;
  }

  // Handle Spring Data response format with data property
  if (response.data !== undefined) {
    return response.data;
  }

  // Handle Spring Data Page response format with content property
  if (response.content !== undefined) {
    return response.content;
  }

  // Return the response itself if it doesn't match known formats
  return response;
}

/**
 * Debug function to log API response structure to help diagnose issues
 * @param response The API response to analyze
 * @param label Optional label to identify the log
 */
export function debugApiResponse(
  response: any,
  label: string = "API Response"
): void {
  console.group(label);
  console.log("Full response:", response);

  // Analyze response structure
  const structure = {
    hasData: response && response.data !== undefined,
    hasContent: response && response.content !== undefined,
    hasSuccess: response && response.success !== undefined,
    hasTotalElements: response && response.totalElements !== undefined,
    hasMessage: response && response.message !== undefined,
    topLevelKeys: response ? Object.keys(response) : [],
  };

  console.log("Response structure:", structure);

  // Extract and log the actual data
  let extractedData;
  if (structure.hasData) {
    extractedData = response.data;
    console.log("Extracted from data property:", extractedData);
  } else if (structure.hasContent) {
    extractedData = response.content;
    console.log("Extracted from content property:", extractedData);
  } else {
    extractedData = response;
    console.log("Using raw response as data");
  }

  // Log data type information
  if (extractedData) {
    if (Array.isArray(extractedData)) {
      console.log("Data is an array with", extractedData.length, "items");
      if (extractedData.length > 0) {
        console.log("First item structure:", Object.keys(extractedData[0]));
      }
    } else if (typeof extractedData === "object") {
      console.log("Data is an object with keys:", Object.keys(extractedData));
    } else {
      console.log("Data type:", typeof extractedData);
    }
  } else {
    console.log("No data available");
  }

  console.groupEnd();
}
