describe 'CustomField' do
    request('/user/logout')
    Scripts.login($staff[:email], $staff[:password], true)

    describe '/system/add-custom field' do
        it 'should add custom field with departments' do
        end
    end
end
