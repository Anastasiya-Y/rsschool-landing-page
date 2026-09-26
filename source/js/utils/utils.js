const isEscapeKey = (evt) => evt.key === 'Escape';

const createNode = (tag, text, className) => {
  const node = document.createElement(tag);

  if (text !== null) {
    node.textContent = text;
  }

  if (className) {
    node.className = className;
  }

  return node;
};

export {isEscapeKey, createNode};
