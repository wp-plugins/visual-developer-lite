<?php

abstract class VisualDeveloperLite {

  public $namespace                   = 'visual_developer_lite_';
  public $storageOption               = 'storage';
  public $settingsStorageOption       = 'settings_storage';
  public $optionsStorageOption        = 'options_storage';
  public $selectorsStorageOptions     = 'selectors_storage';

  public $pageVersionID               = 'page_version_id';

  final public function __construct() {
    $this->_namespaceOptions();

    $this->init();
  }

  private function _namespaceOptions() {
    $this->storageOption             = $this->namespace . $this->storageOption;
    $this->settingsStorageOption     = $this->namespace . $this->settingsStorageOption;
    $this->optionsStorageOption      = $this->namespace . $this->optionsStorageOption;
    $this->selectorsStorageOptions   = $this->namespace . $this->selectorsStorageOptions;
  }

  /**
   *
   * @return string
   */
  abstract public function getVDLibraryFilePath();

  abstract public function init();

  /**
   * @return bool
   */
  abstract public function hasAdminAccess();

  /**
   * @return bool
   */
  abstract public function allowVisualDeveloperLiteInThisSection();

  /**
   * @return string
   */
  abstract public function getPluginAssetsURLPath();

  /**
   * @param $optionName
   * @param null $optionDefault
   * @return mixed
   */
  abstract public function getOptionStorage($optionName, $optionDefault = null);

  /**
   * @param $optionName
   * @param $optionValue
   * @return null
   */
  abstract public function setOptionStorage($optionName, $optionValue);

  /**
   * @param $optionPrefix
   * @return bool
   */
  abstract public function deleteOptionsStorageByOptionPrefix($optionPrefix);

  /**
   * @return string
   */
  abstract public function getUploadsDirectoryFilePath();

  /**
   * @return string
   */
  abstract public function getUploadsDirectoryURLPath();

  /**
   * @return VisualDeveloperLiteAbstractDatabaseConnection
   */
  abstract public function getDatabaseConnectionImplementation();

  final public function resetVisualDeveloperLite() {
    $this->deleteOptionsStorageByOptionPrefix($this->storageOption);
    $this->deleteOptionsStorageByOptionPrefix($this->settingsStorageOption);
    $this->deleteOptionsStorageByOptionPrefix($this->optionsStorageOption);
    $this->deleteOptionsStorageByOptionPrefix($this->selectorsStorageOptions);

    if(file_exists($this->getCSSFilePath()))
      unlink($this->getCSSFilePath());
  }

  final public function getCSSFilePath($pageAlias = false, $pageVersionAlias = false) {
    return $this->getUploadsDirectoryFilePath() . $this->_getCSSFileName($pageAlias, $pageVersionAlias);
  }

  final public function getCSSURLPath($pageAlias = false, $pageVersionAlias = false) {
    return $this->getUploadsDirectoryURLPath() . $this->_getCSSFileName($pageAlias, $pageVersionAlias);
  }

  private function _getCSSFileName($pageAlias, $pageVersionAlias = false) {
    return $this->namespace .
      ( $pageAlias != false && $pageAlias != ''
          ? $pageAlias . '_'
          : ($pageAlias == false ? '' : $pageAlias )
      ) .
      ( $pageVersionAlias != false && $pageVersionAlias != ''
          ? $pageVersionAlias . '_'
          : ($pageVersionAlias == false ? '' : $pageVersionAlias )
      ) .
      'front.css';
  }


  final public function getJSONOptionStorage($optionName, $optionDefault = null) {
    $optionValue = json_decode($this->getOptionStorage($optionName, $optionDefault));

    return ($optionValue == null ? array() : $optionValue);
  }

  final public function setJSONOptionStorage($optionName, $optionValue) {
    $this->setOptionStorage($optionName, json_encode($optionValue));
  }

