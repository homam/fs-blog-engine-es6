# Live App
Please check the live app at: [https://fs-blog-engine.herokuapp.com/](https://fs-blog-engine.herokuapp.com/)

# Features

* Add / Remove / Update posts
* The index route fetches the updates the content in realtime using Socket.IO
* Restoring deleted posts
* Markdown support

# Run the App locally

I am using [nwb](https://github.com/insin/nwb)

```
$ nvm use 5.3.0 
$ npm install -g nwb
$ npm install
$ nwb serve --auto-install
```

# Technology Choices

* Babel
* Redux
* webpack
* Socket.IO'
* Stylus

# Scalability

* Dependency Injection (in API and actions) used for testing
* React Stateless Reusable Components


# Unit Tests

```
$ nwb test
```

Or just `$ npm run test`
