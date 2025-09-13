/**
 * File Explorer Error Message Constants
 * Error messages for user display and logging
 */
export const FILE_EXPLORER_ERROR_MESSAGES = {
  // User-facing error messages
  INVALID_FILE_NAME: 'Invalid file name',
  FILE_ALREADY_EXISTS: 'File already exists',
  CREATE_FILE_ERROR: 'Error creating file',
  CREATE_FOLDER_ERROR: 'Error creating folder',
  RENAME_ERROR: 'Failed to rename file',
  COPY_PATH_ERROR: 'Failed to copy path to clipboard',
  MESSAGE_PARSING: 'Failed to load file data',
  UNKNOWN_MESSAGE: 'Received invalid data from server',

  // Log error messages (for console)
  LOG_RENAME_OPERATION_FAILED: 'Rename operation failed:',
  LOG_COPY_PATH_FAILED: 'Failed to copy path to clipboard:',
  LOG_MESSAGE_PARSING_FAILED: 'Message parsing failed:',
} as const
