export const Constants = {
  AUTH_FLOWS: {
    REFRESH_TOKEN_AUTH: 'REFRESH_TOKEN_AUTH',
  },
  HTTP_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    NOT_MODIFIED: 304,
  },
  ERROR_MESSAGES: {
    TITLE_REQUIRED: 'title is required',
    DESCRIPTION_REQUIRED: 'description is required',
    IS_DONE_REQUIRED: 'isDone is required and must be boolean',
    TO_DO_LIST_ID_REQUIRED: 'toDoListId is required',
    FLAG_MUST_BE: "flag is required to be 'DELETE_ALL' or 'DELETE_ONE'",
  },
}
