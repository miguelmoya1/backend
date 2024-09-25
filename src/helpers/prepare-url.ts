export const prepareUrl = (url: string) => {
  if (!url.startsWith('/')) {
    url = `/${url}`;
  }

  if (!url.endsWith('/')) {
    url = `${url}/`;
  }

  url = url.replace(/\/\//g, '/');

  return url;
};
