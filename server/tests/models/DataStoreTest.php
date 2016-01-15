<?php
include_once 'tests/__lib__/Mock.php';
include_once 'tests/__mocks__/SlimMock.php';
include_once 'tests/__mocks__/RedBeanMock.php';
include_once 'models/DataStore.php';

use RedBeanPHP\Facade as RedBean;

class DataStoreMock extends DataStore {
    const TABLE = 'MOCK_TABLE';

    public static function getProps() {
        return array(
            'prop1',
            'prop2',
            'prop3',
        );
    }

    public function getDefaultProperties() {
        return array(
            'prop1' => 0,
            'prop2' => 'hello'
        );
    }

    public static function deleteDataStore($dataStore) {
        return parent::deleteDataStore($dataStore);
    }
}

class DataStoreTest extends PHPUnit_Framework_TestCase {

    protected function setUp() {
        RedBean::initStubs();

        $this->instance = new DataStoreMock();
    }

    public function testContructor() {
        $newInstance = new DataStoreMock($this->instance->getBeanInstance());

        $this->assertEquals($newInstance->prop1, 0);
        $this->assertEquals($newInstance->prop2, 'hello');
    }

    public function testDataStoreCustomData() {
        $this->instance->setProperties(array(
            'prop3' => 'EXTRA_DATA'
        ));

        $this->assertEquals($this->instance->prop1, 0);
        $this->assertEquals($this->instance->prop2, 'hello');
        $this->assertEquals($this->instance->prop3, 'EXTRA_DATA');
    }

    public function testStore() {
        $this->instance->store();
        $this->assertTrue(RedBean::get('store')->hasBeenCalled());
    }

    public function testGetDataStore() {
        RedBean::setStatics(array(
            'findOne' => \Mock::stub()->returns(array('TEST_PROP' => 'TEST_VALUE'))
        ));

        $dataStoreIntance = DataStoreMock::getDataStore('ID_VALUE');

        $this->assertEquals($dataStoreIntance->TEST_PROP, 'TEST_VALUE');

        $this->assertTrue(RedBean::get('findOne')->hasBeenCalledWithArgs(
            'MOCK_TABLE',
            'id =:value',
            array(
               ':value'  => 'ID_VALUE'
            )
        ));
    }

    public function testDeleteDataStore() {
        $beanInstance = $this->instance->getBeanInstance();
        DataStoreMock::deleteDataStore($this->instance);

        $this->assertTrue(RedBean::get('trash')->hasBeenCalledWithArgs($beanInstance));
    }
}
