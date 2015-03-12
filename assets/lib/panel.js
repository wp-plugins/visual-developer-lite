VisualDeveloperLite.Panel = {

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

};