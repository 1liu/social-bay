let db = {
  posts: [
    {
      userHandle: 'user',
      body: 'dummy',
      createdAt: "2020-07-08T04:50:56.919Z",
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: 'user',
      postId: 'idididid',
      body: 'Hello!',
      createdAt: '2019-03-15T10:59:52.798Z'
    }
  ],
  users: [
    {
      userId: 'dfsgsdfga',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2020-07-08T04:50:56.919Z',
      imageUrl: 'image/dfghdfg',
      bio: 'Hello World',
      website: 'https://user.com',
      location: 'LA, USA'
    }
  ],
  notifications: [
    {
      recipient: 'user',
      sender: 'john',
      read: 'true | false',
      screamId: 'sssssss',
      type: 'like | comment',
      createdAt: '2020-07-08T04:50:56.919Z'
    }
  ]
}
