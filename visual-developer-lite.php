<?php
/*
Plugin Name: Visual Developer Lite
Plugin URI: http://visual-developer.net
Description: Visual Developer
Version: 1.0.0
Author: Andrei-Robert Rusu
Author URI: http://www.easy-development.com
*/

require_once("visual-developer-lite-core.php");

class VisualDeveloperLiteWordPress extends VisualDeveloperLite {

  protected static $_instance;

  public static function getInstance() {
    if(self::$_instance == null)
      self::$_instance = new self();

    return self::$_instance;
  }

  public static function resetInstance() {
    self::$_instance = null;
  }

  /**
   * @var VisualDeveloperLiteWordpressDatabaseConnection
   */
  private $_databaseConnectionImplementation = false;

  public $scriptBasePath              = '';
  public $licensingHandlerObject;

  public $adminAccessOptionName       = 'manage_options';
  public $displayRequestParam         = 'display-visual-developer-lite';
  public $resetRequestParam           = 'reset-visual-developer-lite';

  public function init() {
    $this->scriptBasePath = dirname(__FILE__) . DIRECTORY_SEPARATOR;

    add_action("init", array($this, 'wordPressInit'));
    add_action( 'admin_bar_menu', array($this, 'toolbarLink'), 999 );
    add_action( 'wp_ajax_' . $this->namespace . 'getLayout', array($this, 'ajaxGetLayoutInformation') );
    add_action( 'wp_ajax_' . $this->namespace . 'setLayout', array($this, 'ajaxSetLayoutInformation') );
    add_action( 'wp_ajax_' . $this->namespace . 'setLayout', array($this, 'ajaxSetLayoutInformation') );
  }

  public function getVDLibraryFilePath() {
    if($this->scriptBasePath == '')
      return dirname(__FILE__) . DIRECTORY_SEPARATOR . 'vd-library' . DIRECTORY_SEPARATOR;

    return $this->scriptBasePath . 'vd-library' . DIRECTORY_SEPARATOR;
  }

  public function hasAdminAccess() {
    return current_user_can( $this->adminAccessOptionName );
  }

  public function allowVisualDeveloperLiteInThisSection() {
    return !is_admin();
  }

  public function getPluginAssetsURLPath() {
    return plugins_url("assets", __FILE__);
  }

  public function getOptionStorage($optionName, $optionDefault = null) {
    return get_option($optionName, $optionDefault);
  }

  public function setOptionStorage($optionName, $optionValue) {
    update_option($optionName, $optionValue);
  }

  public function deleteOptionsStorageByOptionPrefix($optionPrefix) {
    global $wpdb;
    $wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '{$optionPrefix}%'" );
  }

  /**
   * @return string
   */
  public function getUploadsDirectoryFilePath() {
    $uploadDirectory = wp_upload_dir();

    return $uploadDirectory['basedir'] . DIRECTORY_SEPARATOR;
  }

  /**
   * @return string
   */
  public function getUploadsDirectoryURLPath() {
    $uploadDirectory = wp_upload_dir();

    return $uploadDirectory['baseurl'] . DIRECTORY_SEPARATOR;
  }

  /**
   * @return VisualDeveloperLiteWordpressDatabaseConnection
   */
  public function getDatabaseConnectionImplementation() {
    if($this->_databaseConnectionImplementation == false) {
      if(!class_exists('VisualDeveloperLiteWordpressDatabaseConnection'))
        require_once($this->scriptBasePath . 'vd-implementation/databaseConnection.php');

      $this->_databaseConnectionImplementation = new VisualDeveloperLiteWordpressDatabaseConnection();
    }

    return $this->_databaseConnectionImplementation;
  }

