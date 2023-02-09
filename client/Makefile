build:
	@docker pull node:11.15.0

run: stop
	@docker run --platform=linux/amd64 --network os-net --name opensupports-client -v $(PWD):/client:delegated -p 3000:3000 node:11.15.0 sh -c "cd client && npm install && npm start"

sh: stop
	@docker run -it --platform=linux/amd64 --network os-net --name opensupports-client -v $(PWD):/client:delegated -p 3000:3000 node:11.15.0 sh -c "bash"

stop:
	@docker rm -f opensupports-client || true
