VisualDeveloperLite.ElementOption.Right = {

  group   : "Position",
  weight  : 3,
  name    : "Right",
  cssRule : "right",
  cssModel: "default",
  format  : {
    value : {
      fieldType       : "input",
      fieldValidation : "numeric"
    },

    valueType : {
      fieldType       : 'select',
      fieldValidation : false,
      fieldOptions    : [ 'px', 'em', 'rem', '%' ]
    }
  },

  generateRuleByFormatResponse : function(format) {
    if(format.value === 0)
      return 0;

    return format.value + format.valueType;
  },

  isValid : function(format) {
    return format.value !== "";
  },

  generateFormatByRule : function(cssValue) {
    return VisualDeveloperLite.Utility.getDefaultCSSFormatByRule(cssValue);
  }

};