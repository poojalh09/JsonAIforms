import { useState } from 'react';

export const useTableSuggestions = () => {
  const [suggestions, setSuggestions] = useState('');
  const [useCase, setUseCase] = useState('');

  const handleSuggestionClick = (suggestion: string) => {
    setUseCase(suggestion);
  };

  return {
    suggestions,
    setSuggestions,
    useCase,
    setUseCase,
    handleSuggestionClick
  };
};
