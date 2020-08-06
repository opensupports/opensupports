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

        $this->assertEquals(0, $newInstance->prop1);
        $this->assertEquals('hello', $newInstance->prop2);
    }

    public function testDataStoreCustomData() {
        $this->instance->setProperties(array(
            'prop3' => 'EXTRA_DATA'
        ));

        $this->assertEquals(0, $this->instance->prop1);
        $this->assertEquals('hello', $this->instance->prop2);
        $this->assertEquals('EXTRA_DATA', $this->instance->prop3);
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

        $this->assertEquals('TEST_VALUE', $dataStoreIntance->prop1);

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
