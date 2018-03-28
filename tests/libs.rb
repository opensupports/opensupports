$agent = Mechanize.new

def plainRequest(path, data = {}, method = 'POST')
    uri = 'http://localhost:8080' + path

    if method == 'POST'
        @response = $agent.post(uri, data)
    else
        @response = $agent.get(uri, data)
    end

    return @response
end

def request(path, data = {})
    uri = 'http://localhost:8080' + path
    response = $agent.post(uri, data)

    return JSON.parse(response.body)
end

class Database
    def initialize()
        mysqlHost = ENV['MYSQL_HOST'] || '127.0.0.1'
        mysqlUser = ENV['MYSQL_USER'] || 'root'
        mysqlPass = ENV['MYSQL_PASSWORD'] || ''
        @connection = Mysql.new(mysqlHost, mysqlUser,  mysqlPass, 'development', 4040)
    end

    def close()
        @connection.close
    end

    def getRow(table, value, field = 'id')
        queryResponse = @connection.query("select * from #{table} where #{field}='#{value.to_s}'")

        return queryResponse.fetch_hash
    end

    def getLastRow(table)
        queryResponse = @connection.query("select * from #{table} order by id desc limit 1")

        return queryResponse.fetch_hash
    end

    def query(query_string)
        return @connection.query(query_string);
    end
end

$database = Database.new

$staff = {
    :email => 'staff@opensupports.com',
    :password => 'staff'
}
