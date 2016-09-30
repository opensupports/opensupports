$agent = Mechanize.new

def request(path, data = {})
    uri = 'http://localhost:8080' + path
    response = $agent.post(uri, data)

    return JSON.parse(response.body)
end

class Database
    def initialize()
        mysqlUser = ENV['MYSQL_USER'] || 'root'
        mysqlPass = ENV['MYSQL_PASSWORD'] || ''
        @connection = Mysql.new('localhost', mysqlUser ,  mysqlPass, 'development')
    end

    def close()
        @connection.close
    end

    def getRow(table, value, field = 'id')
        queryResponse = @connection.query("select * from #{table} where #{field}='#{value.to_s}'")

        return queryResponse.fetch_hash
    end
end

$database = Database.new

$staff = {
    :email => 'staff@opensupports.com',
    :password => 'staff'
}
