VisualDeveloperLite.ElementOption.Display = {

  group   : "Misc",
  weight  : 4,
  name    : "Display",
  cssRule : "display",
  cssModel: "single",
  format  : {
    value : {
      fieldType       : 'select',
      fieldValidation : false,
      fieldOptions    : [ 'inherit', 'initial', 'inline', 'block', 'inline-block', "none", "run-in", "flex" ]
    }
  },

  generateRuleByFormatResponse : function(format) {
    return format.value;
  },

  generateFormatByRule : function(cssValue) {
    return {
      value     : cssValue
    };
  }

};