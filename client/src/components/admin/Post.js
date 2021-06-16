import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

const Post = ({ posts, loading }) => {
  if (loading) {
    return <h2>Loading...</h2>
  }

  return (
    <ListGroup className='mb-4'>
      {posts.map(post => (
        <ListGroupItem key={post.id}>{post.title}</ListGroupItem>
      ))}
    </ListGroup>
  )
}

export default Post
