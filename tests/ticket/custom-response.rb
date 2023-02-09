
describe 'CustomResponses' do
    Scripts.login($staff[:email], $staff[:password], true)

    describe '/ticket/add-custom-responses/' do
        it 'should create custom response' do
            result = request('/ticket/add-custom-response', {
                name: 'Some common problem',
                language: 'en',
                content: 'this is the content of a custom response for a common problem',
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            customResponse = $database.getRow('customresponse', 1)

            (result['status']).should.equal('success')
            (customResponse['name']).should.equal('Some common problem')
            (customResponse['content']).should.equal('this is the content of a custom response for a common problem')
            (customResponse['language']).should.equal('en')

            lastLog = $database.getLastRow('log')
            (lastLog['type']).should.equal('ADD_CUSTOM_RESPONSE')
        end
    end

    describe '/ticket/edit-custom-responses/' do
        it 'should edit a custom response' do
            result = request('/ticket/edit-custom-response', {
                id: 1,
                content: 'this is the content of a custom response for a common problem 2',
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            customResponse = $database.getRow('customresponse', 1)
            (result['status']).should.equal('success')
            (customResponse['name']).should.equal('Some common problem')
            (customResponse['content']).should.equal('this is the content of a custom response for a common problem 2')
            (customResponse['language']).should.equal('en')

            lastLog = $database.getLastRow('log')
            (lastLog['type']).should.equal('EDIT_CUSTOM_RESPONSE')
        end
    end

    describe '/ticket/get-custom-responses/' do
        it 'should return all custom responses' do
            result = request('/ticket/get-custom-responses', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (result['status']).should.equal('success')
            (result['data'].size).should.equal(1)
            (result['data'][0]['name']).should.equal('Some common problem')
            (result['data'][0]['content']).should.equal('this is the content of a custom response for a common problem 2')
            (result['data'][0]['language']).should.equal('en')
        end
    end

    describe '/ticket/delete-custom-responses/' do
        it 'should delete custom response' do
            result = request('/ticket/delete-custom-response', {
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token,
                id: 1
            })

            (result['status']).should.equal('success')
            customResponse = $database.getRow('customresponse', 1)
            (customResponse).should.equal(nil)

            lastLog = $database.getLastRow('log')
            (lastLog['type']).should.equal('DELETE_CUSTOM_RESPONSE')
        end
    end
end
