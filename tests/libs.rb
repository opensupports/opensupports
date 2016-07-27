
def request(path, data = {})
    uri = URI('http://localhost:8080' + path)
    response = Net::HTTP.post_form(uri, data)

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
