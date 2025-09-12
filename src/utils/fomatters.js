const capitalize = (s) => {
  if (!s) return "";
  return `${s[0].toUpperCase()}${s.slice(1).toLowerCase()}`;
};

const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true,
  };
};

export { capitalize, generatePlaceholderCard };
