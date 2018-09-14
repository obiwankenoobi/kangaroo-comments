# Kangaroo Comments
this is the React compnent you need to use KangarooComments

### what is it?
Kangaroo Comments is a service that provide your app/blog or any other service with beautiful and SIMPLE comments system.

### how to use
First you need to go to [here](https://kangaroocomments.herokuapp.com) and signup.
Now you can add a a new website to your account and use the package.

After you added new website - simply download the library:

`npm i -S kangaroo-comments`

 and use it in your app

```js
  import Comments from 'kangaroo-comments'


  <Comments 
    siteName={'tokenFromAccount'}
    pageName={'uniquePageName'}/>
```

#### `siteName`  
will be the token you created when added new website

#### `pageName` 
will be a unique identifier so I recomend to use `new Date().getTime().toString()` or any other unique `String` you want, good idea can be the *blog title* as well.

Now all you have to do is use this component in your page.

### to run local testing app
```sh
git clone https://github.com/obiwankenoobi/kangaroo-comments.git
cd /project
npm install 
npm start
```

### dont be shy - pull requests are always welcome!(:
