var VisualDeveloperLite = {

  namespace      : 'visual-developer-lite',
  styleNamespace : 'visual-developer-lite-',
  fieldNamespace : 'visual_developer_lite_',

  _settings : {
    clearClass                      : "clear",
    externalCSSResourcesContainerID : 'external-css-resources',
    supportStylesheetID             : 'synchronize_support_stylesheet',
    supportFooterStylesheetID       : 'synchronize_support_footer_stylesheet'
  },

  hiddenElementOptions                 : [],
  hiddenSelectorOptions                : [],
  hasSettingSpectralModeDefaultEnabled : 0,
  hasSettingEMOptionDefaultSelected    : 0,
  hasSettingEnableColorPicker          : 1,
  hasSettingEnableKeyboardArrowSupport : 1,
  hasSettingEnableElementPanelFilter   : 1,
  hasSettingFieldDefaultValue          : 0,
  hasSettingEnableAdvancedFeatures     : 1,
  hasSettingEnableImportantElement     : 1,
  externalCSSResources                 : [],
  externalCSSResourcesContainerObject  : false,

  universalEventSettingsUpdate  : 'settings_update',
  universalFilterSettingsExport : 'settings_export',
  universalFilterStylesheetFile : 'stylesheet_file',

  /**
   * This object is very complex and required for the Element Generic Path generation
   */
  _classInterpretationSettings : {
    "*"  : [
      "visual-developer-lite-^"
    ],
    post : [
      "hentry", "status-publish",
      "category-^", "post-^", "format-^"
    ],
    page_item : [
      "page-item-^"
    ]
  },

  _absoluteClassInterpretationSettings : {
    "*"  : [
      "visual-developer-lite-^"
    ]
  },

  toolbarObject : {},
  toolbarIdentifier : "#wpadminbar",

  Init : function() {
    this._initSettings();
    this._initEventAndFilterManager();
    this._initFunctionalityModules();

    this._registerFunctionalityEvents();
  },

  _initSettings : function() {
    this.toolbarObject        = jQuery(this.toolbarIdentifier);
    this._settings.clearClass = this.styleNamespace + this._settings.clearClass;
    this._settings.externalCSSResourcesContainerID = this.styleNamespace + this._settings.externalCSSResourcesContainerID;
  },

  _initEventAndFilterManager : function() {
    this.EventManager             = jQuery.extend(true, {}, this.EventManager);
    VisualDeveloperLite.EventManager.Init(this);

    this.FilterManager             = jQuery.extend(true, {}, this.FilterManager);
    VisualDeveloperLite.FilterManager.Init(this);

    this.EventManager.registerEvent(this.universalEventSettingsUpdate);
    this.FilterManager.registerFilter(this.universalFilterSettingsExport);
  },

  /**
   * Initiate Different Instances, keep it all clean.
   * @private
   */
  _initFunctionalityModules : function() {
    this.Panel                    = jQuery.extend(true, {}, this.Panel);
    this.Navigation               = jQuery.extend(true, {}, this.Navigation);
    this.NavigationPanel          = jQuery.extend(true, {}, this.NavigationPanel);
    this.ElementPanel             = jQuery.extend(true, {}, this.ElementPanel);
    this.ElementOperations        = jQuery.extend(true, {}, this.ElementOperations);
    this.SettingsPanel            = jQuery.extend(true, {}, this.SettingsPanel);
    this.ProgressPanel            = jQuery.extend(true, {}, this.ProgressPanel);
    this.ApplicationSynchronize   = jQuery.extend(true, {}, this.ApplicationSynchronize);
    this.Utility                  = jQuery.extend(true, {}, this.Utility);

    VisualDeveloperLite.Panel.Init(this);
    VisualDeveloperLite.Navigation.Init(this);
    VisualDeveloperLite.NavigationPanel.Init(this);
    VisualDeveloperLite.ElementPanel.Init(this);
    VisualDeveloperLite.ElementOperations.Init(this);
    VisualDeveloperLite.SettingsPanel.Init(this);
    VisualDeveloperLite.ProgressPanel.Init(this);
    VisualDeveloperLite.ApplicationSynchronize.Init(this);
    VisualDeveloperLite.Utility.Init(this);
  },

  _registerFunctionalityEvents : function() {
    this.FilterManager.listenFilter(
        this.universalFilterSettingsExport,
        this,
        '_filterExportStylesheet'
    );

    this.FilterManager.listenFilter(
        this.universalFilterSettingsExport,
        this,
        '_filterExportJSON'
    );

    this.EventManager.listenEvent(
        this.universalEventSettingsUpdate,
        this,
        '_eventSettingsUpdate'
    );
  },

  _filterExportStylesheet : function(currentInformation) {
    currentInformation.stylesheet = '';

    jQuery.each(this.externalCSSResources, function(key, value) {
      currentInformation.stylesheet += '@import url("' + value + '");' + "\n";
    });

    currentInformation.stylesheet = this.FilterManager.parseFilter(
        this.universalFilterStylesheetFile, currentInformation.stylesheet
    );

    return currentInformation;
  },

  _eventSettingsUpdate : function(JSONInformation) {
    var objectInstance = this;

    jQuery('#' + this._settings.supportStylesheetID).remove();
    jQuery('#' + this._settings.supportFooterStylesheetID).remove();

    if(typeof JSONInformation.supportStylesheet !== "undefined" && JSONInformation.supportStylesheet != false)
      jQuery("head").append('<style id="' + this._settings.supportStylesheetID + '">@import url("' + JSONInformation.supportStylesheet + '")</style>');

    if(typeof JSONInformation.supportFooterStylesheet !== "undefined" && JSONInformation.supportFooterStylesheet != false)
      jQuery("body").append('<style id="' + this._settings.supportFooterStylesheetID + '">@import url("' + JSONInformation.supportFooterStylesheet + '")</style>');

    if(typeof JSONInformation['settings'] !== "undefined")
      objectInstance.hiddenElementOptions = JSONInformation['settings'];

    if(typeof JSONInformation['optionsJSON'] !== "undefined") {
      jQuery.each(JSONInformation.optionsJSON, function(key, value){
        objectInstance[key] = (value === "0" ? 0 : value);
      });
    }

    if(typeof JSONInformation.selectorOptionsJSON !== "undefined")
      objectInstance.hiddenSelectorOptions = JSONInformation['selectorOptionsJSON'];

    if(typeof JSONInformation.dependency !== "undefined") {
      this._injectDependencyWithinApplication(JSONInformation.dependency);
    }
  },

  _filterExportJSON : function(currentInformation) {
    currentInformation.settingsArrayPack   = this.hiddenElementOptions;
    currentInformation.selectorOptionsJSON = this.hiddenSelectorOptions;
    currentInformation.optionsJSON         = {
      'hasSettingSpectralModeDefaultEnabled' : this.hasSettingSpectralModeDefaultEnabled,
      'hasSettingEMOptionDefaultSelected'    : this.hasSettingEMOptionDefaultSelected,
      'hasSettingEnableColorPicker'          : this.hasSettingEnableColorPicker,
      'hasSettingEnableKeyboardArrowSupport' : this.hasSettingEnableKeyboardArrowSupport,
      'hasSettingEnableElementPanelFilter'   : this.hasSettingEnableElementPanelFilter,
      'hasSettingFieldDefaultValue'          : this.hasSettingFieldDefaultValue,
      'hasSettingEnableAdvancedFeatures'     : this.hasSettingEnableAdvancedFeatures
    };

    return currentInformation;
  },

  /**
   * @return {string}
   */
  GetElementAbsolutePath : function(jQueryElement) {
    var elementPath    = '',
        currentElement = jQueryElement;

    var i = 1;do {
      var currentElementPath = currentElement[0].tagName.toLowerCase();

      if(typeof currentElement.attr("id") !== "undefined")
        if(jQuery.trim(currentElement.attr("id")) != "")
          currentElementPath += '#' + currentElement.attr("id");

      if(currentElement[0].tagName !== "BODY" && currentElement[0].tagName !== "body" &&
          typeof currentElement.attr("class") !== "undefined") {
        var currentClassList = currentElement.attr("class").split(" ");

        jQuery.each(this._absoluteClassInterpretationSettings, function(presentInterpretationClass, removedClasses) {
          if(jQuery.inArray(presentInterpretationClass, currentClassList) || presentInterpretationClass === "*") {
            jQuery.each(removedClasses, function(index, currentRemovedClass) {
              for(var indexLevel = 0; indexLevel < currentClassList.length; indexLevel++) {
                var currentClass = currentClassList[indexLevel];

                if(currentClass === currentRemovedClass) {
                  currentClassList.splice(indexLevel, 1);
                  indexLevel--;
                } else if(currentRemovedClass.indexOf("^") !== -1 &&
                    currentClass.indexOf(currentRemovedClass.substr(0, currentRemovedClass.length - 1)) === 0) {
                  currentClassList.splice(indexLevel, 1);
                  indexLevel--;
                }
              }
            });
          }
        });

        if(currentClassList.length > 0) {
          var currentClassNode = jQuery.trim("." + currentClassList.join("."));

          currentElementPath += (currentClassNode != "." ? currentClassNode : '');

        }
      }

      elementPath    = currentElementPath + (elementPath !== '' ? ' > ' : '') + elementPath;
      currentElement = currentElement.parent();i++;
    } while(currentElement[0].tagName !== 'HTML' && currentElement[0].tagName !== 'html');

    return elementPath;
  },

  /**
   * @return {string}
   */
  GetElementGenericPath : function(jQueryElement, ignoreClass) {
    var elementPath    = '',
        currentElement = jQueryElement;
        ignoreClass    = (typeof ignoreClass === "undefined" ? true : ignoreClass);

    var i = 1;do {
      var currentElementPath = currentElement[0].tagName.toLowerCase();

      if(currentElement[0].tagName !== "BODY" && currentElement[0].tagName !== "body" &&
          typeof currentElement.attr("class") !== "undefined" && ignoreClass == false) {
        var currentClassList = currentElement.attr("class").split(" ");

        jQuery.each(this._classInterpretationSettings, function(presentInterpretationClass, removedClasses) {
          if(jQuery.inArray(presentInterpretationClass, currentClassList) !== -1 || presentInterpretationClass === "*") {
            jQuery.each(removedClasses, function(index, currentRemovedClass) {
              for(var indexLevel = 0; indexLevel < currentClassList.length; indexLevel++) {
                var currentClass = currentClassList[indexLevel];

                if(currentClass === currentRemovedClass) {
                  currentClassList.splice(indexLevel, 1);
                  indexLevel--;
                } else if(currentRemovedClass.indexOf("^") !== -1 &&
                    currentClass.indexOf(currentRemovedClass.substr(0, currentRemovedClass.length - 1)) === 0) {
                  currentClassList.splice(indexLevel, 1);
                  indexLevel--;
                }
              }
            });
          }
        });

        if(currentClassList.length > 0) {
          var currentClassNode = jQuery.trim("." + currentClassList.join("."));

          currentElementPath += (currentClassNode != "." ? currentClassNode : '');

        }
      }

      elementPath    = currentElementPath + (elementPath !== '' ? ' > ' : '') + elementPath;
      currentElement = currentElement.parent();i++;
    } while(currentElement[0].tagName !== 'HTML' && currentElement[0].tagName !== 'html');

    return elementPath;
  },

  PrefixNonEventSettings : function(settingsObject, namespace) {
    jQuery.each(settingsObject, function(key, value){
      if (key.endsWith("ID")
          || key.endsWith("Class"))
        settingsObject[key] = namespace + value;

      if(key.endsWith("Attribute") || key.endsWith("Attr"))
        settingsObject[key] = 'data-' + namespace + value;
    });

    return settingsObject;
  },

  SyncLayoutWithExternalCSSDependencies : function() {
    var styleSheetContent = '';

    jQuery.each(this.externalCSSResources, function(key, value) {
      styleSheetContent += '@import url("' + value + '");' + "\n";
    });

    if(styleSheetContent == '') {
      if(this.externalCSSResourcesContainerObject != false) {
        this.externalCSSResourcesContainerObject.remove();
        this.externalCSSResourcesContainerObject = false;
      }

      return;
    }

    if(this.externalCSSResourcesContainerObject == false) {
      jQuery("head").append('<style id="' + this._settings.externalCSSResourcesContainerID + '"></style>');

      this.externalCSSResourcesContainerObject = jQuery("#" + this._settings.externalCSSResourcesContainerID);
    }

    this.externalCSSResourcesContainerObject.html(styleSheetContent);
  },

  _injectDependencyWithinApplication : function(injectionObject, currentPattern) {
    currentPattern = typeof currentPattern == "undefined" ? '' : currentPattern;

    var objectInstance                     = this,
        currentInjectedObject              = this,
        currentInjectedObjectPatternTokens = currentPattern.split(".");

    jQuery.each(currentInjectedObjectPatternTokens, function(patternKey, patternValue){
      if(patternValue != '' && typeof currentInjectedObject[patternValue] !== "undefined")
        currentInjectedObject = currentInjectedObject[patternValue];
    });

    jQuery.each(injectionObject, function(currentInjectionIndex, injection){
      if(typeof currentInjectedObject[currentInjectionIndex] !== "undefined")
        currentInjectedObject[currentInjectionIndex] = jQuery.extend(true, currentInjectedObject[currentInjectionIndex], injection);
      else
        objectInstance._injectDependencyWithinApplication(injection, currentPattern + '.' + currentInjectionIndex);
    });
  },

};

