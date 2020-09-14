import morgan from "morgan"

const morganMiddleware = () => {
  return morgan("dev");
};

export default morganMiddleware;