  public function ajaxGetLayoutInformation() {
    if(!$this->hasAdminAccess()) {
      echo json_encode(array("status" => "error", "error" => "Access Denied"));
      exit;
    }

    $optionSuffix       = (isset($_POST['post_id']) ? "_" . intval($_POST['post_id']) : '');
    $optionSecondSuffix = (isset($_POST['version_id']) ? "_" . intval($_POST['version_id']) : '');

    $pluginAssetsPath = $this->getPluginAssetsURLPath();

    $optionInformation         =  $this->getJSONOptionStorage($this->storageOption . $optionSuffix . $optionSecondSuffix);
    $optionSettingsInformation =  $this->getJSONOptionStorage($this->settingsStorageOption);
    $optionsJSONInformation    =  $this->getJSONOptionStorage($this->optionsStorageOption);
    $selectorsJSONInformation  =  $this->getJSONOptionStorage($this->selectorsStorageOptions);

    $ret = array(
        'layout_information'      => $optionInformation,
        'settings'                => $optionSettingsInformation,
        'optionsJSON'             => $optionsJSONInformation,
        'selectorOptionsJSON'     => $selectorsJSONInformation,
        'dependency'              => array(),
        'supportStylesheet'       => (
            isset($_POST['post_id']) && file_exists($this->getCSSFilePath()) ?
                $this->getCSSURLPath() :
                0
        ),
        'supportFooterStylesheet' => (
            isset($_POST['support_post_id']) && file_exists($this->getCSSFilePath($_POST['support_post_id'])) ?
                $this->getCSSURLPath($_POST['support_post_id']) :
                0
        ),
        'pageVersions'  => $this->_getPageVersionsInformation()
    );

    echo json_encode($ret);
    exit;
  }

  public function ajaxSetLayoutInformation() {
    if(!$this->hasAdminAccess()) {
      echo json_encode(array("status" => "error", "error" => "Access Denied"));
      exit;
    }

    $optionSuffix       = (isset($_POST['post_id']) ? "_" . intval($_POST['post_id']) : '');
    $optionSecondSuffix = (isset($_POST['version_id']) ? "_" . intval($_POST['version_id']) : '');

    $this->setJSONOptionStorage(
        $this->storageOption . $optionSuffix . $optionSecondSuffix,
        isset($_POST['layoutInfoJSONPack']) ? $_POST['layoutInfoJSONPack'] : array()
    );

    $this->setJSONOptionStorage(
        $this->settingsStorageOption,
        isset($_POST['settingsArrayPack']) ? $_POST['settingsArrayPack'] : array()
    );

    $this->setJSONOptionStorage(
        $this->optionsStorageOption,
        isset($_POST['optionsJSON']) ? $_POST['optionsJSON'] : array()
    );

    $this->setJSONOptionStorage(
        $this->selectorsStorageOptions,
        isset($_POST['selectorOptionsJSON']) ? $_POST['selectorOptionsJSON'] : array()
    );

    file_put_contents(
        $this->getCSSFilePath(
            (isset($_POST['post_id'])    ? intval($_POST['post_id'])    : false),
            (isset($_POST['version_id']) ? intval($_POST['version_id']) : false)
        ),
        ($optionSuffix != '' ? '@import url("' . $this->namespace . 'front.css");' . "\n" : '') . str_replace('\"', '"', str_replace("\'", "'", $_POST['stylesheet']))
    );

    echo json_encode(array("status" => "ok"));
    exit;
  }

  public function ajaxGetPageVersionsList() {
    if(!$this->hasAdminAccess()) {
      echo json_encode(array("status" => "error", "error" => "Access Denied"));
      exit;
    }

    $optionSuffix       = (isset($_POST['post_id']) ? "_" . intval($_POST['post_id']) : '');
    $optionSecondSuffix = (isset($_POST['version_id']) ? "_" . intval($_POST['version_id']) : '');

    $this->setJSONOptionStorage(
        $this->storageOption . $optionSuffix . $optionSecondSuffix,
        isset($_POST['layoutInfoJSONPack']) ? $_POST['layoutInfoJSONPack'] : array()
    );

    $this->setJSONOptionStorage(
        $this->settingsStorageOption,
        isset($_POST['settingsArrayPack']) ? $_POST['settingsArrayPack'] : array()
    );

    $this->setJSONOptionStorage(
        $this->optionsStorageOption,
        isset($_POST['optionsJSON']) ? $_POST['optionsJSON'] : array()
    );

    $this->setJSONOptionStorage(
        $this->selectorsStorageOptions,
        isset($_POST['selectorOptionsJSON']) ? $_POST['selectorOptionsJSON'] : array()
    );

    file_put_contents(
        $this->getCSSFilePath(
            (isset($_POST['post_id'])    ? intval($_POST['post_id'])    : false),
            (isset($_POST['version_id']) ? intval($_POST['version_id']) : false)
        ),
        ($optionSuffix != '' ? '@import url("' . $this->namespace . 'front.css");' . "\n" : '') . str_replace('\"', '"', str_replace("\'", "'", $_POST['stylesheet']))
    );

    echo json_encode(array("status" => "ok"));
    exit;
  }

  private function _getPageVersionsInformation() {

  }

}