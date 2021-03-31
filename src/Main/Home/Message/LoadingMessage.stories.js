import React from 'react';

import LoadingMessage from './LoadingMessage';

export default {
    title: 'Message/Message/Loading Message',
    component: LoadingMessage
}

export const Template = (args) => <LoadingMessage {...args}/>

Template.storyName = "Loading Message";

Template.args = {}
