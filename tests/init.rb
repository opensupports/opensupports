# LIBRARIES
require 'bacon'
require 'net/http'
require 'uri'
require 'mysql'
require 'json'
require './libs.rb'
require './scripts.rb'

# TESTS
require './user/signup.rb'
require './user/login.rb'
require './user/send-recover-password.rb'
require './user/recover-password.rb'
#require './ticket/create.rb'
