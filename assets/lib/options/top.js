VisualDeveloperLite.ElementOption.Top = {

  group   : "Position",
  weight  : 2,
  name    : "Top",
  cssRule : "top",
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