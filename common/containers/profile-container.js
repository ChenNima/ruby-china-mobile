import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import ProfileUserDetails from '../components/profile-container/profile-user-details';
import ProfileNavigation from '../components/profile-container/profile-navigation';
import ProfileTopicList from '../components/profile-container/profile-topic-list';
import ProfileReplyList from '../components/profile-container/profile-reply-list';
import ProfileUserList from '../components/profile-container/profile-user-list';
import Spinner from '../components/shared/spinner';
import { getToken } from '../lib/util';
import { refreshAccessToken } from '../actions/application';
import {
  getUserProfileAndTopics,
  getUserTopics,
  getUserReplies,
  getUserFollowers,
  getUserFollow
} from '../actions/user';

class ProfileContainer extends Component {

  constructor(props) {

    super(props);
    this.renderProfileList = this.renderProfileList.bind(this);
    this.changeNavigationTab = this.changeNavigationTab.bind(this);

    this.state = {
      selectedTab: 0,
      isLoading: true,
      isLoadingMore: false,
      isLoadingTab: false,
      user: null
    }
  }

  componentDidMount() {

    const { dispatch, entities, location, params } = this.props;
    let username;

    if ( location.pathname === '/me' ) {
      username = getToken().username;
    } else {
      username = params.username;
    }

    window.scrollTo(0, 0);
    this.setState({ isLoading: true });
    dispatch(getUserProfileAndTopics(username))
      .then( () => {
        this.setState({
          isLoading: false,
          user: this.props.entities.users[username]
        });
      })
      .catch( e => {
        this.setState({ isLoading: false });
      });
  }

  changeNavigationTab(tab) {

    const { user } = this.state;
    const { dispatch, params } = this.props;

    switch (tab) {
      case 0:
        if (user['topics_count'] > 0 && (typeof user.topics === 'undefined' ||  user.topics.length === 0)) {
          this.setState({ isLoadingTab: true });
          dispatch(getUserTopics(params.username))
            .then( () => this.setState({ isLoadingTab: false }))
            .catch( e => this.setState({ isLoadingTab: false }));
        }
        break;
      case 1:
        if (user['replies_count'] > 0 && (typeof user.replies === 'undefined' || user.replies.length === 0)) {
          this.setState({ isLoadingTab: true });
          dispatch(getUserReplies(params.username))
            .then( () => this.setState({ isLoadingTab: false }))
            .catch( e => this.setState({ isLoadingTab: false }));
        }
        break;
      case 2:
        if (user['follow_count'] > 0 && (typeof user.follow === 'undefined' || user.follow.length === 0)) {
          this.setState({ isLoadingTab: true });
          dispatch(getUserFollow(params.username))
            .then( () => this.setState({ isLoadingTab: false }))
            .catch( e => this.setState({ isLoadingTab: false }));
        }
        break;
      case 3:
        if (user['followers_count'] > 0 && (typeof user.followers === 'undefined' || user.followers.length === 0)) {
          this.setState({ isLoadingTab: true });
          dispatch(getUserFollowers(params.username))
            .then( () => this.setState({ isLoadingTab: false }))
            .catch( e => this.setState({ isLoadingTab: false }));
        }
        break;
    }

    this.setState({ selectedTab: tab });
  }

  renderProfileList() {

    if (this.state.isLoadingTab) {
      return <Spinner />;
    }

    switch (this.state.selectedTab) {
      case 0:
        return <ProfileTopicList />;
        break;
      case 1:
        return <ProfileReplyList />;
        break;
      case 2:
        return <ProfileUserList />;
        break;
      case 3:
        return <ProfileUserList />;
        break;
      default:
        return <ProfileTopicList />;
    }
  }

  render() {

    if (this.state.isLoading) {
      return <Spinner />
    }

    console.log(this.state.user);

    return (
      <div>
        <ProfileUserDetails user={this.state.user} />
        <ProfileNavigation changeTab={this.changeNavigationTab} selectedTab={this.state.selectedTab} />
        { this.renderProfileList() }
      </div>
    );
  }
}

function mapStateToProps(state) {

  const { entities, topic, reply, user } = state;
  return {
    topic,
    reply,
    user,
    entities
  }
}

export default connect(mapStateToProps)(ProfileContainer);