if (typeof String.prototype.endsWith !== 'function') {
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

// @codekit-append  "lib/filterManager.js",  "lib/eventManager.js", "lib/stylesheetSupport.js", "lib/navigation.js", "lib/navigationPanel.js", "lib/panel.js"
// @codekit-append "lib/elementPanel.js", "lib/elementOption.js", "lib/elementOptions.js", "lib/elementOperations.js"
// @codekit-append "lib/applicationSynchronize.js", "lib/utility.js", "lib/settingsPanel.js", "lib/selectorOption.js"
// @codekit-append "lib/macroInterfaceOperations.js", "lib/progressPanel.js"

jQuery(document).ready(function(){
  VisualDeveloperLite.Init();
});VisualDeveloperLite.FilterManager = {

  filterList : {},

  Init : function() {

  },

  registerFilter : function(eventIdentifier) {
    if(typeof this.filterList[eventIdentifier] == "undefined")
      this.filterList[eventIdentifier] = [];
  },

  unRegisterFilter : function(eventIdentifier) {
    if(typeof this.filterList[eventIdentifier] != "undefined")
      delete this.filterList[eventIdentifier];
  },

  parseFilter  : function(eventIdentifier, data) {
    if(typeof this.filterList[eventIdentifier] != "undefined") {
      var currentEventInformation = this.filterList[eventIdentifier];

      for(var currentListenerIndex in currentEventInformation) {
        var currentListener       = currentEventInformation[currentListenerIndex],
            currentListenerMethod = currentListener['method'];

        data = currentListener.object[currentListenerMethod]
                              .call(currentListener.object, data);
      }
    }

    return data;
  },

  listenFilter : function(eventIdentifier, object, method) {
    if(typeof this.filterList[eventIdentifier] == "undefined")
      this.registerFilter(eventIdentifier);

    this.filterList[eventIdentifier][this.filterList[eventIdentifier].length] = {
      'object' : object,
      'method' : method
    };
  }
};VisualDeveloperLite.EventManager = {

  eventList : {},

  Init : function() {

  },

  registerEvent : function(eventIdentifier) {
    if(typeof this.eventList[eventIdentifier] == "undefined")
      this.eventList[eventIdentifier] = [];
  },

  unRegisterEvent : function(eventIdentifier) {
    if(typeof this.eventList[eventIdentifier] != "undefined")
      delete this.eventList[eventIdentifier];
  },

  triggerEvent  : function(eventIdentifier, data) {
    data = typeof data != "undefined" ? data : {};

    if(typeof this.eventList[eventIdentifier] != "undefined") {
      var currentEventInformation = this.eventList[eventIdentifier];

      for(var currentListenerIndex in currentEventInformation) {
        var currentListener       = currentEventInformation[currentListenerIndex],
            currentListenerMethod = currentListener['method'];

        currentListener.object[currentListenerMethod].call(currentListener.object, data);
      }
    }
  },

  listenEvent : function(eventIdentifier, object, method) {
    if(typeof this.eventList[eventIdentifier] == "undefined")
      this.registerEvent(eventIdentifier);

    this.eventList[eventIdentifier][this.eventList[eventIdentifier].length] = {
      'object' : object,
      'method' : method
    };
  }
};VisualDeveloperLite.Navigation = {

  visualDeveloperInstance : {},

  _settings : {
    navigationVisualIndicatorClass          : 'navigation-item',
    navigationSelectedIndicatorClass        : 'navigation-item-selected',
    navigationSelectedMirrorIndicatorClass  : 'navigation-item-selected-mirror',
    navigationIndicatorTarget               : '*:not([id^="visual-developer-lite"])',
    navigationIndicatorEvent                : 'mouseenter',
    navigationIndicatorCloseEvent           : 'mouseleave',
    navigationSelectionEvent                : 'click'
  },

  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;
    this._initDependencies();
  },

  _initDependencies : function() {
    this._prefixCSSSettings();
    this._settings.navigationIndicatorEvent         = this._settings.navigationIndicatorEvent + '.' + this.visualDeveloperInstance.namespace;
    this._settings.navigationIndicatorCloseEvent    = this._settings.navigationIndicatorCloseEvent + '.' + this.visualDeveloperInstance.namespace;
    this._settings.navigationSelectionEvent         = this._settings.navigationSelectionEvent + '.' + this.visualDeveloperInstance.namespace;
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  OpenNavigation : function() {
    var objectInstance = this;

    this.CloseNavigation();

    jQuery(this._settings.navigationIndicatorTarget)
        .bind(this._settings.navigationIndicatorEvent, function(event){
          event.stopImmediatePropagation();
          event.preventDefault();

          objectInstance.visualDeveloperInstance.Panel.SetUserNotification(
              objectInstance.visualDeveloperInstance.GetElementAbsolutePath(jQuery(this))
          );

          jQuery(this).addClass(objectInstance._settings.navigationVisualIndicatorClass);
          jQuery(this).parents().removeClass(objectInstance._settings.navigationVisualIndicatorClass);
        }).bind(this._settings.navigationIndicatorCloseEvent, function(event){
          event.stopImmediatePropagation();
          event.preventDefault();

          jQuery(this).removeClass(objectInstance._settings.navigationVisualIndicatorClass);
        }).bind(this._settings.navigationSelectionEvent, function(event){
          event.stopImmediatePropagation();
          event.preventDefault();

          jQuery(this).removeClass(objectInstance._settings.navigationVisualIndicatorClass);

          objectInstance.visualDeveloperInstance.Panel.SetUserNotification(
              objectInstance.visualDeveloperInstance.GetElementAbsolutePath(jQuery(this))
          );

          objectInstance.visualDeveloperInstance.NavigationPanel.ActivateNodeInstance(jQuery(this));
          objectInstance._closeNavigationVisualIndicator();
        });
  },

  MarkNavigationVisualSelectedElement : function(jQueryElementObject) {
    jQueryElementObject.addClass(this._settings.navigationSelectedIndicatorClass);
  },

  UnMarkNavigationVisualSelectedElement : function(jQueryElementObject) {
    jQueryElementObject.removeClass(this._settings.navigationSelectedIndicatorClass);
  },

  MarkNavigationVisualSelectedMirrorElement : function(jQueryElementObject) {
    jQueryElementObject.addClass(this._settings.navigationSelectedMirrorIndicatorClass);
  },

  UnMarkNavigationVisualSelectedMirrorElement : function(jQueryElementObject) {
    jQueryElementObject.removeClass(this._settings.navigationSelectedMirrorIndicatorClass);
  },

  _closeNavigationVisualIndicator : function() {
    jQuery(this._settings.navigationIndicatorTarget)
        .trigger(this._settings.navigationIndicatorCloseEvent)
        .unbind(this._settings.navigationIndicatorEvent)
        .unbind(this._settings.navigationIndicatorCloseEvent)
        .unbind(this._settings.navigationSelectionEvent);
  },

  CloseNavigation : function() {
    this._closeNavigationVisualIndicator();
    this.visualDeveloperInstance.NavigationPanel.CloseNavigationPanel();
  }

};VisualDeveloperLite.NavigationPanel = {

  visualDeveloperInstance : {},

  _lang : {
    panelOptionGlobal                   : "Select Structure Based Elements",
    panelOptionGlobalClass              : "Select Structure Class Smart Based Elements",
    panelOptionCurrent                  : "Current Element",
    panelOptionParentElement            : "Parent Element",
    panelOptionReset                    : "Reset",
    panelOptionAdvancedCreation         : "Advanced Creation",
    panelOptionGlobalIcon               : "panel-option-structure",
    panelOptionGlobalClassIcon          : "panel-option-structure-class",
    panelOptionCurrentIcon              : "panel-option-current",
    panelOptionParentElementIcon        : "panel-option-parent",
    panelOptionResetIcon                : "panel-option-reset",
    panelOptionActiveIcon               : "panel-option-active",
    userActionNotificationGlobal        : "<strong>Start customizing</strong>, similar elements have been easily matched.",
    userActionNotificationGlobalClass   : "<strong>Start customizing</strong>, similar elements have been smartly matched.",
    userActionNotificationCurrent       : "<strong>Start customizing</strong> your current element",
    userActionNotificationParentElement : false,
    userActionNotificationReset         : "The previous element is no longer selected, please chose a different one."
  },

  _settings : {
    navigationNamespace                   : '-navigation-panel',
    navigationArrangeEvents               : 'scroll resize',
    navigationPanelID                     : 'navigation-panel',
    navigationPanelToolBarClass           : 'navigation-panel-toolbar',
    navigationOptionGlobalID              : 'navigation-panel-option-global',
    navigationOptionGlobalClassID         : 'navigation-panel-option-global-class',
    navigationOptionCurrentID             : 'navigation-panel-option-current',
    navigationOptionParentElementID       : 'navigation-panel-option-parent-element',
    navigationOptionResetID               : 'navigation-panel-option-reset',
    navigationOptionIndicatorEvent        : 'mouseenter',
    navigationOptionIndicatorCloseEvent   : 'mouseleave',
    navigationOptionSelectEvent           : 'click'
  },

  currentNavigationPanelObject            : false,
  currentNavigationJQueryDOMElement       : false,
  currentNavigationMirrorJQueryDOMElement : false,

  currentNavigationPanelOptionCurrent          : false,
  currentNavigationPanelOptionGlobal           : false,
  currentNavigationPanelOptionParentElement    : false,
  currentNavigationPanelOptionReset            : false,
  currentNavigationPanelOptionAdvancedCreation : false,


  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;
    this._initDependencies();
  },

  _initDependencies : function() {
    this._settings.navigationNamespace = this.visualDeveloperInstance.namespace + this._settings.navigationNamespace;

    this._settings.navigationArrangeEvents             = this._settings.navigationArrangeEvents
        .replace(/ /g, '.' + this._settings.navigationNamespace + ' ') +
        '.' + this._settings.navigationNamespace + ' ';
    this._settings.navigationOptionIndicatorEvent      = this._settings.navigationOptionIndicatorEvent
        .replace(/ /g, '.' + this._settings.navigationNamespace + ' ') +
        '.' + this._settings.navigationNamespace + ' ';
    this._settings.navigationOptionIndicatorCloseEvent = this._settings.navigationOptionIndicatorCloseEvent
        .replace(/ /g, '.' + this._settings.navigationNamespace + ' ') +
        '.' + this._settings.navigationNamespace + ' ';
    this._settings.navigationOptionSelectEvent = this._settings.navigationOptionSelectEvent
        .replace(/ /g, '.' + this._settings.navigationNamespace + ' ') +
        '.' + this._settings.navigationNamespace + ' ';

    this._prefixCSSSettings();
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  ActivateNodeInstance : function(jQueryDOMElement) {
    this._clearCurrentNavigationJQueryDOMElement();

    this.currentNavigationJQueryDOMElement = jQueryDOMElement;
    this.visualDeveloperInstance.Navigation.MarkNavigationVisualSelectedElement(jQueryDOMElement);

    this.triggerNodeInstancePanel();
  },

  triggerNodeInstancePanel : function() {
    var objectInstance = this;

    jQuery('body').append(this._getPanelHTML());

    this.currentNavigationPanelObject                 = jQuery('#' + this._settings.navigationPanelID);
    this.currentNavigationPanelOptionParentElement    = jQuery('#' + this._settings.navigationOptionParentElementID);
    this.currentNavigationPanelOptionCurrent          = jQuery('#' + this._settings.navigationOptionCurrentID);
    this.currentNavigationPanelOptionGlobal           = jQuery('#' + this._settings.navigationOptionGlobalID);
    this.currentNavigationPanelOptionGlobalClass      = jQuery('#' + this._settings.navigationOptionGlobalClassID);
    this.currentNavigationPanelOptionReset            = jQuery('#' + this._settings.navigationOptionResetID);
    this.currentNavigationPanelOptionAdvancedCreation = jQuery('#' + this._settings.navigationOptionAdvancedCreationID);

    this._arrangePanel();
    this._assignPanelAction();

    jQuery(window).bind(this._settings.navigationArrangeEvents, function(){
      objectInstance._arrangePanel();
    });

    if(this.currentNavigationJQueryDOMElement.is("body")) {
      objectInstance._enableElementPanelOnPattern("body");
    }
  },

  _getPanelHTML : function() {
    var panelHTML = '';

    panelHTML += '<div id="' + this._settings.navigationPanelID + '">';
    panelHTML +=  '<div class="' + this._settings.navigationPanelToolBarClass + '">';
    panelHTML +=    '<span id="' + this._settings.navigationOptionResetID + '"' +
                           'class="icon ' + this._lang.panelOptionResetIcon + ' hint--primary hint--top" data-hint="' + this._lang.panelOptionReset + '"' +
                           '>&nbsp;</span>';
    panelHTML +=    '<span id="' + this._settings.navigationOptionParentElementID + '"' +
                           'class="icon ' + this._lang.panelOptionParentElementIcon + ' hint--primary hint--top" data-hint="' + this._lang.panelOptionParentElement + '"' +
                           '>&nbsp;</span>';
    panelHTML +=    '<span id="' + this._settings.navigationOptionCurrentID + '"' +
                          'class="icon ' + this._lang.panelOptionCurrentIcon + ' ' +
                                 (this.visualDeveloperInstance.ElementPanel
                                     .HasPattern(this.visualDeveloperInstance.GetElementAbsolutePath(this.currentNavigationJQueryDOMElement))
                                  ? this._lang.panelOptionActiveIcon + ' ' : ''
                                 ) +
                                 ' hint--primary hint--top" ' +
                          'data-hint="' + this._lang.panelOptionCurrent + '"' +
                          '>&nbsp;</span>';
    panelHTML +=    '<span id="' + this._settings.navigationOptionGlobalID + '"' +
                          'class="icon ' + this._lang.panelOptionGlobalIcon + ' ' +
                                (this.visualDeveloperInstance.ElementPanel
                                    .HasPattern(this.visualDeveloperInstance.GetElementGenericPath(this.currentNavigationJQueryDOMElement))
                                    ? this._lang.panelOptionActiveIcon + ' ' : ''
                                    ) +
                                ' hint--primary hint--top" ' +
                          'data-hint="' + this._lang.panelOptionGlobal + '"' +
                          '>&nbsp;</span>';
    panelHTML +=    '<span id="' + this._settings.navigationOptionGlobalClassID + '"' +
                          'class="icon ' + this._lang.panelOptionGlobalClassIcon + ' ' +
                                (this.visualDeveloperInstance.ElementPanel
                                    .HasPattern(this.visualDeveloperInstance.GetElementGenericPath(this.currentNavigationJQueryDOMElement, false))
                                    ? this._lang.panelOptionActiveIcon + ' ' : ''
                                ) +
                                ' hint--primary hint--top" ' +
                          'data-hint="' + this._lang.panelOptionGlobalClass + '"' +
                          '>&nbsp;</span>';
    panelHTML +=    '<span class="' + this.visualDeveloperInstance._settings.clearClass + '"></span>';
    panelHTML +=  '</div>';
    panelHTML += '</div>';

    return panelHTML;
  },

  _assignPanelAction : function() {

    var objectInstance = this;

    jQuery(this.currentNavigationPanelOptionParentElement).bind(this._settings.navigationOptionSelectEvent, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      if(objectInstance._lang.userActionNotificationParentElement !== false) {
        objectInstance.visualDeveloperInstance.Panel.SetUserNotification(objectInstance._lang.userActionNotificationParentElement);
      } else {
        objectInstance.visualDeveloperInstance.Panel.SetUserNotification(
            objectInstance.visualDeveloperInstance.GetElementAbsolutePath(
                objectInstance.currentNavigationJQueryDOMElement.parent()
            )
        );
      }

      objectInstance.ActivateNodeInstance(objectInstance.currentNavigationJQueryDOMElement.parent());
    });

    jQuery(this.currentNavigationPanelOptionReset).bind(this._settings.navigationOptionSelectEvent, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      objectInstance.visualDeveloperInstance.Panel.SetUserNotification(objectInstance._lang.userActionNotificationReset);
      objectInstance.visualDeveloperInstance.Navigation.OpenNavigation();
    });

    jQuery(this.currentNavigationPanelOptionCurrent).bind(this._settings.navigationOptionSelectEvent, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      objectInstance.visualDeveloperInstance.Panel.SetUserNotification(objectInstance._lang.userActionNotificationCurrent);
      objectInstance._enableElementPanelOnPattern(objectInstance.visualDeveloperInstance.GetElementAbsolutePath(objectInstance.currentNavigationJQueryDOMElement));
    });

    jQuery(this.currentNavigationPanelOptionCurrent).bind(this._settings.navigationOptionIndicatorEvent, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      var currentPattern = objectInstance.visualDeveloperInstance.GetElementAbsolutePath(objectInstance.currentNavigationJQueryDOMElement),
          currentObject  = jQuery(currentPattern);
          currentObject.not(objectInstance.currentNavigationJQueryDOMElement);

      objectInstance.visualDeveloperInstance.Panel.SetUserNotification(currentPattern);
      objectInstance._highlightNavigationMirrorJQueryDOMElement(currentObject);
    });

    jQuery(this.currentNavigationPanelOptionCurrent).bind(this._settings.navigationOptionIndicatorCloseEvent, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      objectInstance._clearCurrentNavigationMirrorJQueryDOMElement();
      objectInstance.visualDeveloperInstance.Panel.SetUserNotification("&nbsp;");
    });

    jQuery(this.currentNavigationPanelOptionGlobal).bind(this._settings.navigationOptionSelectEvent, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      objectInstance.visualDeveloperInstance.Panel.SetUserNotification(objectInstance._lang.userActionNotificationGlobal);
      objectInstance._enableElementPanelOnPattern(objectInstance.visualDeveloperInstance.GetElementGenericPath(objectInstance.currentNavigationJQueryDOMElement));
    });

    jQuery(this.currentNavigationPanelOptionGlobal).bind(this._settings.navigationOptionIndicatorEvent, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      var currentPattern = objectInstance.visualDeveloperInstance.GetElementGenericPath(objectInstance.currentNavigationJQueryDOMElement),
          currentObject  = jQuery(currentPattern);
          currentObject.not(objectInstance.currentNavigationJQueryDOMElement);

      objectInstance.visualDeveloperInstance.Panel.SetUserNotification(currentPattern);
      objectInstance._highlightNavigationMirrorJQueryDOMElement(currentObject);
    });

    jQuery(this.currentNavigationPanelOptionGlobal).bind(this._settings.navigationOptionIndicatorCloseEvent, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      objectInstance._clearCurrentNavigationMirrorJQueryDOMElement();
      objectInstance.visualDeveloperInstance.Panel.SetUserNotification("&nbsp;");
    });

    jQuery(this.currentNavigationPanelOptionGlobalClass).bind(this._settings.navigationOptionSelectEvent, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      objectInstance.visualDeveloperInstance.Panel.SetUserNotification(objectInstance._lang.userActionNotificationGlobalClass);
      objectInstance._enableElementPanelOnPattern(objectInstance.visualDeveloperInstance.GetElementGenericPath(objectInstance.currentNavigationJQueryDOMElement, false));
    });

    jQuery(this.currentNavigationPanelOptionGlobalClass).bind(this._settings.navigationOptionIndicatorEvent, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      var currentPattern = objectInstance.visualDeveloperInstance.GetElementGenericPath(objectInstance.currentNavigationJQueryDOMElement, false),
          currentObject  = jQuery(currentPattern);
          currentObject.not(objectInstance.currentNavigationJQueryDOMElement);

      objectInstance.visualDeveloperInstance.Panel.SetUserNotification(currentPattern);
      objectInstance._highlightNavigationMirrorJQueryDOMElement(currentObject);
    });

    jQuery(this.currentNavigationPanelOptionGlobalClass).bind(this._settings.navigationOptionIndicatorCloseEvent, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      objectInstance._clearCurrentNavigationMirrorJQueryDOMElement();
      objectInstance.visualDeveloperInstance.Panel.SetUserNotification("&nbsp;");
    });

    jQuery(this.currentNavigationPanelOptionAdvancedCreation).bind(this._settings.navigationOptionSelectEvent, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      var cssRule = objectInstance.visualDeveloperInstance.GetElementGenericPath(objectInstance.currentNavigationJQueryDOMElement, false);

      objectInstance._clearCurrentNavigationJQueryDOMElement();
      objectInstance
          .visualDeveloperInstance
          .Utility
          .DomRuleBuilder
          .InitInstance(
              cssRule,
              objectInstance,
              objectInstance._enableElementPanelOnPattern
          );
      objectInstance.visualDeveloperInstance.Panel.SetUserNotification("&nbsp;");
    });

  },

  _enableElementPanelOnPattern : function(elementPanelPattern) {
    if(elementPanelPattern == false) {
      this.visualDeveloperInstance.Panel.SetUserNotification(this._lang.userActionNotificationReset);
      this.visualDeveloperInstance.Navigation.OpenNavigation();

      return;
    }

    this._clearCurrentNavigationJQueryDOMElement();
    this.visualDeveloperInstance.ElementPanel.InitPatternCustomization(elementPanelPattern);
  },

  _arrangePanel : function() {
    this.currentNavigationPanelObject.css("top", this.currentNavigationJQueryDOMElement.offset().top - this.currentNavigationPanelObject.height() - 5);
    this.currentNavigationPanelObject.css("left", this.currentNavigationJQueryDOMElement.offset().left);
  },

  _clearCurrentNavigationJQueryDOMElement : function() {
    jQuery(window).unbind(this._settings.navigationArrangeEvents);

    if(this.currentNavigationJQueryDOMElement !== false) {
      this.visualDeveloperInstance.Navigation.UnMarkNavigationVisualSelectedElement(this.currentNavigationJQueryDOMElement);

      this.currentNavigationJQueryDOMElement = false;
    }

    this._clearCurrentNavigationMirrorJQueryDOMElement();

    if(this.currentNavigationPanelObject !== false) {
      jQuery(this.currentNavigationPanelObject).find('*').unbind(this._settings.navigationNamespace);

      this.currentNavigationPanelObject.remove();

      this.currentNavigationPanelObject = false;
    }

  },

  _highlightNavigationMirrorJQueryDOMElement : function(mirrorJQueryDOMElement) {
    this._clearCurrentNavigationMirrorJQueryDOMElement();

    this.currentNavigationMirrorJQueryDOMElement = mirrorJQueryDOMElement;

    this.visualDeveloperInstance.Navigation.MarkNavigationVisualSelectedMirrorElement(this.currentNavigationMirrorJQueryDOMElement);
  },

  _clearCurrentNavigationMirrorJQueryDOMElement : function() {
    if(this.currentNavigationMirrorJQueryDOMElement !== false) {
      this.visualDeveloperInstance.Navigation.UnMarkNavigationVisualSelectedMirrorElement(this.currentNavigationMirrorJQueryDOMElement);

      this.currentNavigationMirrorJQueryDOMElement = false;
    }
  },

  CloseNavigationPanel : function() {
    this._clearCurrentNavigationJQueryDOMElement();
  }

};VisualDeveloperLite.Panel = {

  visualDeveloperInstance : {},

  _lang : {
    title                       : "Visual Developer Lite",
    enableButton                : "Open",
    disableButton               : "Close",
    progressButton              : "Progress",
    pageSpecificButton          : "Page Specific",
    versionsButton              : "Versions",
    settingsButton              : "Preferences",
    saveButton                  : "Save Changes",
    defaultNotification         : "Hello ! Your First Step is pressing the Open button.",
    userActionNotificationClose : "Navigation has been closed.",
    userActionNotificationOpen  : "Click on the element you want to start customizing"
  },

  _settings : {
    arrangeEvents                       : 'scroll resize',
    actionEvents                        : 'click',
    panelID                             : 'panel',
    panelContainerID                    : 'panel-container',
    navigationControlsID                : 'operations-navigation-panel',
    navigationTopControlsID             : 'top-operations-navigation-panel',
    navigationTopSecondaryControlsID    : 'top-operations-secondary-navigation-panel',
    navigationEnableID                  : 'enable-navigation-panel',
    navigationDisableID                 : 'disable-navigation-panel',
    navigationProgressID                : 'progress-navigation-panel',
    navigationPageSpecificID            : 'page-specific-navigation-panel',
    navigationPageSpecificBlockedClass  : 'blocked',
    navigationPageSpecificInactiveClass : 'inactive',
    navigationPageSpecificActiveClass   : 'active',
    navigationPageVersionsBlockedClass  : 'blocked',
    navigationPageVersionsID            : 'page-versions-navigation-panel',
    navigationSettingsID                : 'settings-navigation-panel',
    navigationSaveID                    : 'save-navigation-panel',
    userNotificationID                  : 'user-top-notification'
  },

  _userNotificationLOG      : [],
  _userNotificationHeight   : 22,
  _userNotificationFontSize : 14,

  eventPanelRefresh    : 'panel_refresh',

  currentPanelObject                    : false,
  currentPanelTopOperationsSecondary    : false,
  currentPanelEnableTriggerObject       : false,
  currentPanelDisableTriggerObject      : false,
  currentPanelProgressTriggerObject     : false,
  currentPanelPageSpecificTriggerObject : false,
  currentPanelPageVersionsTriggerObject : false,
  currentPanelSettingsTriggerObject     : false,
  currentPanelSaveTriggerObject         : false,
  currentPanelUserNotificationObject    : false,

  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;
    this._initDependencies();

    this.visualDeveloperInstance.EventManager.registerEvent(this.eventPanelRefresh);
    this.visualDeveloperInstance.EventManager.listenEvent(
        this.visualDeveloperInstance.universalEventSettingsUpdate,
        this,
        'HandleSettingsOptions'
    );

    this.displayPanel();
  },

  _initDependencies : function() {
    this._settings.arrangeEvents = this._settings.arrangeEvents
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + ' ') +
        '.' + this.visualDeveloperInstance.namespace + ' ';
    this._settings.actionEvents  = this._settings.actionEvents
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + ' ') +
        '.' + this.visualDeveloperInstance.namespace + ' ';

    this._prefixCSSSettings();
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  displayPanel : function() {
    var objectInstance = this;

    jQuery('body').append(this._getPanelHTML());

    this.currentPanelObject                    = jQuery('#' + this._settings.panelID);
    this.currentPanelContainerObject           = jQuery('#' + this._settings.panelContainerID);
    this.currentPanelTopOperationsSecondary    = jQuery('#' + this._settings.navigationTopSecondaryControlsID);
    this.currentPanelEnableTriggerObject       = jQuery('#' + this._settings.navigationEnableID);
    this.currentPanelDisableTriggerObject      = jQuery('#' + this._settings.navigationDisableID);
    this.currentPanelSaveTriggerObject         = jQuery('#' + this._settings.navigationSaveID);
    this.currentPanelProgressTriggerObject     = jQuery('#' + this._settings.navigationProgressID);
    this.currentPanelPageSpecificTriggerObject = jQuery('#' + this._settings.navigationPageSpecificID);
    this.currentPanelPageVersionsTriggerObject = jQuery('#' + this._settings.navigationPageVersionsID);
    this.currentPanelSettingsTriggerObject     = jQuery('#' + this._settings.navigationSettingsID);
    this.currentPanelUserNotificationObject    = jQuery('#' + this._settings.userNotificationID);

    this._arrangePanel();
    this._assignPanelActions();

    jQuery(window).bind(this._settings.arrangeEvents, function(){
      objectInstance._arrangePanel();
    });
  },

  _getPanelHTML : function() {
    var panelHTML = '';

    panelHTML += '<p id="' + this._settings.userNotificationID + '">' + this._lang.defaultNotification + '</p>';
    panelHTML += '<div id="' + this._settings.panelID + '">';
    panelHTML +=  '<div id="' + this._settings.panelContainerID + '">';
    panelHTML +=    '<h2>' + this._lang.title + '</h2>';
    panelHTML +=    '<div id="' + this._settings.navigationTopControlsID + '">';
    panelHTML +=      '<span id="' + this._settings.navigationSettingsID + '">' + this._lang.settingsButton + '</span>';
    panelHTML +=      '<span id="' + this._settings.navigationProgressID + '">' + this._lang.progressButton + '</span>';
    panelHTML +=      '<span class="' + this.visualDeveloperInstance._settings.clearClass + '"></span>';
    panelHTML +=    '</div>';
    panelHTML +=    '<span class="' + this.visualDeveloperInstance._settings.clearClass + '"></span>';
    panelHTML +=    '<div id="' + this._settings.navigationControlsID + '">';
    panelHTML +=      '<span id="' + this._settings.navigationEnableID + '">' + this._lang.enableButton + '</span>';
    panelHTML +=      '<span id="' + this._settings.navigationDisableID + '">' + this._lang.disableButton + '</span>';
    panelHTML +=      '<span id="' + this._settings.navigationSaveID + '">' + this._lang.saveButton + '</span>';
    panelHTML +=    '</div>';
    panelHTML +=    '<span class="' + this.visualDeveloperInstance._settings.clearClass + '"></span>';
    panelHTML +=  '</div>';
    panelHTML += '</div>';

    return panelHTML;
  },

  _arrangePanel : function() {
    this.currentPanelUserNotificationObject.css(
        "top",
        this.visualDeveloperInstance.toolbarObject.length > 0 ?
            this.visualDeveloperInstance.toolbarObject.height() : 0
    );

    var maxIndicator = jQuery(window).height() > jQuery('body').height() ? jQuery(window).height() : jQuery('body').height();

    this.currentPanelObject.css(
        "top",
        this.currentPanelUserNotificationObject.innerHeight() + (
            this.visualDeveloperInstance.toolbarObject.length > 0 ?
                this.visualDeveloperInstance.toolbarObject.height() : 0
        )
    ).css( "height", maxIndicator );
  },

  _assignPanelActions : function() {
    var objectInstance = this;

    jQuery(this.currentPanelEnableTriggerObject).bind(this._settings.actionEvents, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      objectInstance.currentPanelEnableTriggerObject.fadeOut(1000, function(){
        objectInstance.currentPanelDisableTriggerObject.fadeIn();
      });

      objectInstance.SetUserNotification(objectInstance._lang.userActionNotificationOpen);

      objectInstance.visualDeveloperInstance.Navigation.OpenNavigation();
    });

    jQuery(this.currentPanelDisableTriggerObject).bind(this._settings.actionEvents, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      objectInstance.currentPanelDisableTriggerObject.fadeOut(1000, function(){
        objectInstance.currentPanelEnableTriggerObject.fadeIn();
      });

      objectInstance.visualDeveloperInstance.Navigation.CloseNavigation();
      objectInstance.visualDeveloperInstance.ElementPanel.Close();
      objectInstance.SetUserNotification(objectInstance._lang.userActionNotificationClose);
    });

    jQuery(this.currentPanelProgressTriggerObject).bind(this._settings.actionEvents, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      objectInstance.visualDeveloperInstance.ProgressPanel.DisplayPanel();
    });

    jQuery(this.currentPanelSettingsTriggerObject).bind(this._settings.actionEvents, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      objectInstance.visualDeveloperInstance.SettingsPanel.DisplayPanel();
    });

    jQuery(this.currentPanelSaveTriggerObject).bind(this._settings.actionEvents, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      objectInstance.visualDeveloperInstance.ApplicationSynchronize.SyncLayoutWithApplication();
    });

    var allowPageSpecific = false;

    if(typeof PluginInfo !== "undefined")
      if(PluginInfo.post_id != 0)
        allowPageSpecific = true;

    if (allowPageSpecific) {
      this.currentPanelPageSpecificTriggerObject.addClass(this._settings.navigationPageSpecificInactiveClass);
      jQuery(this.currentPanelPageSpecificTriggerObject).bind(this._settings.actionEvents, function(event){
        event.preventDefault();
        event.stopImmediatePropagation();

        if(jQuery(this).hasClass(objectInstance._settings.navigationPageSpecificInactiveClass)) {
          objectInstance._pageSpecificEventActivate();
        } else {
          objectInstance._pageSpecificEventDeActivate();
        }
      });
    } else {
      this.currentPanelPageSpecificTriggerObject.addClass(this._settings.navigationPageSpecificBlockedClass);
      this.currentPanelPageVersionsTriggerObject.addClass(this._settings.navigationPageVersionsBlockedClass);
    }
  },

  _pageSpecificEventActivate : function() {
    this.currentPanelPageSpecificTriggerObject.removeClass(
      this._settings.navigationPageSpecificInactiveClass
    ).addClass(
      this._settings.navigationPageSpecificActiveClass
    );

    this.visualDeveloperInstance.ApplicationSynchronize.SetPostSpecific(PluginInfo.post_id);
  },

  _pageSpecificEventDeActivate : function() {
    this.currentPanelPageSpecificTriggerObject.removeClass(
      this._settings.navigationPageSpecificActiveClass
    ).addClass(
      this._settings.navigationPageSpecificInactiveClass
    );

    this.visualDeveloperInstance.ApplicationSynchronize.SetNoSpecific();
  },

  SetUserNotification : function(notification) {
    this._userNotificationLOG[this._userNotificationLOG.length - 1] = notification;

    this.currentPanelUserNotificationObject
        .css("font-size", this._userNotificationFontSize + "px")
        .html(notification);

    var fontSize = this._userNotificationFontSize;

    while(parseInt(this.currentPanelUserNotificationObject.height()) > this._userNotificationHeight
            && fontSize > 1) {
      fontSize -= 0.5;

      this.currentPanelUserNotificationObject.css("font-size", fontSize + "px");
    }
  },

  HandleSettingsOptions : function() {
    if(this.currentPanelTopOperationsSecondary == false)
      return;

    var objectInstance = this;


    if(this.visualDeveloperInstance.hasSettingEnableAdvancedFeatures) {
      this.currentPanelTopOperationsSecondary.slideDown(function(){
        objectInstance.visualDeveloperInstance
                      .EventManager
                      .triggerEvent(objectInstance.eventPanelRefresh);
      });
    } else {
      this.currentPanelTopOperationsSecondary.slideUp(function(){
        objectInstance.visualDeveloperInstance
                      .EventManager
                      .triggerEvent(objectInstance.eventPanelRefresh);
      });
    }
  }

};VisualDeveloperLite.ElementPanel = {

  visualDeveloperInstance : {},

  _lang : {
    toggleSpectralMode : 'Spectral Mode',
    reset              : 'Reset Element',
    filter             : 'Filter Options',
    selectorIcon       : 'selector-options',
    selectorModalTitle : 'Change Customization Selector',
    resetModalTitle    : 'Are you sure ?'
  },

  _settings : {
    arrangeEvents                                 : 'resize scroll',
    elementPanelActivePatternClass                : 'element-panel-active-pattern',
    spectralModeBodyClass                         : 'spectral-mode',
    spectralModeOverlayID                         : 'spectral-mode-overlay',
    spectralModeArrangeEvent                      : 'resize scroll',
    panelID                                       : 'element-panel',
    panelOperationsContainerID                    : 'element-panel-operations-container',
    panelOperationsOptionsContainerID             : 'element-panel-operations-options-container',
    panelOperationsOptionActiveClass              : 'element-panel-option-active',
    panelOperationsOptionToggleSpectralModeID     : 'element-panel-option-toggle-spectral-mode',
    panelOperationsOptionResetID                  : 'element-panel-option-reset',
    panelOperationsOptionFilterID                 : 'element-panel-option-filter',
    panelOperationsOptionSelectorID               : 'element-panel-option-selector',
    panelOperationsOptionSelectorActiveClass      : 'element-panel-option-selector-active',
    panelOperationsOptionTrigger                  : 'click',
    panelOperationsInputOptionTrigger             : 'change keyup',
    panelOperationGroupClass                      : 'operation-group',
    panelOperationGroupAliasAttribute             : 'operation-group-name',
    panelOperationElementOptionClass              : 'operation-element-option',
    panelOperationElementOptionAliasAttribute     : 'operation-element-alias',
    linkDisableEventTrigger                       : 'click'
  },

  baseElementPattern        : false,
  baseElementObject         : false,
  elementPattern            : "",
  elementPatternMD5         : "",
  elementObject             : false,
  elementOptionsObjectList  : {},

  currentElementPosition                : "left",
  currentPanelObject                    : false,
  currentPanelOptionResetObject         : false,
  currentPanelOptionSpectralModeObject  : false,
  currentPanelOptionFilterObject        : false,
  currentPanelOperationsObject          : false,
  currentPanelOperationsOptionsObject   : false,
  currentPanelOperationsLabels          : false,
  currentPanelOperationsGroups          : false,
  spectralModeOverlayObject             : false,

  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;
    this._initDependencies();
    this._registerFilterAndEvents();
  },

  _initDependencies : function() {
    this._prefixCSSSettings();

    this._settings.arrangeEvents  = this._settings.arrangeEvents
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-element-panel ') +
        '.' + this.visualDeveloperInstance.namespace + '-element-panel ';

    this._settings.panelOperationsOptionTrigger  = this._settings.panelOperationsOptionTrigger
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-element-panel ') +
        '.' + this.visualDeveloperInstance.namespace + '-element-panel ';

    this._settings.panelOperationsInputOptionTrigger  = this._settings.panelOperationsInputOptionTrigger
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-element-panel ') +
        '.' + this.visualDeveloperInstance.namespace + '-element-panel ';

    this._settings.linkDisableEventTrigger  = this._settings.linkDisableEventTrigger
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-link-disable ') +
        '.' + this.visualDeveloperInstance.namespace + '-link-disable ';

    this._settings.spectralModeArrangeEvent  = this._settings.spectralModeArrangeEvent
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-spectral-mode ') +
        '.' + this.visualDeveloperInstance.namespace + '-spectral-mode ';
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  _registerFilterAndEvents : function() {
    this.visualDeveloperInstance.EventManager.listenEvent(
        this.visualDeveloperInstance.universalEventSettingsUpdate,
        this,
        '_universalEventSettingsUpdateHandler'
    );

    this.visualDeveloperInstance.FilterManager.listenFilter(
        this.visualDeveloperInstance.universalFilterSettingsExport,
        this,
        '_filterExportSettingsLayoutInformation'
    );

    this.visualDeveloperInstance.FilterManager.listenFilter(
        this.visualDeveloperInstance.universalFilterStylesheetFile,
        this,
        '_filterExportStylesheet'
    );

    this.visualDeveloperInstance.EventManager.listenEvent(
        this.visualDeveloperInstance.Panel.eventPanelRefresh,
        this,
        '_arrangePanel'
    );
  },

  InitPatternCustomization : function(elementPattern) {
    this._reset();

    this.baseElementPattern = this.baseElementPattern == false ?
        elementPattern : this.baseElementPattern;

    if(elementPattern.startsWith(this.baseElementPattern) == false
        || this.baseElementPattern.split(">").length != elementPattern.split(">").length)
      this.baseElementPattern = elementPattern;

    this.baseElementObject    = jQuery(this.baseElementPattern);

    this.elementPattern       = elementPattern;
    this.elementPatternMD5    = CryptoJS.MD5(this.elementPattern).toString(CryptoJS.enc.Hex);
    this.elementObject        = jQuery(elementPattern);

    if(this.baseElementObject.eq(0).offset().left > jQuery(window).width() / 2)
      this.currentElementPosition = "right";

    if(typeof this.elementOptionsObjectList[this.elementPatternMD5] === "undefined") {
      this.elementOptionsObjectList[this.elementPatternMD5] =
          jQuery.extend(1, {}, this.visualDeveloperInstance.ElementOptions);
      this.elementOptionsObjectList[this.elementPatternMD5]
          .Init(this.visualDeveloperInstance, elementPattern);
    }

    this.baseElementObject.addClass(this._settings.elementPanelActivePatternClass);

    jQuery("a")
        .unbind(this._settings.linkDisableEventTrigger)
        .bind(this._settings.linkDisableEventTrigger, function(event) {
          event.stopImmediatePropagation();
          event.stopPropagation();
          event.preventDefault();
        });

    this._displayPanel();
  },

  _displayPanel : function() {
    var objectInstance = this;

    if(this.currentPanelObject == false) {
      this.visualDeveloperInstance.Panel.currentPanelObject.append(this._getPanelHTML());

      this.currentPanelObject                    = jQuery('#' + this._settings.panelID);
      this.currentPanelOperationsObject          = jQuery('#' + this._settings.panelOperationsContainerID);
      this.currentPanelOperationsOptionsObject   = jQuery('#' + this._settings.panelOperationsOptionsContainerID);
      this.currentPanelOperationsGroups          = this.currentPanelOperationsObject.find('> .' + this._settings.panelOperationGroupClass);

      this.currentPanelOptionResetObject         = this.currentPanelObject.find("#" + this._settings.panelOperationsOptionResetID);
      this.currentPanelOptionSpectralModeObject  = this.currentPanelObject.find("#" + this._settings.panelOperationsOptionToggleSpectralModeID);
      this.currentPanelOptionFilterObject        = this.currentPanelObject.find("#" + this._settings.panelOperationsOptionFilterID);

      this.currentPanelObject.hide().fadeIn("slow");

      this._assignPanelActions();
      this._arrangePanel();

      jQuery(window).unbind(this._settings.arrangeEvents).bind(this._settings.arrangeEvents, function(){
        objectInstance._arrangePanel();
      });
    } else {
      this.RefreshPanelOperationsContent();
      this._arrangePanel();
    }
  },

  _universalEventSettingsUpdateHandler : function(JSONInformation) {
    if(typeof JSONInformation.layout_information !== "undefined") {
      var objectInstance = this;

      jQuery.each(JSONInformation['layout_information'], function(index, elementOptionJSONPack){
        var md5Hash = CryptoJS.MD5(elementOptionJSONPack._elementPattern).toString(CryptoJS.enc.Hex);

        objectInstance.elementOptionsObjectList[md5Hash] = jQuery.extend(
            1, {}, objectInstance.visualDeveloperInstance.ElementOptions
        );
        objectInstance.elementOptionsObjectList[md5Hash].InitFromPackedJSONObject(
                objectInstance.visualDeveloperInstance, elementOptionJSONPack
        );
      });
    }

    if(this.currentPanelObject != false) {
      this.RefreshPanelOperationsContent();
      this._arrangePanel();
    }
  },

  RefreshPanelOperationsContent : function() {
    this.currentPanelOperationsObject.html(this._getPanelOperationsContainer());
    this.currentPanelOperationsGroups = this.currentPanelOperationsObject.find('> .' + this._settings.panelOperationGroupClass);

    this._assignPanelActions(true);
  },

  /**
   * @returns {string}
   * @private
   */
  _getPanelHTML : function() {
    var panelHTML = '';

    panelHTML += '<div id="' + this._settings.panelID + '">';
    panelHTML +=  '<div id="' + this._settings.panelOperationsOptionsContainerID + '">';
    panelHTML +=    this._getPanelOperationsOptionsContainer();
    panelHTML +=  '</div>';
    panelHTML +=  '<span class="' + this.visualDeveloperInstance._settings.clearClass + '"></span>';
    panelHTML +=  '<div id="' + this._settings.panelOperationsContainerID + '">';
    panelHTML +=    this._getPanelOperationsContainer();
    panelHTML +=  '</div>';
    panelHTML +=  '<span class="' + this.visualDeveloperInstance._settings.clearClass + '"></span>';
    panelHTML += '</div>';

    return panelHTML;
  },

  _arrangePanel : function() {
    if(this.currentPanelObject == false)
      return;

    var topDistance  = this.visualDeveloperInstance.Panel.currentPanelContainerObject.height() +
        this.visualDeveloperInstance.Panel.currentPanelUserNotificationObject.innerHeight() +
        (this.visualDeveloperInstance.toolbarObject.length > 0 ? this.visualDeveloperInstance.toolbarObject.height() : 0);

    this.currentPanelObject.height(jQuery(window).height() - topDistance);
    this.currentPanelOperationsObject.css("height",
      this.currentPanelObject.height() - this.currentPanelOperationsOptionsObject.height()
    );
  },

  _assignPanelActions : function(isRefresh) {
    isRefresh = typeof isRefresh == "undefined" ? false : isRefresh;
    var objectInstance = this;

    this.currentPanelOptionSpectralModeObject
        .unbind(this._settings.panelOperationsOptionTrigger)
        .bind(this._settings.panelOperationsOptionTrigger, function(event){
      event.stopImmediatePropagation();
      event.preventDefault();

      if(objectInstance.spectralModeOverlayObject !== false)
        objectInstance._cancelSpectralMode();
      else
        objectInstance._enableSpectralMode();
    });

    this.currentPanelOptionResetObject
        .unbind(this._settings.panelOperationsOptionTrigger)
        .bind(this._settings.panelOperationsOptionTrigger, function(event){
          event.stopImmediatePropagation();
          event.preventDefault();

          objectInstance.visualDeveloperInstance.Utility.Modal.InitInstance(
              objectInstance._lang.resetModalTitle,
              {
                yes : {
                  name   : "Yes",
                  danger : true
                },

                no  : {
                  name   : "No"
                }
              }, objectInstance, objectInstance._getPanelOperationsOptionResetContainerModalCallback
          );
        });

    this.currentPanelOptionFilterObject
        .unbind(this._settings.panelOperationsInputOptionTrigger)
        .bind(this._settings.panelOperationsInputOptionTrigger, function(event) {
          event.stopImmediatePropagation();
          event.preventDefault();
          var optionAttribute  = objectInstance.visualDeveloperInstance.ElementOperations._settings.fieldElementContainerOptionAttribute,
              currentValue     = jQuery(this).val().trim().toLowerCase(),
              groupOptionsList = objectInstance.currentPanelOperationsGroups.find(
              '.' + objectInstance.visualDeveloperInstance.ElementOperations._settings.fieldElementContainerClass
          );

          if(currentValue == '')
            groupOptionsList.show();
          else
            groupOptionsList
                .hide()
                .filter(function( index ) {
                  return (jQuery(this).attr(optionAttribute).toLowerCase().indexOf(currentValue) !== -1);
                }).show();
        });

    if(this.spectralModeOverlayObject === false
        && isRefresh == false) {
      if(this.visualDeveloperInstance.hasSettingSpectralModeDefaultEnabled)
        this._enableSpectralMode();
      else
        this._cancelSpectralMode();
    }

    if(this.visualDeveloperInstance.hasSettingEnableElementPanelFilter == false)
      this.currentPanelOptionFilterObject.val("").hide().trigger("change");
    else
      this.currentPanelOptionFilterObject.show();

    this.visualDeveloperInstance.ElementOperations.AssignElementOperationsInOperationGroups(
        this.elementOptionsObjectList[this.elementPatternMD5],
        this.currentPanelOperationsGroups
    );
  },

  _getPanelOperationsOptionResetContainerModalCallback : function(response) {
    if(response == 'no')
      return;

    this.currentPanelOperationsGroups.find(":input").val("");
    this.currentPanelOperationsGroups.find(
        "." + this.visualDeveloperInstance.ElementOperations._settings.fieldElementContainerClass
    ).removeClass(this.visualDeveloperInstance.ElementOperations._settings.fieldElementActiveStateClass);

    this.elementOptionsObjectList[this.elementPatternMD5].Reset();
  },

  _getPanelOperationsOptionsContainer : function() {
    var operationsHTML = "";

    operationsHTML +=  '<span id="' + this._settings.panelOperationsOptionToggleSpectralModeID + '">';
    operationsHTML +=    this._lang.toggleSpectralMode;
    operationsHTML +=  '</span>';

    operationsHTML +=  '<span id="' + this._settings.panelOperationsOptionResetID + '">';
    operationsHTML +=    this._lang.reset;
    operationsHTML +=  '</span>';

    operationsHTML +=  '<span class="' + this.visualDeveloperInstance._settings.clearClass + '"></span>';

    operationsHTML += '<input type="text" id="' + this._settings.panelOperationsOptionFilterID + '" placeholder="' + this._lang.filter + '"/>';

    return operationsHTML;
  },

  panelOperationsOptionSelectorTriggerModal : function() {
    var objectInstance  = this,
        options         = {},
        activeOption    = false;

    jQuery.each(this.visualDeveloperInstance.SelectorOption, function(selectorIndex, selectorInformation) {
      if(selectorInformation.suffix != ""
          && objectInstance.elementPattern.endsWith(selectorInformation.suffix))
        activeOption = selectorIndex;
    });

    activeOption = activeOption == false ? "default" : activeOption;

    jQuery.each(this.visualDeveloperInstance.SelectorOption, function(selectorIndex, selectorInformation) {
      options[selectorIndex] = {
        name      : selectorInformation.name,
        active    : selectorIndex == activeOption,
        highlight : (typeof objectInstance.elementOptionsObjectList[CryptoJS.MD5(objectInstance.baseElementPattern + selectorInformation.suffix).toString(CryptoJS.enc.Hex)] !== "undefined")
      };
    });

    this.visualDeveloperInstance.Utility.Modal.InitInstance(this._lang.selectorModalTitle, options, this, this._getPanelOperationsOptionSelectorContainerModalCallback);
  },

  _getPanelOperationsContainer : function() {
    var objectInstance = this,
        operationsHTML = '',
        groupMap       = this._getPanelOperationsGroupsMap();

    jQuery.each(groupMap, function(groupName, groupOptions){
      operationsHTML += '<div class="' + objectInstance._settings.panelOperationGroupClass + '"' +
                              objectInstance._settings.panelOperationGroupAliasAttribute + '="' + groupName + '"' +
                        '>';
      jQuery.each(groupOptions, function(optionWeight, optionIndex){
        operationsHTML += objectInstance.visualDeveloperInstance.ElementOperations.GetElementOptionSettingsHTML(optionIndex);
      });
      operationsHTML += '</div>';
    });

    operationsHTML += '<span class="' + this.visualDeveloperInstance._settings.clearClass + '"></span>';

    return operationsHTML;
  },

  _getPanelOperationsGroupsMap : function() {
    var objectInstance = this,
        groupMap = {};

    jQuery.each(this.visualDeveloperInstance.ElementOption, function(optionIndex, optionInformation) {
      if(jQuery.inArray(optionIndex, objectInstance.visualDeveloperInstance.hiddenElementOptions) == -1) {
        if(typeof groupMap[optionInformation.group] === "undefined")
          groupMap[optionInformation.group] = {};

        var optimalIndex = optionInformation.weight;

        while(typeof groupMap[optionInformation.group][optimalIndex] !== "undefined")
          optimalIndex++;

        groupMap[optionInformation.group][optimalIndex] = optionIndex;
      }
    });

    return groupMap;
  },

  _reset : function() {
    jQuery("body").removeClass(this._settings.elementPositionLeftBodyClass);

    if(this.elementObject !== false) {
      this.elementObject.removeClass(this._settings.elementPanelActivePatternClass);
      this.elementObject = false;
    }

    this.elementPattern = "";
  },

  _filterExportSettingsLayoutInformation : function(currentInformation) {
    currentInformation.layoutInfoJSONPack = [];

    if(typeof this.elementOptionsObjectList !== "undefined") {
      jQuery.each(this.elementOptionsObjectList, function(key, optionsObject){
        currentInformation.layoutInfoJSONPack[currentInformation.layoutInfoJSONPack.length]
            = optionsObject.GetInformationPackJSON();
      });
    }

    return currentInformation;
  },

  _filterExportStylesheet : function(stylesheet) {
    stylesheet = typeof stylesheet == "undefined" ? '' : stylesheet;

    if(typeof this.elementOptionsObjectList !== "undefined") {
      jQuery.each(this.elementOptionsObjectList, function(key, optionsObject){
        stylesheet += optionsObject.GetStylesheetCSSRulesText();
      });
    }

    return stylesheet;
  },

  _enableSpectralMode : function() {
    jQuery("body").addClass(this._settings.spectralModeBodyClass);

    this.currentPanelOptionSpectralModeObject.addClass(this._settings.panelOperationsOptionActiveClass);

    if(this.spectralModeOverlayObject === false) {
      jQuery('body').append(this._getSpectralModeOverlay());
      this.spectralModeOverlayObject = jQuery("#" + this._settings.spectralModeOverlayID);

      this.spectralModeOverlayObject.hide();
      this._arrangeSpectralModeOverlay();
      this.spectralModeOverlayObject.fadeIn("slow");

      var objectInstance = this;

      jQuery(window).bind(this._settings.spectralModeArrangeEvent, function(){
        objectInstance._arrangeSpectralModeOverlay();
      });
    }
  },

  _cancelSpectralMode : function() {
    jQuery("body").removeClass(this._settings.spectralModeBodyClass);
    this.currentPanelOptionSpectralModeObject.removeClass(this._settings.panelOperationsOptionActiveClass);

    if(this.spectralModeOverlayObject !== false) {
      jQuery(window).unbind(this._settings.spectralModeArrangeEvent);
      this.spectralModeOverlayObject.fadeOut("slow", function(){
        jQuery(this).remove();
      });
      this.spectralModeOverlayObject = false;
    }
  },

  _getSpectralModeOverlay : function() {
    return '<div id="' + this._settings.spectralModeOverlayID + '"></div>';
  },

  _arrangeSpectralModeOverlay : function() {
    this.spectralModeOverlayObject
        .css("width", jQuery(window).width())
        .css("height", jQuery(window).height());
  },

  /**
   * @return {boolean}
   */
  HasPattern : function(path) {
    return (typeof this.elementOptionsObjectList[CryptoJS.MD5(path).toString(CryptoJS.enc.Hex)] !== "undefined");
  },

  Close : function() {
    this._reset();
    this._cancelSpectralMode();

    jQuery("a").unbind(this._settings.linkDisableEventTrigger);

    if(this.currentPanelObject != false) {
      jQuery(window).unbind(this._settings.arrangeEvents);

      this.currentPanelObject.find("*").unbind(this.visualDeveloperInstance.namespace + '-element-panel');
      this.currentPanelObject.fadeOut("slow", function() {
        jQuery(this).remove();
      });

      this.currentPanelObject = false;
    }
  }

};VisualDeveloperLite.ElementOption = {

};