  public function wordPressInit() {
    if(isset($_GET[$this->resetRequestParam]) && $_GET[$this->resetRequestParam] == 1) {
      global $wp;
      $currentURL = add_query_arg( $wp->query_string, '', home_url( $wp->request ) );
      $currentURL = str_replace(array("&" . $this->resetRequestParam . '=1', "&" . $this->resetRequestParam . '=0'), '', $currentURL);
      $currentURL = str_replace(array($this->resetRequestParam . '=1', $this->resetRequestParam . '=0'), '', $currentURL);

      $this->resetVisualDeveloperLite();

      wp_redirect($currentURL);exit;
    }

    $isAdminActive = false;

    if($this->hasAdminAccess()
        && $this->allowVisualDeveloperLiteInThisSection()) {
      if(isset($_GET[$this->displayRequestParam]) && $_GET[$this->displayRequestParam] == true) {
        add_action('wp_enqueue_scripts', array($this, '_initJavascriptLibrary'));
        add_action('wp_footer', array($this, '_initStylesheetsOfLibrary'));

        $isAdminActive = true;
      }
    }

    if($this->allowVisualDeveloperLiteInThisSection() && !$isAdminActive) {
      $postID = intval(url_to_postid( "http://".$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'] ));

      if(file_exists($this->getCSSFilePath($postID)))
        wp_enqueue_style($this->namespace . 'front-' . $postID, $this->getCSSURLPath($postID));
      else if(file_exists($this->getCSSFilePath()))
        wp_enqueue_style($this->namespace . 'front', $this->getCSSURLPath());
    }
  }

  public function toolbarLink( $wpAdminBar ) {
    global $wp;

    $currentURL = add_query_arg( $wp->query_string, '', home_url( $wp->request ) );
    $currentURL = str_replace(array("&" . $this->displayRequestParam . '=1', "&" . $this->displayRequestParam . '=0'), '', $currentURL);
    $currentURL = str_replace(array($this->displayRequestParam . '=1', $this->displayRequestParam . '=0'), '', $currentURL);

    $currentURL .= strpos($currentURL, "?") === false ? '?' : '&';

    if(!isset($_GET[$this->displayRequestParam])
        || (isset($_GET[$this->displayRequestParam]) && $_GET[$this->displayRequestParam] == false))
      $currentURL .= $this->displayRequestParam . '=1';

    if($currentURL[strlen($currentURL) - 1] == "?")
      $currentURL = substr($currentURL, 0, strlen($currentURL) - 1);

    $wpAdminBar->add_node( array(
        'id'    => $this->namespace . 'menu',
        'title' => 'Toggle Visual Developer',
        'href'  => $currentURL
    ) );

    $wpAdminBar->add_node(array(
        'parent' => $this->namespace . 'menu',
        'id'     => $this->namespace . 'menu_reset',
        'title'  => "Reset All Changes",
        'href'   => $currentURL . (strpos($currentURL, "?") === false ? '?' : '&') . $this->resetRequestParam . '=1'
    ));
  }

  public function _initJavascriptLibrary() {
    wp_enqueue_script('jquery');
    wp_enqueue_script('colpick', plugins_url( 'assets/colpick.js', __FILE__), array("jquery"), false, true);
    wp_enqueue_script($this->namespace . 'core', plugins_url( 'assets/visualDeveloper-min.js', __FILE__), array("jquery"), false, true);
    wp_localize_script( $this->namespace . 'core', 'WordpressAjax', array(
        'target'   => admin_url( 'admin-ajax.php' ),
        'security' => wp_create_nonce( $this->namespace )
    ));
    wp_localize_script( $this->namespace . 'core', 'PluginInfo', array(
        'post_id'         => intval(url_to_postid( "http://".$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'] )),
        'post_version_id' => (isset($_GET[$this->pageVersionID]) ? $_GET[$this->pageVersionID] : 0),
        'core_css_file'   => $this->getCSSURLPath()
    ));

    wp_enqueue_script("crypto-js-md5", plugins_url( 'assets/crypto-md5.js', __FILE__), array(), false, true);
    wp_enqueue_script("fileSaver", plugins_url( 'assets/fileSaver.min.js', __FILE__), array(), false, true);
    wp_enqueue_script("jszip", plugins_url( 'assets/jszip.js', __FILE__), array(), false, true);
  }

  public function _initStylesheetsOfLibrary() {
    wp_enqueue_style($this->namespace . 'core', plugins_url( 'assets/visualDeveloper.css', __FILE__));
    wp_enqueue_style('hint', plugins_url( 'assets/hint.css', __FILE__));
    wp_enqueue_style('colpick', plugins_url( 'assets/colpick.css', __FILE__));
  }

}

VisualDeveloperLiteWordPress::getInstance();