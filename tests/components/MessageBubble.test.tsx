import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MessageBubble } from './MessageBubble';
import { Message, User } from '@/types';

describe('MessageBubble', () => {
  const user: User = {
    id: 1,
    name: 'Alice',
    avatar: '',
    email: 'alice@example.com',
    // ...other user fields as needed
  };

  const message: Message = {
    id: 101,
    sender: user,
    content: 'Hello, world!',
    timestamp: Date.now(),
    type: 'TEXT',
    reactions: [],
    // ...other message fields as needed
  };

  it('renders the sender name and message content', () => {
    render(
      <MessageBubble
        message={message}
        user={user}
        currentUserId={2} // not the sender
      />
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });
}); 