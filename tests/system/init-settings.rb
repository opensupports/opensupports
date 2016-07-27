describe '/system/init-settings' do
    it 'should initialize correctly' do
        result = request('/system/init-settings')

        lang = $database.getRow('setting', 'language', 'name')

        (result['status']).should.equal('success')
        (lang['value']).should.equal('en')
    end
end