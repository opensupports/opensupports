<?php
include_once 'tests/__lib__/Mock.php';
include_once 'tests/__mocks__/BeanMock.php';
include_once 'tests/__mocks__/SlimMock.php';
include_once 'tests/__mocks__/RedBeanMock.php';

use RedBeanPHP\Facade as RedBean;
use PHPUnit\Framework\TestCase;

class DataStoreMock extends DataStore {
    const TABLE = 'MOCK_TABLE';

    public static function getProps() {
        return array(
            'prop1',
            'prop2',
            'prop3',
        );
    }

    public function getDefaultProps() {
        return array(
            'prop1' => 0,
            'prop2' => 'hello'
        );
    }
}

class DataStoreTest extends TestCase {

    protected function setUp() {
        RedBean::initStubs();

        $this->instance = new DataStoreMock();
    }

    public function testContructor() {
        $this->instance->store();
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
            'findOne' => \Mock::stub()->returns(new BeanMock(['prop1' => 'TEST_VALUE']))
        ));

        $dataStoreIntance = DataStoreMock::getDataStore('ID_VALUE');

        $this->assertEquals($dataStoreIntance->prop1, 'TEST_VALUE');

        $this->assertTrue(RedBean::get('findOne')->hasBeenCalledWithArgs(
            'MOCK_TABLE',
            'id =:value',
            array(
               ':value'  => 'ID_VALUE'
            )
        ));
    }

    public function testDeleteDataStore() {
        $this->instance->delete();

        $this->assertTrue(RedBean::get('trash')->hasBeenCalledWithArgs($this->instance->getBeanInstance()));
    }
}
