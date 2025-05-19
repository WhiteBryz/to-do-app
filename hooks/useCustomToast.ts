// hooks/useCustomToast.ts
import { useState } from 'react';

export function useCustomToast(duration: number = 5000) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const showToast = (newTitle: string, newMessage?: string) => {
    setTitle(newTitle);
    setMessage(newMessage || '');
    setVisible(true);
    setTimeout(() => setVisible(false), duration);
  };

  return { visible, title, message, showToast };
}
