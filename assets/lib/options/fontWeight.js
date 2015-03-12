VisualDeveloperLite.ElementOption.FontWeight = {

  group   : "Text",
  weight  : 4,
  name    : "Font Weight",
  cssRule : "font-weight",
  cssModel: "single",
  format  : {
    value : {
      fieldType       : 'select',
      fieldValidation : false,
      fieldOptions    : [ "inherit", "initial" , "normal", "bold" ]
    }
  },

  generateRuleByFormatResponse : function(format) {
    return format.value;
  }

};