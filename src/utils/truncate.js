const truncate = (input, limit) => input.length > limit ? `${input.substring(0, limit)}...` : input;

export default truncate;