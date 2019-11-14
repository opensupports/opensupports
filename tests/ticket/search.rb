describe '/user/get' do
    request('/user/logout')


    #Scripts.createUser('user_get@os4.com', 'user_get','User Get')

    #Scripts.login('user_get@os4.com', 'user_get')
    #result = request('/ticket/create', {
        title: 'Should we pay?',
        content: 'A Lannister always pays his debts.',
        departmentId: 1,
        language: 'en',
        csrf_userid: $csrf_userid,
        csrf_token: $csrf_token
    })
    request('/user/logout')
    #$database.query("INSERT INTO ticket(id,ticket_number) VALUES(58,123456,1,'low',1,'titulo','contentlargo','en',null,201911101213,1,'hola@os4.com','nameuatuhor',1,1,1,null);")


    #@ticketNumber = result['data']['ticketNumber']
    request('/user/logout')
end
