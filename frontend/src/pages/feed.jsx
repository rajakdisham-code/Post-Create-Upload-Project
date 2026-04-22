import React ,{useState , useEffect, use}from 'react'
import axios from 'axios';

const feed = () => {
    const [posts, setPosts] = useState([
        {
        _id:"1",
        image:"https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=500&h=500&fit=crop",
        caption:"Beautiful sunset",
        }
    ]) ;

useEffect(() => {
    axios.get('http://localhost:3000/posts')
        .then((res) => {
            setPosts(res.data.posts);
        })
},[]) ;

  return (
    <section className = "feed-section" >
        <h1 className = "feed-heading" > Feed </h1>
        {posts.length > 0 ? (
            posts.map((post) => (
                <div key={post._id} className="post">
                    <img src={post.image} alt={post.caption} className="post-image" />
                    <p className="post-caption">{post.caption}</p>
                </div>
            ))
        ) : (
            <p>No posts available.</p>
        )}
    </section>
  )
}

export default feed