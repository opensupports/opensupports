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
require './user/sendrecoverpassword.rb'
require './user/recoverpassword.rb'
#require './ticket/create.rb'
