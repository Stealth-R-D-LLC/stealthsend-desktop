import tooltipDirective from "./tooltip/";

// register all directives
const directives = (app) => {
  tooltipDirective(app);
};

export default directives;
