const CUSTOM_STATUS_CODE = {
  user_not_fond: 1001,
  fail_to_log: 1002,
  user_expired: 1003,
  db_not_connected: 1004,
};

const DEFAULT_STATUS_CODE = {
  ok: 200,
  created: 201,
  no_content: 204,
  bad_request: 400,
  unauthorized: 401,
  interval_server_error: 500,
};

type CustomStatusType = typeof CUSTOM_STATUS_CODE;
type DefaultStatusCode = typeof DEFAULT_STATUS_CODE;

export {
  CUSTOM_STATUS_CODE,
  DEFAULT_STATUS_CODE,
  type CustomStatusType,
  type DefaultStatusCode,
};
