VisualDeveloperLite.ElementOption.Margin = {

  group   : "Spacing",
  weight  : 2,
  name    : "Margin",
  cssRule : "margin",
  cssModel: "default",
  allow4InputMap  : true,
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

    if(format.value instanceof Array && format.valueType instanceof Array) {
      var ret = "";

      for(var i = 0; i <= 3; i++) {
        ret += (format.value[i] == 0 ? 0 : format.value[i] + format.valueType[i]);

        ret += (i != 3 ? " " : "");
      }

      return ret;
    }

    return format.value + format.valueType;
  },

  isValid : function(format) {
    return format.value !== "";
  },

  generateFormatByRule : function(cssValue) {
    return VisualDeveloperLite.Utility.getDefaultCSSFormatByRule(cssValue);
  }

};