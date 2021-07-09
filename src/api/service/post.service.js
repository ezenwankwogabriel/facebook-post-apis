const axios = require('axios');

const { pageAccessToken, pageId } = require('../../config/vars');
const graphApi = 'https://graph.facebook.com';

exports.publishPost = async ({ message }) => {
  const graphUrl = `${graphApi}/${pageId}/feed?message=${message}&access_token=${pageAccessToken}`;

  const response = await axios.post(graphUrl);
  
  return response.data;
};

exports.uploadPost = async (params, body) => {
  const { pageId } = params;
  const { pathToUrl } = body;
  const graphUrl = `${graphApi}/${pageId}/photos?url=${pathToUrl}&access_token=${pageAccessToken}`;
  
  const response = await axios.post(graphUrl);
  
  return response.data;
};

exports.fetchPosts = async () => {
  const graphUrl = `${graphApi}/${pageId}/feed?access_token=${pageAccessToken}`;

  const response = await axios.get(graphUrl);
  
  return response.data.data;
};

exports.deletePost = async (params) => {
  const { pagePostId } = params;
  const graphUrl = `${graphApi}/${pagePostId}?access_token=${pageAccessToken}`;

  const response = await axios.delete(graphUrl);
  
  return response.data;
};

exports.updatePost = async (params, body) => {
  const { pagePostId } = params;
  const { message } = body;
  const graphUrl = `${graphApi}/${pagePostId}?message=${message}&access_token=${pageAccessToken}`;

  const response = await axios.post(graphUrl);
  
  return response.data;
};

exports.commentOnPost = async (params, body) => {
  const { pagePostId } = params;
  const { message } = body;
  const graphUrl = `${graphApi}/${pagePostId}/comments?message=${message}&access_token=${pageAccessToken}`;

  const response = await axios.post(graphUrl);
  
  return response.data;
};

