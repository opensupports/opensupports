describe '/system/get-settings' do
    it 'should return correct values' do
        result = request('/system/get-settings')

        (result['status']).should.equal('success')
        (result['data']['language']).should.equal('en')
        (result['data']['departments'][0]['name']).should.equal('Tech Support')
        (result['data']['departments'][1]['name']).should.equal('Suggestions')
        (result['data']['departments'][2]['name']).should.equal('Sales and Subscriptions')
    end
end