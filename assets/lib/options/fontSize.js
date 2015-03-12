VisualDeveloperLite.ElementOption.FontSize = {

  group   : "Text",
  weight  : 2,
  name    : "Font Size",
  cssRule : "font-size",
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
    return format.value + format.valueType;
  },

  isValid : function(format) {
    return format.value !== "";
  },

  generateFormatByRule : function(cssValue) {
    return VisualDeveloperLite.Utility.getDefaultCSSFormatByRule(cssValue);
  }

};