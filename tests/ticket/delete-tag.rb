describe '/ticket/delete-tag' do

    it 'should fail if a user is logged' do
        Scripts.login

        result = request('/ticket/delete-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
    end


    it 'should delete a tag if is a Staff 3 logged' do
        Scripts.login($staff[:email], $staff[:password], true)
        result = request('/ticket/delete-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1
        })

        (result['status']).should.equal('success')
    end

    it 'should fail if the tagId is invalid' do
        result = request('/ticket/delete-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            tagId: 1000
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('INVALID_TAG')
    end
end
