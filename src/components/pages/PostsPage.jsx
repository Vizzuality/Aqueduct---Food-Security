import React from 'react';

import PostList from 'containers/pages/PostList';

class PostsPage extends React.Component {

  componentWillMount() {
    this.props.getPosts();
  }

  render() {
    return (
      <div>
        {this.props.posts.postsLoading && 'loading...'}
        <PostList posts={this.props.posts} />
      </div>
    );
  }
}

PostsPage.propTypes = {
  // STATE
  posts: React.PropTypes.object,

  // ACTIONS
  getPosts: React.PropTypes.func
};


export default PostsPage;
