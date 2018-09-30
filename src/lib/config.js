const helpers = {
  __DEBUG__: false,
  alertD: function(...args) {
    if (this.__DEBUG__) {
      args.map(arg => {
        console.log(arg);
      });
    }
  },
  server: 'http://10.0.0.14:3011', //https://commentssystem.herokuapp.com
  siteName:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3ZWJzaXRlTmFtZSI6InRlc3RpbmciLCJpYXQiOjE1MzY3NTM3ODd9.dVn2x_8SCnEGtCpU2lZsH8xXGkU9MdayT0h_OhxWyaM',
  pageName: 'page1',
};

export default helpers;
