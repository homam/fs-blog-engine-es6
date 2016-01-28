require('whatwg-fetch')

let trace = (x) => {
  console.log(x)
  return x
}

let fetch1 = (path, body = null) => new Promise((resolve, reject) => {
  console.log("fetch1", body)
  let options = (body == null) ? {} : {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  return fetch('http://fs-blog-engine.herokuapp.com' + path, options)
    .then(it => 
      it.json()
      .then(res => [it.ok, res])
      .then(([ok, res]) => ok ? resolve(res) : reject(res.errorContext)))
    .catch(_ => reject('Network Error'))
})


// public interface:

export default {
  all: _ => fetch1('/api/all'),

  get: (postid) => fetch1('/api/get/' + postid),
  
  // add :: NewPost -> Promise Post
  add: (newPost) => fetch1('/api/new', newPost),

  // update :: Post -> Promise Post
  update: (post) =>  fetch1('/api/update', post),

  // remove :: PostId (Integer) -> Promise Post
  remove: (postid) => fetch1(`/api/delete/${postid}`, {}),

  // restore :: Post -> Promise Post
  restore: (post) => fetch1('/api/restore', post)
  
}