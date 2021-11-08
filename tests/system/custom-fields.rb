describe 'Custom fields' do
    Scripts.logout()
    Scripts.login($staff[:email], $staff[:password], true)

    describe '/system/add-custom-field' do

        it 'should fail if the name is to short ' do
            result = request('/system/add-custom-field', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: '',
                type: 'text',
                description: 'custom field description',
                options: nil
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_NAME')

        end

        it 'should fail if the name is to long' do
            long_text = ''
            201.times {long_text << 'A'}

            result = request('/system/add-custom-field', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: long_text,
                type: 'text',
                description: 'custom field description',
                options: nil
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_NAME')
        end

        it 'should fail if the type is not one of text or select'do
            result = request('/system/add-custom-field', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: 'name of custom field',
                type: 'tex',
                description: 'custom field description'
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_CUSTOM_FIELD_TYPE')

            result = request('/system/add-custom-field', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: 'name of custom field',
                type: 'selec',
                description: 'custom field description'
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_CUSTOM_FIELD_TYPE')
        end

        it 'should fail if the option is invalid' do
            result = request('/system/add-custom-field', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: 'name of custom field',
                type: 'select',
                description: 'custom field description',
                options: 'json'
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_CUSTOM_FIELD_OPTIONS')
        end

        it 'should create name of select customfield' do
            result = request('/system/add-custom-field', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: 'mockselectfield',
                type: 'select',
                description: 'custom field description',
                options: '["option1","option2","option3"]'
            })

            (result['status']).should.equal('success')

            custom_field_row = $database.getRow('customfield', 'mockselectfield', 'name')
            custom_field_row_id = custom_field_row['id']

            (custom_field_row['name']).should.equal('mockselectfield')
            (custom_field_row['type']).should.equal('select')
            (custom_field_row['description']).should.equal('custom field description')

            ($database.getRow('customfieldoption', 'option1', 'name')['customfield_id']).should.equal(custom_field_row_id)
            ($database.getRow('customfieldoption', 'option2', 'name')['customfield_id']).should.equal(custom_field_row_id)
            ($database.getRow('customfieldoption', 'option3', 'name')['customfield_id']).should.equal(custom_field_row_id)

            quantity_of_options = $database.query("SELECT COUNT(*) as qt FROM customfieldoption WHERE customfield_id='#{custom_field_row_id}'").first['qt']
            (quantity_of_options).should.equal(3)
        end

        it 'should fail if field name already exists' do
            result = request('/system/add-custom-field', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                name: 'mockselectfield',
                type: 'select',
                description: 'custom field description',
                options: '["option1","option2","option3"]'
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('CUSTOM_FIELD_ALREADY_EXISTS')
        end
    end

    describe '/system/get-custom-fields' do

        it 'should success and shows all custom fields' do
            Scripts.createTextCustomField('mocktextfield1','description number 1')
            Scripts.createTextCustomField('mocktextfield2','description number 2')
            Scripts.createTextCustomField('mocktextfield3','description number 3')

            result = request('/system/get-custom-fields', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (result['status']).should.equal('success')
            (result['data'].size).should.equal(4)

            result['data'][0]['name'].should.equal('mockselectfield')
            result['data'][0]['type'].should.equal('select')
            result['data'][0]['description'].should.equal('custom field description')
            result['data'][0]['options'].should.equal([
                {'id' => '1', 'name'=> 'option1'},
                {'id' => '2', 'name'=> 'option2'},
                {'id' => '3', 'name'=> 'option3'},
            ])
            result['data'][1]['name'].should.equal('mocktextfield1')
            result['data'][1]['type'].should.equal('text')
            result['data'][1]['description'].should.equal('description number 1')
            result['data'][2]['name'].should.equal('mocktextfield2')
            result['data'][2]['type'].should.equal('text')
            result['data'][2]['description'].should.equal('description number 2')
            result['data'][3]['name'].should.equal('mocktextfield3')
            result['data'][3]['type'].should.equal('text')
            result['data'][3]['description'].should.equal('description number 3')
        end
    end


    describe '/user/edit-custom-fields' do

        it 'should add custom field values to user' do
          last_user_id = $database.getLastRow('user')['id']
          result = request('/user/edit-custom-fields', {
              csrf_userid: $csrf_userid,
              csrf_token: $csrf_token,
              userId: last_user_id,
              customfield_mockselectfield: 'option2',
              customfield_mocktextfield3: 'mockvalue',
          })
          (result['status']).should.equal('success')

          result = request('/user/get-user', {
              csrf_userid: $csrf_userid,
              csrf_token: $csrf_token,
              userId: last_user_id,
          })

          (result['status']).should.equal('success')
          (result['data']['customfields'][0]['customfield']).should.equal('mockselectfield')
          (result['data']['customfields'][0]['value']).should.equal('option2')
          (result['data']['customfields'][0]['customfieldoption']['id']).should.equal('2')
          (result['data']['customfields'][0]['customfieldoption']['name']).should.equal('option2')

          (result['data']['customfields'][1]['customfield']).should.equal('mocktextfield3')
          (result['data']['customfields'][1]['value']).should.equal('mockvalue')
        end

        it 'should allow changes' do
            last_user_id = $database.getLastRow('user')['id']
            result = request('/user/edit-custom-fields', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                userId: last_user_id,
                customfield_mockselectfield: 'option3',
                customfield_mocktextfield3: 'mockvalue2',
            })
            (result['status']).should.equal('success')

            result = request('/user/get-user', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                userId: last_user_id,
            })

            (result['status']).should.equal('success')
            (result['data']['customfields'].size).should.equal(2)
            (result['data']['customfields'][0]['customfield']).should.equal('mockselectfield')
            (result['data']['customfields'][0]['value']).should.equal('option3')
            (result['data']['customfields'][0]['customfieldoption']['id']).should.equal('3')
            (result['data']['customfields'][0]['customfieldoption']['name']).should.equal('option3')

            (result['data']['customfields'][1]['customfield']).should.equal('mocktextfield3')
            (result['data']['customfields'][1]['value']).should.equal('mockvalue2')
        end
    end

    describe '/system/delete-custom-field' do

        it 'should fail if is an invalid custom field ' do
            result = request('/system/delete-custom-field', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                id: 100
            })

            (result['status']).should.equal('fail')
            (result['message']).should.equal('INVALID_CUSTOM_FIELD')

        end
        it 'should success if everything is ok' do
            result = request('/system/delete-custom-field', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                id: 1
            })

            (result['status']).should.equal('success')

            custom_field_row = $database.getRow('customfield', 1, 'id')
            (custom_field_row).should.equal(nil)

            last_user_id = $database.getLastRow('user')['id']
            result = request('/user/get-user', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                userId: last_user_id,
            })

            (result['status']).should.equal('success')
            (result['data']['customfields'].size).should.equal(1)
            (result['data']['customfields'][0]['customfield']).should.equal('mocktextfield3')
            (result['data']['customfields'][0]['value']).should.equal('mockvalue2')
        end
    end
end
