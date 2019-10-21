describe '/ticket/get-tags' do

    it 'should fail if a user is logged' do
        Scripts.login('steve@jobs.com', 'custompassword')

        result = request('/ticket/get-tags', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('fail')
        (result['message']).should.equal('NO_PERMISSION')
    end


    it 'should get the tags if is a Staff 3 logged' do
        Scripts.login($staff[:email], $staff[:password], true)

        request('/ticket/create-tag', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token,
            name: 'TAG3',
            color: '#dddddd'
        })
        result = request('/ticket/get-tags', {
            csrf_userid: $csrf_userid,
            csrf_token: $csrf_token
        })

        (result['status']).should.equal('success')
        (result['data'][0]['name']).should.equal('TAG1')
        (result['data'][0]['color']).should.equal('#ff00ff')
        (result['data'][1]['name']).should.equal('TAG2')
        (result['data'][1]['color']).should.equal('#0000ff')
        (result['data'][2]['name']).should.equal('TAG3')
        (result['data'][2]['color']).should.equal('#dddddd')
    end
end
