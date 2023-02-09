describe '/system/get-settings' do
    it 'should return correct values' do
        result = request('/system/get-settings')
        
        (result['status']).should.equal('success')
        (result['data']['language']).should.equal('en')
        (result['data']['departments'][0]['name']).should.equal('Help and Support')
        (result['data']['mandatory-login']).should.equal('1')
        (result['data']['default-department-id']).should.equal('1')
        (result['data']['default-is-locked']).should.equal('0')
        (result['data']['allowedLanguages'][0]).should.equal('en')
        (result['data']['allowedLanguages'][1]).should.equal('es')
        (result['data']['allowedLanguages'][2]).should.equal('de')
        (result['data']['allowedLanguages'][3]).should.equal('fr')
        (result['data']['allowedLanguages'][4]).should.equal('pt')
        (result['data']['allowedLanguages'][5]).should.equal('jp')
        (result['data']['allowedLanguages'][6]).should.equal('ru')
        (result['data']['allowedLanguages'][7]).should.equal('cn')
        (result['data']['allowedLanguages'][8]).should.equal('in')
        (result['data']['allowedLanguages'][9]).should.equal('tr')
        (result['data']['supportedLanguages'][0]).should.equal('en')
    end
end