// @codekit-append "options/padding.js"
// @codekit-append "options/margin.js"
// @codekit-append "options/border.js"
// @codekit-append "options/width.js"
// @codekit-append "options/minWidth.js"
// @codekit-append "options/maxWidth.js"
// @codekit-append "options/height.js"
// @codekit-append "options/minHeight.js"
// @codekit-append "options/maxHeight.js"
// @codekit-append "options/top.js"
// @codekit-append "options/right.js"
// @codekit-append "options/bottom.js"
// @codekit-append "options/left.js"
// @codekit-append "options/fontSize.js"
// @codekit-append "options/textIndent.js"
// @codekit-append "options/fontWeight.js"
// @codekit-append "options/lineHeight.js"
// @codekit-append "options/color.js"
// @codekit-append "options/textAlign.js"
// @codekit-append "options/textDecoration.js"
// @codekit-append "options/font.js"
// @codekit-append "options/backgroundColor.js"
// @codekit-append "options/backgroundImage.js"
// @codekit-append "options/cursor.js"
// @codekit-append "options/borderRadius.js"
// @codekit-append "options/display.js"
// @codekit-append "options/opacity.js"
// @codekit-append "options/position.js"
// @codekit-append "options/textTransform.js"

VisualDeveloperLite.ElementOption.Padding = {

  group   : "Spacing",
  weight  : 1,
  name    : "Padding",
  cssRule : "padding",
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

};VisualDeveloperLite.ElementOption.Margin = {

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

};VisualDeveloperLite.ElementOption.Border = {

  group   : "Border",
  weight  : 3,
  name    : "Border",
  cssRule : "border",
  cssModel: "border",
  format  : {
    value : {
      fieldType        : "input",
      fieldValidation  : "numeric"
    },

    valueType : {
      fieldType       : 'select',
      fieldValidation : false,
      fieldOptions    : [ 'px', 'em', 'rem', '%' ]
    },

    color : {
      fieldType       : "color-picker",
      fieldValidation : "required"
    },

    type : {
      fieldType       : "select",
      fieldValidation : false,
      fieldOptions    : {
        'dotted' : 'Defines a dotted border',
        'dashed' : 'Defines a dashed border',
        'solid'  : 'Defines a solid border',
        'double' : 'Defines two borders. The width of the two borders are the same as the border-width value',
        'groove' : 'Defines a 3D grooved border. The effect depends on the border-color value',
        'ridge'  : 'Defines a 3D ridged border. The effect depends on the border-color value',
        'inset'  : 'Defines a 3D inset border. The effect depends on the border-color value',
        'outset' : 'Defines a 3D outset border. The effect depends on the border-color value'
      }
    }
  },

  generateRuleByFormatResponse : function(format) {
    if(format.value == 0)
      return 0;

    return (format.value instanceof Array ?
            format.valueType.join(format.valueType + " ") + format.valueType:
            format.value + format.valueType
           ) + ' ' + format.type + ' ' + format.color;
  },

  isValid : function(format) {
    return format.value !== "";
  }

};VisualDeveloperLite.ElementOption.Width = {

  group   : "Size",
  weight  : 1,
  name    : "Width",
  cssRule : "width",
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

    return (format.value instanceof Array ?
            format.valueType.join(format.valueType + " ") + format.valueType:
            format.value + format.valueType
           );
  },

  isValid : function(format) {
    return format.value !== "";
  },

  generateFormatByRule : function(cssValue) {
    return VisualDeveloperLite.Utility.getDefaultCSSFormatByRule(cssValue);
  }

};VisualDeveloperLite.ElementOption.MinWidth = {

  group   : "Size",
  weight  : 3,
  name    : "Minimum Width",
  cssRule : "min-width",
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

    return (format.value instanceof Array ?
        format.valueType.join(format.valueType + " ") + format.valueType:
        format.value + format.valueType
        );
  },

  isValid : function(format) {
    return format.value !== "";
  },

  generateFormatByRule : function(cssValue) {
    return VisualDeveloperLite.Utility.getDefaultCSSFormatByRule(cssValue);
  }

};VisualDeveloperLite.ElementOption.MaxWidth = {

  group   : "Size",
  weight  : 4,
  name    : "Maximum Width",
  cssRule : "max-width",
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

    return (format.value instanceof Array ?
        format.valueType.join(format.valueType + " ") + format.valueType:
        format.value + format.valueType
        );
  },

  isValid : function(format) {
    return format.value !== "";
  },

  generateFormatByRule : function(cssValue) {
    return VisualDeveloperLite.Utility.getDefaultCSSFormatByRule(cssValue);
  }

};VisualDeveloperLite.ElementOption.Height = {

  group   : "Size",
  weight  : 2,
  name    : "Height",
  cssRule : "height",
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

    return (format.value instanceof Array ?
            format.valueType.join(format.valueType + " ") + format.valueType:
            format.value + format.valueType
           );
  },

  isValid : function(format) {
    return format.value !== "";
  },

  generateFormatByRule : function(cssValue) {
    return VisualDeveloperLite.Utility.getDefaultCSSFormatByRule(cssValue);
  }

};VisualDeveloperLite.ElementOption.MinHeight = {

  group   : "Size",
  weight  : 5,
  name    : "Minimum Height",
  cssRule : "min-height",
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

    return (format.value instanceof Array ?
        format.valueType.join(format.valueType + " ") + format.valueType:
        format.value + format.valueType
        );
  },

  isValid : function(format) {
    return format.value !== "";
  },

  generateFormatByRule : function(cssValue) {
    return VisualDeveloperLite.Utility.getDefaultCSSFormatByRule(cssValue);
  }

};VisualDeveloperLite.ElementOption.MaxHeight = {

  group   : "Size",
  weight  : 6,
  name    : "Maximum Height",
  cssRule : "max-height",
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

    return (format.value instanceof Array ?
            format.valueType.join(format.valueType + " ") + format.valueType:
            format.value + format.valueType
           );
  },

  isValid : function(format) {
    return format.value !== "";
  },

  generateFormatByRule : function(cssValue) {
    return VisualDeveloperLite.Utility.getDefaultCSSFormatByRule(cssValue);
  }

};VisualDeveloperLite.ElementOption.Top = {

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

};VisualDeveloperLite.ElementOption.Right = {

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

};VisualDeveloperLite.ElementOption.Bottom = {

  group   : "Position",
  weight  : 4,
  name    : "Bottom",
  cssRule : "bottom",
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

};VisualDeveloperLite.ElementOption.Left = {

  group   : "Position",
  weight  : 5,
  name    : "Left",
  cssRule : "left",
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

};VisualDeveloperLite.ElementOption.FontSize = {

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

};VisualDeveloperLite.ElementOption.TextIndent = {

  group   : "Text",
  weight  : 8,
  name    : "Text Indent",
  cssRule : "text-indent",
  cssModel: "default",
  format  : {
    value : {
      fieldType       : "input"
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

};VisualDeveloperLite.ElementOption.FontWeight = {

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

};VisualDeveloperLite.ElementOption.LineHeight = {

  group   : "Text",
  weight  : 7,
  name    : "Line Height",
  cssRule : "line-height",
  cssModel: "single",
  format  : {
    input : {
      fieldType       : "url",
      placeholder     : "Input Based Value"
    },
    value : {
      fieldType       : 'select',
      fieldValidation : false,
      fieldOptions    : [ "inherit", "initial" , "normal", "input" ]
    }
  },

  generateRuleByFormatResponse : function(format) {
    return (format.value === "input" ? format.input : format.value);
  }

};VisualDeveloperLite.ElementOption.Color = {

  group   : "Text",
  weight  : 1,
  name    : "Color",
  cssRule : "color",
  cssModel: "single",
  format  : {
    value : {
      fieldType       : "color-picker",
      fieldValidation : "required"
    }
  },

  generateRuleByFormatResponse : function(format) {
    return format.value;
  },

  isValid : function(format) {
    return format.value !== "";
  },

  generateFormatByRule : function(cssValue) {
    return {
      value : cssValue
    };
  }

};VisualDeveloperLite.ElementOption.TextAlign = {

  group   : "Text",
  weight  : 3,
  name    : "Text Align",
  cssRule : "text-align",
  cssModel: "single",
  format  : {
    value : {
      fieldType       : 'select',
      fieldValidation : false,
      fieldOptions    : {
        'inherit'       : 'Inherits this property from its parent element',
        'initial'       : 'Sets this property to its default value',
        'left'          : 'Aligns the text to the left',
        'right'         : 'Aligns the text to the right',
        'center'        : 'Centers the text',
        'justify'       : 'Stretches the lines so that each line has equal width (like in newspapers and magazines)'
      }
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

};VisualDeveloperLite.ElementOption.TextDecoration = {

  group   : "Text",
  weight  : 6,
  name    : "Text Decoration",
  cssRule : "text-decoration",
  cssModel: "single",
  format  : {
    value : {
      fieldType       : 'select',
      fieldValidation : false,
      fieldOptions    : {
        'inherit'       : 'Inherits this property from its parent element',
        'none'          : 'Defines a normal text.',
        'underline'     : 'Defines a line below the text',
        'overline'      : 'Defines a line above the text',
        'line-through'  : 'Defines a line through the text',
        'initial'       : 'Sets this property to its default value'
      }
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

};VisualDeveloperLite.ElementOption.Font = {

  group   : "Text",
  weight  : 5,
  name    : "Font",
  cssRule : "font-family",
  cssModel: "single-select",
  format  : {
    value : {
      fieldType       : 'select',
      fieldValidation : false,
      fieldOptions    : [
        'initial', 'Abel', 'Abril Fatface', 'Aclonica', 'Actor', 'Adamina', 'Aguafina Script', 'Aladin', 'Aldrich', 'Alice', 'Alike Angular',
        'Alike', 'Allan', 'Allerta Stencil', 'Allerta', 'Amaranth', 'Amatic SC', 'Andada', 'Andika', 'Annie Use Your Telescope',
        'Anonymous Pro', 'Antic', 'Anton', 'Arapey', 'Architects Daughter', 'Arimo', 'Artifika', 'Arvo', 'Asset', 'Astloch',
        'Atomic Age', 'Aubrey', 'Bangers', 'Bentham', 'Bevan', 'Bigshot One', 'Bitter', 'Black Ops One', 'Bowlby One SC',
        'Bowlby One', 'Brawler', 'Bubblegum Sans', 'Buda', 'Butcherman Caps', 'Cabin Condensed', 'Cabin Sketch', 'Cabin',
        'Cagliostro', 'Calligraffitti', 'Candal', 'Cantarell', 'Cardo', 'Carme', 'Carter One', 'Caudex', 'Cedarville Cursive',
        'Changa One', 'Cherry Cream Soda', 'Chewy', 'Chicle', 'Chivo', 'Coda Caption', 'Coda', 'Comfortaa', 'Coming Soon',
        'Contrail One', 'Convergence', 'Cookie', 'Copse', 'Corben', 'Cousine', 'Coustard', 'Covered By Your Grace', 'Crafty Girls',
        'Creepster Caps', 'Crimson Text', 'Crushed', 'Cuprum', 'Damion', 'Dancing Script', 'Dawning of a New Day', 'Days One',
        'Delius Swash Caps', 'Delius Unicase', 'Delius', 'Devonshire', 'Didact Gothic', 'Dorsa', 'Dr Sugiyama', 'Droid Sans Mono',
        'Droid Sans', 'Droid Serif', 'EB Garamond', 'Eater Caps', 'Expletus Sans', 'Fanwood Text', 'Federant', 'Federo', 'Fjord One',
        'Fondamento', 'Fontdiner Swanky', 'Forum', 'Francois One', 'Gentium Basic', 'Gentium Book Basic', 'Geo', 'Geostar Fill', 'Geostar',
        'Give You Glory', 'Gloria Hallelujah', 'Goblin One', 'Gochi Hand', 'Goudy Bookletter 1911', 'Gravitas One', 'Gruppo', 'Hammersmith One',
        'Herr Von Muellerhoff', 'Holtwood One SC', 'Homemade Apple', 'IM Fell DW Pica SC', 'IM Fell DW Pica', 'IM Fell Double Pica SC',
        'IM Fell Double Pica', 'IM Fell English SC', 'IM Fell English', 'IM Fell French Canon SC', 'IM Fell French Canon', 'IM Fell Great Primer SC',
        'IM Fell Great Primer', 'Iceland', 'Inconsolata', 'Indie Flower', 'Irish Grover', 'Istok Web', 'Jockey One', 'Josefin Sans', 'Josefin Slab',
        'Judson', 'Julee', 'Jura', 'Just Another Hand', 'Just Me Again Down Here', 'Kameron', 'Kelly Slab', 'Kenia', 'Knewave', 'Kranky', 'Kreon',
        'Kristi', 'La Belle Aurore', 'Lancelot', 'Lato', 'League Script', 'Leckerli One', 'Lekton', 'Lemon', 'Limelight', 'Linden Hill', 'Lobster Two',
        'Lobster', 'Lora', 'Love Ya Like A Sister', 'Loved by the King', 'Luckiest Guy', 'Maiden Orange', 'Mako', 'Marck Script', 'Marvel', 'Mate SC',
        'Mate', 'Maven Pro', 'Meddon', 'MedievalSharp', 'Megrim', 'Merienda One', 'Merriweather', 'Metrophobic', 'Michroma', 'Miltonian Tattoo', 'Miltonian', 'Miss Fajardose', 'Miss Saint Delafield', 'Modern Antiqua', 'Molengo', 'Monofett', 'Monoton', 'Monsieur La Doulaise', 'Montez', 'Mountains of Christmas', 'Mr Bedford', 'Mr Dafoe', 'Mr De Haviland', 'Mrs Sheppards', 'Muli', 'Neucha', 'Neuton', 'News Cycle', 'Niconne', 'Nixie One', 'Nobile', 'Nosifer Caps', 'Nothing You Could Do', 'Nova Cut', 'Nova Flat', 'Nova Mono', 'Nova Oval', 'Nova Round', 'Nova Script', 'Nova Slim', 'Nova Square', 'Numans', 'Nunito', 'Old Standard TT', 'Open Sans Condensed', 'Open Sans', 'Orbitron', 'Oswald', 'Over the Rainbow', 'Ovo', 'PT Sans Caption', 'PT Sans Narrow', 'PT Sans', 'PT Serif Caption', 'PT Serif', 'Pacifico', 'Passero One', 'Patrick Hand', 'Paytone One', 'Permanent Marker', 'Petrona', 'Philosopher', 'Piedra', 'Pinyon Script', 'Play', 'Playfair Display', 'Podkova', 'Poller One', 'Poly', 'Pompiere', 'Prata', 'Prociono', 'Puritan', 'Quattrocento Sans', 'Quattrocento', 'Questrial', 'Quicksand', 'Radley', 'Raleway', 'Rammetto One', 'Rancho', 'Rationale', 'Redressed', 'Reenie Beanie', 'Ribeye Marrow', 'Ribeye', 'Righteous', 'Rochester', 'Rock Salt', 'Rokkitt', 'Rosario', 'Ruslan Display', 'Salsa', 'Sancreek', 'Sansita One', 'Satisfy', 'Schoolbell', 'Shadows Into Light', 'Shanti', 'Short Stack', 'Sigmar One', 'Signika Negative', 'Signika', 'Six Caps', 'Slackey', 'Smokum', 'Smythe', 'Sniglet', 'Snippet', 'Sorts Mill Goudy', 'Special Elite', 'Spinnaker', 'Spirax', 'Stardos Stencil', 'Sue Ellen Francisco', 'Sunshiney', 'Supermercado One', 'Swanky and Moo Moo', 'Syncopate', 'Tangerine', 'Tenor Sans', 'Terminal Dosis', 'The Girl Next Door', 'Tienne', 'Tinos', 'Tulpen One', 'Ubuntu Condensed', 'Ubuntu Mono', 'Ubuntu', 'Ultra', 'UnifrakturCook', 'UnifrakturMaguntia', 'Unkempt', 'Unlock', 'Unna', 'VT323', 'Varela Round', 'Varela', 'Vast Shadow', 'Vibur', 'Vidaloka', 'Volkhov', 'Vollkorn', 'Voltaire', 'Waiting for the Sunrise', 'Wallpoet', 'Walter Turncoat', 'Wire One', 'Yanone Kaffeesatz', 'Yellowtail', 'Yeseva One', 'Zeyada',
      ]
    }
  },

  generateDependencyImportURL : function(format) {
    if(format.value == "initial")
      return false;

    var family = format.value;
        family = family.replace(/ /g, "+");

    return 'http://fonts.googleapis.com/css?family=' + family + ':400';
  },

  generateRuleByFormatResponse : function(format) {
    if(format.value == 'initial')
      return format.value;

    return "'" + format.value + "'" + ', sans-serif';
  },

  /**
   * Don't customize for that specific setting
   * @param format
   * @returns {boolean}
   */
  isValid : function(format) {
    return format.value !== "initial";
  }

};VisualDeveloperLite.ElementOption.BackgroundColor = {

  group   : "Background",
  weight  : 1,
  name    : "Background Color",
  cssRule : "background-color",
  cssModel: "single",
  format  : {
    value : {
      fieldType       : "color-picker",
      fieldValidation : "required"
    }
  },

  generateRuleByFormatResponse : function(format) {
    return format.value;
  },

  isValid : function(format) {
    return format.value !== "";
  },

  generateFormatByRule : function(cssValue) {
    return {
      value : cssValue
    };
  }

};VisualDeveloperLite.ElementOption.BackgroundImage = {

  group   : "Background",
  weight  : 2,
  name    : "Background Image",
  cssRule : "background-image",
  cssModel: "single",
  format  : {
    url : {
      fieldType       : "url",
      fieldValidation : "required",
      placeholder     : "Image URL"
    },
    value : {
      fieldType       : 'select',
      fieldValidation : false,
      fieldOptions    : ['inherit', 'initial', 'url', 'none', "full-background", "forced-background"]
    }
  },

  generateRuleByFormatResponse : function(format) {
    if(format.value == "full-background")
      return 'url("' + format.url + '");' + "\n" +
             'background: url("' + format.url + '") no-repeat center center fixed;' + "\n" +
             '-webkit-background-size: cover;' + "\n" +
             '-moz-background-size: cover;' + "\n" +
             '-o-background-size: cover;' + "\n" +
             'background-size: cover';

    if(format.value == "forced-background")
      return 'url("' + format.url + '") !important';

    return (format.value == "url" ? 'url("' + format.url + '")' : format.value);
  },

  isValid : function(format) {
    return !(format.url === "" && (format.value == "url" || format.value == "full-background" || format.value == "forced-background"));
  }

};VisualDeveloperLite.ElementOption.Cursor = {

  group   : "Misc",
  weight  : 3,
  name    : "Cursor",
  cssRule : "cursor",
  cssModel: "single",
  format  : {
    value : {
      fieldType       : 'select',
      fieldValidation : false,
      fieldOptions    : {
        'inherit'     : 'Inherits this property from its parent element',
        'default' 	  : 'The default cursor',
        'pointer'     : 'The cursor is a pointer and indicates a link',
        'auto'        : 'Default. The browser sets a cursor',
        'none'        : 'No cursor is rendered for the element',
        'ew-resize'   : 'Indicates a bidirectional resize cursor',
        'help'        : 'The cursor indicates that help is available',
        'move'        : 'The cursor indicates something is to be moved'
      }
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

};VisualDeveloperLite.ElementOption.BorderRadius = {

  group   : "Border",
  weight  : 2,
  name    : "Border Radius",
  cssRule : "border-radius",
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

};VisualDeveloperLite.ElementOption.Display = {

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

};VisualDeveloperLite.ElementOption.Opacity = {

  group   : "Misc",
  weight  : 9,
  name    : "Opacity",
  cssRule : "Opacity",
  cssModel: "single",
  format  : {
    input : {
      fieldType       : "input",
      fieldValidation : "numeric",
      placeholder     : "Input Based Value"
    },
    value : {
      fieldType       : 'select',
      fieldValidation : false,
      fieldOptions    : [ "inherit", "input" ]
    }
  },

  generateRuleByFormatResponse : function(format) {
    return (format.value === "input" ? format.input : format.value);
  }

};VisualDeveloperLite.ElementOption.Position = {

  group   : "Position",
  weight  : 1,
  name    : "Position",
  cssRule : "position",
  cssModel: "single",
  format  : {
    value : {
      fieldType       : 'select',
      fieldValidation : false,
      fieldOptions    : [ "initial", "static" , "absolute", "relative", "fixed", "inherit" ]
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

};VisualDeveloperLite.ElementOption.TextTransform = {

  group   : "Text",
  weight  : 8,
  name    : "Text Transform",
  cssRule : "text-transform",
  cssModel: "single",
  format  : {
    value : {
      fieldType       : 'select',
      fieldValidation : false,
      fieldOptions    : [ 'none', 'capitalize', 'uppercase', 'lowercase', 'initial', 'inherit' ]
    }
  },

  generateRuleByFormatResponse : function(format) {
    if(format.value === 0)
      return 0;

    return format.value;
  },

  isValid : function(format) {
    return format.value !== "";
  },

  generateFormatByRule : function(cssValue) {
    return VisualDeveloperLite.Utility.getDefaultCSSFormatByRule(cssValue);
  }

};VisualDeveloperLite.ElementOptions = {

  visualDeveloperInstance : {},

  _elementPattern     : "",
  _elementObject      : {},
  _uniqueLayoutID     : '',
  _uniqueLayoutObject : false,
  options : {

  },

  activeOptions : {

  },

  importantOptions : {

  },

  registeredExternalResources : [],

  Init : function(visualDeveloperInstance, elementPattern) {
    this.visualDeveloperInstance = visualDeveloperInstance;

    this.options          = jQuery.extend(1, {}, this.options);
    this.activeOptions    = jQuery.extend(1, {}, this.activeOptions);
    this.importantOptions = jQuery.extend(1, {}, this.importantOptions);

    this._elementPattern = elementPattern;
    this._elementObject  = jQuery(elementPattern);
    this._uniqueLayoutID = this.visualDeveloperInstance.styleNamespace + CryptoJS.MD5(this._elementPattern);

    this._syncOptionsObject();
  },

  _syncOptionsObject : function() {
    var objectInstance = this;

    jQuery.each(this.visualDeveloperInstance.ElementOption, function(optionIndex, optionObject){
      objectInstance.options[optionIndex] = (
            typeof objectInstance.options[optionIndex] === "undefined" ?
                objectInstance.options[optionIndex] : {}
          );

      objectInstance.activeOptions[optionIndex] = (
          typeof objectInstance.activeOptions[optionIndex] === "undefined" ?
              objectInstance.activeOptions[optionIndex] : 0
          );

      objectInstance.importantOptions[optionIndex] = (
          typeof objectInstance.importantOptions[optionIndex] === "undefined" ?
              objectInstance.importantOptions[optionIndex] : 0
          );

    });
  },

  SetOptionValues : function(optionIndex, fieldValues) {
    this.options[optionIndex] = fieldValues;

    this._syncOptionWithLayout();
  },

  EnableOption    : function(optionIndex) {
    this.activeOptions[optionIndex] = 1;

    this._syncOptionWithLayout();
  },

  DisableOption   : function(optionIndex) {
    this.activeOptions[optionIndex] = 0;

    this._syncOptionWithLayout();
  },

  EnableOptionImportant    : function(optionIndex) {
    this.importantOptions[optionIndex] = 1;

    this._syncOptionWithLayout();
  },

  DisableOptionImportant   : function(optionIndex) {
    this.importantOptions[optionIndex] = 0;

    this._syncOptionWithLayout();
  },

  GetCurrentActiveOptionsMap : function() {
    var objectInstance = this,
        ret            = {};

    this._resetRegisteredExternalResources();

    jQuery.each(this.activeOptions, function(optionIndex, isActiveOption){
      if(isActiveOption
          && typeof objectInstance.options[optionIndex] !== "undefined") {
        var includeRule   = true;

        if(typeof objectInstance.visualDeveloperInstance.ElementOption[optionIndex].isValid === "function"
            && objectInstance.visualDeveloperInstance.ElementOption[optionIndex].isValid(objectInstance.options[optionIndex]) == false)
          includeRule = false;

        if(includeRule) {
          ret[optionIndex] = objectInstance
                              .visualDeveloperInstance
                              .ElementOption[optionIndex]
                              .generateRuleByFormatResponse(
                                  objectInstance.options[optionIndex]
                              );

          if(typeof objectInstance.visualDeveloperInstance.ElementOption[optionIndex].generateDependencyImportURL == "function") {
            var externalCSS = objectInstance
                                .visualDeveloperInstance
                                .ElementOption[optionIndex]
                                .generateDependencyImportURL(objectInstance.options[optionIndex]);

            if(jQuery.inArray(externalCSS, objectInstance.visualDeveloperInstance.externalCSSResources) == -1) {
              objectInstance.visualDeveloperInstance.externalCSSResources[
                  objectInstance.visualDeveloperInstance.externalCSSResources.length
              ] = externalCSS;

              objectInstance.registeredExternalResources[
                  objectInstance.registeredExternalResources.length
              ] = externalCSS;
            }
          }
        }
      }
    });

    return ret;
  },

  _resetRegisteredExternalResources : function() {
    var objectInstance = this;

    jQuery.each(this.registeredExternalResources, function(key, value) {
      var arrayPosition = jQuery.inArray(value, objectInstance.visualDeveloperInstance.externalCSSResources);

      if(arrayPosition !== -1)
        objectInstance.visualDeveloperInstance.externalCSSResources.splice(arrayPosition, 1);
    });

    this.registeredExternalResources = [];
  },

  _syncOptionWithLayout : function() {
    var stylesheetObject = this._getStyleSheetObject();

    stylesheetObject.html(this.GetStylesheetCSSRulesText());

    this.visualDeveloperInstance.SyncLayoutWithExternalCSSDependencies();
  },

  /**
   * @return {string}
   */
  GetStylesheetCSSRulesText : function() {
    var objectInstance   = this,
        stylesheetRule   = "";

    stylesheetRule += this._elementPattern + " { \n";

    jQuery.each(this.GetCurrentActiveOptionsMap(), function(optionIndex, cssValue) {
      stylesheetRule +=
          "    " + objectInstance._getStylesheetCSSRuleByOptionIndexAndCSSValue(
              optionIndex, cssValue
          ) + "\n";
    });

    stylesheetRule += "}\n";

    return stylesheetRule;
  },

  _getStylesheetCSSRuleByOptionIndexAndCSSValue : function(optionIndex, cssValue){
    return this.visualDeveloperInstance.ElementOption[optionIndex].cssRule + " : " + cssValue +
            ( typeof this.importantOptions[optionIndex] !== "undefined" && this.importantOptions[optionIndex] == 1
                ? ' !important' : '' ) +
            ";";
  },

  _getStyleSheetObject : function() {
    if(this._uniqueLayoutObject != false)
      return this._uniqueLayoutObject;

    jQuery("head").append('<style id="' + this._uniqueLayoutID + '"></style>');

    this._uniqueLayoutObject = jQuery("#" + this._uniqueLayoutID);

    return this._uniqueLayoutObject;
  },

  Reset : function() {
    this.options       = {};
    this.activeOptions = {};

    this._syncOptionsObject();
    this._syncOptionWithLayout();
  },

  GetInformationPackJSON : function() {
    return {
      _elementPattern  : this._elementPattern,
      options          : this.options,
      activeOptions    : this.activeOptions,
      importantOptions : this.importantOptions
    };
  },

  _unpackInformationFromJSON : function(packedJSONObject) {
    var objectInstance = this;

    jQuery.each(packedJSONObject, function(key, value) {
      objectInstance[key] = value;
    });

    this._syncOptionWithLayout();
  },

  InitFromPackedJSONObject : function(visualDeveloperInstance, packedJSONObject) {
    this.Init(visualDeveloperInstance, packedJSONObject._elementPattern);
    this._unpackInformationFromJSON(packedJSONObject);
  }

};VisualDeveloperLite.ElementOperations = {

  visualDeveloperInstance : {},

  _lang : {
    placeholderColorPickerInput : "Color Picker",
    placeholderTextInput        : "Value",
    operationSetImportant       : '!important'
  },

  _settings : {
    fieldAllow4InputAttribute              : 'allow-four-input-map',
    fieldNumericInputAttribute             : 'is-numeric-field',
    fieldColorPickerInputClass             : 'color-picker-field',
    fieldColorPickerInputAttribute         : 'is-color-picker-field',
    labelFieldNameClass                    : 'element-operations-field-label',
    fieldElementContainerClass             : 'element-operations-field-container',
    fieldElementContainerModelPrefixClass  : 'element-operations-model-',
    fieldElementContainerOptionAttribute   : 'element-operations-field-option-name',
    fieldElementActiveStateClass           : 'element-operations-active-rule',
    fieldElementEnableTrigger              : 'click',
    fieldElementSyncTrigger                : 'keyup change',
    fieldElementImportantToggleTrigger     : 'click',
    fieldElementImportantToggleClass       : 'element-operations-field-important-toggle',
    fieldElementImportantActiveClass       : 'element-operations-field-important-active'
  },

  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;
    this._initDependencies();
  },

  _initDependencies : function() {
    this._prefixCSSSettings();
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  /**
   * @param elementOptionIndex
   * @returns {string}
   * @constructor
   */
  GetElementOptionSettingsHTML : function(elementOptionIndex) {
    var objectInstance = this,
        currentOption  = this.visualDeveloperInstance.ElementOption[elementOptionIndex],
        html           = '';

    html += '<div class="' + this._settings.fieldElementContainerClass + '" ' + this._settings.fieldElementContainerOptionAttribute + '="' + elementOptionIndex + '">';
    html +=   '<p class="' + this._settings.labelFieldNameClass + '">';

    if(this.visualDeveloperInstance.hasSettingEnableImportantElement) {
      html +=    '<span class="' + this._settings.fieldElementImportantToggleClass + '">';
      html +=      this._lang.operationSetImportant;
      html +=    '</span>';
    }

    html +=       currentOption.name;
    html +=   '</p>';
    html +=   '<ul class="' + this._settings.fieldElementContainerModelPrefixClass + (typeof currentOption.cssModel === "undefined" ? "default" : currentOption.cssModel) + '" ';
    html +=     this._settings.fieldAllow4InputAttribute + '="' + (typeof currentOption.allow4InputMap === "undefined" ? 0 : currentOption.allow4InputMap | 0) + '"';
    html +=   '>';
    jQuery.each(currentOption.format, function(alias, informationMAP){
      if(informationMAP.fieldType == 'input')
        html += '<li>' + objectInstance._getTextInputElementOptionHTML(
                  elementOptionIndex + "-" + alias, informationMAP
                 ) + '</li>';
      else if(informationMAP.fieldType == 'url')
        html += '<li>' + objectInstance._getURLInputElementOptionHTML(
            elementOptionIndex + "-" + alias, informationMAP
                ) + '</li>';
      else if(informationMAP.fieldType == 'select')
        html += '<li>' + objectInstance._getSelectInputElementOptionHTML(
                  elementOptionIndex + "-" + alias, informationMAP
                ) + '</li>';
      else if(informationMAP.fieldType == 'color-picker')
        html += '<li>' + objectInstance._getColorPickerInputElementOptionHTML(
                  elementOptionIndex + "-" + alias, informationMAP
                ) + '</li>';
    });
    html +=   '</ul>';
    html += '</div>';

    return html;
  },

  _getTextInputElementOptionHTML : function(alias, informationMAP) {
    var inputElementOptionHTML = '';

    inputElementOptionHTML += '<input type="text" ';
    inputElementOptionHTML +=        'name="' + this.visualDeveloperInstance.fieldNamespace + alias + '" ';
    if(typeof informationMAP.placeholder !== "undefined" )
      inputElementOptionHTML +=        'placeholder="' + informationMAP.placeholder + '" ';
    else
      inputElementOptionHTML +=        'placeholder="' + this._lang.placeholderTextInput + '" ';

    if(typeof informationMAP.fieldValidation !== "undefined" )
      if(informationMAP.fieldValidation === "numeric" )
        inputElementOptionHTML +=        this._settings.fieldNumericInputAttribute + '="1" ';

    inputElementOptionHTML += '/>';

    return inputElementOptionHTML;
  },

  _getURLInputElementOptionHTML : function(alias, informationMAP) {
    var inputElementOptionHTML = '';

    inputElementOptionHTML += '<input type="text" ';
    inputElementOptionHTML +=        'name="' + this.visualDeveloperInstance.fieldNamespace + alias + '" ';
    if(typeof informationMAP.placeholder !== "undefined" )
      inputElementOptionHTML +=        'placeholder="' + informationMAP.placeholder + '" ';


    inputElementOptionHTML += '/>';

    return inputElementOptionHTML;
  },

  _getSelectInputElementOptionHTML : function(alias, informationMAP) {
    var inputElementOptionHTML = '',
        optionsWithIndicators = !(informationMAP.fieldOptions instanceof Array);

    inputElementOptionHTML += '<select name="' + this.visualDeveloperInstance.fieldNamespace + alias + '">';

    jQuery.each(informationMAP.fieldOptions, function(key, value){
      if(optionsWithIndicators) {
        inputElementOptionHTML += '<option data-tooltip="' + value + '" value="' + key + '" ' +
                                  '>' + key  + '</option>';
      } else {
        inputElementOptionHTML += '<option value="' + value + '">' + value + '</option>';
      }
    });

    inputElementOptionHTML += '</select>';

    return inputElementOptionHTML;
  },

  _getColorPickerInputElementOptionHTML : function(alias, informationMAP) {
    var inputElementOptionHTML = '';

    inputElementOptionHTML += '<input type="text" ';
    inputElementOptionHTML +=        'class="' + this._settings.fieldColorPickerInputClass + '" ';
    inputElementOptionHTML +=        'name="' + this.visualDeveloperInstance.fieldNamespace + alias + '" ';
    inputElementOptionHTML +=        'placeholder="' + (typeof informationMAP.placeholder !== "undefined" ? informationMAP.placeholder : this._lang.placeholderColorPickerInput) + '" ';
    inputElementOptionHTML +=        this._settings.fieldColorPickerInputAttribute + '="1" ';
    inputElementOptionHTML += '/>';


    return inputElementOptionHTML;
  },

  AssignElementOperationsInOperationGroups : function(elementOptionsObject, operationGroups) {
    var objectInstance = this;

    operationGroups.find('.' + this._settings.labelFieldNameClass)
        .unbind(this._settings.fieldElementEnableTrigger)
        .bind(this._settings.fieldElementEnableTrigger, function(){
      jQuery(this).parent().toggleClass(objectInstance._settings.fieldElementActiveStateClass);

      var currentOptionName = jQuery(this)
          .parents("." + objectInstance._settings.fieldElementContainerClass + ':first')
          .attr(objectInstance._settings.fieldElementContainerOptionAttribute);

      if(jQuery(this).parent().hasClass(objectInstance._settings.fieldElementActiveStateClass)) {
        elementOptionsObject.EnableOption(currentOptionName);
      } else {
        elementOptionsObject.DisableOption(currentOptionName);
      }
    });

    operationGroups.find(':input')
        .unbind(this._settings.fieldElementSyncTrigger)
        .bind(this._settings.fieldElementSyncTrigger, function(){
      var currentPatternRow = jQuery(this)
              .parents("." + objectInstance._settings.fieldElementContainerClass + ':first'),
          currentOptionName = currentPatternRow
              .attr(objectInstance._settings.fieldElementContainerOptionAttribute),
          currentFieldInputNamePrefix = objectInstance.visualDeveloperInstance.fieldNamespace + currentOptionName;

      var fieldValues = {};

      jQuery.each(currentPatternRow.find('[name^="' + currentFieldInputNamePrefix + '"]'), function(){
        var inputName = jQuery(this).attr("name").substr(currentFieldInputNamePrefix.length + 1);

        if(inputName.substr(inputName.length - 2) == "[]") {
          inputName = inputName.substr(0, inputName.length - 2);

          if(typeof fieldValues[inputName] === "undefined")
            fieldValues[inputName] = [];

          fieldValues[inputName][fieldValues[inputName].length] = jQuery(this).val();
        } else {
          fieldValues[inputName] = jQuery(this).val();
        }
      });

      if(!currentPatternRow.hasClass(objectInstance._settings.fieldElementActiveStateClass))
        currentPatternRow.find('.' + objectInstance._settings.labelFieldNameClass).trigger(
            objectInstance._settings.fieldElementEnableTrigger
        );

      elementOptionsObject.SetOptionValues(currentOptionName, fieldValues);
    });


    this._handleUserOptions(elementOptionsObject, operationGroups);
    this._populateInputsWithCurrentValuesOnLoad(elementOptionsObject, operationGroups);

    var splitSelectObjects = operationGroups.find(
        "." + this._settings.fieldElementContainerModelPrefixClass + 'single select, ' +
            "." + this._settings.fieldElementContainerModelPrefixClass + 'border > li:last-child select'
    );

    this.visualDeveloperInstance.Utility.SplitSelect.InitInstance(splitSelectObjects);

    this.visualDeveloperInstance.Utility.NiceSelect.InitInstance(
        operationGroups.find("select").not(splitSelectObjects)
    );

    this.visualDeveloperInstance.Utility.InputMAP.InitInstance(
        operationGroups.find('[' + this._settings.fieldAllow4InputAttribute + '="1"]')
    );

    this.visualDeveloperInstance.Utility.InputColorpicker.InitInstance(
        operationGroups.find('.' + this._settings.fieldColorPickerInputClass)
    );

    if(typeof operationGroups.on !== "undefined"
        && this.visualDeveloperInstance.hasSettingEnableColorPicker) {
      operationGroups.find('[' + this._settings.fieldColorPickerInputAttribute + '="1"]').each(function(){
        jQuery(this).colpick({
          layout      : 'rgbhex',
          submit      : 0,
          colorScheme : 'dark',
          onChange:function(hsb,hex,rgb,el,bySetColor) {
            if(!bySetColor) jQuery(el).val('#' + hex).trigger("change");
          }
        }).keyup(function(){
          jQuery(this).colpickSetColor(this.value);
        });
      });
    }

    if(this.visualDeveloperInstance.hasSettingEnableKeyboardArrowSupport) {
      operationGroups.find('[' + this._settings.fieldNumericInputAttribute + '="1"]').keyup(function(event){
        if(!(event.which == 40 || event.which == 38))
          return;

        var value = jQuery(this).val();

        if(value == "")
          value = 0;

        if(objectInstance.visualDeveloperInstance.Utility.isNumber(value)) {
          value = parseFloat(value);
          if(event.which == 40)
            value--;
          else
            value++;
        }

        jQuery(this).val(value);
      });
    }

    if(this.visualDeveloperInstance.hasSettingEnableImportantElement) {
      operationGroups.find('.' + this._settings.fieldElementImportantToggleClass)
          .unbind(this._settings.fieldElementImportantToggleTrigger)
          .bind(this._settings.fieldElementImportantToggleTrigger, function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        jQuery(this).toggleClass(objectInstance._settings.fieldElementImportantActiveClass);

        var currentOptionName = jQuery(this)
            .parents("." + objectInstance._settings.fieldElementContainerClass + ':first')
            .attr(objectInstance._settings.fieldElementContainerOptionAttribute);

        if(jQuery(this).hasClass(objectInstance._settings.fieldElementImportantActiveClass)) {
          elementOptionsObject.EnableOptionImportant(currentOptionName);
        } else {
          elementOptionsObject.DisableOptionImportant(currentOptionName);
        }
      });
    }
  },

  _handleUserOptions : function(elementOptionsObject, operationGroups) {
    var objectInstance = this;

    if(this.visualDeveloperInstance.hasSettingEMOptionDefaultSelected) {
      operationGroups.find('select').each(function(){
        if(jQuery(this).find('> option[val="em"]'))
          jQuery(this).val("em");
      });
    }

    if(this.visualDeveloperInstance.hasSettingFieldDefaultValue) {
      var currentElement = objectInstance.visualDeveloperInstance.ElementPanel.elementObject;
          currentElement = currentElement.length > 1 ? currentElement.eq(0) : currentElement;

      operationGroups.find('[' + this._settings.fieldElementContainerOptionAttribute + ']').each(function(){
        var optionAlias = jQuery(this).attr(objectInstance._settings.fieldElementContainerOptionAttribute);

        if(typeof objectInstance.visualDeveloperInstance.ElementOption[optionAlias].generateFormatByRule !== "undefined") {
          var ruleInformation = objectInstance.visualDeveloperInstance.ElementOption[optionAlias].generateFormatByRule(
                  currentElement.css(objectInstance.visualDeveloperInstance.ElementOption[optionAlias].cssRule)
              ),
              elementOption   = jQuery(this);

          jQuery.each(ruleInformation, function(key, value) {
            elementOption.find('input[name="visual_developer_lite_' + optionAlias + '-' + key + '"]')
                         .attr("data-clean-value", value)
                         .val(value);
          });
        }
      });
    }
  },

  _populateInputsWithCurrentValuesOnLoad : function(elementOptionsObject, operationGroups) {
    var objectInstance = this;

    jQuery.each(elementOptionsObject.options, function(key, format) {
      if(typeof format === "object") {
        jQuery.each(format, function(formatKey, formatValue){
          var element = operationGroups.find(
                  '[name="' + objectInstance.visualDeveloperInstance.fieldNamespace + key + "-" + formatKey + '"]'
              );

          element.val(formatValue);
          element.attr("data-clean-value", formatValue);
        });
      }
    });

    jQuery.each(elementOptionsObject.activeOptions, function(elementOptionIndex, status) {
      if(status) {
        operationGroups
            .find(
                "." + objectInstance._settings.fieldElementContainerClass +
                    '[' + objectInstance._settings.fieldElementContainerOptionAttribute +
                    '="' + elementOptionIndex + '"]'
            ).addClass(objectInstance._settings.fieldElementActiveStateClass);
      }
    });

    jQuery.each(elementOptionsObject.importantOptions, function(elementOptionIndex, status) {
      if(status) {
        operationGroups
            .find(
                "." + objectInstance._settings.fieldElementContainerClass +
                    '[' + objectInstance._settings.fieldElementContainerOptionAttribute +
                    '="' + elementOptionIndex + '"]' +
                ' .' + objectInstance._settings.fieldElementImportantToggleClass
            ).addClass(objectInstance._settings.fieldElementImportantActiveClass);
      }
    });
  }
};VisualDeveloperLite.ApplicationSynchronize = {

  _lang : {
    loaderText  : "Visual Developer is synchronizing with the application"
  },
  _settings               : {
    ajaxSetLayoutAction       : 'visual_developer_lite_setLayout',
    ajaxGetLayoutAction       : 'visual_developer_lite_getLayout',
    loaderOverlayID           : 'application-synchronize-overlay',
    loaderArrangeEvent        : 'resize'
  },

  visualDeveloperInstance : {},
  loaderObject            : false,

  postID        : false,
  postVersionID : false,

  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;
    this._initDependencies();
    this._initPostInformation();

    this.SyncApplicationWithLayout();
  },

  _initDependencies : function() {
    this._prefixCSSSettings();

    this._settings.loaderArrangeEvent  = this._settings.loaderArrangeEvent
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-application-synchronize ') +
        '.' + this.visualDeveloperInstance.namespace + '-application-synchronize ';
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  _initPostInformation : function() {
    if(typeof PluginInfo.post_id == "undefined"
        && typeof PluginInfo.post_version_id == "undefined") {
      this.postID        = PluginInfo.post_id;
      this.postVersionID = PluginInfo.post_version_id;
    }
  },

  SyncApplicationWithLayout : function() {
    var objectInstance = this;

    this.displayLoader();

    jQuery.each(objectInstance.visualDeveloperInstance.ElementPanel.elementOptionsObjectList, function(index, elementOption){
      elementOption.Reset();
    });

    objectInstance
        .visualDeveloperInstance
        .ElementPanel
        .elementOptionsObjectList = {};

    var postedInformation = {
      action : this._settings.ajaxGetLayoutAction
    };

    if(this.postID != false)
      postedInformation.post_id = this.postID;
    else if( typeof PluginInfo != "undefined" && PluginInfo.post_id != 0)
      postedInformation.support_post_id = PluginInfo.post_id;

    var ajaxRequestObject = jQuery.post(WordpressAjax.target, postedInformation, function(r) {
      var response = (typeof r == "object" ? r : jQuery.parseJSON(r));

      objectInstance.UpdateLayoutInformationFromJSON(response);

      objectInstance.hideLoader();
    });

    return ajaxRequestObject;
  },

  UpdateLayoutInformationFromJSON : function(JSONInformation) {
    this.visualDeveloperInstance.EventManager.triggerEvent(
        this.visualDeveloperInstance.universalEventSettingsUpdate, JSONInformation
    );

  },

  UpdateLayoutInformationFromExportJSON : function(JSONInformation) {
    this.UpdateLayoutInformationFromJSON(JSONInformation);
  },

  SyncLayoutWithApplication : function() {
    var objectInstance = this;

    this.displayLoader();

    var ajaxRequestObject = jQuery.post(WordpressAjax.target, this.GetLayoutInformationJSON(), function(r) {
      objectInstance.hideLoader();
    });

    return ajaxRequestObject;
  },

  GetLayoutInformationJSON : function() {
    var returnInformation = this.GetGeneralLayoutInformationJSON();

    if(this.postID != false)
      returnInformation.post_id = this.postID;
    else if( typeof PluginInfo != "undefined" && PluginInfo.post_id != 0)
      returnInformation.support_post_id = PluginInfo.post_id;

    if(this.postVersionID != false)
      returnInformation.postVersionID = this.postVersionID;

    return returnInformation;
  },

  GetLayoutInformationExportJSON : function() {
    return this.GetGeneralLayoutInformationJSON();
  },

  GetGeneralLayoutInformationJSON : function() {
    var layoutInformation = {
      action              : this._settings.ajaxSetLayoutAction
    };

    layoutInformation = this.visualDeveloperInstance.FilterManager.parseFilter(
        this.visualDeveloperInstance.universalFilterSettingsExport, layoutInformation
    );

    return layoutInformation;
  },

  displayLoader : function(message) {
    if(this.loaderObject === false) {
      jQuery('body').append(this._getLoaderOverlay(message));
      this.loaderObject = jQuery("#" + this._settings.loaderOverlayID);

      this.loaderObject.hide();
      this._arrangeLoaderOverlay();
      this.loaderObject.fadeIn("slow");

      var objectInstance = this;

      jQuery(window).bind(this._settings.loaderArrangeEvent, function(){
        objectInstance._arrangeLoaderOverlay();
      });
    }
  },

  hideLoader : function() {
    if(this.spectralModeOverlayObject !== false) {
      jQuery(window).unbind(this._settings.loaderArrangeEvent);

      this.loaderObject.fadeOut("slow", function(){
        jQuery(this).remove();
      });

      this.loaderObject = false;
    }
  },

  _getLoaderOverlay : function(message) {
    return '<div id="' + this._settings.loaderOverlayID + '">' +
              '<ul>' +
                '<li></li>' +
                '<li></li>' +
                '<li></li>' +
                '<li></li>' +
              '</ul>' +
              '<p>' + (typeof message !== "undefined" ? message : this._lang.loaderText) + '</p>' +
           '</div>';
  },

  _arrangeLoaderOverlay : function() {
    this.loaderObject
        .css("width", jQuery(window).width())
        .css("height", jQuery(window).height());
  },

  SetPostSpecific : function(postID) {
    this.postID = postID;

    this.SyncApplicationWithLayout();
  },

  SetNoSpecific : function() {
    this.postID = false;

    this.SyncApplicationWithLayout();
  }

};VisualDeveloperLite.Utility = {

  visualDeveloperInstance : {},

  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;

    this.NiceSelect.Init(visualDeveloperInstance);
    this.SplitSelect.Init(visualDeveloperInstance);
    this.InputMAP.Init(visualDeveloperInstance);
    this.InputColorpicker.Init(visualDeveloperInstance);
    this.Modal.Init(visualDeveloperInstance);
    this.ImageSelect.Init(visualDeveloperInstance);
    this.DomRuleBuilder.Init(visualDeveloperInstance);
  },

  isNumber : function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  getDefaultCSSFormatByRule : function(cssValue) {
    if(cssValue == 'auto')
      return { value : '' };

    var presentDigit = parseFloat(cssValue, 10);

    if(isNaN(presentDigit))
      return { value : '' };

    return {
      value     : presentDigit,
      valueType : cssValue.replace(presentDigit, "")
    };
  }

};

// @codekit-append "utilities/splitSelect.js"
// @codekit-append "utilities/niceSelect.js"
// @codekit-append "utilities/inputMAP.js"
// @codekit-append "utilities/inputColorpicker.js"
// @codekit-append "utilities/svgCheckbox.js"
// @codekit-append "utilities/modal.js"
// @codekit-append "utilities/imageSelect.js"
// @codekit-append "utilities/domRuleBuilder.js"



VisualDeveloperLite.Utility.SplitSelect = {

  _settings : {
    containerClass         : 'utility-split-select-container',
    itemClass              : 'utility-split-select-item',
    itemActiveClass        : 'utility-split-select-item-active',
    itemValueAttribute     : 'utility-split-select-item-value',
    itemValueSelectTrigger : 'click'
  },

  visualDeveloperInstance : {},
  instanceList            : [],

  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;

    this._initDependencies();
  },

  _initDependencies : function() {
    this._settings.itemValueSelectTrigger  = this._settings.itemValueSelectTrigger
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-split-select ') +
        '.' + this.visualDeveloperInstance.namespace + '-split-select ';

    this._prefixCSSSettings();
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  InitInstance : function(selectObject) {
    var objectInstance = this;

    selectObject.each(function(){
      objectInstance.instanceList[objectInstance.instanceList.length] = jQuery.extend(1, {}, objectInstance.InstanceObject);
      objectInstance.instanceList[objectInstance.instanceList.length - 1].Init(objectInstance, jQuery(this));
    });
  },

  InstanceObject : {

    selectObject        : false,
    splitSelectInstance : {},

    Init : function(splitSelectInstance, selectObject) {
      this.splitSelectInstance = splitSelectInstance;
      this.selectObject        = selectObject;

      this.displayContent();
      this.bindContentEvents();
    },

    displayContent : function() {
      this.selectObject.after(this.getHTMLContent());
      this.selectObject.hide();
      this._syncSelectWithItems();
    },

    getHTMLContent : function() {
      var objectInstance = this,
          html           = '';

      html += '<ul class="' + this.splitSelectInstance._settings.containerClass + '">';

      this.selectObject.find("> option").each(function(){
        var itemClass     = objectInstance.splitSelectInstance._settings.itemClass,
            itemAttribute = objectInstance.splitSelectInstance._settings.itemValueAttribute + '="' + jQuery(this).val() + '"';

        if(typeof jQuery(this).attr("data-tooltip") !== "undefined" && 1 == 2) {
          itemClass     += " hint--primary hint--top";
          itemAttribute += ' data-hint="' + jQuery(this).attr("data-tooltip") + '" ';
        }

        html += '<li ' + itemAttribute +
                     'class="' + itemClass + '" >' +
                    jQuery(this).val() +
                '</li>';
      });

      html += '</ul>';

      return html;
    },

    bindContentEvents : function() {
      var objectInstance = this;

      this.selectObject
          .next()
          .find("." + this.splitSelectInstance._settings.itemClass)
          .bind(this.splitSelectInstance._settings.itemValueSelectTrigger, function() {
            objectInstance.selectObject.val(
                jQuery(this).attr(
                    objectInstance.splitSelectInstance._settings.itemValueAttribute
                )
            ).trigger("change");
            objectInstance._syncSelectWithItems();
          });
    },

    _syncSelectWithItems : function() {
      this.selectObject
          .next()
          .find("." + this.splitSelectInstance._settings.itemClass)
          .removeClass(this.splitSelectInstance._settings.itemActiveClass);
      this.selectObject
          .next()
          .find('[' + this.splitSelectInstance._settings.itemValueAttribute + '="' + this.selectObject.find("> option:selected").val() + '"]')
          .addClass(this.splitSelectInstance._settings.itemActiveClass);
    }

  }

};VisualDeveloperLite.Utility.NiceSelect = {

  _settings : {
    selectContainerClass   : 'utility-nice-select-container',
    selectLabelClass       : 'utility-nice-select-container-label',
    valueSelectionTrigger  : 'change keyup'
  },

  visualDeveloperInstance : {},
  instanceList            : [],

  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;

    this._initDependencies();
  },

  _initDependencies : function() {
    this._settings.valueSelectionTrigger  = this._settings.valueSelectionTrigger
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-nice-select ') +
        '.' + this.visualDeveloperInstance.namespace + '-nice-select ';

    this._prefixCSSSettings();
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  InitInstance : function(selectObject) {
    var objectInstance = this;

    selectObject.each(function(){
      objectInstance.instanceList[objectInstance.instanceList.length] = jQuery.extend(1, {}, objectInstance.InstanceObject);
      objectInstance.instanceList[objectInstance.instanceList.length - 1].Init(objectInstance, jQuery(this));
    });
  },

  InstanceObject : {

    selectObject          : false,
    selectContainerObject : false,
    selectLabelObject     : false,
    niceSelectInstance    : {},

    Init : function(niceSelectInstance, selectObject) {
      this.niceSelectInstance = niceSelectInstance;
      this.selectObject       = selectObject;

      this._moveSelectObjectIntoContainer();
      this._enableLabelText();
    },

    _moveSelectObjectIntoContainer : function() {
      this.selectObject.after(this._getContainerHTML());

      this.selectContainerObject = this.selectObject.next();
      this.selectLabelObject     = this.selectContainerObject
          .find("." + this.niceSelectInstance._settings.selectLabelClass);

      this.selectObject.appendTo(this.selectContainerObject);
    },

    _getContainerHTML : function() {
      return '<div class="' + this.niceSelectInstance._settings.selectContainerClass + '">' +
                '<span class="' + this.niceSelectInstance._settings.selectLabelClass + '">' +
                  this.selectObject.find(" > option:selected").text() +
                '</span>' +
             '</div>'
    },

    _enableLabelText : function() {
      var objectInstance = this;

      this.selectObject.bind(this.niceSelectInstance._settings.valueSelectionTrigger, function() {
        objectInstance.selectLabelObject.text(jQuery(this).val());
      });
    }

  }

};VisualDeveloperLite.Utility.InputMAP = {

  _lang : {
    toggleFeature     : "&frac14;",
    inputPlaceholders : ['top', 'right', 'bottom', 'left']
  },

  _settings : {
    toggleFeatureClass       : "toggle-input-map",
    toggleFeatureActiveClass : 'active-input-map',
    toggleFeatureTrigger     : "click"
  },

  visualDeveloperInstance : {},
  instanceList            : [],

  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;
    this._initDependencies();
  },

  _initDependencies : function() {
    this._settings.toggleFeatureTrigger  = this._settings.toggleFeatureTrigger
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-input-map ') +
        '.' + this.visualDeveloperInstance.namespace + '-input-map ';

    this._prefixCSSSettings();
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  InitInstance : function(selectObject) {
    var objectInstance = this;

    selectObject.each(function(){
      objectInstance.instanceList[objectInstance.instanceList.length] = jQuery.extend(1, {}, objectInstance.InstanceObject);
      objectInstance.instanceList[objectInstance.instanceList.length - 1].Init(objectInstance, jQuery(this));
    });
  },

  InstanceObject : {

    listObject       : false,
    inputMAPInstance : {},

    Init : function(inputMAPInstance, listObject) {
      this.inputMAPInstance = inputMAPInstance;
      this.listObject       = listObject;

      if(!(this.displayContent())) {
        var objectInstance = this,
            prevObject     = this.listObject.prev();

        prevObject.html(prevObject.html() +
            '<span class="' + this.inputMAPInstance._settings.toggleFeatureClass + '">' +
              this.inputMAPInstance._lang.toggleFeature +
            '</span>'
        );

        prevObject
            .find("." + this.inputMAPInstance._settings.toggleFeatureClass)
            .bind(this.inputMAPInstance._settings.toggleFeatureTrigger, function(event) {
          event.preventDefault();
          event.stopImmediatePropagation();

          if(jQuery(this).hasClass(objectInstance.inputMAPInstance._settings.toggleFeatureActiveClass)) {
            jQuery(this).removeClass(objectInstance.inputMAPInstance._settings.toggleFeatureActiveClass);
            objectInstance.hideContent();
          } else {
            jQuery(this).addClass(objectInstance.inputMAPInstance._settings.toggleFeatureActiveClass);
            objectInstance.displayContent(true);
          }
        });
      }
    },

    displayContent : function(force) {
      var objectInstance = this,
          initialLength  = this.listObject.find("> li").length,
          inputValues    = {},
          topValueLength = 0;

      force = typeof force === "undefined" ? false : force;

      this.listObject.find("select, input").each(function(i){
        inputValues[jQuery(this).attr("name") + "[]"] = (
            typeof jQuery(this).attr("data-clean-value") !== "undefined" ?
                jQuery(this).attr("data-clean-value") :
                jQuery(this).val()
        ).split(",");

        topValueLength = topValueLength > inputValues[jQuery(this).attr("name") + "[]"] ?
            topValueLength : inputValues[jQuery(this).attr("name") + "[]"].length;
      });

      if(topValueLength == 1 && force == false)
        return false;

      this.listObject.find("select, input").each(function(i){
        jQuery(this).attr("name", jQuery(this).attr("name") + "[]");
      });

      for(var i = 1; i <= 3; i++) {
        this.listObject.find("> li").slice(0,initialLength).each(function(){
          jQuery(this).clone(true).appendTo(objectInstance.listObject);
        });
      }

      objectInstance.listObject.find("input").each(function(i){
        jQuery(this).attr("placeholder", objectInstance.inputMAPInstance._lang.inputPlaceholders[i]);
      });


      this.listObject.find("select, input").each(function(){
        if(inputValues[jQuery(this).attr("name")].length != 0) {
          jQuery(this).val(
              inputValues[jQuery(this).attr("name")][0]
          );

          inputValues[jQuery(this).attr("name")].splice(0,1);
        }
      });

      return true;
    },

    hideContent : function() {
      this.listObject.find("> li").slice(2).remove();

      this.listObject.find("select, input").each(function(i){
        jQuery(this).attr("name", jQuery(this).attr("name").replace("[]", ""));


        if(jQuery(this).is("input"))
          jQuery(this).val("").trigger("change").attr("placeholder", "Value");
      });
    }

  }

};VisualDeveloperLite.Utility.InputColorpicker = {

  _settings : {
    triggerEvent : "change"
  },

  visualDeveloperInstance : {},
  instanceList            : [],

  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;
    this._initDependencies();
  },

  _initDependencies : function() {
    this._prefixCSSSettings();
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  InitInstance : function(inputObject) {
    var objectInstance = this;

    inputObject.each(function(){
      objectInstance.instanceList[objectInstance.instanceList.length] = jQuery.extend(1, {}, objectInstance.InstanceObject);
      objectInstance.instanceList[objectInstance.instanceList.length - 1].Init(objectInstance, jQuery(this));
    });
  },

  InstanceObject : {

    inputObject       : false,
    inputColorPickerInstance : {},

    Init : function(inputColorPickerInstance, inputObject) {
      this.inputColorPickerInstance = inputColorPickerInstance;
      this.inputObject              = inputObject;

      this.setInputBackground();

      var objectInstance = this;

      this.inputObject.bind(this.inputColorPickerInstance._settings.triggerEvent, function(){
        objectInstance.setInputBackground();
      });
    },

    setInputBackground : function() {
      this.inputObject.css("background", this.inputObject.val());
    }

  }

};VisualDeveloperLite.Utility.SVGCheckbox = {

  _settings : {
    svgDefinition :  {
      cross : ['M 10 10 L 90 90','M 90 10 L 10 90'],
      fill : ['M15.833,24.334c2.179-0.443,4.766-3.995,6.545-5.359 c1.76-1.35,4.144-3.732,6.256-4.339c-3.983,3.844-6.504,9.556-10.047,13.827c-2.325,2.802-5.387,6.153-6.068,9.866 c2.081-0.474,4.484-2.502,6.425-3.488c5.708-2.897,11.316-6.804,16.608-10.418c4.812-3.287,11.13-7.53,13.935-12.905 c-0.759,3.059-3.364,6.421-4.943,9.203c-2.728,4.806-6.064,8.417-9.781,12.446c-6.895,7.477-15.107,14.109-20.779,22.608 c3.515-0.784,7.103-2.996,10.263-4.628c6.455-3.335,12.235-8.381,17.684-13.15c5.495-4.81,10.848-9.68,15.866-14.988 c1.905-2.016,4.178-4.42,5.556-6.838c0.051,1.256-0.604,2.542-1.03,3.672c-1.424,3.767-3.011,7.432-4.723,11.076 c-2.772,5.904-6.312,11.342-9.921,16.763c-3.167,4.757-7.082,8.94-10.854,13.205c-2.456,2.777-4.876,5.977-7.627,8.448 c9.341-7.52,18.965-14.629,27.924-22.656c4.995-4.474,9.557-9.075,13.586-14.446c1.443-1.924,2.427-4.939,3.74-6.56 c-0.446,3.322-2.183,6.878-3.312,10.032c-2.261,6.309-5.352,12.53-8.418,18.482c-3.46,6.719-8.134,12.698-11.954,19.203 c-0.725,1.234-1.833,2.451-2.265,3.77c2.347-0.48,4.812-3.199,7.028-4.286c4.144-2.033,7.787-4.938,11.184-8.072 c3.142-2.9,5.344-6.758,7.925-10.141c1.483-1.944,3.306-4.056,4.341-6.283c0.041,1.102-0.507,2.345-0.876,3.388 c-1.456,4.114-3.369,8.184-5.059,12.212c-1.503,3.583-3.421,7.001-5.277,10.411c-0.967,1.775-2.471,3.528-3.287,5.298 c2.49-1.163,5.229-3.906,7.212-5.828c2.094-2.028,5.027-4.716,6.33-7.335c-0.256,1.47-2.07,3.577-3.02,4.809'],
      checkmark : ['M16.667,62.167c3.109,5.55,7.217,10.591,10.926,15.75 c2.614,3.636,5.149,7.519,8.161,10.853c-0.046-0.051,1.959,2.414,2.692,2.343c0.895-0.088,6.958-8.511,6.014-7.3 c5.997-7.695,11.68-15.463,16.931-23.696c6.393-10.025,12.235-20.373,18.104-30.707C82.004,24.988,84.802,20.601,87,16'],
      circle : ['M34.745,7.183C25.078,12.703,13.516,26.359,8.797,37.13 c-13.652,31.134,9.219,54.785,34.77,55.99c15.826,0.742,31.804-2.607,42.207-17.52c6.641-9.52,12.918-27.789,7.396-39.713 C85.873,20.155,69.828-5.347,41.802,13.379'],
      boxfill : ['M6.987,4.774c15.308,2.213,30.731,1.398,46.101,1.398 c9.74,0,19.484,0.084,29.225,0.001c2.152-0.018,4.358-0.626,6.229,1.201c-5.443,1.284-10.857,2.58-16.398,2.524 c-9.586-0.096-18.983,2.331-28.597,2.326c-7.43-0.003-14.988-0.423-22.364,1.041c-4.099,0.811-7.216,3.958-10.759,6.81 c8.981-0.104,17.952,1.972,26.97,1.94c8.365-0.029,16.557-1.168,24.872-1.847c2.436-0.2,24.209-4.854,24.632,2.223 c-14.265,5.396-29.483,0.959-43.871,0.525c-12.163-0.368-24.866,2.739-36.677,6.863c14.93,4.236,30.265,2.061,45.365,2.425 c7.82,0.187,15.486,1.928,23.337,1.903c2.602-0.008,6.644-0.984,9,0.468c-2.584,1.794-8.164,0.984-10.809,1.165 c-13.329,0.899-26.632,2.315-39.939,3.953c-6.761,0.834-13.413,0.95-20.204,0.938c-1.429-0.001-2.938-0.155-4.142,0.436 c5.065,4.68,15.128,2.853,20.742,2.904c11.342,0.104,22.689-0.081,34.035-0.081c9.067,0,20.104-2.412,29.014,0.643 c-4.061,4.239-12.383,3.389-17.056,4.292c-11.054,2.132-21.575,5.041-32.725,5.289c-5.591,0.124-11.278,1.001-16.824,2.088 c-4.515,0.885-9.461,0.823-13.881,2.301c2.302,3.186,7.315,2.59,10.13,2.694c15.753,0.588,31.413-0.231,47.097-2.172 c7.904-0.979,15.06,1.748,22.549,4.877c-12.278,4.992-25.996,4.737-38.58,5.989c-8.467,0.839-16.773,1.041-25.267,0.984 c-4.727-0.031-10.214-0.851-14.782,1.551c12.157,4.923,26.295,2.283,38.739,2.182c7.176-0.06,14.323,1.151,21.326,3.07 c-2.391,2.98-7.512,3.388-10.368,4.143c-8.208,2.165-16.487,3.686-24.71,5.709c-6.854,1.685-13.604,3.616-20.507,4.714 c-1.707,0.273-3.337,0.483-4.923,1.366c2.023,0.749,3.73,0.558,5.95,0.597c9.749,0.165,19.555,0.31,29.304-0.027 c15.334-0.528,30.422-4.721,45.782-4.653'],
      swirl : ['M49.346,46.341c-3.79-2.005,3.698-10.294,7.984-8.89 c8.713,2.852,4.352,20.922-4.901,20.269c-4.684-0.33-12.616-7.405-14.38-11.818c-2.375-5.938,7.208-11.688,11.624-13.837 c9.078-4.42,18.403-3.503,22.784,6.651c4.049,9.378,6.206,28.09-1.462,36.276c-7.091,7.567-24.673,2.277-32.357-1.079 c-11.474-5.01-24.54-19.124-21.738-32.758c3.958-19.263,28.856-28.248,46.044-23.244c20.693,6.025,22.012,36.268,16.246,52.826 c-5.267,15.118-17.03,26.26-33.603,21.938c-11.054-2.883-20.984-10.949-28.809-18.908C9.236,66.096,2.704,57.597,6.01,46.371 c3.059-10.385,12.719-20.155,20.892-26.604C40.809,8.788,58.615,1.851,75.058,12.031c9.289,5.749,16.787,16.361,18.284,27.262 c0.643,4.698,0.646,10.775-3.811,13.746'],
      diagonal : ['M16.053,91.059c0.435,0,0.739-0.256,0.914-0.768 c3.101-2.85,5.914-6.734,8.655-9.865C41.371,62.438,56.817,44.11,70.826,24.721c3.729-5.16,6.914-10.603,10.475-15.835 c0.389-0.572,0.785-1.131,1.377-1.521'],
      list : ['M1.986,8.91c41.704,4.081,83.952,5.822,125.737,2.867 c17.086-1.208,34.157-0.601,51.257-0.778c21.354-0.223,42.706-1.024,64.056-1.33c18.188-0.261,36.436,0.571,54.609,0.571','M3.954,25.923c9.888,0.045,19.725-0.905,29.602-1.432 c16.87-0.897,33.825-0.171,50.658-2.273c14.924-1.866,29.906-1.407,44.874-1.936c19.9-0.705,39.692-0.887,59.586,0.45 c35.896,2.407,71.665-1.062,107.539-1.188']
    },
    animationDefinition : {
      cross : { speed : .2, easing : 'ease-in-out' },
      fill : { speed : .8, easing : 'ease-in-out' },
      checkmark : { speed : .2, easing : 'ease-in-out' },
      circle : { speed : .2, easing : 'ease-in-out' },
      boxfill : { speed : .8, easing : 'ease-in' },
      swirl : { speed : .8, easing : 'ease-in' },
      diagonal : { speed : .2, easing : 'ease-in-out' },
      list : { speed : .3, easing : 'ease-in-out' }
    }
  },

  visualDeveloperInstance : {},
  instanceList            : [],

  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;

    this._initDependencies();
  },

  _initDependencies : function() {
    this._prefixCSSSettings();
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  InitInstance : function(selectObject) {
    var objectInstance = this;

    selectObject.each(function(){
      objectInstance.instanceList[objectInstance.instanceList.length] = jQuery.extend(1, {}, objectInstance.InstanceObject);
      objectInstance.instanceList[objectInstance.instanceList.length - 1].Init(objectInstance, jQuery(this));
    });
  },

  InstanceObject : {

    formObject            : false,
    selectContainerObject : false,
    selectLabelObject     : false,
    svgCheckboxInstance   : {},

    Init : function(svgCheckboxInstance, formObject) {
      this.svgCheckboxInstance = svgCheckboxInstance;
      this.formObject          = formObject;

      if( document.createElement('svg').getAttributeNS ) {
        this._init();
      }
    },

    _init : function() {
      var objectInstance = this;

      if(this.formObject.hasClass('visual-developer-lite-utility-svg-checkbox-option-cross')) {
        var crossOptionList = Array.prototype.slice.call( this.formObject.get(0).querySelectorAll( 'input[type="checkbox"]' ) );

        crossOptionList.forEach( function( el, i ) { objectInstance.ControlCheckbox( el, 'cross' ); } );


      } else if(this.formObject.hasClass('visual-developer-lite-utility-svg-checkbox-option-fill')) {
        var fillOptionList = Array.prototype.slice.call( this.formObject.get(0).querySelectorAll( 'input[type="radio"]' ) );

        fillOptionList.forEach( function( el, i ) { objectInstance.ControlRadioBox( el, 'fill' ); } );


      } else if(this.formObject.hasClass('visual-developer-lite-utility-svg-checkbox-option-checkmark')) {
        var checkMarkOptionList = Array.prototype.slice.call( this.formObject.get(0).querySelectorAll( 'input[type="checkbox"]' ) );

        checkMarkOptionList.forEach( function( el, i ) { objectInstance.ControlCheckbox( el, 'checkmark' ); } );


      } else if(this.formObject.hasClass('visual-developer-lite-utility-svg-checkbox-option-circle')) {
        var circleOptionList = Array.prototype.slice.call( this.formObject.get(0).querySelectorAll( 'input[type="radio"]' ) );

        circleOptionList.forEach( function( el, i ) { objectInstance.ControlRadioBox( el, 'circle' ); } );


      } else if(this.formObject.hasClass('visual-developer-lite-utility-svg-checkbox-option-boxfill')) {
        var boxFillOptionList = Array.prototype.slice.call( this.formObject.get(0).querySelectorAll( 'input[type="checkbox"]' ) );

        boxFillOptionList.forEach( function( el, i ) { objectInstance.ControlCheckbox( el, 'boxfill' ); } );


      } else if(this.formObject.hasClass('visual-developer-lite-utility-svg-checkbox-option-swirl')) {
        var swirlOptionList = Array.prototype.slice.call( this.formObject.get(0).querySelectorAll( 'input[type="radio"]' ) );

        swirlOptionList.forEach( function( el, i ) { objectInstance.ControlRadioBox( el, 'swirl' ); } );


      } else if(this.formObject.hasClass('visual-developer-lite-utility-svg-checkbox-option-diagonal')) {
        var diagonalOptionList = Array.prototype.slice.call( this.formObject.get(0).querySelectorAll( 'input[type="checkbox"]' ) );

        diagonalOptionList.forEach( function( el, i ) { objectInstance.ControlCheckbox( el, 'diagonal' ); } );


      } else if(this.formObject.hasClass('visual-developer-lite-utility-svg-checkbox-option-list')) {
        var listOptionList = Array.prototype.slice.call( this.formObject.get(0).querySelectorAll( 'input[type="checkbox"]' ) );

        listOptionList.forEach( function( el, i ) { objectInstance.ControlCheckbox( el, 'list', { viewBox : '0 0 300 100', preserveAspectRatio : 'none' } ); } );


      }

    },

    DrawSVG : function draw( el, type ) {
      var paths        = [],
          pathDef      = this.svgCheckboxInstance._settings.svgDefinition[type],
          animationDef = this.svgCheckboxInstance._settings.animationDefinition[type],
          svg          = el.parentNode.querySelector( 'svg' );

      paths.push( document.createElementNS('http://www.w3.org/2000/svg', 'path' ) );

      if( type === 'cross' || type === 'list' ) {
        paths.push( document.createElementNS('http://www.w3.org/2000/svg', 'path' ) );
      }

      for( var i = 0, len = paths.length; i < len; ++i ) {
        var path = paths[i];
        svg.appendChild( path );
        path.setAttributeNS( null, 'd', pathDef[i] );

        var length = path.getTotalLength();
        path.style.strokeDasharray = length + ' ' + length;
        if( i === 0 ) {
          path.style.strokeDashoffset = Math.floor( length ) - 1;
        }
        else path.style.strokeDashoffset = length;

        path.getBoundingClientRect();
        path.style.transition = path.style.WebkitTransition = path.style.MozTransition  = 'stroke-dashoffset ' + animationDef.speed + 's ' + animationDef.easing + ' ' + i * animationDef.speed + 's';
        path.style.strokeDashoffset = '0';
      }
    },

    ResetSVG : function( el ) {
      Array.prototype.slice.call( el.parentNode.querySelectorAll( 'svg > path' ) ).forEach( function( el ) { el.parentNode.removeChild( el ); } );
    },

    ResetRadio : function( el ) {
      Array.prototype.slice.call( document.querySelectorAll( 'input[type="radio"][name="' + el.getAttribute( 'name' ) + '"]' ) ).forEach( function( el ) {
        var path = el.parentNode.querySelector( 'svg > path' );
        if( path ) {
          path.parentNode.removeChild( path );
        }
      } );
    },

    ControlRadioBox : function ( el, type ) {
      var objectInstance = this,
          svg            = this.CreateSVGEl();
      el.parentNode.appendChild( svg );
      el.addEventListener( 'change', function() {
        objectInstance.ResetRadio( el );
        objectInstance.DrawSVG( el, type );
      } );
    },

    ControlCheckbox : function ( el, type, svgDef ) {
      var objectInstance = this,
          svg            = this.CreateSVGEl( svgDef );
      el.parentNode.appendChild( svg );

      if(el.checked) {
        objectInstance.DrawSVG( el, type );
      }

      el.addEventListener( 'change', function() {
        if( el.checked ) {
          objectInstance.DrawSVG( el, type );
        }
        else {
          objectInstance.ResetSVG( el );
        }
      } );
    },

    CreateSVGEl : function ( def ) {
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      if( def ) {
        svg.setAttributeNS( null, 'viewBox', def.viewBox );
        svg.setAttributeNS( null, 'preserveAspectRatio', def.preserveAspectRatio );
      }
      else {
        svg.setAttributeNS( null, 'viewBox', '0 0 100 100' );
      }
      svg.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );
      return svg;
    }

  }

};VisualDeveloperLite.Utility.Modal = {

  _settings : {
    overlayID            : 'utility-modal-overlay',
    containerID          : 'utility-modal',
    modalArrangeEvent    : 'resize',
    optionSelectionEvent : 'click',
    optionListClass      : 'utility-modal-list-container',
    optionAttribute      : 'utility-modal-list-option-index',
    optionClass          : 'utility-modal-list-option',
    activeOptionClass    : 'utility-modal-list-active-option',
    highlightOptionClass : 'utility-modal-list-highlight-option',
    dangerOptionClass    : 'utility-modal-list-danger-option'
  },

  visualDeveloperInstance : {},
  instanceList            : [],

  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;

    this._initDependencies();
  },

  _initDependencies : function() {
    this._prefixCSSSettings();

    this._settings.optionSelectionEvent  = this._settings.optionSelectionEvent
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-utility-modal ') +
        '.' + this.visualDeveloperInstance.namespace + '-utility-modal ';

    this._settings.modalArrangeEvent  = this._settings.modalArrangeEvent
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-utility-modal ') +
        '.' + this.visualDeveloperInstance.namespace + '-utility-modal ';
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  InitInstance : function(modalTitle, options, responseObject, responseAction) {
    this.instanceList[this.instanceList.length] = jQuery.extend(1, {}, this.InstanceObject);
    this.instanceList[this.instanceList.length - 1].Init(this, modalTitle, options, responseObject, responseAction);
  },

  InstanceObject : {

    modalInstance  : {},

    responseObject : {},
    responseAction : {},

    title          : {},
    options        : {},

    modalOverlayObject  : {},
    modalObject         : {},
    modalOptionsObject  : {},

    Init : function(modalInstance, modalTitle, options, responseObject, responseAction) {
      this.modalInstance  = modalInstance;

      this.responseObject = responseObject;
      this.responseAction = responseAction;

      this.title          = modalTitle;
      this.options        = options;
      this.displayModal();

      var objectInstance = this;

      jQuery(window)
          .unbind(this.modalInstance._settings.modalArrangeEvent)
          .bind(this.modalInstance._settings.modalArrangeEvent, function(){
        objectInstance.arrangeModal();
      });
    },

    displayModal : function() {
      jQuery('body').append(this.getModalContent());

      this.modalOverlayObject = jQuery("#" + this.modalInstance._settings.overlayID);
      this.modalObject        = jQuery("#" + this.modalInstance._settings.containerID);
      this.modalOptionsObject = this.modalObject.find('.' + this.modalInstance._settings.optionClass);

      this.modalOverlayObject.hide().fadeIn("slow");
      this.modalObject.hide().fadeIn("slow");

      this.setModalInteraction();
      this.arrangeModal();
    },

    getModalContent : function() {
      var objectInstance = this,
          modalContent   = '';
      modalContent += '<div id="' + this.modalInstance._settings.overlayID + '">';
      modalContent += '<div id="' + this.modalInstance._settings.containerID + '">';
      modalContent +=   '<h2>' + this.title + '</h2>';
      modalContent +=   '<ul class="' + this.modalInstance._settings.optionListClass + '">';

      jQuery.each(this.options, function(optionIndex, optionInformation) {
        modalContent +=   '<li class="' + objectInstance.modalInstance._settings.optionClass + ' ' +
                               (typeof optionInformation.active !== "undefined" &&
                                   optionInformation.active == true ? objectInstance.modalInstance._settings.activeOptionClass + " " : '') +
                               (typeof optionInformation.highlight !== "undefined" &&
                                   optionInformation.highlight == true ? objectInstance.modalInstance._settings.highlightOptionClass + " " : '') +
                               (typeof optionInformation.danger !== "undefined" &&
                                   optionInformation.danger == true ? objectInstance.modalInstance._settings.dangerOptionClass + " " : '') +
                                    '" ' +
                               objectInstance.modalInstance._settings.optionAttribute + '="' + optionIndex + '"' +
                           '>' +
                              '<span>' + optionInformation.name + '</span>' +
                          '</li>';
      });
      modalContent +=   '</ul>';
      modalContent += '</div>';
      modalContent += '</div>';

      return modalContent;
    },

    setModalInteraction : function() {
      var objectInstance = this;

      this.modalOptionsObject.bind(this.modalInstance._settings.optionSelectionEvent, function(){
        objectInstance.Respond(jQuery(this).attr(objectInstance.modalInstance._settings.optionAttribute));

        objectInstance.modalObject.fadeOut("slow");
        objectInstance.modalOverlayObject.fadeOut('slow', function(){
          jQuery(this).remove();
        });
        jQuery(window).unbind(objectInstance.modalInstance._settings.modalArrangeEvent);
      });
    },

    arrangeModal : function() {
      this.modalOverlayObject
          .css("width", jQuery(window).width())
          .css("height", jQuery(window).height());
      var currentPanelObject = this.modalInstance.visualDeveloperInstance.Panel.currentPanelObject;

      var topDistance  = this.modalInstance
                             .visualDeveloperInstance
                             .Panel
                             .currentPanelUserNotificationObject.outerHeight() + (
            this.modalInstance.visualDeveloperInstance.toolbarObject.length > 0 ?
                this.modalInstance.visualDeveloperInstance.toolbarObject.outerHeight() : 0
          );

      var leftDistance  = (currentPanelObject.length > 0
          ? ((currentPanelObject.offset().left + currentPanelObject.width()) | 0 )
          : ( jQuery(window).width() / 2 | 0 ));

      if(currentPanelObject.length > 0 &&
          parseInt(jQuery(window).width(), 10) <
              parseInt(currentPanelObject.width(), 10) + parseInt(this.modalObject.width(), 10)
          )
        leftDistance = 0;

      this.modalObject
          .css("top", topDistance + "px")
          .css("left", leftDistance + "px")
          .css("position", "fixed");
    },

    Respond : function(response) {
      this.responseAction.call(this.responseObject, [response]);
    }

  }
};VisualDeveloperLite.Utility.ImageSelect = {

  _settings : {
    containerClass         : 'utility-image-select-container',
    itemClass              : 'utility-image-select-item',
    itemActiveClass        : 'utility-image-select-item-active',
    itemValueAttribute     : 'utility-image-select-item-value',
    itemValueSelectTrigger : 'click'
  },

  visualDeveloperInstance : {},
  instanceList            : [],

  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;

    this._initDependencies();
  },

  _initDependencies : function() {
    this._settings.itemValueSelectTrigger  = this._settings.itemValueSelectTrigger
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-image-select ') +
        '.' + this.visualDeveloperInstance.namespace + '-image-select ';

    this._prefixCSSSettings();
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  InitInstance : function(selectObject, selectFirstByDefault) {
    selectFirstByDefault = typeof selectFirstByDefault == "undefined" ? false : selectFirstByDefault;
    var objectInstance = this;

    selectObject.each(function(){
      objectInstance.instanceList[objectInstance.instanceList.length] = jQuery.extend(1, {}, objectInstance.InstanceObject);
      objectInstance.instanceList[objectInstance.instanceList.length - 1].Init(objectInstance, jQuery(this), selectFirstByDefault);
    });
  },

  InstanceObject : {

    selectFirstByDefault: false,
    selectObject        : false,
    imageSelectInstance : {},

    Init : function(imageSelectInstance, selectObject, selectFirstByDefault) {
      this.imageSelectInstance = imageSelectInstance;
      this.selectObject        = selectObject;
      this.selectFirstByDefault= selectFirstByDefault;

      this.displayContent();
      this.bindContentEvents();
      this._checkSelectDisplay();
    },

    displayContent : function() {
      this.selectObject.after(this.getHTMLContent());
      this.selectObject.hide();
      this._syncSelectWithItems();
    },

    getHTMLContent : function() {
      var objectInstance = this,
          html           = '';

      html += '<ul class="' + this.imageSelectInstance._settings.containerClass + '">';

      this.selectObject.find("> option").each(function(){
        var itemClass     = objectInstance.imageSelectInstance._settings.itemClass,
            itemAttribute = objectInstance.imageSelectInstance._settings.itemValueAttribute + '="' + jQuery(this).val() + '"';

        if(typeof jQuery(this).attr("data-tooltip") !== "undefined" && 1 == 2) {
          itemClass     += " hint--primary hint--top";
          itemAttribute += ' data-hint="' + jQuery(this).attr("data-tooltip") + '" ';
        }

        html += '<li ' + itemAttribute +
                     'class="' + itemClass + '" >' +
                     '<img src="' + jQuery(this).text() + '"/>'    +
                '</li>';
      });

      html += '</ul>';

      return html;
    },

    bindContentEvents : function() {
      var objectInstance = this;

      this.selectObject
          .next()
          .find("." + this.imageSelectInstance._settings.itemClass)
          .bind(this.imageSelectInstance._settings.itemValueSelectTrigger, function() {
            objectInstance._selectObjectSelectionEventHandler(jQuery(this));
          });
    },

    _syncSelectWithItems : function() {
      this.selectObject
          .next()
          .find("." + this.imageSelectInstance._settings.itemClass)
          .removeClass(this.imageSelectInstance._settings.itemActiveClass);
      this.selectObject
          .next()
          .find('[' + this.imageSelectInstance._settings.itemValueAttribute + '="' + this.selectObject.find("> option:selected").val() + '"]')
          .addClass(this.imageSelectInstance._settings.itemActiveClass);

      this._checkSelectDisplay();
    },

    _checkSelectDisplay : function() {
      if(this.selectFirstByDefault
          && this.selectObject.next().find("." + this.imageSelectInstance._settings.itemActiveClass).length <= 0
          && this.selectObject.attr("data-clean-value") == '') {
        this._selectObjectSelectionEventHandler(
          this.selectObject.next().find("." + this.imageSelectInstance._settings.itemClass + ":first")
        );
      }
    },

    _selectObjectSelectionEventHandler : function(selectionObject) {
      this.selectObject.val(
          selectionObject.attr(
              this.imageSelectInstance._settings.itemValueAttribute
          )
      ).trigger("change");
      this._syncSelectWithItems();
    }

  }

};VisualDeveloperLite.Utility.DomRuleBuilder = {

  _lang : {
    title  : 'Advanced CSS Rule Builder',
    finish : "Start Customizing",
    cancel : 'Cancel'
  },

  _settings : {
    bodyClass                   : 'utility-dom-rule-builder-body',
    overlayID                   : 'utility-dom-rule-builder-overlay',
    containerID                 : 'utility-dom-rule-builder-container',
    ruleControllerInputID       : 'utility-dom-rule-builder-rule-preview',
    nodeItemContainerClass      : 'utility-dom-rule-builder-node-item-container',
    nodeItemClass               : 'utility-dom-rule-builder-node-item',
    nodeItemTargetChildrenClass : 'utility-dom-rule-builder-node-item-target-children',
    nodeItemFirstClass          : 'utility-dom-rule-builder-node-item-first',
    finishCreationClass         : 'utility-dom-rule-builder-finish-creation',
    cancelCreationClass         : 'utility-dom-rule-builder-cancel-creation',
    trigger                     : 'click',
    inputRuleRefreshEvent       : 'keyup',
    arrangeEvents               : 'resize'
  },

  visualDeveloperInstance : {},
  instanceList            : [],

  Init : function(visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;

    this._initDependencies();
  },

  _initDependencies : function() {
    this._settings.trigger  = this._settings.trigger
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-dom-rule-builder ') +
        '.' + this.visualDeveloperInstance.namespace + '-dom-rule-builder ';
    this._settings.arrangeEvents  = this._settings.arrangeEvents
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-dom-rule-builder ') +
        '.' + this.visualDeveloperInstance.namespace + '-dom-rule-builder ';
    this._settings.inputRuleRefreshEvent  = this._settings.inputRuleRefreshEvent
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-dom-rule-builder ') +
        '.' + this.visualDeveloperInstance.namespace + '-dom-rule-builder ';

    this._prefixCSSSettings();
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  InitInstance : function(cssRule, responseObject, responseAction) {
    this.instanceList[this.instanceList.length] = jQuery.extend(1, {}, this.InstanceObject);
    this.instanceList[this.instanceList.length - 1].Init(this, cssRule, responseObject, responseAction);
  },

  InstanceObject : {

    builderInstance  : {},

    responseObject : {},
    responseAction : {},

    cssRule             : {},
    cssRuleLevelTokens  : {},

    builderOverlayObject  : {},
    builderObject         : {},

    ruleControllerInput   : {},
    nodeItemContainer     : {},
    ruleSubmissionButton  : {},
    ruleCancelButton      : {},

    Init : function(builderInstance, cssRule, responseObject, responseAction) {
      this.builderInstance = builderInstance;

      this.responseObject  = responseObject;
      this.responseAction  = responseAction;

      this.displayBuilder();
      this._interactionUpdateCSSRule(cssRule);

      var objectInstance = this;

      jQuery(window)
          .unbind(this.builderInstance._settings.arrangeEvents)
          .bind(this.builderInstance._settings.arrangeEvents, function(){
            objectInstance.arrangeBuilder();
          });
    },

    displayBuilder : function() {
      jQuery('body')
          .addClass(this.builderInstance._settings.bodyClass)
          .append(this.getBuilderContent());

      this.builderOverlayObject = jQuery("#" + this.builderInstance._settings.overlayID);
      this.builderObject        = jQuery("#" + this.builderInstance._settings.containerID);
      this.ruleControllerInput  = jQuery("#" + this.builderInstance._settings.ruleControllerInputID);
      this.nodeItemContainer    = this.builderObject.find(" > ." + this.builderInstance._settings.nodeItemContainerClass);
      this.ruleSubmissionButton = this.builderObject.find(" > ." + this.builderInstance._settings.finishCreationClass);
      this.ruleCancelButton     = this.builderObject.find(" > ." + this.builderInstance._settings.cancelCreationClass);

      this.builderOverlayObject.hide().fadeIn("slow");
      this.builderObject.hide().fadeIn("slow");

      this.setBuilderInteraction();
      this.arrangeBuilder();
    },

    getBuilderContent : function() {
      var builderContent   = '';

      builderContent += '<div id="' + this.builderInstance._settings.overlayID + '">';
      builderContent +=   '<div id="' + this.builderInstance._settings.containerID + '">';
      builderContent +=     '<span class="' + this.builderInstance._settings.cancelCreationClass + '">';
      builderContent +=       this.builderInstance._lang.cancel;
      builderContent +=     '</span>';
      builderContent +=     '<h2>' + this.builderInstance._lang.title + '</h2>';
      builderContent +=     '<input type="text" ';
      builderContent +=            'id="' + this.builderInstance._settings.ruleControllerInputID + '" ';
      builderContent +=            'value="' + this.cssRule + '" ';
      builderContent +=     '/>';
      builderContent +=     '<div class="' + this.builderInstance._settings.nodeItemContainerClass + '">';
      builderContent +=     '</div>';
      builderContent +=     '<span class="' + this.builderInstance.visualDeveloperInstance._settings.clearClass + '"></span>';
      builderContent +=     '<span class="' + this.builderInstance._settings.finishCreationClass + '">';
      builderContent +=       this.builderInstance._lang.finish;
      builderContent +=     '</span>';
      builderContent +=   '</div>';
      builderContent += '</div>';

      return builderContent;
    },

    _getBuilderVisualSyntax : function() {
      var objectInstance = this,
          content        = '';

      content += this._getBuilderVisualSyntaxItem(this.cssRuleLevelTokens, 0);
      content += '<span class="' + this.builderInstance.visualDeveloperInstance._settings.clearClass + '"></span>';

      return content;
    },

    _getBuilderVisualSyntaxItem : function(cssRuleTokens, tokenDepth) {
      tokenDepth = (typeof tokenDepth == "undefined" ? 1 : tokenDepth);
      var objectInstance = this,
          content        = '';

      jQuery.each(cssRuleTokens, function(ruleIndex, cssRuleLevel) {
        cssRuleLevel = jQuery.trim(cssRuleLevel);

        var currentLevelPrimaryItem = jQuery.trim(
                        cssRuleLevel.indexOf(" ") === -1 ?
                        cssRuleLevel : cssRuleLevel.substr(0, cssRuleLevel.indexOf(" "))
            );


        if(currentLevelPrimaryItem != '') {
          var itemClass = objectInstance.builderInstance._settings.nodeItemClass;

          if(tokenDepth == 0)
            itemClass += ' ' + (ruleIndex == 0 ? objectInstance.builderInstance._settings.nodeItemFirstClass : objectInstance.builderInstance._settings.nodeItemTargetChildrenClass);

          content += '<div class="' + itemClass  + '">' + currentLevelPrimaryItem + '</div>';
        }

        if(currentLevelPrimaryItem != cssRuleLevel)
          content += objectInstance._getBuilderVisualSyntaxItem(cssRuleLevel.substr(currentLevelPrimaryItem.length).split(" "));

      });

      return content;
    },

    setBuilderInteraction : function() {
      var objectInstance = this;

      this.ruleControllerInput.bind(this.builderInstance._settings.inputRuleRefreshEvent, function(event) {
        objectInstance._interactionUpdateCSSRule(jQuery(this).val());
      });

      this.nodeItemContainer
          .off(this.builderInstance._settings.trigger, '> .' + this.builderInstance._settings.nodeItemClass)
          .on(this.builderInstance._settings.trigger, '> .' + this.builderInstance._settings.nodeItemClass, function(){
            jQuery(this).toggleClass(objectInstance.builderInstance._settings.nodeItemTargetChildrenClass);
            objectInstance._interactionUpdateCSSBasedOnSyntaxBuilder();
          });

      this.ruleSubmissionButton.bind(this.builderInstance._settings.trigger, function(event){
        event.preventDefault();
        event.stopImmediatePropagation();

        objectInstance.CloseAndRespond(objectInstance.cssRule);
      });

      this.ruleCancelButton.bind(this.builderInstance._settings.trigger, function(event){
        event.preventDefault();
        event.stopImmediatePropagation();

        objectInstance.CloseAndRespond(false);
      });
    },

    _interactionUpdateCSSBasedOnSyntaxBuilder : function() {
      var objectInstance = this,
          cssRule        = '';

      this.nodeItemContainer.find('> .' + this.builderInstance._settings.nodeItemClass).each(function(index) {
        if(index > 0)
          cssRule += (
              jQuery(this).hasClass(objectInstance.builderInstance._settings.nodeItemTargetChildrenClass) ?
                  ' > ' : ' '
          );

        cssRule += jQuery(this).text();
      });

      this._interactionUpdateCSSRule(cssRule);
    },

    _interactionUpdateCSSRule : function(cssRule) {
      if(this.ruleControllerInput.val() != cssRule)
        this.ruleControllerInput.val(cssRule);

      this.cssRule              = cssRule;
      this.cssRuleLevelTokens   = cssRule.split(">");
      this.nodeItemContainer.html(this._getBuilderVisualSyntax());

      this.builderInstance.visualDeveloperInstance.NavigationPanel._highlightNavigationMirrorJQueryDOMElement(
          jQuery(this.cssRule)
      );
    },

    arrangeBuilder : function() {
      this.builderOverlayObject
          .css("width", jQuery(window).width())
          .css("height", jQuery(window).height());
      var currentPanelObject = this.builderInstance.visualDeveloperInstance.Panel.currentPanelObject;

      var topDistance  = this.builderInstance
          .visualDeveloperInstance
          .Panel
          .currentPanelUserNotificationObject.outerHeight() + (
          this.builderInstance.visualDeveloperInstance.toolbarObject.length > 0 ?
              this.builderInstance.visualDeveloperInstance.toolbarObject.outerHeight() : 0
          );

      var leftDistance  = (currentPanelObject.length > 0
          ? ((currentPanelObject.offset().left + currentPanelObject.width()) | 0 )
          : ( jQuery(window).width() / 2 | 0 ));

      this.builderObject
          .css("top", topDistance + "px")
          .css("left", leftDistance + "px")
          .css("width", parseInt(jQuery(window).width()) - leftDistance)
          .css("position", "fixed");
    },

    CloseAndRespond : function(response) {
      this.CloseBuilder();
      this.Respond(response);
    },

    CloseBuilder : function() {
      jQuery('body').removeClass(this.builderInstance._settings.bodyClass);
      jQuery(window).unbind(this.builderInstance._settings.arrangeEvents);
      this.builderOverlayObject.fadeOut('slow', function(){
        jQuery(this).remove();
      });
    },

    Respond : function(response) {
      this.responseAction.call(this.responseObject, response);
    }

  }

};VisualDeveloperLite.SettingsPanel = {

  visualDeveloperInstance : {},

  _lang : {
    title                          : "Visual Developer <span>Preferences</span>",
    close                          : "Close",
    elementPanelDisplaySettings    : 'Element Panel Display Options',
    selectorOptionsDisplaySettings : 'Element Selectors Display Options',
    importExportTitle              : 'Import & Export Settings & CSS Modifications',
    importExportWarning            : 'The File APIs are not fully supported in this browser.',
    exportButton                   : 'JSON Export',
    importButton                   : 'JSON Import',
    fullExportButton               : 'CSS Export',
    exportFileName                 : 'visual-developer-lite.json',
    fullExportZIPName              : 'visual-developer-lite-export.zip',
    fullExportSpecifications       : 'Full Export offers you a way to download everything modified within Visual Developer, right away, easily.',
    importNotification             : "Please Wait, Visual Developer is handling the import",
    generalTitle                   : "General Preferences",
    enableSpectralModeByDefault    : 'Enable Spectral Mode by default',
    selectEMValuesByDefault        : 'Work in EM by default instead of pixel',
    enableColorPicker              : 'ColorPicker enabled where it is supported',
    enableKeyboardArrowSupport     : 'Allow arrow usage to increment and decrement numeric values',
    enableElementPanelFilter       : 'Enable Element Panel Filter Box',
    enableFieldDefaultValues       : 'Display default values in the Element Panel ( partial support )',
    enableImportantElement         : 'Enable the option to set an CSS rule to important'
  },

  _settings : {
    bodyClass              : 'settings-panel-active',
    arrangeEvents          : 'resize',
    actionEvents           : 'click',
    settingsActionEvents   : 'click change',
    fileActionEvents       : 'change',
    panelID                : 'settings-panel',
    panelTopSectionID      : 'settings-panel-top-section',
    panelTopCloseID        : 'settings-panel-top-close',
    panelContainerSectionID                       : 'settings-panel-container',
    panelContainerElementOptionContainerID        : 'settings-panel-element-option-container',
    panelContainerElementOptionClass              : 'settings-panel-element-option',
    panelContainerElementOptionActiveClass        : 'settings-panel-active-element-option',
    panelContainerElementOptionIndexAttribute     : 'settings-panel-element-option-index',
    panelContainerSelectorOptionContainerID       : 'settings-panel-selector-option-container',
    panelContainerSelectorOptionClass             : 'settings-panel-selector-option',
    panelContainerSelectorOptionActiveClass       : 'settings-panel-active-selector-option',
    panelContainerSelectorOptionIndexAttribute    : 'settings-panel-selector-option-index',
    panelContainerExportInfoClass                 : 'settings-panel-operation-export-info',
    panelContainerExportID                        : 'settings-panel-operation-export',
    panelContainerImportID                        : 'settings-panel-operation-import',
    panelContainerImportMaskID                    : 'settings-panel-operation-import-mask',
    panelContainerFullExportID                    : 'settings-panel-operation-full-export',
    panelContainerSpectralModeInputID             : 'settings-panel-default-spectral-mode',
    panelContainerSpectralModeInputName           : 'settings-panel-default-spectral-mode',
    panelContainerFieldDefaultValueInputID        : 'settings-panel-field-default-value',
    panelContainerFieldDefaultValueInputName      : 'settings-panel-field-default-value',
    panelContainerCheckboxListClass               : 'utility-svg-checkbox',
    panelContainerCheckboxListSpecificClass       : 'utility-svg-checkbox-option-checkmark',
    panelContainerSelectEMValuesInputID           : 'settings-panel-default-em-values',
    panelContainerSelectEMValuesInputName         : 'settings-panel-default-em-values',
    panelContainerColorPickerInputID              : 'settings-panel-color-picker',
    panelContainerColorPickerInputName            : 'settings-panel-color-picker',
    panelContainerKeyboardArrowSupportInputID     : 'settings-panel-keyboard-arrow-support',
    panelContainerKeyboardArrowSupportInputName   : 'settings-panel-keyboard-arrow-support',
    panelContainerElementPanelFilterInputID       : 'settings-panel-element-panel-filter',
    panelContainerElementPanelFilterInputName     : 'settings-panel-element-panel-filter',
    panelContainerEnableImportantElementInputID   : 'settings-panel-enable-element-important',
    panelContainerEnableImportantElementInputName : 'settings-panel-enable-element-important',
    fullExportBlacklistedURLPatterns              : ['fonts.googleapis.com']
  },

  currentPanelObject                             : false,
  currentPanelTopSectionObject                   : false,
  currentPanelCloseTriggerObject                 : false,
  currentPanelContainerObject                    : false,
  currentPanelOptionEMValuesObject               : false,
  currentPanelOptionSpectralModeObject           : false,
  currentPanelOptionColorPickerObject            : false,
  currentPanelOptionKeyboardArrowSupportObject   : false,
  currentPanelOptionElementPanelFilterObject     : false,
  currentPanelOptionFieldDefaultValueObject      : false,
  currentPanelOptionEnableImportantElementObject : false,
  currentPanelElementOptionsObject               : false,
  currentPanelElementSelectorsObject             : false,
  currentPanelExportTriggerObject                : false,
  currentPanelImportTriggerObject                : false,
  currentPanelImportMaskTriggerObject            : false,

  Init : function (visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;
    this._initDependencies();
  },

  _initDependencies : function() {
    this._settings.arrangeEvents = this._settings.arrangeEvents
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-settings-panel ') +
        '.' + this.visualDeveloperInstance.namespace + '-settings-panel ';
    this._settings.settingsActionEvents  = this._settings.settingsActionEvents
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-settings-panel ') +
        '.' + this.visualDeveloperInstance.namespace + '-settings-panel ';
    this._settings.actionEvents  = this._settings.actionEvents
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-settings-panel ') +
        '.' + this.visualDeveloperInstance.namespace + '-settings-panel ';
    this._settings.fileActionEvents  = this._settings.fileActionEvents
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-settings-panel ') +
        '.' + this.visualDeveloperInstance.namespace + '-settings-panel ';

    this._prefixCSSSettings();
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  DisplayPanel : function() {
    var objectInstance = this;

    jQuery('body')
        .addClass(this._settings.bodyClass)
        .append(this._getPanelHTML());

    this.currentPanelObject                             = jQuery('#' + this._settings.panelID);
    this.currentPanelTopSectionObject                   = jQuery('#' + this._settings.panelTopSectionID);
    this.currentPanelCloseTriggerObject                 = jQuery('#' + this._settings.panelTopCloseID);
    this.currentPanelContainerObject                    = jQuery('#' + this._settings.panelContainerSectionID);
    this.currentPanelOptionSpectralModeObject           = jQuery('#' + this._settings.panelContainerSpectralModeInputID);
    this.currentPanelOptionEMValuesObject               = jQuery('#' + this._settings.panelContainerSelectEMValuesInputID);
    this.currentPanelOptionColorPickerObject            = jQuery('#' + this._settings.panelContainerColorPickerInputID);
    this.currentPanelOptionKeyboardArrowSupportObject   = jQuery('#' + this._settings.panelContainerKeyboardArrowSupportInputID);
    this.currentPanelOptionElementPanelFilterObject     = jQuery('#' + this._settings.panelContainerElementPanelFilterInputID);
    this.currentPanelOptionFieldDefaultValueObject      = jQuery('#' + this._settings.panelContainerFieldDefaultValueInputID);
    this.currentPanelOptionEnableImportantElementObject = jQuery('#' + this._settings.panelContainerEnableImportantElementInputID);
    this.currentPanelElementOptionsObject               = this.currentPanelObject.find(
        '.' + this._settings.panelContainerElementOptionClass
    );
    this.currentPanelElementSelectorsObject = this.currentPanelObject.find(
        '.' + this._settings.panelContainerSelectorOptionClass
    );
    this.currentPanelExportTriggerObject      = jQuery('#' + this._settings.panelContainerExportID);
    this.currentPanelImportTriggerObject      = jQuery('#' + this._settings.panelContainerImportID);
    this.currentPanelImportMaskTriggerObject  = jQuery('#' + this._settings.panelContainerImportMaskID);

    this._arrangePanel();
    this._assignPanelActions();

    this.visualDeveloperInstance.Utility.SVGCheckbox.InitInstance(
        this.currentPanelObject.find('.' + this._settings.panelContainerCheckboxListClass)
    );

    this.currentPanelObject.hide().fadeIn("slow");

    jQuery(window).bind(this._settings.arrangeEvents, function(){
      objectInstance._arrangePanel();
    });
  },

  HidePanel : function() {
    jQuery('body').removeClass(this._settings.bodyClass);

    jQuery(window).unbind(this._settings.arrangeEvents);
    this.currentPanelObject.find("*").unbind(this.visualDeveloperInstance.namespace + '-settings-panel');

    this.visualDeveloperInstance.EventManager.triggerEvent(
        this.visualDeveloperInstance.universalEventSettingsUpdate
    );

    this.currentPanelObject.fadeOut("slow", function(){
      jQuery(this).remove();
    });
  },

  _getPanelHTML : function() {
    var panelHTML = '';

    panelHTML += '<div id="' + this._settings.panelID + '">';
    panelHTML +=  '<div id="' + this._settings.panelTopSectionID + '">';
    panelHTML +=    '<h2>' + this._lang.title + '</h2>';
    panelHTML +=    '<span id="' + this._settings.panelTopCloseID + '">' + this._lang.close + '</span>';
    panelHTML +=    '<span class="' + this.visualDeveloperInstance._settings.clearClass + '"></span>';
    panelHTML +=  '</div>';
    panelHTML +=  '<div id="' + this._settings.panelContainerSectionID + '">';
    panelHTML +=    this._getGeneralSettingsContainerHTML();
    panelHTML +=    this._getImportExportContainerHTML();
    panelHTML +=    this._getPanelContainerHTML();
    panelHTML +=  '</div>';
    panelHTML += '</div>';

    return panelHTML;
  },

  _getGeneralSettingsContainerHTML : function() {
    var generalSettingsContainerHTML = '';

    generalSettingsContainerHTML += '<h2>' + this._lang.generalTitle + '</h2>';
    generalSettingsContainerHTML += '<ul class="' + this._settings.panelContainerCheckboxListClass + ' ' + this._settings.panelContainerCheckboxListSpecificClass + '">';
    generalSettingsContainerHTML +=   '<li>';
    generalSettingsContainerHTML +=     '<input id="' + this._settings.panelContainerSpectralModeInputID + '" ';
    generalSettingsContainerHTML +=            'name="' + this._settings.panelContainerSpectralModeInputName + '" ';
    generalSettingsContainerHTML +=            (this.visualDeveloperInstance.hasSettingSpectralModeDefaultEnabled ? 'checked="checked" ' : '');
    generalSettingsContainerHTML +=            'type="checkbox">';
    generalSettingsContainerHTML +=     '<label for="' + this._settings.panelContainerSpectralModeInputID + '">';
    generalSettingsContainerHTML +=       this._lang.enableSpectralModeByDefault;
    generalSettingsContainerHTML +=     '</label>';
    generalSettingsContainerHTML +=   '</li>';
    generalSettingsContainerHTML +=   '<li>';
    generalSettingsContainerHTML +=     '<input id="' + this._settings.panelContainerSelectEMValuesInputID + '" ';
    generalSettingsContainerHTML +=            'name="' + this._settings.panelContainerSelectEMValuesInputName + '" ';
    generalSettingsContainerHTML +=            (this.visualDeveloperInstance.hasSettingEMOptionDefaultSelected ? 'checked="checked" ' : '');
    generalSettingsContainerHTML +=            'type="checkbox">';
    generalSettingsContainerHTML +=     '<label for="' + this._settings.panelContainerSelectEMValuesInputID + '">';
    generalSettingsContainerHTML +=       this._lang.selectEMValuesByDefault;
    generalSettingsContainerHTML +=     '</label>';
    generalSettingsContainerHTML +=   '</li>';
    generalSettingsContainerHTML +=   '<li>';
    generalSettingsContainerHTML +=     '<input id="' + this._settings.panelContainerColorPickerInputID + '" ';
    generalSettingsContainerHTML +=            'name="' + this._settings.panelContainerColorPickerInputName + '" ';
    generalSettingsContainerHTML +=            (this.visualDeveloperInstance.hasSettingEnableColorPicker ? 'checked="checked" ' : '');
    generalSettingsContainerHTML +=            'type="checkbox">';
    generalSettingsContainerHTML +=     '<label for="' + this._settings.panelContainerColorPickerInputID + '">';
    generalSettingsContainerHTML +=       this._lang.enableColorPicker;
    generalSettingsContainerHTML +=     '</label>';
    generalSettingsContainerHTML +=   '</li>';
    generalSettingsContainerHTML +=   '<li>';
    generalSettingsContainerHTML +=     '<input id="' + this._settings.panelContainerKeyboardArrowSupportInputID + '" ';
    generalSettingsContainerHTML +=            'name="' + this._settings.panelContainerKeyboardArrowSupportInputName + '" ';
    generalSettingsContainerHTML +=            (this.visualDeveloperInstance.hasSettingEnableKeyboardArrowSupport ? 'checked="checked" ' : '');
    generalSettingsContainerHTML +=            'type="checkbox">';
    generalSettingsContainerHTML +=     '<label for="' + this._settings.panelContainerKeyboardArrowSupportInputID + '">';
    generalSettingsContainerHTML +=       this._lang.enableKeyboardArrowSupport;
    generalSettingsContainerHTML +=     '</label>';
    generalSettingsContainerHTML +=   '</li>';
    generalSettingsContainerHTML +=   '<li>';
    generalSettingsContainerHTML +=     '<input id="' + this._settings.panelContainerElementPanelFilterInputID + '" ';
    generalSettingsContainerHTML +=            'name="' + this._settings.panelContainerElementPanelFilterInputName + '" ';
    generalSettingsContainerHTML +=            (this.visualDeveloperInstance.hasSettingEnableElementPanelFilter ? 'checked="checked" ' : '');
    generalSettingsContainerHTML +=            'type="checkbox">';
    generalSettingsContainerHTML +=     '<label for="' + this._settings.panelContainerElementPanelFilterInputID + '">';
    generalSettingsContainerHTML +=       this._lang.enableElementPanelFilter;
    generalSettingsContainerHTML +=     '</label>';
    generalSettingsContainerHTML +=   '</li>';
    generalSettingsContainerHTML +=   '<li>';
    generalSettingsContainerHTML +=     '<input id="' + this._settings.panelContainerFieldDefaultValueInputID + '" ';
    generalSettingsContainerHTML +=            'name="' + this._settings.panelContainerFieldDefaultValueInputName + '" ';
    generalSettingsContainerHTML +=            (this.visualDeveloperInstance.hasSettingFieldDefaultValue ? 'checked="checked" ' : '');
    generalSettingsContainerHTML +=            'type="checkbox">';
    generalSettingsContainerHTML +=     '<label for="' + this._settings.panelContainerFieldDefaultValueInputID + '">';
    generalSettingsContainerHTML +=       this._lang.enableFieldDefaultValues;
    generalSettingsContainerHTML +=     '</label>';
    generalSettingsContainerHTML +=   '</li>';
    generalSettingsContainerHTML +=   '<li>';
    generalSettingsContainerHTML +=     '<input id="' + this._settings.panelContainerEnableImportantElementInputID + '" ';
    generalSettingsContainerHTML +=            'name="' + this._settings.panelContainerEnableImportantElementInputName + '" ';
    generalSettingsContainerHTML +=            (this.visualDeveloperInstance.hasSettingEnableImportantElement ? 'checked="checked" ' : '');
    generalSettingsContainerHTML +=            'type="checkbox">';
    generalSettingsContainerHTML +=     '<label for="' + this._settings.panelContainerEnableImportantElementInputID + '">';
    generalSettingsContainerHTML +=       this._lang.enableImportantElement;
    generalSettingsContainerHTML +=     '</label>';
    generalSettingsContainerHTML +=   '</li>';
    generalSettingsContainerHTML += '</ul>';
    return generalSettingsContainerHTML;
  },

  _getImportExportContainerHTML : function() {
    var importExportContainerHTML = '';

    importExportContainerHTML += '<h2>' + this._lang.importExportTitle + '</h2>';

    if (!(window.File && window.FileReader && window.Blob)) {
      importExportContainerHTML += '<div class="warning">' + this._lang.importExportWarning + '</div>';

      return importExportContainerHTML;
    }

    importExportContainerHTML +=  '<span class="' + this.visualDeveloperInstance._settings.clearClass + '"></span>';

    importExportContainerHTML += '<input id="' + this._settings.panelContainerImportID + '" type="file"/>';

    importExportContainerHTML += '<span id="' + this._settings.panelContainerImportMaskID + '">' +
                                    this._lang.importButton +
                                 '</span>';

    importExportContainerHTML += '<span id="' + this._settings.panelContainerExportID + '">' +
                                    this._lang.exportButton +
                                 '</span>';

    importExportContainerHTML +=  '<span class="' + this.visualDeveloperInstance._settings.clearClass + '"></span>';

    importExportContainerHTML += '<p class="' + this._settings.panelContainerExportInfoClass + '">' +
                                    this._lang.fullExportSpecifications +
                                  '</p>';

    return importExportContainerHTML;
  },

  _getPanelContainerHTML : function() {
    var objectInstance     = this,
        panelContainerHTML = '';

    panelContainerHTML += '<h2>' + this._lang.elementPanelDisplaySettings + '</h2>';

    panelContainerHTML += '<ul id="' + this._settings.panelContainerElementOptionContainerID + '">';

    jQuery.each(this.visualDeveloperInstance.ElementOption, function(optionIndex, optionInformation) {
      var currentItemClass = objectInstance._settings.panelContainerElementOptionClass + " ";

      if(jQuery.inArray(optionIndex, objectInstance.visualDeveloperInstance.hiddenElementOptions) == - 1)
        currentItemClass += objectInstance._settings.panelContainerElementOptionActiveClass + ' ';


      panelContainerHTML += '<li class="' + currentItemClass + '" ' +
                                 objectInstance._settings.panelContainerElementOptionIndexAttribute + '="' +
                                  optionIndex + '" ' +
                              '>' +
                              '<span>' + optionInformation.name + '</span>' +
                            '</li>';
    });

    panelContainerHTML += '</ul>';

    return panelContainerHTML;
  },

  _arrangePanel : function() {
    var wpAdminBarObject = this.visualDeveloperInstance.toolbarObject,
        topDistance      = wpAdminBarObject.length > 0 ? wpAdminBarObject.height() : 0;

    this.currentPanelObject
        .css("position", "fixed")
        .css("top", topDistance)
        .css("left", 0)
        .css("height", jQuery(window).height() - topDistance)
        .css("width", jQuery(window).width());

    this.currentPanelContainerObject
        .css("overflow-y", "auto")
        .css("height", "auto");

    if(this.currentPanelContainerObject.height() + this.currentPanelTopSectionObject.height()
        > this.currentPanelObject.height()) {
      this.currentPanelContainerObject
          .css("overflow-y", "scroll")
          .css("height", this.currentPanelObject.height() - this.currentPanelTopSectionObject.height() - 50);
    }
  },

  _assignPanelActions : function() {
    var objectInstance = this;

    this.currentPanelCloseTriggerObject
        .unbind(this._settings.actionEvents)
        .bind(this._settings.actionEvents, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      objectInstance.HidePanel();
    });

    this.currentPanelElementOptionsObject
        .unbind(this._settings.actionEvents)
        .bind(this._settings.actionEvents, function(event){
      event.preventDefault();
      event.stopImmediatePropagation();

      var optionIndex = jQuery(this).attr(objectInstance._settings.panelContainerElementOptionIndexAttribute);

      jQuery(this).toggleClass(objectInstance._settings.panelContainerElementOptionActiveClass);

      if(jQuery(this).hasClass(objectInstance._settings.panelContainerElementOptionActiveClass)) {
        objectInstance.visualDeveloperInstance.hiddenElementOptions
            .splice(
                jQuery.inArray(
                    optionIndex,
                    objectInstance.visualDeveloperInstance.hiddenElementOptions
                ), 1
            );
      } else {
        objectInstance.visualDeveloperInstance.hiddenElementOptions[
            objectInstance.visualDeveloperInstance.hiddenElementOptions.length
            ] = optionIndex;
      }
    });

    this._assignPanelActionsForOptions();
    this._assignPanelActionsImportAndExport();
  },

  _assignPanelActionsForOptions : function() {
    var objectInstance = this;

    this.currentPanelOptionSpectralModeObject
        .unbind(this._settings.settingsActionEvents)
        .bind(this._settings.settingsActionEvents, function(event){
          objectInstance.visualDeveloperInstance.hasSettingSpectralModeDefaultEnabled = jQuery(this).is(":checked") | 0;
        });

    this.currentPanelOptionEMValuesObject
        .unbind(this._settings.settingsActionEvents)
        .bind(this._settings.settingsActionEvents, function(event){
          objectInstance.visualDeveloperInstance.hasSettingEMOptionDefaultSelected = jQuery(this).is(":checked") | 0;
        });

    this.currentPanelOptionColorPickerObject
        .unbind(this._settings.settingsActionEvents)
        .bind(this._settings.settingsActionEvents, function(event){
          objectInstance.visualDeveloperInstance.hasSettingEnableColorPicker = jQuery(this).is(":checked") | 0;
        });

    this.currentPanelOptionKeyboardArrowSupportObject
        .unbind(this._settings.settingsActionEvents)
        .bind(this._settings.settingsActionEvents, function(event){
          objectInstance.visualDeveloperInstance.hasSettingEnableKeyboardArrowSupport = jQuery(this).is(":checked") | 0;
        });

    this.currentPanelOptionElementPanelFilterObject
        .unbind(this._settings.settingsActionEvents)
        .bind(this._settings.settingsActionEvents, function(event){
          objectInstance.visualDeveloperInstance.hasSettingEnableElementPanelFilter = jQuery(this).is(":checked") | 0;
        });

    this.currentPanelOptionFieldDefaultValueObject
        .unbind(this._settings.settingsActionEvents)
        .bind(this._settings.settingsActionEvents, function(event){
          objectInstance.visualDeveloperInstance.hasSettingFieldDefaultValue = jQuery(this).is(":checked") | 0;
        });

    this.currentPanelOptionEnableImportantElementObject
        .unbind(this._settings.settingsActionEvents)
        .bind(this._settings.settingsActionEvents, function(event){
          objectInstance.visualDeveloperInstance.hasSettingEnableImportantElement = jQuery(this).is(":checked") | 0;
        });
  },

  _assignPanelActionsImportAndExport : function() {
    var objectInstance = this;

    this.currentPanelExportTriggerObject
        .unbind(this._settings.actionEvents)
        .bind(this._settings.actionEvents, function(event){
          objectInstance._currentPanelExportTriggerHandler();
        });

    this.currentPanelImportMaskTriggerObject
        .unbind(this._settings.actionEvents)
        .bind(this._settings.actionEvents, function(event){
          objectInstance.currentPanelImportTriggerObject.trigger("click");
        });

    this.currentPanelImportTriggerObject
        .unbind(this._settings.fileActionEvents)
        .bind(this._settings.fileActionEvents, function(event){
          objectInstance._currentPanelImportTriggerHandler();
        });
  },

  _currentPanelExportTriggerHandler : function() {
    var blob = new Blob(
        [JSON.stringify(this.visualDeveloperInstance.ApplicationSynchronize.GetLayoutInformationExportJSON())],
        {type: "application/json;charset=UTF8"}
    );

    saveAs(blob, this._lang.exportFileName);
  },

  _currentPanelImportTriggerHandler : function() {
    var objectInstance = this,
        reader         = new FileReader();

    this.visualDeveloperInstance.ApplicationSynchronize.displayLoader(this._lang.importNotification);

    reader.onload = function(e) {
      var jsonInformation = JSON.parse(reader.result);

      objectInstance.visualDeveloperInstance.ApplicationSynchronize.UpdateLayoutInformationFromExportJSON(
          jsonInformation
      );
      objectInstance.visualDeveloperInstance.Panel.currentPanelDisableTriggerObject.trigger("click");

      setTimeout(function(){
        objectInstance.HidePanel();
        objectInstance.visualDeveloperInstance.ApplicationSynchronize.hideLoader();
      }, 1000);
    };

    reader.readAsText(this.files[0]);
  },

  _getAllAssetsLinksFromStylesheetInfo : function(stylesheetInfo) {
    var imageLinksRegex = /url\("(.+)"\)/g,
        imageLinkMatch,
        imageLinks      = [];

    while (imageLinkMatch = imageLinksRegex.exec(stylesheetInfo)) {
      var isBlacklisted = 0;

      jQuery.each(this._settings.fullExportBlacklistedURLPatterns, function(key, urlPattern) {
        if(imageLinkMatch[1].indexOf(urlPattern) !== -1)
          isBlacklisted = 1;
      });

      if(isBlacklisted == 0)
        imageLinks.push(imageLinkMatch[1]);
    }

    imageLinks      = imageLinks.filter(function(elem,idx,arr){ return arr.indexOf(elem) >= idx; });

    return imageLinks;
  }

};VisualDeveloperLite.SelectorOption = {

  default : {
    name     : "None",
    suffix   : "",
    optional : false
  },

  hover   : {
    name     : ":hover",
    suffix   : ":hover",
    optional : true
  },

  focus   : {
    name     : ":focus",
    suffix   : ":focus",
    optional : true
  },

  active   : {
    name     : ":active",
    suffix   : ":active",
    optional : true
  },

  link    : {
    name     : ":link",
    suffix   : ":link",
    optional : true
  },

  disabled : {
    name     : ":disabled",
    suffix   : ":disabled",
    optional : true
  },

  first_child   : {
    name     : ":first-child",
    suffix   : ":first-child",
    optional : true
  },

  last_child   : {
    name     : ":last-child",
    suffix   : ":last-child",
    optional : true
  },

  first_line : {
    name     : "::first-line",
    suffix   : "::first-line",
    optional : true
  },

  first_letter : {
    name     : "::first-letter",
    suffix   : "::first-letter",
    optional : true
  }

};VisualDeveloperLite.ProgressPanel = {

  visualDeveloperInstance : {},

  _lang : {
    title                             : "Visual Developer <span>Progress Tracker</span>",
    close                             : "Close",
    containerOverlayText              : "Start Customizing",
    containerOverlayElementNotPresent : "This element is not present on this page"
  },

  _settings : {
    bodyClass                  : 'progress-panel-active',
    arrangeEvents              : 'resize',
    actionEvents               : 'click',
    progressActionEvents       : 'click change',
    fileActionEvents           : 'change',
    panelID                    : 'progress-panel',
    panelTopSectionID          : 'progress-panel-top-section',
    panelTopCloseID            : 'progress-panel-top-close',
    panelContainerSectionID    : 'progress-panel-container',
    panelContainerPatternRowClass             : 'progress-panel-pattern-row',
    panelContainerPatternRowRuleAttr          : 'progress-panel-pattern-row-rule',
    panelContainerPatternContainerClass       : 'progress-panel-pattern-container',
    panelContainerPatternContainerRuleClass        : 'progress-panel-pattern-container-rule',
    panelContainerPatternContainerCodeClass        : 'progress-panel-pattern-container-code',
    panelContainerPatternRowOverlayClass           : 'progress-panel-pattern-row-overlay',
    panelContainerPatternRowOverlayPersistentClass : 'progress-panel-pattern-row-overlay-persistent'
  },

  currentPanelObject                           : false,
  currentPanelTopSectionObject                 : false,
  currentPanelCloseTriggerObject               : false,
  currentPanelContainerObject                  : false,
  currentPanelContainerPatternRowObject        : false,
  currentPanelContainerLineListObject          : false,

  panelContainerRuleListFontSize : 14,
  panelContainerRuleListHeight   : 22,

  Init : function (visualDeveloperInstance) {
    this.visualDeveloperInstance = visualDeveloperInstance;
    this._initDependencies();
  },

  _initDependencies : function() {
    this._settings.arrangeEvents = this._settings.arrangeEvents
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-progress-panel ') +
        '.' + this.visualDeveloperInstance.namespace + '-progress-panel ';
    this._settings.progressActionEvents  = this._settings.progressActionEvents
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-progress-panel ') +
        '.' + this.visualDeveloperInstance.namespace + '-progress-panel ';
    this._settings.actionEvents  = this._settings.actionEvents
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-progress-panel ') +
        '.' + this.visualDeveloperInstance.namespace + '-progress-panel ';
    this._settings.fileActionEvents  = this._settings.fileActionEvents
        .replace(/ /g, '.' + this.visualDeveloperInstance.namespace + '-progress-panel ') +
        '.' + this.visualDeveloperInstance.namespace + '-progress-panel ';

    this._prefixCSSSettings();
  },

  _prefixCSSSettings : function() {
    this._settings = this.visualDeveloperInstance.PrefixNonEventSettings(
        this._settings, this.visualDeveloperInstance.styleNamespace);
  },

  DisplayPanel : function() {
    var objectInstance = this;

    jQuery('body')
        .addClass(this._settings.bodyClass)
        .append(this._getPanelHTML());

    this.currentPanelObject                           = jQuery('#' + this._settings.panelID);
    this.currentPanelTopSectionObject                 = jQuery('#' + this._settings.panelTopSectionID);
    this.currentPanelCloseTriggerObject               = jQuery('#' + this._settings.panelTopCloseID);
    this.currentPanelContainerObject                  = jQuery('#' + this._settings.panelContainerSectionID);
    this.currentPanelContainerPatternRowObject        = this.currentPanelContainerObject
                                                            .find("." + this._settings.panelContainerPatternRowClass);
    this.currentPanelContainerLineListObject          = this.currentPanelContainerPatternRowObject
                                                            .find("p");

    this._arrangePanel();
    this._assignPanelActions();

    this.currentPanelObject.hide().fadeIn("slow");

    jQuery(window).bind(this._settings.arrangeEvents, function(){
      objectInstance._arrangePanel();
    });
  },

  HidePanel : function() {
    jQuery('body').removeClass(this._settings.bodyClass);

    jQuery(window).unbind(this._settings.arrangeEvents);
    this.currentPanelObject.find("*").unbind(this.visualDeveloperInstance.namespace + '-progress-panel');

    this.currentPanelObject.fadeOut("slow", function(){
      jQuery(this).remove();
    });
  },

  _getPanelHTML : function() {
    var panelHTML = '';

    panelHTML += '<div id="' + this._settings.panelID + '">';
    panelHTML +=  '<div id="' + this._settings.panelTopSectionID + '">';
    panelHTML +=    '<h2>' + this._lang.title + '</h2>';
    panelHTML +=    '<span id="' + this._settings.panelTopCloseID + '">' + this._lang.close + '</span>';
    panelHTML +=    '<span class="' + this.visualDeveloperInstance._settings.clearClass + '"></span>';
    panelHTML +=  '</div>';
    panelHTML +=  '<div id="' + this._settings.panelContainerSectionID + '">';
    panelHTML +=     this._getPanelPatternsHTML();
    panelHTML +=  '</div>';
    panelHTML += '</div>';

    return panelHTML;
  },

  _getPanelPatternsHTML : function() {
    var objectInstance    = this,
        panelPatternsHTML = '';

    jQuery.each(this.visualDeveloperInstance.ElementPanel.elementOptionsObjectList, function(elementOptionsObjectIndex, elementOptionsObject) {
      var elementPatternCode   = '',
          elementPresentOnPage = jQuery(elementOptionsObject._elementPattern).length > 0;

      jQuery.each(elementOptionsObject.GetCurrentActiveOptionsMap(), function(optionIndex, cssValue) {
        elementPatternCode += "<p>&nbsp;&nbsp;&nbsp;&nbsp;" +
            elementOptionsObject._getStylesheetCSSRuleByOptionIndexAndCSSValue(
            optionIndex, cssValue
        ) + "</p>";
      });

      panelPatternsHTML += '<div ' +
                                 objectInstance._settings.panelContainerPatternRowRuleAttr + '="' + elementOptionsObject._elementPattern + '" ' +
                                 'class="' + objectInstance._settings.panelContainerPatternRowClass + '">' +
                             '<div class="' + objectInstance._settings.panelContainerPatternContainerClass + '">' +
                                '<p class="' + objectInstance._settings.panelContainerPatternContainerRuleClass + '">' +
                                  elementOptionsObject._elementPattern +
                                '</p>' +
                                '<div class="' + objectInstance._settings.panelContainerPatternContainerCodeClass + '">' +
                                  "<p>{</p>" +
                                  elementPatternCode +
                                  "<p>}</p>" +
                                '</div>' +
                             '</div>' +
                             '<div class="' + objectInstance._settings.panelContainerPatternRowOverlayClass + ' ' +
                                              (elementPresentOnPage == 0 ?
                                                  objectInstance._settings.panelContainerPatternRowOverlayPersistentClass :
                                                  ''
                                              ) +
                              '">' +
                                '<p>' +
                                  (elementPresentOnPage == 0 ?
                                      objectInstance._lang.containerOverlayElementNotPresent :
                                      objectInstance._lang.containerOverlayText
                                  ) +
                                '</p>' +
                             '</div>' +
                           '</div>';
    });

    return panelPatternsHTML;
  },

  _arrangePanel : function() {
    var wpAdminBarObject = this.visualDeveloperInstance.toolbarObject,
        topDistance      = wpAdminBarObject.length > 0 ? wpAdminBarObject.height() : 0;

    this.currentPanelObject
        .css("position", "fixed")
        .css("top", topDistance)
        .css("left", 0)
        .css("height", jQuery(window).height() - topDistance)
        .css("width", jQuery(window).width());

    this.currentPanelContainerObject
        .css("overflow-y", "auto")
        .css("height", "auto");

    if(this.currentPanelContainerObject.height() + this.currentPanelTopSectionObject.height()
        > this.currentPanelObject.height()) {
      this.currentPanelContainerObject
          .css("overflow-y", "scroll")
          .css("height", this.currentPanelObject.height() - this.currentPanelTopSectionObject.height() - 50);
    }

    this._arrangePanelRowText();
  },

  _assignPanelActions : function() {
    var objectInstance = this;

    this.currentPanelCloseTriggerObject
        .unbind(this._settings.actionEvents)
        .bind(this._settings.actionEvents, function(event){
          event.preventDefault();
          event.stopImmediatePropagation();

          objectInstance.HidePanel();
        });

    this.currentPanelContainerPatternRowObject
        .unbind(this._settings.actionEvents)
        .bind(this._settings.actionEvents, function(event) {
          event.preventDefault();
          event.stopImmediatePropagation();

          if(jQuery(jQuery(this).attr(objectInstance._settings.panelContainerPatternRowRuleAttr)).length == 0)
            return;

          objectInstance.visualDeveloperInstance.Panel.currentPanelEnableTriggerObject.trigger("click");
          objectInstance.visualDeveloperInstance.Navigation.CloseNavigation();
          
          objectInstance.visualDeveloperInstance.NavigationPanel._enableElementPanelOnPattern(
              jQuery(this).attr(objectInstance._settings.panelContainerPatternRowRuleAttr)
          );

          objectInstance.HidePanel();
        });
  },

  _arrangePanelRowText : function() {
    var objectInstance = this;

    this.currentPanelContainerLineListObject.each(function(){
      jQuery(this).css("font-size", objectInstance.panelContainerRuleListFontSize + "px");

      var fontSize = objectInstance.panelContainerRuleListFontSize;

      while(parseInt(jQuery(this).height()) > objectInstance.panelContainerRuleListHeight
          && fontSize > 1) {
        fontSize--;

        jQuery(this).css("font-size", fontSize + "px");
      }
    });


  }

};