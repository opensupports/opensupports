describe 'ticket/comment/' do
    #it 'should fail if not logged' do

    #end

    describe 'on successful request' do

        it 'should add comment to current ticket' do
            result = request('/ticket/comment', {
                content: 'some commment content',
                ticketId: 1,
                csrf_userid: $csrf_userid,
                csrf_token: $csrf_token
            })

            (result['status']).should.equal('success')
        end

        # it 'should link the comment to author' do

        # end
    end
end