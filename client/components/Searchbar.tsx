import React from 'react';

const styles = {
  Input: {
    top: '304px',
    left: '20px',
    width: '335px',
    height: '44px',
    padding: '0px 8px',
    border: '0',
    boxSizing: 'border-box',
    borderRadius: '24px',
    boxShadow: '0px 2px 8px rgba(64,60,67,0.24)',
    backgroundColor: '#ffffff',
    color: '#8c8c8c',
    fontSize: '16px',
    fontFamily: 'Roboto',
    lineHeight: '20px',
    outline: 'none',
  },
};

const defaultProps = {
  text: 'Enter car issue here',
};

const Searchbar = () => {
  return (
    <input />
  );
};

export default Searchbar;