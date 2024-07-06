// suppress the findDOMNode error until the issue - https://github.com/ant-design/ant-design/issues/26136 - resolved

const config = {
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /*@ts-ignore*/
  baseURL: process.env.NODE_ENV === 'production' ? window.location.origin || 'http://localhost:9002' : process.env.REACT_APP_BASE_URL || 'http://localhost:9002', // Fallback in case the environment variable is not set
};

export default config;

// const consoleError = console.error.bind(console);
// console.error = (errObj, ...args) => {
//   if (process.env.NODE_ENV === 'development' && typeof errObj === 'string' && args.includes('findDOMNode')) {
//     return;
//   }
//   consoleError(errObj, ...args);
// };

// export default {};
