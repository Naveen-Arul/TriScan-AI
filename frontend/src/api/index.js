/**
 * API Module Index
 * Central export for all API services
 */

import * as authApi from './auth';
import * as chatApi from './chat';
import * as ocrApi from './ocr';
import * as webApi from './web';
import * as compareApi from './compare';
import * as userApi from './user';
import apiClient from './apiClient';

export {
  authApi,
  chatApi,
  ocrApi,
  webApi,
  compareApi,
  userApi,
  apiClient
};

export default {
  auth: authApi,
  chat: chatApi,
  ocr: ocrApi,
  web: webApi,
  compare: compareApi,
  user: userApi,
  client: apiClient
};
