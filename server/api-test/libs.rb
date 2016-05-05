
def request(path, data)
    uri = URI('http://localhost:8080' + path)
    response = Net::HTTP.post_form(uri, data)

    return JSON.parse(response.body)
end

def getRow(table, id)
    database = Mysql.new('localhost', 'root', '', 'os_dev')
    queryResponse = database.query("select * from #{table} where id='#{id.to_s}'")

    database.close

    return queryResponse.fetch_hash
end
